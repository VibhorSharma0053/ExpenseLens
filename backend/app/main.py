from fastapi import FastAPI
from app.db.mongodb import db

app = FastAPI(title='ExpenseLens Backend')

@app.get('/')
def greet():
    return {'status':'ok','message': 'Welcome, Server is Working...'}


@app.get("/ping-db")
async def ping_db():
    try:
        # The ping command is cheap and does not require auth.
        await db.command("ping")
        return {"status": "success", "message": "Database connection is healthy!"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {e}"}

