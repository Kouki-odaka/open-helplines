# npm Publish 手順書 — `@open-helplines/mcp`

**対象者:** 小髙航輝さん（Kouki-odaka）  
**最終更新:** 2026-06-04

---

## 概要

`@open-helplines/mcp` を npm に publish し、その後 MCP Registry (https://registry.modelcontextprotocol.io/) に登録する手順です。

---

## 前提条件

- [ ] npm アカウント保有（https://www.npmjs.com）
- [ ] `@open-helplines` スコープの publish 権限（自分のアカウント or org 管理者）
- [ ] `mcp-publisher` CLI インストール済み（下記 Step 3 参照）
- [ ] GitHub アカウント（`Kouki-odaka`）でログイン可能

---

## Step 1: ビルド確認

```bash
cd ~/tools/open-helplines
npm install
cd packages/mcp
npm run build
```

エラーなく `dist/` が生成されることを確認。

---

## Step 2: npm publish

```bash
# npm にログイン（未ログインの場合）
npm login

# パッケージを public で publish
cd ~/tools/open-helplines/packages/mcp
npm publish --access public
```

**成功確認:**
```bash
npm view @open-helplines/mcp
# → version: 0.2.0 が表示されること

# または URL で確認
# https://www.npmjs.com/package/@open-helplines/mcp
```

---

## Step 3: mcp-publisher CLI インストール

```bash
# macOS/Linux (Homebrew)
brew install mcp-publisher

# または curl でバイナリ取得
curl -L "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher && sudo mv mcp-publisher /usr/local/bin/

# インストール確認
mcp-publisher --help
```

---

## Step 4: GitHub 認証

```bash
mcp-publisher login github
```

ターミナルに表示されるデバイスコードを使って:
1. https://github.com/login/device にアクセス
2. コードを入力して認証

```
Successfully authenticated!
✓ Successfully logged in
```

と表示されれば OK。

---

## Step 5: MCP Registry に publish

```bash
cd ~/tools/open-helplines/packages/mcp
mcp-publisher publish
```

**成功確認:**
```
Publishing to https://registry.modelcontextprotocol.io...
✓ Successfully published
✓ Server io.github.Kouki-odaka/open-helplines version 0.2.0
```

```bash
# 登録確認
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.Kouki-odaka/open-helplines"
```

---

## トラブルシューティング

| エラー | 対処 |
|:---|:---|
| `Registry validation failed for package` | `package.json` の `mcpName` フィールドを確認（`"io.github.Kouki-odaka/open-helplines"` と一致しているか） |
| `Invalid or expired Registry JWT token` | `mcp-publisher login github` で再認証 |
| `You do not have permission to publish this server` | GitHub ユーザー名と `io.github.Kouki-odaka/` プレフィックスが一致しているか確認 |
| npm の `E403 Forbidden` | `npm login` で再ログイン、またはスコープ権限を確認 |

---

## 現在の package.json 確認事項

以下が正しく設定されていることを確認:

```json
{
  "name": "@open-helplines/mcp",
  "version": "0.2.0",
  "mcpName": "io.github.Kouki-odaka/open-helplines",
  ...
}
```

`mcpName` は registry の所有権検証に必要。GitHub ユーザー名と一致している必要があります。

---

## バージョン更新時の手順

新バージョンをリリースする場合:

1. `packages/mcp/package.json` の `version` を更新
2. `packages/mcp/server.json` の `version` と `packages[0].version` も同じ値に更新
3. `npm publish --access public`（Step 2 と同様）
4. `mcp-publisher publish`（Step 5 と同様）— 新バージョンが registry に反映される

---

## 参考リンク

- [MCP Registry quickstart](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx)
- [npm: Creating scoped packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [mcp-publisher releases](https://github.com/modelcontextprotocol/registry/releases)
