from pymongo.database import Database
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

async def get_user_by_email(db: Database, email:str):
    return await db['users'].find_one({'email':email})

async def create_user(db:Database, user:UserCreate):
    print(user.password)
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict['hashed_password'] = hashed_password
    del user_dict['password']

    result = await db['users'].insert_one(user_dict)
    new_user = await db['users'].find_one({'_id':result.inserted_id})

    return new_user

async def authenticate_user(db:Database, email:str, password:str):
    user = await get_user_by_email(db, email)
    if not user or not verify_password(password, user['hashed_password']):
        return None
    return user