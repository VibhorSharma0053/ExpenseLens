from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.database import Database

from app.schemas.user import User, UserCreate
from app.schemas.token import Token
from app.core.security import create_access_token
from app.services import user_services
from app.db.mongodb import db

router = APIRouter()

@router.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    db_user = await user_services.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Email already Registered!'
        )
    new_user = await user_services.create_user(db, user)
    new_user['_id'] = str(new_user['_id'])
    return new_user

@router.post('/login', response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_services.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect Email or Password!'
        )
    
    access_token = create_access_token(
        data={'sub': user['email']}
    )
    return {'access_token': access_token, 'token_type': 'bearer'}