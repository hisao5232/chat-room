from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from app import models, schemas

app = FastAPI()

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB設定
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 起動時にテーブルを作成
models.Base.metadata.create_all(bind=engine)

# DBセッション管理用の関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Chat API is running"}

# メッセージ一覧を取得
@app.get("/messages", response_model=List[schemas.MessageResponse])
def get_messages(db: Session = Depends(get_db)):
    # 修正：models.models.Message -> models.Message
    messages = db.query(models.Message).order_by(models.Message.timestamp.asc()).all()
    return messages

# メッセージを投稿（保存）
@app.post("/messages", response_model=schemas.MessageResponse)
def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    # 修正：models.models.Message -> models.Message
    # 修正：message.dict() -> message.model_dump() (Pydantic V2推奨)
    new_message = models.Message(**message.model_dump())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message
    
@app.delete("/messages/{message_id}")
async def delete_message(message_id: int, db: Session = Depends(get_db)):
    db_msg = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not db_msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(db_msg)
    db.commit()
    return {"message": "Successfully deleted"}
