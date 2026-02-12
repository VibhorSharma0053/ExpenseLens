from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import jwt
import os
from bson import ObjectId
from dotenv import load_dotenv
import logging
from pdf_parser import PhonePePDFParser, validate_transactions
import shutil
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize FastAPI app
app = FastAPI(title="ExpenseLens API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Initialize PDF parser
pdf_parser = PhonePePDFParser()


# MongoDB Connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(MONGODB_URL)
    app.mongodb = app.mongodb_client[DATABASE_NAME]
    
    # Create indexes
    await app.mongodb.users.create_index("email", unique=True)
    await app.mongodb.sessions.create_index("user_id")
    await app.mongodb.sessions.create_index("refresh_token", unique=True)
    await app.mongodb.sessions.create_index("expires_at")
    await app.mongodb.transactions.create_index("user_id")
    await app.mongodb.transactions.create_index([("user_id", 1), ("transaction_date", -1)])
    await app.mongodb.transactions.create_index("category")
    
    logger.info("Database connected and indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
    logger.info("Database connection closed")


# ============= Pydantic Models =============

# Auth Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

# Transaction Models
class TransactionResponse(BaseModel):
    id: str
    transaction_date: datetime
    description: str
    amount: float
    type: str  # CREDIT or DEBIT
    category: str
    status: str
    transaction_id: str
    utr_number: str

class TransactionListResponse(BaseModel):
    transactions: List[TransactionResponse]
    total: int
    page: int
    page_size: int

class CategorySummary(BaseModel):
    category: str
    total_amount: float
    transaction_count: int
    percentage: float

class AnalyticsSummaryResponse(BaseModel):
    total_spent: float
    total_received: float
    net_balance: float
    transaction_count: int
    top_category: str
    categories: List[CategorySummary]

class MonthlyTrendItem(BaseModel):
    month: str
    year: int
    total_spent: float
    total_received: float
    transaction_count: int

class MonthlyTrendResponse(BaseModel):
    trends: List[MonthlyTrendItem]

class UploadResponse(BaseModel):
    message: str
    transactions_added: int
    transactions_failed: int


# ============= Utility Functions =============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )


# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user = await app.mongodb.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


# ============= Authentication Endpoints =============

@app.post("/api/auth/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup):
    """Register a new user"""
    
    existing_user = await app.mongodb.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_dict = {
        "email": user_data.email,
        "name": user_data.name,
        "password_hash": get_password_hash(user_data.password),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await app.mongodb.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    session_data = {
        "user_id": ObjectId(user_id),
        "refresh_token": refresh_token,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "ip_address": None,
        "user_agent": None
    }
    await app.mongodb.sessions.insert_one(session_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    """Authenticate user"""
    
    user = await app.mongodb.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user_id = str(user["_id"])
    
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    session_data = {
        "user_id": ObjectId(user_id),
        "refresh_token": refresh_token,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "ip_address": None,
        "user_agent": None
    }
    await app.mongodb.sessions.insert_one(session_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@app.post("/api/auth/refresh", response_model=TokenResponse)
async def refresh_token(token_data: RefreshTokenRequest):
    """Refresh access token"""
    
    payload = decode_token(token_data.refresh_token)
    
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    session = await app.mongodb.sessions.find_one({
        "refresh_token": token_data.refresh_token
    })
    
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    user_id = payload.get("sub")
    access_token = create_access_token(data={"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=token_data.refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@app.post("/api/auth/logout")
async def logout(
    token_data: RefreshTokenRequest,
    current_user: dict = Depends(get_current_user)
):
    """Logout user"""
    
    result = await app.mongodb.sessions.delete_one({
        "refresh_token": token_data.refresh_token,
        "user_id": current_user["_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return {"message": "Successfully logged out"}


@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        name=current_user["name"],
        created_at=current_user["created_at"]
    )


# ============= Transaction Endpoints =============

@app.post("/api/transactions/upload", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload and parse PhonePe payment history PDF"""
    
    logger.info(f"=== UPLOAD STARTED ===")
    logger.info(f"User: {current_user['email']}")
    logger.info(f"File: {file.filename}")
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    # Save uploaded file
    user_id = str(current_user["_id"])
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{user_id}_{timestamp}_{file.filename}"
    file_path = UPLOAD_DIR / filename
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = file_path.stat().st_size
        logger.info(f"✅ File saved: {file_path} ({file_size} bytes)")
        
        # Parse PDF
        logger.info(f"📄 Starting PDF parsing...")
        transactions = pdf_parser.parse_pdf(str(file_path))
        logger.info(f"✅ Extracted {len(transactions)} raw transactions from PDF")
        
        if len(transactions) == 0:
            logger.warning("⚠️ No transactions extracted from PDF!")
            return UploadResponse(
                message=f"No transactions found in {file.filename}",
                transactions_added=0,
                transactions_failed=0
            )
        
        # Log first transaction for debugging
        if transactions:
            logger.info(f"First transaction sample: {transactions[0]}")
        
        # Validate transactions
        logger.info(f"🔍 Validating transactions...")
        valid_transactions = validate_transactions(transactions)
        logger.info(f"✅ Validated {len(valid_transactions)} transactions")
        logger.info(f"❌ Invalid transactions: {len(transactions) - len(valid_transactions)}")
        
        if len(valid_transactions) == 0:
            logger.warning("⚠️ No valid transactions after validation!")
            return UploadResponse(
                message=f"No valid transactions in {file.filename}",
                transactions_added=0,
                transactions_failed=len(transactions)
            )
        
        # Save to database
        logger.info(f"💾 Saving to MongoDB...")
        added_count = 0
        failed_count = 0
        
        for idx, txn in enumerate(valid_transactions):
            try:
                # Add user_id and upload metadata
                txn_doc = {
                    **txn,
                    "user_id": ObjectId(user_id),
                    "uploaded_at": datetime.utcnow(),
                    "source_file": filename
                }
                
                # Convert transaction_date string to datetime if needed
                if isinstance(txn_doc['transaction_date'], str):
                    txn_doc['transaction_date'] = datetime.fromisoformat(txn_doc['transaction_date'])
                
                # Log first transaction being inserted
                if idx == 0:
                    logger.info(f"Inserting first transaction: {txn_doc}")
                
                result = await app.mongodb.transactions.insert_one(txn_doc)
                logger.debug(f"Inserted transaction {idx + 1}/{len(valid_transactions)} - ID: {result.inserted_id}")
                added_count += 1
                
            except Exception as e:
                logger.error(f"❌ Error saving transaction {idx + 1}: {str(e)}")
                logger.error(f"Transaction data: {txn}")
                import traceback
                logger.error(traceback.format_exc())
                failed_count += 1
                continue
        
        logger.info(f"✅ Successfully saved {added_count} transactions")
        logger.info(f"❌ Failed to save {failed_count} transactions")
        logger.info(f"=== UPLOAD COMPLETED ===")
        
        return UploadResponse(
            message=f"Successfully processed {file.filename}",
            transactions_added=added_count,
            transactions_failed=failed_count
        )
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing PDF: {str(e)}"
        )
    
    finally:
        # Clean up uploaded file
        try:
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Cleaned up file: {file_path}")
        except Exception as e:
            logger.warning(f"Error cleaning up file: {str(e)}")


@app.get("/api/transactions", response_model=TransactionListResponse)
async def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    category: Optional[str] = None,
    transaction_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get user's transactions with filtering and pagination"""
    
    # Build query
    query = {"user_id": current_user["_id"]}
    
    if category:
        query["category"] = category
    
    if transaction_type:
        query["type"] = transaction_type.upper()
    
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = datetime.fromisoformat(start_date)
        if end_date:
            date_query["$lte"] = datetime.fromisoformat(end_date)
        query["transaction_date"] = date_query
    
    # Get total count
    total = await app.mongodb.transactions.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * page_size
    cursor = app.mongodb.transactions.find(query).sort("transaction_date", -1).skip(skip).limit(page_size)
    
    transactions = []
    async for txn in cursor:
        transactions.append(TransactionResponse(
            id=str(txn["_id"]),
            transaction_date=txn["transaction_date"],
            description=txn["description"],
            amount=txn["amount"],
            type=txn["type"],
            category=txn["category"],
            status=txn.get("status", "SUCCESS"),
            transaction_id=txn.get("transaction_id", ""),
            utr_number=txn.get("utr_number", "")
        ))
    
    return TransactionListResponse(
        transactions=transactions,
        total=total,
        page=page,
        page_size=page_size
    )


@app.delete("/api/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a transaction"""
    
    result = await app.mongodb.transactions.delete_one({
        "_id": ObjectId(transaction_id),
        "user_id": current_user["_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return {"message": "Transaction deleted successfully"}


# ============= Analytics Endpoints =============

@app.get("/api/analytics/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics_summary(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get spending summary and category breakdown"""
    
    # Build match query
    match_query = {"user_id": current_user["_id"]}
    
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = datetime.fromisoformat(start_date)
        if end_date:
            date_query["$lte"] = datetime.fromisoformat(end_date)
        match_query["transaction_date"] = date_query
    
    # Aggregate by type (CREDIT/DEBIT)
    type_pipeline = [
        {"$match": match_query},
        {"$group": {
            "_id": "$type",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }}
    ]
    
    type_results = await app.mongodb.transactions.aggregate(type_pipeline).to_list(None)
    
    total_spent = 0
    total_received = 0
    transaction_count = 0
    
    for result in type_results:
        transaction_count += result["count"]
        if result["_id"] == "DEBIT":
            total_spent = result["total"]
        elif result["_id"] == "CREDIT":
            total_received = result["total"]
    
    # Aggregate by category
    category_pipeline = [
        {"$match": match_query},
        {"$group": {
            "_id": "$category",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"total": -1}}
    ]
    
    category_results = await app.mongodb.transactions.aggregate(category_pipeline).to_list(None)
    
    categories = []
    top_category = "N/A"
    
    if category_results:
        top_category = category_results[0]["_id"]
        
        for cat in category_results:
            percentage = (cat["total"] / total_spent * 100) if total_spent > 0 else 0
            categories.append(CategorySummary(
                category=cat["_id"],
                total_amount=cat["total"],
                transaction_count=cat["count"],
                percentage=round(percentage, 2)
            ))
    
    return AnalyticsSummaryResponse(
        total_spent=total_spent,
        total_received=total_received,
        net_balance=total_received - total_spent,
        transaction_count=transaction_count,
        top_category=top_category,
        categories=categories
    )


@app.get("/api/analytics/monthly-trend", response_model=MonthlyTrendResponse)
async def get_monthly_trend(
    months: int = Query(6, ge=1, le=24),
    current_user: dict = Depends(get_current_user)
):
    """Get monthly spending trends"""
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=months * 30)
    
    pipeline = [
        {
            "$match": {
                "user_id": current_user["_id"],
                "transaction_date": {"$gte": start_date, "$lte": end_date}
            }
        },
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$transaction_date"},
                    "month": {"$month": "$transaction_date"},
                    "type": "$type"
                },
                "total": {"$sum": "$amount"},
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"_id.year": 1, "_id.month": 1}
        }
    ]
    
    results = await app.mongodb.transactions.aggregate(pipeline).to_list(None)
    
    # Group by month
    monthly_data = {}
    
    for result in results:
        year = result["_id"]["year"]
        month = result["_id"]["month"]
        txn_type = result["_id"]["type"]
        
        key = f"{year}-{month:02d}"
        
        if key not in monthly_data:
            monthly_data[key] = {
                "year": year,
                "month": month,
                "total_spent": 0,
                "total_received": 0,
                "transaction_count": 0
            }
        
        monthly_data[key]["transaction_count"] += result["count"]
        
        if txn_type == "DEBIT":
            monthly_data[key]["total_spent"] = result["total"]
        elif txn_type == "CREDIT":
            monthly_data[key]["total_received"] = result["total"]
    
    # Convert to response format
    month_names = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    
    trends = []
    for key in sorted(monthly_data.keys()):
        data = monthly_data[key]
        month_name = month_names[data["month"] - 1]
        
        trends.append(MonthlyTrendItem(
            month=month_name,
            year=data["year"],
            total_spent=data["total_spent"],
            total_received=data["total_received"],
            transaction_count=data["transaction_count"]
        ))
    
    return MonthlyTrendResponse(trends=trends)


@app.get("/api/analytics/category-breakdown")
async def get_category_breakdown(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed category breakdown for pie chart"""
    
    match_query = {"user_id": current_user["_id"], "type": "DEBIT"}
    
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = datetime.fromisoformat(start_date)
        if end_date:
            date_query["$lte"] = datetime.fromisoformat(end_date)
        match_query["transaction_date"] = date_query
    
    pipeline = [
        {"$match": match_query},
        {"$group": {
            "_id": "$category",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"total": -1}}
    ]
    
    results = await app.mongodb.transactions.aggregate(pipeline).to_list(None)
    
    return {"categories": results}


# Health check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": "ExpenseLens API"
    }


# Debug endpoint - Remove in production
@app.get("/api/debug/transaction-count")
async def debug_transaction_count(current_user: dict = Depends(get_current_user)):
    """Debug endpoint to check transaction count in database"""
    
    try:
        # Count total transactions for this user
        total = await app.mongodb.transactions.count_documents({"user_id": current_user["_id"]})
        
        # Get all transactions
        all_transactions = await app.mongodb.transactions.find(
            {"user_id": current_user["_id"]}
        ).limit(5).to_list(5)
        
        # Count by category
        pipeline = [
            {"$match": {"user_id": current_user["_id"]}},
            {"$group": {"_id": "$category", "count": {"$sum": 1}}}
        ]
        categories = await app.mongodb.transactions.aggregate(pipeline).to_list(None)
        
        return {
            "user_id": str(current_user["_id"]),
            "user_email": current_user["email"],
            "total_transactions": total,
            "categories": categories,
            "sample_transactions": [
                {
                    "id": str(txn["_id"]),
                    "date": txn.get("transaction_date"),
                    "description": txn.get("description"),
                    "amount": txn.get("amount"),
                    "category": txn.get("category")
                }
                for txn in all_transactions
            ]
        }
    except Exception as e:
        logger.error(f"Debug error: {str(e)}")
        return {
            "error": str(e),
            "user_id": str(current_user["_id"])
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)