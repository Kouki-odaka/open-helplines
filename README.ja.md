# open-helplines

**世界中のメンタルヘルス相談窓口・ホットラインのオープンデータレジストリ。APIキー不要、無料で利用可能。**

---

## 概要

open-helplines は、各国の危機相談窓口・メンタルヘルスホットラインの連絡先情報を構造化したオープンデータセットです。

- **データ:** CC0（パブリックドメイン）— 著作権表示不要、商用・非商用問わず自由に利用可能
- **コード:** Apache-2.0
- **APIキー不要**、登録不要、即座に利用開始できます

---

## 対象読者

- メンタルヘルス系アプリ・サービスを開発するエンジニア
- LLMにホットライン情報を提供したい AI 開発者
- 国内外の相談窓口データを研究・調査する研究者・NGO

---

## インストール

```sh
# TypeScript / JavaScript
npm install @open-helplines/core

# Python
pip install open-helplines
```

---

## 基本的な使い方

### TypeScript

```ts
import { loadCountry } from "@open-helplines/core";

const records = await loadCountry("JP");
const lines = records.filter(r => r.category === "suicide_prevention");
```

### Python

```python
from open_helplines import Registry

registry = Registry.from_github()
records = registry.find(country="JP", category="suicide_prevention")
```

### 生 JSON（curl）

```sh
# 日本のデータを取得
curl -s https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data/countries/jp/helplines.json \
  | jq '.records[] | {name, category}'
```

---

## LLM / AI との統合

### MCP（Claude Desktop）

```json
{
  "mcpServers": {
    "open-helplines": {
      "command": "npx",
      "args": ["@open-helplines/mcp"]
    }
  }
}
```

設定後、Claude Desktop から「日本の自殺防止ホットラインを教えて」と聞くだけで、レジストリから正確な情報を取得できます。

> **安全上の注意:** 電話番号・URLはレジストリのデータをそのまま提示してください。LLMが電話番号を生成・推測することは禁止です。

---

## データへの貢献

新しい相談窓口の追加・既存データの修正はプルリクエストで直接受け付けています。

詳細: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 安全に関するポリシー

open-helplines はデータレジストリです。カウンセリングや緊急対応は行いません。

**緊急の場合は、まず 110（警察）、119（救急・消防）に連絡してください。**

詳細: [docs/safety/SAFETY.md](docs/safety/SAFETY.md)

---

## ライセンス

| 対象 | ライセンス |
|------|-----------|
| `data/` | [CC0 1.0 Universal](LICENSE-DATA) — パブリックドメイン |
| コード | [Apache-2.0](LICENSE) |
