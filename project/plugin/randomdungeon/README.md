# Random Dungeon Generator

RPG-Cobo マップエディタ向けランダムダンジョン生成プラグイン（設計・実装予定）。

## ドキュメント

| ファイル | 内容 |
|----------|------|
| [../../docs/random-dungeon-design.md](../../docs/random-dungeon-design.md) | 設計正本 |
| [docs/reward-model.md](docs/reward-model.md) | 戦利品・ポイント・交換 |
| [docs/generator-mvp.md](docs/generator-mvp.md) | v0.1 生成アルゴリズム |
| [docs/apply-path.md](docs/apply-path.md) | マップ反映・Undo |
| [docs/runtime-events.md](docs/runtime-events.md) | ランタイムイベントテンプレート |
| [docs/verification.md](docs/verification.md) | 検証・スモークテスト |

## 状態

- **Phase 0**: 設計・仕様・チェックスクリプト・プラグイン骨格
- **Phase 1**: Classic 矩形部屋生成、設定ダイアログ、`submitOp` 反映、Undo 対応の縦切り
- **Phase 2+**: ランタイム報酬ループ、部屋ロック、部分再生成、洞窟/迷路モード

## オフライン検証

```powershell
& "H:\CURSOR\rpgcobo-tool\project\plugin\randomdungeon\check\check-randomdungeon.ps1"
```

起動前の再発防止チェック:

```powershell
python "H:\CURSOR\rpgcobo-tool\project\plugin\randomdungeon\check\test.py"
```

## 有効化

`project/plugin/plugin.json` で `randomdungeon.enable` を `true` にする。
