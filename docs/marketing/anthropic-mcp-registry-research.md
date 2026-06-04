# Anthropic MCP Registry — 調査レポート

**作成日:** 2026-06-04  
**担当:** se-mcp-registry  
**ステータス:** 調査完了、plan_approval_request 提出済み

---

## サマリー（重要）

当初の想定（`modelcontextprotocol/servers` への PR）は **誤り**。  
正しい提出先・提出方式は以下の通り。

| 項目 | 調査結果 |
|:---|:---|
| 提出先リポジトリ | `modelcontextprotocol/registry`（servers ではない） |
| 提出方式 | `mcp-publisher` CLI ツール（PR ではない） |
| npm publish | **必須**（未 publish では登録不可） |
| server.json | `mcp-publisher init` で生成、編集後 `mcp-publisher publish` で送信 |
| 認証 | GitHub OAuth (`mcp-publisher login github`) |

---

## 1. `modelcontextprotocol/servers` の現状

**URL:** https://github.com/modelcontextprotocol/servers

### 結論: このリポジトリへの PR は不要・不可

`CONTRIBUTING.md` より:

> The README no longer contains a list of third-party MCP servers — that list has been retired in favor of the [MCP Server Registry](https://github.com/modelcontextprotocol/registry). To make your server discoverable, follow the quickstart guide to publish it there.
> 
> **We don't accept: New server implementations** — We encourage you to publish them to the MCP Server Registry instead.

PR テンプレートにも明記:

> **Note: We are no longer accepting PRs to add servers to the README.** Instead, please publish your server to the MCP Server Registry.

### 用途
- 既存リファレンスサーバー（filesystem, github, postgres 等）のバグ修正・機能改善のみ受け付け
- サードパーティの新規サーバー追加は **拒否される**

---

## 2. 正規登録先: `modelcontextprotocol/registry`

**URL:** https://github.com/modelcontextprotocol/registry  
**ライブ API:** https://registry.modelcontextprotocol.io/

### 特徴
- **Preview ステータス** (2025-09-08 launch、2025-10-24 API Freeze v0.1)
- PR での server 追加は **受け付けない**
- `data/seed.json` は ローカル開発用のみ、本番登録とは無関係
- `mcp-publisher` CLI ツールを使って publish する

### 登録フロー（6 ステップ）

```
Step 1: package.json に mcpName を追加
        "mcpName": "io.github.Kouki-odaka/open-helplines"
        ※ GitHub auth 使用時は必ず io.github.<username>/ プレフィックス必須

Step 2: npm publish
        npm publish --access public
        ※ Registry は metadata のみ保持、artifact は npm で配布

Step 3: mcp-publisher CLI インストール
        curl -L "<url>" | tar xz mcp-publisher && sudo mv mcp-publisher /usr/local/bin/
        or: brew install mcp-publisher

Step 4: server.json 作成
        mcp-publisher init  →  server.json を編集
        ※ name は mcpName と一致させること

Step 5: GitHub 認証
        mcp-publisher login github
        (ブラウザでデバイス認証)

Step 6: Publish
        mcp-publisher publish
        ※ 完了後 https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.Kouki-odaka/open-helplines で確認
```

---

## 3. `@open-helplines/mcp` の現状確認

| チェック項目 | 現状 | 必要なアクション |
|:---|:---|:---|
| npm publish | **未 publish** (`npm view @open-helplines/mcp` → 404) | 小髙さん主導で `npm publish --access public` |
| `package.json` の mcpName | **なし** | 追加必要: `"mcpName": "io.github.Kouki-odaka/open-helplines"` |
| `packages/mcp/README.md` | **存在しない** | 作成必要（install 手順、tools 一覧、example） |
| `server.json` | **存在しない** | `mcp-publisher init` 後に作成 |
| `package.json` の keywords | なし | `mcp`, `mental-wellbeing`, `helpline` 等を追加 |
| `package.json` の homepage | なし | GitHub Pages URL を追加 |

### 提供する MCP Tools
- `find_helplines` — country code で検索、guardrails 付き
- `list_countries` — 対応国コード一覧
- `get_helpline_by_id` — スラッグ ID で直接取得

### ライセンス
- コード: Apache-2.0
- データ: CC0

---

## 4. server.json テンプレート（作成予定）

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.Kouki-odaka/open-helplines",
  "description": "CC0 community support resource directory with guardrails: find helplines by country, category, or ID. Returns DATA_NOT_FOUND sentinel instead of hallucinating.",
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
      "transport": {
        "type": "stdio"
      }
    }
  ]
}
```

---

## 5. 既存エントリ Formatting 例

`data/seed.json` より:

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.domdomegg/airtable-mcp-server",
  "description": "Read and write access to Airtable database schemas, tables, and records.",
  "repository": {
    "url": "https://github.com/domdomegg/airtable-mcp-server.git",
    "source": "github"
  },
  "version": "1.7.2",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "airtable-mcp-server",
      "version": "1.7.2",
      "runtimeHint": "npx",
      "transport": { "type": "stdio" },
      "environmentVariables": [...]
    }
  ]
}
```

---

## 6. 推奨アプローチ

1. **SE が準備する作業**（承認後）:
   - `packages/mcp/README.md` 作成（install / tools / example、中立表現）
   - `package.json` に `mcpName`, `keywords`, `homepage` 追加
   - `packages/mcp/server.json` 作成（`mcp-publisher init` 相当内容を手動）
   - `docs/dev/npm-publish-mcp.md` に publish 手順書作成

2. **小髙さんが実施する作業**（SE 準備後）:
   - `npm publish --access public`（npm account 必要）
   - `mcp-publisher login github`（GitHub デバイス認証）
   - `mcp-publisher publish`（registry への最終登録）

3. **PR は不要**: `modelcontextprotocol/servers` への draft PR は作成しない。  
   正しいフローは CLI ツール経由の直接 publish。

---

## 参考リンク

- [MCP Registry quickstart guide](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx)
- [Live registry API](https://registry.modelcontextprotocol.io/)
- [servers CONTRIBUTING.md](https://github.com/modelcontextprotocol/servers/blob/main/CONTRIBUTING.md)
- [registry CONTRIBUTING.md](https://github.com/modelcontextprotocol/registry/blob/main/CONTRIBUTING.md)
