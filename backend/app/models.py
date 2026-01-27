from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)
    # サーバー側の時刻を自動で入れる設定
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    