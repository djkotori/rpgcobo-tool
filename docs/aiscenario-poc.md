# AI Scenario Importer — PoC 技術メモ（PR #3）

本家 [djkotori/rpgcobo-tool](https://github.com/djkotori/rpgcobo-tool) 向け PR [#3](https://github.com/djkotori/rpgcobo-tool/pull/3)（Issue #2）の PoC 実装で判明した事項の正本。

- **フォーク:** `matrix9neonebuchadnezzar2199-sketch/rpgcobo-tool`
- **プラグイン:** `project/plugin/aiscenario/`
- **最終コミット（PoC v2 完了）:** `c98b7bc`
- **検証マップ:** M001（エディタ + ランタイム）

---

## 1. アーキテクチャ概要

```
sample/*.json
    ↓ loadScenarioJson (getResource / FileRef)
ScenarioImporter.importFromFile
    ├─ buildEvent (role 分岐)
    │    ├─ villager → buildVillagerEvent (msg 直書き)
    │    └─ custom   → buildCustomEvent → buildPage → ScenarioCommandBuilder
    ├─ allocNextEventId (最大 ID + 1)
    └─ 保存
         ├─ Path A: ::skstudio.editor.data.event → editor.save()
         └─ Path B: getResource → deepclone → mapres.save()
```

| ファイル | 役割 |
|----------|------|
| `plugin.sk` | `pluginfo` + `loadPlugin`（セットアップ前は return、postload でメニュー登録） |
| `ScenarioImporter.sk` | JSON 読込、role 分岐、採番、2 経路保存 |
| `ScenarioCommandBuilder.sk` | 中間 `commands[]` → `cmdblock[]`（再帰） |
| `sample/villager.json` | v1 サンプル |
| `sample/custom.json` | v2 サンプル |

メニュー: **編集** → `[PoC] villager JSON取り込み` / `[PoC] custom JSON取り込み`  
ログ: **表示 → システムコンソール**（Ctrl+@）

---

## 2. 中間 JSON スキーマ

### 2.1 共通（ルート）

```json
{
  "map": "M001",
  "events": [ /* ... */ ]
}
```

- `map`: 対象 mapid（`map.json` のキーと一致）
- `events`: 配列。各要素が 1 イベント

### 2.2 villager（v1）

```json
{
  "role": "villager",
  "name": "任意（空なら *villager-N 自動）",
  "mdlid": "CV000",
  "pos": [x, y, z, dir],
  "msg": "会話文（map.json に直書き）",
  "spawndist": 1
}
```

### 2.3 custom（v2）

```json
{
  "role": "custom",
  "name": "任意",
  "mdlid": "CV000",
  "pos": [x, y, z, dir],
  "pages": [
    {
      "trigger": "examine",
      "conditions": [],
      "commands": [ /* 下記 type */ ]
    }
  ]
}
```

`pages[]` → map.json の `page[]`。各 page の `commands[]` → `cmdblock[]`。

### 2.4 commands[] の type 対応

| type | 内部 cmd | 主なフィールド |
|------|----------|----------------|
| `message` | `cmd_showmsg` | `text`, `name`, `key`, `uiclose` |
| `wait` | `cmd_wait` | `time` (ms) |
| `setvar` | `cmd_compute` | `var`, `op`, `value` |
| `choice` | `cmd_choices` | `options[]`, `branches[][]`（再帰） |
| `if` | `cmd_if` | `conditions[]`, `then[]`, `else[]` |

**Squirrel 注意:** テーブルキー `"if"` は予約語のため `builders["if"]` で参照する。

---

## 3. 作者確認済み仕様（PR #3）

### 3.1 trigger（文字列 → 数値）

| 文字列 | 数値 | 意味 |
|--------|------|------|
| `examine` | 2 | 調べるボタン |
| `auto` | 6 | 自動 |
| `contact` | **3** | 接触（触れただけで実行） |

- 1, 2 は「調べる」系。3 が厳密な「接触」。
- その他プロパティの対応表は未整備。定義は `EventRole.sk`、使用は `RPGEvent.sk`。

### 3.2 cmd_showmsg.uiclose

| 値 | 意味 |
|----|------|
| 0 | 閉じない（イベント終了後もウィンドウ残る） |
| 1 | イベント終了時に閉じる |
| 2 | 即閉じ（**デフォルト**） |

実装: `("uiclose" in c) ? c["uiclose"] : 2` — **0 を `||` で扱うと 2 に落ちる**ため `in` 必須。

### 3.3 cmd_if の else

- `cmdblocks[0]` = then
- `cmdblocks[1]` = else（EventCommands.sk 準拠）

### 3.4 イベント ID

- 範囲: `1000000`〜`1999999`
- map.json キー: int または `"#1000010#"` 文字列の両方あり得る
- 採番: 既存最大 ID + 1（`allocNextEventId`）

---

## 4. 保存経路（4 点目 — 最重要）

### 4.1 確定事実（本家調査 + 作者回答）

1. 編集中マップの最新データは **ディスクの map.json ではなく** `MapEditor.data` 内。
2. `getResource(...).getContent()` は **エディタ未保存分を含まない**。
3. 開いているエディタ一覧: `::skstudio.tabeditors`（`path -> editor`）。
4. マップエディタ判定: `path` が `/.x/map/M001` のようになり、`ed` に `MapEditor` インスタンスが入る（作者回答）。
5. 編集中データ: `ed.data`（`map.conf` 当該マップ相当）。
6. 本家 savefunc（MapToolEvent.sk）作法:
   ```
   editor.data.event[id] <- ev
   editor.save()
   editor.op.markSaved()
   ::skstudio.updateChangeFile(editor)
   ```

### 4.2 プラグインの 2 経路

| 条件 | 経路 | ログ例 |
|------|------|--------|
| 対象 mapid が開いている（非アクティブタブ含む） | **A (editor)** | `into M001 (editor)` |
| 対象 mapid が開いていない | **B (disk)** | `into M001 (disk)` |

**実機確認（2026-06-23）**

- Path B: マップ閉じた状態 → disk 更新 OK
- Path A: M001 開いて手動編集後に取り込み → Ctrl+S 後も手動編集 + インポート分が**両方残存**
- Path A 後、マップ再オープン → イベント表示・分岐データ保持 OK
- villager / custom × Path A/B すべて OK

### 4.3 既知の制約

| 制約 | 内容 |
|------|------|
| ギズモ未生成 | Path A では 3D 表示オブジェクトは即時生成しない。マップ**再オープン**で反映 |
| 非アクティブタブ | 作者回答に基づき `::skstudio.tabeditors` で検出するため、Path B への誤落ちは解消 |

### 4.4 採用しなかった案

- **flushEditor のみ:** エディタ内未保存分は flush 後も `getContent()` 経路では取れない問題は解決しない
- **常に中断:** 編集中は一切インポート不可 — Path A で両立可能と判明したため不採用

---

## 5. 実装時の落とし穴

| 現象 | 原因 | 対処 |
|------|------|------|
| PluginDialog 例外 | `plugin.json` に `lock` 未設定 | `"lock": false` |
| `scenario file not found: /plugin/...` | `FileRef` は Resource 仮想パス不可 | `getResource().loadData()` |
| メニューが出ない（セットアップ前） | postload 前にメニュー登録 | 本家流 `loadPlugin` 分岐 |
| `if` ビルダー登録失敗 | Squirrel 予約語 | `builders["if"]` |
| uiclose=0 が 2 になる | `\|\|` による falsy 判定 | `("uiclose" in c)` |
| contact が 1 | 観測値と作者仕様の差 | **3** に修正 |
| 編集中インポート後に消失 | disk 経路で上書き | `::skstudio.tabeditors` で開いている MapEditor を検出し Path A |

---

## 6. plugin.json 設定

```json
"aiscenario.enable": true,
"aiscenario.lock": false
```

（キー名は本家 `plugin.json` 構造に合わせる。`lock: false` は PluginDialog 互換に必須。）

---

## 7. コミット履歴（PoC チェーン）

| hash | 概要 |
|------|------|
| `d194ad9` | villager PoC 初版 |
| `64eda57` | plugin.json lock |
| `b7599ef` | getResource で JSON 読込 |
| `6ec8347` | loadPlugin 本家流 |
| `095f5e0` | v2 custom + CommandBuilder |
| `34db305` | import 部分失敗許容 |
| `50ed2d1` | trigger/uiclose/if 作者回答反映 |
| `c98b7bc` | 編集中マップ Path A/B 保存 |

---

## 8. 今後（本 PR 外）

- ~~`ImportDialog.sk` — ファイル選択 / 貼り付け UI~~ → **M1–M3 完了**（`ImportDialog.sk`）
- `ScenarioAI.sk` — AI 生成パイプライン（**M5 スタブのみ**、実 API 未接続）
- 他 role: itemchest / enemy / portal / clerk
- ギズモ即時生成（Path A 後の 3D 表示）

マイルストーン一覧: [aiscenario-milestones.md](./aiscenario-milestones.md)

---

## 8b. シナリオメーカー（HTML ウィザード）

`project/plugin/aiscenario/scenario-maker/index.html` — ブラウザ単体で中間 JSON を生成。

- **出力形式:** `sample/villager.json` / `sample/custom.json` と同じ中間 JSON（`version`, `map`, `events[]`）
- **変換の分担:** フォームは `type: "message"` 等の人間向け形式のみ出力。`cmdblock[]` や trigger 数値への変換は **プラグイン**（`ScenarioCommandBuilder.sk`）が担当
- **フロー:** キャラ種類 → マップ・配置 → 会話（選択肢なし / YES-NO / YES-NO+if）
- **便利機能:** プリセット読込、会話プレビュー、コピー、ダウンロード、localStorage 下書き、バリデーション
- **GitHub Pages:** https://matrix9neonebuchadnezzar2199-sketch.github.io/aiscenario-maker/（リポ `aiscenario-maker`、正本 `scenario-maker/` から `update-from-rpgcobo.ps1` で同期）

---

## 9. 参照

- [Issue #2](https://github.com/djkotori/rpgcobo-tool/issues/2) — 提案元
- [PR #3](https://github.com/djkotori/rpgcobo-tool/pull/3) — 本 PoC
- プラグイン README: `project/plugin/aiscenario/README.md`
