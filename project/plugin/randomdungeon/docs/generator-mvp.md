# v0.1 生成仕様 — Graph-first 王道ダンジョン

Phase 1 実装対象の最小生成パイプライン。

---

## 1. 入力 `DungeonSettings`

| パラメータ | 型 | デフォルト | 説明 |
|------------|-----|------------|------|
| `mode` | string | `"classic"` | v0.1 は classic のみ |
| `themeId` | string | `"stone_ruins"` | `DungeonTheme` 参照 |
| `seed` | string | `""` | 空ならランダム生成 |
| `width` | int | 80 | 生成幅（X） |
| `depth` | int | 80 | 生成奥行（Z） |
| `height` | int | 64 | BlockWorld 高さ（変更しない場合は editor.bw.h） |
| `roomCount` | int | 12 | 目標部屋数 |
| `minRoomW` | int | 5 | 最小部屋幅 |
| `minRoomD` | int | 5 | 最小部屋奥行 |
| `maxRoomW` | int | 13 | 最大部屋幅 |
| `maxRoomD` | int | 11 | 最大部屋奥行 |
| `corridorWidth` | int | 1 | 通路幅 |
| `branchRate` | float | 0.35 | 分岐枝の確率 |
| `loopRate` | float | 0.10 | ループ辺追加確率（v0.1 は任意） |
| `treasureCount` | int | 3 | 宝箱部屋数 |
| `trapCount` | int | 5 | 罠部屋/通路罠数 |
| `enemyDensity` | string | `"medium"` | low / medium / high |
| `bossRoom` | bool | true | ボス部屋を作る |
| `entranceMode` | string | `"auto"` | auto / manual |
| `entrancePos` | [x,z] | null | manual 時 |
| `exitMode` | string | `"farthest"` | farthest / manual |
| `exitPos` | [x,z] | null | manual 時 |
| `region` | IRect3D | null | null = マップ全体 |

### プリセット

| ID | roomCount | size | 用途 |
|----|-----------|------|------|
| `small_cave` | 6 | 50×50 | 序盤 |
| `thief_hideout` | 10 | 70×70 | 中規模 |
| `ancient_ruins` | 14 | 90×90 | ストーリー |
| `roguelike_floor` | 12 | 80×80 | 周回 |

---

## 2. 乱数

```squirrel
function hashSeed(seedStr){
  // FNV-1a 風 32bit → DungeonRNG 初期値
}
```

同一 `seed` + 同一 `settings` → 同一 `DungeonDraft`（ロック部屋除く）。

---

## 3. パイプライン

```
buildGraph(settings, rng)
  → assignRoomTypes(graph, settings)
  → placeRooms(draft, graph, settings, rng)
  → connectCorridors(draft, graph, settings)
  → rasterizeTiles(draft, theme)
  → placeEntities(draft, settings, rng)
  → validate(draft)
```

### 3.1 `buildGraph`

1. ノード数 = `roomCount`
2. 線形チェーン: `entrance → ... → boss → exit`（bossRoom=false なら entrance → exit）
3. `branchRate` に応じて側枝（treasure / trap / combat）
4. `loopRate` でチェーン外の辺を 1 本まで追加可能

部屋タイプ enum:

`entrance`, `normal`, `combat`, `treasure`, `trap`, `rest`, `mini_boss`, `boss`, `exit`, `key`, `locked`

v0.1 で割り当てるタイプ: `entrance`, `normal`, `combat`, `treasure`, `trap`, `boss`, `exit`

### 3.2 `placeRooms`

- グリッド上に長方形配置、AABB 非重複
- `entrance` は左端寄り、`boss`/`exit` は右端寄り（入口からのグラフ距離最大付近）
- `treasure` は主経路から 1 ホップ外
- 配置失敗時は最大 200 リトライ → 失敗なら `quality.errors` に記録

### 3.3 `connectCorridors`

