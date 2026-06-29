# マップ反映・Undo 仕様

`DungeonApply` が `DungeonDraft` を開いているマップエディタへ安全に反映する手順。

---

## 1. 経路分岐

`ScenarioImporter.getOpenMapEditor(mapid)` と同じ二経路:

| 経路 | 条件 | 書き込み先 |
|------|------|------------|
| **A** | `tabeditors["/.x/map/"+mapid]` が存在 | `activeEd.data`, `activeEd.bw` |
| **B** | マップ未オープン | `getResource` → `deepclone` → `mapres.save` |

**経路 A を優先**。経路 B は未保存タブを上書きしない。

`map_asset` エディタ（`data=null`）では生成不可 — `Dialogs.notice` で拒否。

---

## 2. 確定前チェック

1. `DungeonValidator.validate(draft)` → `errors` があれば確定禁止
2. `warnings` のみ → 確認ダイアログ
3. 生成範囲内の既存イベント数をカウント → 上書きモードなら警告

### 上書きモード

| モード | 動作 |
|--------|------|
| `merge` | 既存イベント保持。生成 entity のみ追加 |
| `replace_region` | 生成矩形内のイベントのみ削除してから配置 |
| `replace_all_events` | 危険 — v0.1 では非搭載 |

デフォルト: `merge`

---

## 3. ブロック反映

### 3.1 スナップショット

確定直前:

```squirrel
local region = draft.bounds;  // IRect3D
local oldBw = editor.bw.createCopy(region);
local oldEvents = snapshotEventsInRegion(editor.data.event, region);
```

### 3.2 適用

1. `region` 内を `clearRegion`（または床高さに合わせた `clearRegion` — `MapToolSel.deleteOp` 参照）
2. `draft.tileMask` を `BlockOperation.boxPaintBlock` または一括 `drawWorld` で描画
3. `editor.canvas.loadInCameraMesh(20)` を `while(...){ suspend(); }`

### 3.2.1 Phase 1.5 terrain preservation

Phase 1.5 では既存マップへの馴染ませを優先し、`preserveTerrain=true` をデフォルトとする。Apply 時は、生成 tile patch の位置に既存の非空ブロックがあり、かつ生成 tileId と異なる場合は上書きしない。

目的:

- 既存地形・装飾・段差を不用意に塗り潰さない。
- 生成床/壁が既存地形の上に不自然な色面として重なるのを抑える。
- Phase 2 以降の本格テーマ選択 UI を入れるまで、現在マップの表面ブロック推定を初期値として使う。

### 3.3 Undo

単一 `editor.submitOp(redo, undo)`:

```squirrel
redo = [@(){
  self._applyBlocks(draft);
  self._applyEvents(draft, mode);
  self.canvas.loadInCameraMesh(20);
}];
undo = [@(){
  self.bw.clearRegion(region);
  self.bw.drawWorld(oldBw, IMat(region.x, region.y, region.z));
  self._restoreEvents(oldEvents);
  self.canvas.placeEventMarkerGizmos();  // 全再構築
  self.canvas.loadInCameraMesh(20);
}];
editor.submitOp(redo, undo, null);
```

`MapToolSel.paste2DStart` の `pasteop()` パターンに準拠。

---

## 4. イベント反映

### 4.1 ID 採番

`ScenarioImporter.allocNextEventId` と同帯:

- 範囲: `1000000`–`1999999`
- `DungeonApply.allocEventIds(count)` で連続採番

### 4.2 配置

各 `draft.entities[]`:

```squirrel
local evid = allocNextEventId(eventTb);
local ev = DungeonRuntimeBuilder.buildEvent(entity, draft.runtimeHooks);
eventTb[evid] <- ev;
importedEvents.push({ id=evid, event=ev });
```

経路 A では即 `canvas.placeEventGizmo(evid, ev)`。

### 4.2.1 Phase 1 marker policy

Phase 1 の生成イベントは runtime 動作確認用ではなく、マップ上の配置確認用 marker として扱う。

| entity type | Phase 1 role | runtime 挙動 |
|-------------|--------------|--------------|
| `entrance` | `custom` | `trigger=0`, `cmdblock=[]` |
| `exit` | `custom` | `trigger=0`, `cmdblock=[]` |
| `chest` | `custom` | `trigger=0`, `cmdblock=[]` |
| `enemy` | `custom` | `trigger=0`, `cmdblock=[]` |

Phase 1 では `itemchest` / `enemy` ロールを使わない。理由は、宝箱接触で未完成の報酬コマンドが実行されたり、敵接触で戦闘・消滅の runtime 挙動へ入るのを避けるため。`cmd_showmsg` も Phase 1 生成イベントからは出力しない。

### 4.3 ギズモ同期

`ScenarioImporter.syncImportedEventsToEditor` と同一:

1. `placeEventGizmo` 各件
2. `ed.tool.updateEventList()` / `updateGizmoStates()`
3. `ed.canvas.view.repaint()`

### 4.4 FreeBlock 連動

扉 `door` + `portal` 生成時は `mdl.fbuid` / `mdl.r` を設定。Undo 時 `tool.syncFBGizmo` / `restoreFBGizmo` を redo/undo に追加（`MapEditor.resizeMap` 参照）。

---

## 5. 保存と dirty 状態

| 操作 | 推奨 v0.1 |
|------|-----------|
| 確定後 auto-save | **しない** — `submitOp` のみで `updateChangeFile` |
| ユーザーが Ctrl+S | `editor.save()` |

`aiscenario` の自動 save は争点があるため、ダンジョン生成は **dirty のまま Undo 可能** を優先。

経路 B（ディスクのみ）:

```squirrel
mapres.save(mapdata);
// editor 未オープンなので updateChangeFile 不要
```

---

## 6. サイズ変更

生成範囲が `editor.bw` を超える場合:

1. `MapEditor.resizeMap` と同等の `setBlockWorld` + `data.size` 更新
2. 既存 `event.pos` / `marker.pos` をオフセット（`resizeMap` 内ロジック再利用）

v0.1 では **生成範囲 ⊆ 現 bw** を UI で強制し、リサイズは Phase 2。

---

## 7. プレビューと確定の分離

| 段階 | `editor.bw` | `editor.data.event` |
|------|-------------|---------------------|
| プレビュー生成 | 不変 | 不変 |
| ミニマップ表示 | 不変 | 不変 |
| 確定 | 変更 | 変更（merge/replace_region） |
| キャンセル | 不変 | 不変 |

プレビュー用 `DungeonDraft` は `DungeonDialog` のインスタンス変数 `currentDraft` に保持。

Phase 1 の確認ダイアログは固定サイズの `Dialogs.confirm` を使うため、本文は 3〜4 行以内に制限する。ボタン領域と重ならないことを UI 確認の必須項目とする。

---

## 8. エラーハンドリング

| 失敗 | 対応 |
|------|------|
| 採番枯渇 | Exception → `Dialogs.notice` |
| `submitOp` 内例外 | undo 未登録なら bw を手動復元、ログ出力 |
| メッシュ生成タイムアウト | `suspend` 継続、キャンセルボタンで中断フラグ |

---

## 9. API（予定）

```squirrel
DungeonApply <- {
  function getTargetEditor(mapid),
  function snapshotRegion(editor, region),
  function commit(editor, draft, options),
  function allocEventIds(eventTb, count),
}
```

`options`: `{ overwriteMode="merge", autoSave=false }`
