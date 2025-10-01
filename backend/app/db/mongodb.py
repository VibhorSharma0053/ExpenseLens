import motor.motor_asyncio
from app.core.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_DETAILS)

db = client.expense_lens # You can name your database anything

# Example of getting a collection
async def get_user_collection():
    return db.get_collection("users")