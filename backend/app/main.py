from fastapi import FastAPI
from app.db.mongodb import db
from app.api.v1 import auth

app = FastAPI(title='ExpenseLens Backend')

app.include_router(auth.router, prefix='/api/v1/auth', tags=['Authentications'])

@app.get('/')
def greet():
    return {'status':'ok','message': 'Welcome, Server is Working...'}

@app.get("/ping-db")
async def ping_db():
    try:
        await db.command("ping")
        return {"status": "success", "message": "Database is Connected!"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {e}"}