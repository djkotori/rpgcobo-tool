# ランタイムイベントテンプレート

`DungeonRuntimeBuilder` が `DungeonDraft.entities` と `runtimeHooks` から `map.json` イベント JSON を生成する仕様。

---

## 1. 共通

- イベント ID: Apply 時に採番（テンプレート内では `0` プレースホルダ）
- 位置: `[x, y, z, dir]` — `y` は床+1、`dir` 0–3
- `spawndist`: 入口 NPC=1、宝箱=0、敵=1

---

## 2. 入口（ハブマップ）

### 2.1 `entrance_talk` — 会話で転送

`role: custom`

```json
{
  "role": "custom",
  "name": "*dungeon-entrance",
  "mdlid": "CV000",
  "pos": [10, 1, 10, 0],
  "page": [{
    "trigger": 3,
    "cmdblock": [
      { "cmd": "cmd_showmsg", "msg": "ダンジョンに入りますか？" },
      { "cmd": "cmd_choices", "choices": ["入る", "やめる"], "cancel": 1 },
      { "cmd": "cmd_if", "cond": { "lvar": "RESULT", "op": "==", "rvar": 0 },
        "cmdblocks": [
          { "cmd": "cmd_compute", "lvar": "G100", "op": "=", "rvar": true },
          { "cmd": "cmd_compute", "lvar": "G101", "op": "=", "rvar": 0 },
          { "cmd": "cmd_mapmove", "dest": { "mapid": "M050", "pos": [4, 1, 35, 0] },
            "wipe": 1, "remap": true }
        ]
      }
    ]
  }]
}
```

### 2.2 `entrance_portal` — 魔法陣（無条件進入）

`role: portal`

```json
{
  "role": "portal",
  "name": "*dungeon-portal",
  "pos": [10, 1, 10, 0],
  "dest": { "mapid": "M050", "pos": [4, 1, 35, 0] },
  "wipe": 1,
  "remap": true,
  "page": [{
    "trigger": 5,
    "wvarmap": { "W": "dest", "X": "wipe", "Y": "remap" },
    "cmdblock": [
      { "cmd": "cmd_compute", "lvar": "G100", "op": "=", "rvar": true },
      { "cmd": "cmd_compute", "lvar": "G101", "op": "=", "rvar": 0 },
      { "cmd": "cmd_mapmove", "dest": null, "_var": { "dest": "W", "wipe": "X", "remap": "Y" } }
    ]
  }]
}
```

入口で `G100`/`G101` 初期化を必ず実行。

### 2.3 `entrance_gate` — 扉 + 隣接ポータル

1. `door` イベント（開閉）
2. 1 マス先に `portal`（`entrance_portal` と同構造）

v0.1 では `entrance_talk` と `entrance_portal` の 2 種のみ実装。

---

## 3. ダンジョン内 — 出口・帰還

### 3.1 `exit_return` — リザルト付き帰還

`role: custom`, trigger 3（調べる）または 4（接触）

```json
{
  "role": "custom",
  "name": "*dungeon-exit",
  "mdlid": "CV000",
  "pos": [62, 1, 10, 0],
  "page": [{
    "trigger": 3,
    "cmdblock": [
      { "cmd": "cmd_macro", "macroid": "X050" }
    ]
  }]
}
```

`X050` = リザルト macro（プロジェクト `macro.json` に追加）。中身:

1. `G103 = G101`
2. `W = floor(G103 * 1.0)` → `cmd_moneyop` +W
3. `X = floor(G103 * 0.5)` → `G102 += X`
4. メッセージ表示
5. `G101 = 0`, `G100 = false`
6. `cmd_mapmove` → `returnDest`

雛形: `sample/macro-result-X050.json`

### 3.2 `exit_escape` — 途中離脱（評価半減）

`G101 = floor(G101 * 0.5)` してから `exit_return` と同じ macro。

---

## 4. 宝箱（スコアのみ）

### 4.1 `chest_score` — custom

