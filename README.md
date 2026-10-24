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

## 記事URL

記事は `data/blog/<slug>.mdx` に置き、`/blog/<slug>` で公開します。たとえば `blogstr.mdx` のURLは `/blog/blogstr` です。

旧 `/blog/portfolio/<slug>` は対応する記事URLへ、旧 `/portfolio` は `/blog` へ恒久転送します。

記事画像は `public/images/blog/` 以下に置き、`/images/blog/...` を参照します。旧 `/images/blog/portfolio/...` は対応する画像URLへ恒久転送します。

## コラム記事

コラム記事には、MDX の frontmatter に `tags: ['column']` を指定します。他のタグと併用できます。

コラムは `data/column/` に置き、ファイル名を `001.mdx`、`002.mdx` のような連番にします。`data/column/001.mdx` の記事URLは `/column/001` です。一覧は `/column`、RSS は `/column/feed.xml` です。

「コラム」はタグ一覧に表示し、`/column` へリンクします。コラム記事は通常の Blog 一覧（ページ送りを含む）から除外します。記事が0件でもタグと一覧ページは表示します。旧 `/blog/column/...`、`/tags/column` は新しい URL へ恒久転送します。

記事末尾の「前の記事」「次の記事」は、コラム同士・コラム以外同士で投稿日順に移動します。コラムの一覧リンクは `/column` へ戻ります。

コラム一覧は投稿日、タイトルの順に1行ずつ並べ、画面幅に応じて折り返します。アイキャッチ、説明文、記事タグは出さず、表示件数の制限やページ送りも設けません。

コラムの記事ページと SNS シェア用画像には、共通の `/images/column-cover.webp` を使います。記事ごとに `images` を指定する必要はありません。

トップページは Column、Blog の順に表示します。Column は公開済みの最新5件を投稿日順に並べ、コラム一覧へリンクします。ヘッダーメニューには Column を表示しません。

Blog（タグ別の一覧を含む）と Newsletter の一覧は1ページ10件です。1ページ目は Project・Book も10件に含め、2ページ目以降は通常記事を10件ずつ表示します。

## ニュースレターの登録先

このサイトを導入する運営者は、登録フォームの連携先を次の7サービスから選べます。`.env.local` または Vercel の `NEWSLETTER_PROVIDER` に識別名を設定し、選んだサービスの環境変数を入力します。空欄・未設定なら `data/siteMetadata.js` の `newsletter.provider` を使います（初期値は `resend`）。

| サービス             | `NEWSLETTER_PROVIDER` | 必要な環境変数                                                       |
| -------------------- | --------------------- | -------------------------------------------------------------------- |
| Buttondown           | `buttondown`          | `BUTTONDOWN_API_KEY`                                                 |
| Resend               | `resend`              | `RESEND_API_KEY`、`RESEND_SEGMENT_ID`                                |
| Mailchimp            | `mailchimp`           | `MAILCHIMP_API_KEY`、`MAILCHIMP_API_SERVER`、`MAILCHIMP_AUDIENCE_ID` |
| Kit（旧 ConvertKit） | `convertkit`          | `CONVERTKIT_API_KEY`（V3）、`CONVERTKIT_FORM_ID`                     |
| Klaviyo              | `klaviyo`             | `KLAVIYO_API_KEY`、`KLAVIYO_LIST_ID`                                 |
| EmailOctopus         | `emailoctopus`        | `EMAILOCTOPUS_API_KEY`、`EMAILOCTOPUS_LIST_ID`                       |
| Beehiiv              | `beehiiv`             | `BEEHIIV_API_KEY`、`BEEHIIV_PUBLICATION_ID`                          |

登録先はサイト単位で選びます。読者がフォームに入力したメールアドレスは、そのサービスへ登録されます。設定変更後は再起動・再デプロイしてください。`.env.example` は全サービスの変数名を空値でまとめています。旧テンプレートの `REVUE_API_KEY` は登録処理がないため削除しています。

Mailchimp の `MAILCHIMP_API_SERVER` には `us1` などのデータセンター識別子を指定します。新規読者は `pending` で登録し、確認メールによる購読承認を待ちます。Kit は互換性のため V3 の API キーと Form ID を使用します。Klaviyo と EmailOctopus は各リストのオプトイン設定に従います。

Resend を使う場合は、管理画面で読者用の Segment を用意し、`NEWSLETTER_PROVIDER` に `resend`、残りの2変数に API キーと Segment ID を設定して再起動・再デプロイします。`.env.example` の値は空欄にしてあります。

Resend は [Contacts API](https://resend.com/docs/api-reference/contacts/create-contact) と [Segment 追加 API](https://resend.com/docs/api-reference/contacts/add-contact-to-segment) で登録し、配信停止を解除する更新は行いません。Resend の確認メール送信やダブルオプトインは、この登録 API には含まれていません。Resend での配信は管理画面の Broadcasts から行います。

Newsletter 一覧とサイトマップは、引き続き Buttondown の公開 RSS を使用します。登録先の切り替えによる既存読者の移行や同期は行いません。

登録 API のテストは外部通信をモックに置き換えて実行します。

```bash
npm run test:newsletter
```

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
