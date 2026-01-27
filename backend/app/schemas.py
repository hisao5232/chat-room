from pydantic import BaseModel, Field
from datetime import datetime

# メッセージ作成時にフロントから送られてくるデータの形
class MessageCreate(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    content: str = Field(..., min_length=1)

# APIが応答として返すデータの形（DBのIDやタイムスタンプを含む）
class MessageResponse(BaseModel):
    id: int
    username: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True # SQLAlchemyのモデルをPydanticに変換可能にする
        