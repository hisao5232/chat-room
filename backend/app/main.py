from fastapi import FastAPI, Depends, HTTPException
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from . import models, schemas

app = FastAPI()

# DB設定
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 起動時にテーブルを作成する（簡易的なマイグレーション）
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
    messages = db.query(models.models.Message).order_by(models.models.Message.timestamp.asc()).all()
    return messages

# メッセージを投稿（保存）
@app.post("/messages", response_model=schemas.MessageResponse)
def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    # message.dict() で辞書形式にして展開して保存
    new_message = models.models.Message(**message.dict())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message
