# AI Scenario Importer (PoC v1 + v2)

外部シナリオ JSON から `data/map.json` の対象マップへイベントを追記するプラグイン。

- **v1:** `role: villager`（`msg` 直書き）
- **v2:** `role: custom`（`pages[]` / `commands[]` → `page[]` / `cmdblock[]`）

**詳細技術メモ:** [`docs/aiscenario-poc.md`](../../docs/aiscenario-poc.md)（PR #3 確定仕様・保存経路・落とし穴）

## 使い方

### プラグイン（RPG-Cobo 内）

1. RPG-Cobo ツール起動（プロジェクトを開いた状態）
2. **編集** メニューから取り込みを実行:
   - `[PoC] villager JSON取り込み` — `sample/villager.json`
   - `[PoC] custom JSON取り込み` — `sample/custom.json`
3. ログは **表示 → システムコンソール**（Ctrl+@）
4. 対象マップを**閉じて開き直す** → 配置・会話を確認

### シナリオメーカー（ブラウザ）

AI なしで中間 JSON を作るウィザード HTML です。

1. `scenario-maker/index.html` をブラウザで開く（右上に **v0.5.0** 等の版数表示）
2. **左サイドバー** — プリセット読込 / 履歴（ホバーでプレビュー・「読み込み」で復元）/ 下書きリセット
3. ステップ 1〜3 でキャラ種類・配置・会話を入力
4. **JSON を作成する** → 右ペインに出力（会話プレビュー付き・履歴に自動保存）
5. **コピー** または **ダウンロード** した JSON を、RPG-Cobo 側で取り込む

サイドバーは ☰ で折りたたみ可能。履歴は最大 30 件（localStorage）。

**版数:** `index.html` 内 `APP_VERSION` を修正のたびに更新（右上表示と連動）。

## 保存経路（PR#3 4点目）

インポート先は対象マップの編集状態で自動分岐する。

| 状態 | 経路 | 保存先 |
|---|---|---|
| 対象マップを**アクティブに**開いている | A（editor） | `::skstudio.editor.data.event` → `editor.save()` |
| 開いていない / 別マップを編集中 | B（disk） | `getResource → deepclone → save()` |

- **経路A:** 本家 `MapToolEvent.sk` の savefunc 作法（`save()` → `markSaved()` → `updateChangeFile`）に倣う。
- **経路A の制約:** ギズモ（3D表示）の即時生成は PoC スコープ外。**マップを開き直す**と追記イベントがエディタ画面に表示される。
- **既知の制約（TODO verify）:** `::skstudio.editor` はアクティブなエディタのみ。対象マップが別タブで開いているが非アクティブの場合は経路Bになり、後のエディタ保存で上書きされる可能性がある。

## ファイル構成

```
project/plugin/aiscenario/
├─ plugin.sk
├─ ScenarioImporter.sk
├─ ScenarioCommandBuilder.sk   # v2: type → cmd_* 変換
├─ scenario-maker/
│  └─ index.html                 # ブラウザ用 JSON ウィザード
└─ sample/
   ├─ villager.json
   └─ custom.json
```

## データ仕様（v2 custom）

- **trigger（文字列→数値）:** `examine`=2, `auto`=6, `contact`=3（作者確認 PR#3）
- **message.uiclose:** `0`=開いたまま / `1`=イベント終了時に閉じる / `2`=即閉じ（**既定 2**、未指定時）

## データ仕様（PoC v1）

- 対応 role: `villager` のみ（`msg` に会話文を直接設定）
- イベント ID: 1000001〜、既存 `event` と衝突しない最小値を採番
- 保存経路: `ConfigItemResource.save()`（`::conf.map` 直書き禁止）

## 検証チェックリスト

- [ ] PluginDialog に「AI Scenario Importer (PoC)」が表示される
- [ ] メニュー実行後ログ成功
- [ ] M001 に村人が追加され会話できる
- [ ] 既存イベントが消えていない
