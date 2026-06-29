# 報酬・ポイント・交換モデル（確定）

Phase 0 で確定した初回実装モデル。ランタイム専用エンジンを増やさず、既存 `gvar` + `cmdblock[]` で表現する。

---

## 1. 設計原則

1. **ダンジョン内で拾ったものは外に持ち出せない** — インベントリへ `cmd_itemop` しない
2. **換金とポイントはリザルト時のみ確定** — ラン中はスコア変数のみ更新
3. **`point.json` は触らない** — システム固定（N000=金、N001=EXP、N002=JXP）
4. **`store` type=2 の runtime roll は使わない** — `RND99` + `cmd_if` で明示抽選

---

## 2. 変数割り当て

| 変数 | type | スコープ | 説明 |
|------|------|----------|------|
| `G100` | bool | セッション | `true` = ダンジョンラン中 |
| `G101` | num | ラン | 今回の戦利品評価スコア（持ち出し不可） |
| `G102` | num | 永続 | ダンジョンポイント（交換通貨） |
| `G103` | num | 一時 | リザルト表示用（換金額・獲得ポイントのキャッシュ） |
| `G110`–`G129` | bool | 永続 | 交換アイテム解放フラグ（20 枠） |

### ラン開始時（入口イベント）

```
G100 = true
G101 = 0
G103 = 0
```

### ラン終了時（出口リザルト）

```
換金額 = floor(G101 * 換金レート)     → cmd_moneyop
獲得PT = floor(G101 * ポイントレート) → G102 += 獲得PT
G101 = 0
G100 = false
```

換金レート・ポイントレートは `DungeonRuntimeBuilder` が `custom` の `cmd_compute` として埋め込む（デフォルト: 金 1.0、PT 0.5）。

---

## 3. 戦利品（一時スコア）の加算

### 3.1 宝箱

**v0.1**: `itemchest` ロールは使わず、`custom` イベントでスコアのみ加算。

```json
{
  "cmd": "cmd_compute",
  "lvar": "G101",
  "op": "+=",
  "rvar": 150
}
```

ランダム幅が必要な場合は macro または連鎖 `cmd_if`:

```
W = RND99
if W < 30  → G101 += 50
elif W < 70 → G101 += 120
else        → G101 += 200
```

`DungeonGenerator` は `entities[].params.score` に値を持たせ、`DungeonRuntimeBuilder` が上記 `cmdblock` を生成する。

### 3.2 敵撃破

マップ `enemy` ロール + 勝利 macro（`X003`）後に、ボス部屋のみ追加 `custom` ページで `G101 += bossBonus` を挿入するか、敵 DB の `money` をリザルトへ合算しない（ダンジョンラン中は `G100` で分岐）。

**v0.1 推奨**: 敵撃破ボーナスは宝箱と同様にイベント側で固定加算。通常敵 +30、中ボス +200、ボス +500。

### 3.3 罠

罠発動時 `G101 -= penalty` または `cmd_hpmp` ダメージのみ。スコア減はオプション。

---

## 4. 評価・換金（リザルト）

v0.1 は専用 UI なし。`custom` 出口イベントの `cmdblock` 順:

1. `cmd_showmsg` — 「獲得品を評価しています…」
2. `cmd_compute` — `G103 = G101`（表示用コピー）
3. `cmd_compute` — `W = floor(G103 * goldRate)` → `cmd_moneyop` で `W` 加算
4. `cmd_compute` — `X = floor(G103 * pointRate)` → `G102 += X`
5. `cmd_showmsg` — 「換金 ○○G、ポイント +○○」
6. `cmd_compute` — `G101 = 0`, `G100 = false`
7. `cmd_mapmove` — 帰還先（`runtimeHooks.returnDest`）

v0.2 で `cmd_showui` + 選択肢（換金のみ / ポイントのみ / 両方）を検討。

---

## 5. ポイント交換

### 5.1 データ

- `store.json` に `R050` など **type=0** 店舗を追加
- 各 `items[]` に `reqs: { lvar: "G110", op: "==", rvar: true }` で解放条件
- 価格は `price` フィールドではなく、購入 `custom` で `G102 -= cost` を実行（gvar を通貨として扱う）

### 5.2 購入フロー（v0.2）

```
clerk → macro X013 → store_item UI
  または
custom NPC → cmd_choices → reqs G102 >= cost → G102 -= cost → cmd_itemop（永続アイテム付与）
```

**v0.1**: 交換所 NPC と store 定義の JSON テンプレートのみ生成。購入ロジックは `custom` + `cmd_compute` の手動マクロ雛形。

### 5.3 解放条件

| 条件 | gvar |
|------|------|
| 初回クリア | `G110 = true`（ボス撃破イベントで設定） |
| 累計 PT 1000 | `G111 = true`（リザルト後 `if G102 >= 1000`） |
| 特定シードクリア | `G112`（`G103` または専用フラグ） |

---

## 6. 入口方式（確定）

| 方式 | 採用 | 理由 |
|------|------|------|
| 外部マップへ自動配置 | **v0.2 以降** | 未保存タブ・別マップ編集の競合 |
| **ハブマップ手動 + 生成時に入口イベント雛形** | **v0.1** | `ScenarioImporter` 二経路と整合 |
| 同一マップ内に入口/ダンジョン領域 | v0.1 対応 | 選択範囲生成で対応 |

`runtimeHooks.hubMapId`（入口を置くマップ）と `dungeonMapId`（生成先）を UI で指定。  
同一マップの場合は `hubMapId == dungeonMapId`。

---

## 7. プロジェクト側セットアップ

ゲームプロジェクトで `gvar.json` に以下を追加（プラグインは雛形 JSON を `sample/gvar-dungeon.json` で配布）:

```json
{
  "G100": { "name": "ダンジョン探索中", "type": 1, "defval": false },
  "G101": { "name": "今回の戦利品スコア", "type": 2, "defval": 0 },
  "G102": { "name": "ダンジョンポイント", "type": 2, "defval": 0 },
  "G103": { "name": "リザルト表示用", "type": 2, "defval": 0 }
}
```

---

## 8. 却下した代替案

| 案 | 却下理由 |
|----|----------|
| ラン中に通常 `itemchest` で I### 付与 | 外持ち出し禁止と矛盾 |
| `point.json` に N003 追加 | ファイルがシステム固定 |
| `store` type=2 のみで宝箱 | runtime roll 未確認 |
| インベントリ専用「仮想アイテム」ID 帯 | DB 汚染・エディタ負荷 |
