# chat-room

モダンな技術スタックを用いた、シンプルかつ拡張性の高いチャットウェブアプリケーション。

## 🏗 システム構成図

フロントエンドとバックエンドを分離し、スケーラビリティとセキュリティを両立させた構成です。



### 技術スタック
- **Frontend**: Next.js (TypeScript) - Hosted on **Cloudflare Pages**
- **Backend**: FastAPI (Python) - Containerized with **Docker**
- **Database**: PostgreSQL (v16-alpine)
- **Infrastructure**: エックスサーバー VPS (Ubuntu 24.04)
- **Reverse Proxy**: Traefik (Auto SSL via Let's Encrypt)

## 🚀 現在の機能
- [x] Dockerによるコンテナ化環境の構築
- [x] FastAPIとPostgreSQLの連携
- [x] Pydanticを用いた型安全なAPI設計
- [x] Swagger UIによるAPIドキュメントの自動生成
- [x] Traefikによるサブドメイン (`api-chat-room.go-pro-world.net`) での公開

## 🛠 今後の拡張予定 (Roadmap)
- [ ] **Frontend実装**: TypeScript + Tailwind CSSによるクリーンなUI
- [ ] **認証システム**: JWTを用いたログイン機能の実装
- [ ] **リアルタイム通信**: WebSocket (FastAPI) による即時メッセージ反映
- [ ] **サブドメイン運用**: `chat-room.go-pro-world.net` でのフロントエンド公開
- [ ] **GitHub Actions**: 自動デプロイ (CI/CD) の構築

## 🛠 開発環境のセットアップ

### 1. リポジトリのクローン
```bash
git clone [https://github.com/hisao5232/chat-room.git](https://github.com/hisao5232/chat-room.git)
cd chat-room
```

### 2. 環境変数の設定
.env ファイルを作成し、必要な情報を入力します。
```
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=chat_db
DATABASE_URL=postgresql://your_user:your_password@db:5432/chat_db
```

### 3. コンテナの起動
Bash```
docker compose up -d --build
```

起動後、https://api-chat-room.go-pro-world.net/docs (または localhost:8000/docs) でAPIドキュメントを確認できます。

Developed by hisao5232
