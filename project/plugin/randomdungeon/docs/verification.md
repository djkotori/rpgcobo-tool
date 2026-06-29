# 検証計画

オフライン回帰と RPG-Cobo 手動スモークの両方で品質を担保する。

---

## 1. オフライン検証

### 1.1 実行

```powershell
& "H:\CURSOR\rpgcobo-tool\project\plugin\randomdungeon\check\check-randomdungeon.ps1"
```

または:

```powershell
node "H:\CURSOR\rpgcobo-tool\project\plugin\randomdungeon\check\check-randomdungeon.mjs"
```

終了コード: `0` = 全 pass、`1` = 失敗あり

### 1.2 チェック項目（`check-randomdungeon.mjs`）

| ID | 内容 |
|----|------|
| `docs-exist` | 設計正本・5 仕様書・README が存在 |
| `sample-json-valid` | `sample/*.json` が parse 可能 |
| `plugin-json-entry` | `plugin.json` に `randomdungeon` |
| `plugin-sk-structure` | `plugin.sk` に `pluginfo`, `loadPlugin`, `SKStudio` ガード |
| `gvar-sample` | `sample/gvar-dungeon.json` に G100–G103 |
| `draft-schema` | `draft-classic.json` に必須キー |
| `runtime-templates` | `sample/events/*.json` が存在 |
| `macro-sample` | `macro-result-X050.json` 構造 |
| `no-squirrel-pitfalls` | ドキュメント化された禁止パターンの注記 |
| `reward-model-consistency` | reward-model と runtime-events の G101/G102 整合 |

### 1.3 CI 統合（将来）

`aiscenario/check` と同様、PR 前に手動実行。自動 CI はリポジトリ方針に従う。

---

## 2. 手動スモークテスト

詳細手順: [MANUAL-CHECKLIST.md](../check/MANUAL-CHECKLIST.md)

### 2.1 起動・メニュー

1. `rpgcobo.exe` 起動
2. テストプロジェクトを開く
3. マップ `M983` または新規マップをマップエディタで開く
4. **編集** → **ランダムダンジョン生成** が表示される
5. コンソールに `[randomdungeon] plugin loaded` が出る

### 2.2 生成・プレビュー（Phase 1 以降）

| # | 操作 | 期待結果 |
|---|------|----------|
| 1 | デフォルトでプレビュー生成 | ミニマップに部屋色分け |
| 2 | シード `test-001` で再生成 | 同一レイアウト |
| 3 | シード変更 | レイアウト変化 |
| 4 | 品質スコア < 60 の設定 | 警告ダイアログ |
| 5 | キャンセル | マップ無変更 |

### 2.3 確定・Undo

| # | 操作 | 期待結果 |
|---|------|----------|
| 1 | 確定 | 床・壁・イベントが反映 |
| 2 | Ctrl+Z | ブロックとイベントが同時に戻る |
| 3 | Ctrl+Y | 再適用 |
| 4 | イベントギズモ | 一覧・右クリックが動作 |
| 5 | タブの * | dirty 表示 |

### 2.4 保存経路

| # | 条件 | 期待結果 |
|---|------|----------|
| A | マップ開いたまま確定 → 保存 | `map.json` + `.bw` 更新 |
| B | マップ閉じた状態で別経路 import | 未オープンタブの未保存内容が消えない |
| C | 確定後マップ再オープン | ギズモ・イベント一致 |

### 2.5 ランタイム（Phase 2 以降）

前提: `gvar-dungeon.json` をプロジェクトにマージ、`X050` macro 追加。

| # | 操作 | 期待結果 |
|---|------|----------|
| 1 | 入口で「入る」 | ダンジョンマップへ転送、`G100=true` |
| 2 | 宝箱 | `G101` 増加、インベントリ不変 |
| 3 | 敵撃破 | 戦闘後マップ復帰 |
| 4 | 出口 | リザルトメッセージ、金・PT 加算、`G101=0` |
| 5 | 帰還 | ハブマップへ、`G100=false` |
| 6 | 再入場 | `G101` が 0 から開始 |

### 2.6 パフォーマンス

| 指標 | 目安 |
|------|------|
| 80×80 生成 | UI フリーズ < 3s（`suspend` あり） |
| 確定反映 | メッシュ更新完了 < 10s |
| Undo | 1s 以内 |

---

## 3. バリデーションユニット（Phase 1 実装時）

Squirrel または Node で `DungeonValidator` ロジックを移植したテスト:

| ケース | 入力 | 期待 |
|--------|------|------|
| 到達不能宝箱 | 孤立部屋 | `reachability` error |
| 部屋重なり | 手動 corrupt draft | `room_overlap` error |
| 正常 12 部屋 | `draft-classic.json` | score >= 70 |

---

## 4. 退行防止

非自明なバグ解決後は `.cursor/docs/mistakes.md` に追記:

- 未保存タブ上書き
- ギズモ未同期
- Undo でイベントだけ残る
- `ByteBuffer.pos` 未リセット

---

## 5. 完了基準（Phase 0）

- [x] 本検証計画ドキュメント
- [x] `check-randomdungeon.mjs` が pass
- [x] `MANUAL-CHECKLIST.md` 整備
- [ ] Phase 1: スモーク 2.2–2.4 の自動化は未（手動のみ）
