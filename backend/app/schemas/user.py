from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    fullname: str | None = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    _id: str | None = None
    class Config:
        from_attributes = True