# SUUMO AI君

AIが最適な不動産会社を自動選定する高品質一括査定サイト

## 構成

- `public/` : 静的HTMLフロントエンド（トップページ、会社概要、利用規約、プライバシーポリシー、お問い合わせ）
- `backend/` : Node.js（Express）メール送信API

## セットアップ手順

### 1. フロントエンド
`public/` 配下のHTMLをWebサーバーで公開してください。

### 2. バックエンド（メール送信API）

1. `backend/` ディレクトリで依存パッケージをインストール

```
cd backend
npm install
```

2. `.env` ファイルを作成し、SMTP情報を設定

```
cp .env.example .env
# .envを編集してSMTP情報を入力
```

3. サーバー起動

```
npm start
```

4. フロントエンドのフォームから `/api/send` にPOSTされると、support@century21.group にメールが届きます。

## 注意事項
- SMTPサーバーの設定が必要です。
- 本番運用時はHTTPS/セキュリティ対策を行ってください。

---

ご質問・ご要望は `/public/contact.html` よりお問い合わせください。 