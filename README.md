# yutaro.me

Next.js で構築している個人サイト [yutaro.me](https://yutaro.me) の公開リポジトリです。

サイトと無料記事の原稿、コメント用の GitHub Discussions をこのリポジトリで管理します。有料記事の全文は含めず、Blogstr の記事へリンクします。

ローカルの作業フォルダは `code/me` です。開発用の環境変数は `.env.example` を参考に `.env.local` に設定します。

依存関係は、リポジトリに固定した Yarn でインストールします。Zap のエラー文を安全に表示し、支払い結果を案内するためのパッチを `.yarn/patches/` で管理しているため、`npm install` は使いません。

```bash
node .yarn/releases/yarn-3.6.1.cjs install --immutable
npm run dev
npm run build
```

Zap は、WebLN の支払い応答の preimage が請求書と一致した場合、または受取サービスが署名した対応する Zap receipt を受信した場合に「Zapped!」を表示します。外部ウォレットの起動や QR 表示だけでは成功扱いにしません。失敗時は英語の案内と再試行、確認が遅い場合はウォレット確認の案内を表示します。

## 画像運用

Vercel Hobby プランの Image Optimization 上限を避けるため、サイト内の画像は事前に WebP 化して `public/images/` から静的配信します。

- `next/image` は維持し、`next.config.js` の `images.unoptimized: true` で Vercel Image Optimization を通さない
- 記事カード、記事本文、OGP、プロフィール、プロジェクト画像は `/images/...` を参照する
- 画像がないカードでは `/images/fallback.webp` を表示する
- 元画像の JPG / JPEG / PNG は、WebP 参照へ切り替えたあと削除する

画像を追加・更新するときは、事前に WebP / AVIF へ変換して `public/images/` に置き、参照を `/images/<path>` に更新します。更新後は存在確認とビルドを実行します。

```bash
npm run build
```