- 各部屋の中心（床 Y）を L字で接続
- `corridorWidth` マス幅を床マスクに刻む
- 部屋内部は既に床；通路のみ追加

### 3.4 `rasterizeTiles`

`DungeonTheme` から:

| マスク | ブロック |
|--------|----------|
| 部屋床 | `theme.floor` |
| 通路床 | `theme.floor` |
| 壁（床隣接非床） | `theme.wall` |
| ドア位置 | `theme.door` または air + `door` イベント |

Y 座標: `region.y + floorY`（通常 `getFloorY` 相当の 1 段目）。

### 3.5 `placeEntities`

| type | 条件 | entity |
|------|------|--------|
| enemy | combat/boss、密度 | `enemy` + gid |
| treasure | treasure 部屋、行き止まり | `custom` chest + score |
| trap | trap 部屋 | `custom` trap |
| portal | exit 部屋 | 出口 `custom` |
| marker | entrance | スポーン位置 |

座標: 部屋内部のランダム床セル（壁・既存 entity と重複不可）。

---

## 4. プレビューモデル

`DungeonDraft` をそのまま UI に渡す。追加フィールド:

```json
"preview": {
  "roomColors": {
    "entrance": "#44aa44",
    "normal": "#4488cc",
    "treasure": "#cccc44",
    "trap": "#aa44aa",
    "boss": "#cc4444",
    "exit": "#888888",
    "corridor": "#666666"
  },
  "overlay": "minimap"
}
```

### プレビュー表示方式（Phase 1）

1. **ミニマップ `SKView`**: `rooms` + `connections` を 2D 描画（推奨・軽量）
2. オプション: 半透明ガイドを `MapCanvas` に重ねる（Phase 3）

プレビュー中 `editor.bw` は不変。`[確定]` のみ `DungeonApply.commit(draft)`。

---

## 5. バリデーション `DungeonValidator`

| checkId | 必須 | 内容 |
|---------|------|------|
| `reachability` | yes | entrance から exit/boss/treasure へ BFS |
| `entrance_exit` | yes | 両タイプの部屋が存在 |
| `boss_distance` | yes | boss が entrance からグラフ距離 >= 3 |
| `room_overlap` | yes | AABB 重複なし |
| `isolated_floor` | warn | 床マスク連結成分が 1 |
| `event_collision` | yes | entities 同一 (x,y,z) なし |
| `corridor_width` | yes | 最小幅 >= 1 |
| `key_order` | n/a v0.1 | 鍵ギミック未実装 |

### 品質スコア（0–100）

| 重み | 指標 |
|------|------|
| 30 | 到達可能性（全必須部屋） |
| 20 | ボス導線長 |
| 15 | 宝箱分散 |
| 15 | 分岐量（適正範囲） |
| 10 | 部屋サイズ分散 |
| 10 | 警告なし |

`score < 60` は確定前に `Dialogs.confirm` 警告。

---

## 6. ロック＆部分再生成（Phase 3 仕様・インターフェースのみ v0.1 定義）

```json
"locks": [
  { "kind": "room", "roomId": "room_003" },
  { "kind": "rect", "x": 20, "z": 30, "w": 15, "d": 15 }
]
```

再生成時:

- `kind=room`: 当該部屋の rect/type を固定、グラフの該当ノードを固定
- `kind=rect`: 矩形内の床/壁/entity を `oldDraft` からマージ
- 未ロック領域のみ `buildGraph` 以降を再実行

v0.1 では `locks` フィールドと UI プレースホルダのみ。ロジックは Phase 3。

---

## 7. 出力サンプル

`sample/draft-classic.json` — 12 部屋・固定シード `ruin-2026` の期待構造（手書き参照用）。

---

## 8. Squirrel API（予定）

```squirrel
DungeonGenerator <- {
  function generate(settings, lockedDraft=null),
  function regeneratePartial(draft, lockSpec),
}
```
