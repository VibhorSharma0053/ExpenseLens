from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.database import Database

from app.schemas.user import User, UserCreate
from app.schemas.token import Token
from app.core.security import create_access_token

router = APIRouter()

# @router.post("/singup", response_model=User, status_code=status.HTTP_201_CREATED)
# async def signup(user: UserCreate):
#     db_user = await user