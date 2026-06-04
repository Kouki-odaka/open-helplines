# MCP Registry 提出前チェックリスト

**対象者:** 小髙航輝さん（Kouki-odaka）  
**対象 registry:** https://registry.modelcontextprotocol.io/  
**提出するパッケージ:** `@open-helplines/mcp` → `io.github.Kouki-odaka/open-helplines`  
**最終更新:** 2026-06-04

---

## 重要: 提出方式について

~~modelcontextprotocol/servers への PR~~（旧方式、廃止済み）

✅ **正しい方式:** `mcp-publisher` CLI ツールで直接 publish  
詳細手順: [`docs/dev/npm-publish-mcp.md`](../dev/npm-publish-mcp.md)

---

## Phase 1: 事前準備（SE 完了済み）

- [x] `packages/mcp/README.md` 作成完了
- [x] `packages/mcp/package.json` に `mcpName` 追加済み
- [x] `packages/mcp/package.json` に `keywords`, `homepage` 追加済み  
- [x] `packages/mcp/server.json` 作成完了（registry 登録メタデータ）
- [x] 調査レポート: `docs/marketing/anthropic-mcp-registry-research.md`

---

## Phase 2: npm Publish（小髙さんが実施）

- [ ] `npm login` で npm アカウントにログイン
- [ ] `cd packages/mcp && npm run build` — ビルドが通ること
- [ ] `npm publish --access public` — 成功確認
- [ ] `npm view @open-helplines/mcp` — バージョン `0.2.0` が表示されること
- [ ] https://www.npmjs.com/package/@open-helplines/mcp にアクセス可能なこと

---

## Phase 3: mcp-publisher インストール・認証（小髙さんが実施）

- [ ] `brew install mcp-publisher` または curl でインストール
- [ ] `mcp-publisher --help` — 正常起動確認
- [ ] `mcp-publisher login github` — GitHub デバイス認証完了
- [ ] 認証成功メッセージ確認: `✓ Successfully logged in`

---

## Phase 4: MCP Registry への Publish（小髙さんが実施）

- [ ] `cd packages/mcp` に移動（`server.json` があるディレクトリ）
- [ ] `mcp-publisher publish` 実行
- [ ] 成功メッセージ確認: `✓ Server io.github.Kouki-odaka/open-helplines version 0.2.0`
- [ ] 登録確認コマンド実行:
  ```bash
  curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.Kouki-odaka/open-helplines"
  ```
- [ ] レスポンスに `"name":"io.github.Kouki-odaka/open-helplines"` が含まれること

---

## Phase 5: 公開後の確認（小髙さんが実施）

- [ ] https://registry.modelcontextprotocol.io/ でサーバー名検索
- [ ] Claude Desktop に設定して動作確認:
  ```json
  {
    "mcpServers": {
      "open-helplines": {
        "command": "npx",
        "args": ["-y", "@open-helplines/mcp"]
      }
    }
  }
  ```
- [ ] Claude Desktop で `find_helplines({ country: "JP" })` が正常動作すること
- [ ] `DATA_NOT_FOUND` センチネルが未収録国に対して正常返却されること

---

## Phase 6: フォローアップ（任意・オプション）

- [ ] GitHub Discussions や Discord で公開アナウンス
- [ ] awesome-mcp-servers 等のコミュニティリストへの追記 PR
- [ ] `CHANGELOG.md` に registry 登録を記録
- [ ] README の badges セクションに MCP Registry バッジを追加（提供されている場合）

---

## server.json 確認事項

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.Kouki-odaka/open-helplines",
  "description": "...",
  "repository": {
    "url": "https://github.com/Kouki-odaka/open-helplines.git",
    "source": "github"
  },
  "version": "0.2.0",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "@open-helplines/mcp",
      "version": "0.2.0",
      "runtimeHint": "npx",
      "transport": { "type": "stdio" }
    }
  ]
}
```

---

## トラブルシューティング

詳細: [`docs/dev/npm-publish-mcp.md`](../dev/npm-publish-mcp.md) のトラブルシューティングセクション参照

| エラー | 原因 | 対処 |
|:---|:---|:---|
| Registry validation failed | `mcpName` ≠ `server.json` の `name` | 両ファイルの値を一致させる |
| Permission denied to publish | GitHub ユーザー名不一致 | `io.github.Kouki-odaka/` で始まっているか確認 |
| npm 404 Not Found | npm 未 publish | Phase 2 を先に完了させる |