```json
{
  "role": "custom",
  "name": "*dungeon-chest",
  "mdlid": "CV370",
  "pos": [45, 1, 12, 0],
  "page": [
    {
      "trigger": 3,
      "reqs": { "lvar": "A", "op": "!=", "rvar": "REMAPID" },
      "cmdblock": [
        { "cmd": "cmd_showmsg", "msg": "宝箱を開けた！" },
        { "cmd": "cmd_compute", "lvar": "G101", "op": "+=", "rvar": 150 },
        { "cmd": "cmd_compute", "lvar": "A", "op": "=", "rvar": "REMAPID" }
      ]
    },
    {
      "trigger": 0,
      "reqs": { "lvar": "A", "op": "==", "rvar": "REMAPID" },
      "cmdblock": []
    }
  ]
}
```

`A` + `REMAPID` でワンショット。`params.score` を `rvar` に埋め込む。

### 4.2 `chest_random` — RND99 分岐

`params.scoreTiers`: `[{max:30, score:50}, {max:70, score:120}, {max:100, score:200}]`

Builder が `cmd_if` 連鎖を生成（`store` type=2 不使用）。

---

## 5. 敵

### 5.1 `enemy_normal`

`role: enemy`

```json
{
  "role": "enemy",
  "name": "*dungeon-enemy",
  "mdlid": "CV000",
  "gid": 1,
  "pos": [20, 1, 31, 0],
  "page": [{ "trigger": 1, "cmdblock": [{ "cmd": "cmd_macro", "macroid": "X003" }] }]
}
```

`gid` は `draft.settings.encountGroupId` または距離に応じたテーブル。

### 5.2 `enemy_boss`

同一構造、`gid` = ボス用、`params.postDefeat`:

```json
{ "cmd": "cmd_compute", "lvar": "G101", "op": "+=", "rvar": 500 },
{ "cmd": "cmd_compute", "lvar": "G110", "op": "=", "rvar": true }
```

---

## 6. 罠

### 6.1 `trap_damage`

```json
{
  "role": "custom",
  "name": "*dungeon-trap",
  "pos": [30, 1, 15, 0],
  "page": [{
    "trigger": 4,
    "reqs": { "lvar": "B", "op": "!=", "rvar": "REMAPID" },
    "cmdblock": [
      { "cmd": "cmd_showmsg", "msg": "罠だ！" },
      { "cmd": "cmd_hpmp", "who": 0, "hp": -20 },
      { "cmd": "cmd_compute", "lvar": "B", "op": "=", "rvar": "REMAPID" }
    ]
  }]
}
```

---

## 7. 交換所

### 7.1 `exchange_clerk`

`role: clerk`（店 macro `X013`）

```json
{
  "role": "clerk",
  "name": "*dungeon-exchange",
  "storeid": "R050",
  "pos": [5, 1, 5, 0]
}
```

購入時の `G102` 減算は v0.2 で `custom` 購入イベントに移行。v0.1 は store 雛形 + 手動マクロ。

### 7.2 `exchange_unlock_gate`

```json
{
  "role": "custom",
  "name": "*exchange-gate",
  "page": [{
    "trigger": 3,
    "reqs": { "lvar": "G102", "op": ">=", "rvar": 1000 },
    "cmdblock": [
      { "cmd": "cmd_compute", "lvar": "G111", "op": "=", "rvar": true },
      { "cmd": "cmd_showmsg", "msg": "新しい品が解禁された！" }
    ]
  }]
}
```

---

## 8. 鍵付き扉（Phase 4）

v0.1 ではテンプレート定義のみ:

- `key_pickup`: `G101 += 0`, `G120 = true`（鍵所持）
- `locked_door`: `reqs G120 == true` → `door` open + `cmd_mapmove`

`DungeonValidator.checkKeyOrder` で鍵が扉より前にあることを検証。

---

## 9. Builder API

```squirrel
DungeonRuntimeBuilder <- {
  function buildEvent(entity, hooks),
  function buildEntrance(kind, hooks, pos),
  function buildExit(hooks, pos),
  function buildChest(entity),
  function buildEnemy(entity),
  function buildTrap(entity),
  function buildResultMacro(hooks, rates),
}
```

`sample/events/` に各テンプレートの完成 JSON を配置。

---

## 10. encount 連携

ランダムエンカウントを使う場合、生成マップに `encount[]` エントリを追加:

```json
{
  "gid": 10,
  "rate": 0.05,
  "area": "<base64 bitmap>",
  "enemies": ["E001", "E002"],
  "mapid": "M051",
  "escape": true
}
```

v0.1 では配置 `enemy` ロールを優先。`encount[]` は Phase 2。
