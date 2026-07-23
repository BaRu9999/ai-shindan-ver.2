# 今日の和茶タイプ診断 完成コード

祇園茶寮×タニタカフェ柏の葉店向けの、7問式「今日の和茶タイプ診断」です。

## 入っている機能

- 全7問の選択式診断
- 抹茶／ほうじ茶／和紅茶／桑茶／枇杷の葉茶／ルイボスティーの6タイプ
- メインタイプ＋隠れタイプの採点
- 2・4・6問目後のリアクション演出
- AIによる回答内容を反映した結果文
- AIが利用できない場合の自動代替結果
- おすすめ商品表示
- 結果カードのPNG保存
- LINE・スマートフォンの共有メニューで友達へ結果送信
- 友達の診断後に2人の和茶相性を自動表示
- 個人情報や診断履歴を保存しない共有リンク方式
- スマートフォン対応
- 簡易的な連続アクセス制限

## 主に編集するファイル

| ファイル | 内容 |
| --- | --- |
| `app/page.tsx` | 診断画面と動作 |
| `app/diagnosis-data.ts` | 質問、タイプ、商品、価格、写真 |
| `app/compatibility-data.ts` | タイプ別の相性点数と相性メッセージ |
| `app/api/diagnose/route.ts` | OpenAI APIとの接続 |
| `app/globals.css` | デザイン |

## 1. 最初に行うこと

プロジェクトのフォルダで次を実行します。

```bash
npm install
npm run dev
```

ブラウザで表示されたローカルURLを開きます。

## 2. OpenAI APIキーの設定

`.env.example`を複製して、名前を`.env.local`にします。

```text
OPENAI_API_KEY=取得したAPIキー
OPENAI_MODEL=gpt-5-mini
```

APIキーは、`page.tsx`など公開されるファイルへ直接書かないでください。
APIキーが未設定でも診断は止まらず、用意済みの結果文を表示します。

## 3. 商品名・価格の変更

`app/diagnosis-data.ts`の各タイプにある次の部分を変更します。

```ts
product: "抹茶ラテ ＋ 抹茶テリーヌ",
price: "税込 1,000円",
image: "/menu/matcha-set.jpg",
```

写真は`public/menu/`フォルダへ保存します。

## 4. Vercelへ反映

GitHubとVercelが接続されている場合は、変更をGitHubへ反映すると自動で再公開されます。

```bash
git add .
git commit -m "和茶タイプ診断を更新"
git push
```

VercelのEnvironment Variablesに次を登録します。

```text
OPENAI_API_KEY
OPENAI_MODEL
```

登録後はVercelで再デプロイしてください。

## 注意

- 表示中の商品価格は初期状態では未設定です。
- 実際の販売商品名、価格、写真へ変更してから本番公開してください。
- 診断は娯楽目的です。医療・健康状態を断定する内容には使用しないでください。
