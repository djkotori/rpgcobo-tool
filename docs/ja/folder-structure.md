# RPG-Coboのフォルダ構造

RPG-Cobo のプロジェクトは、ゲームのソースコード・データ・リソース・ツール・ドキュメントなどを整理するために、以下のようなフォルダ構造を持っています。

## 	ルートディレクトリ

```
/
├── addon/
├── docs/
├── project/
│   ├── conf/
│   ├── data/
│   ├── plugin/
│   │   └── rpgtools/
│   │       ├── common/
│   │       ├── dbeditor/
│   │       ├── mapeditor/
│   │       ├── pm/
│   │       ├── reseditor/
│   │       ├── shader/
│   │       └── voxeditor/
│   ├── resource/
│   ├── src/
│   │   ├── rpg/
│   │   │   ├── action/
│   │   │   ├── battle/
│   │   │   ├── setting/
│   │   │   └── ui/
│   │   ├── shader/
│   │   └── vox/
│   └── system/
│       ├── 3d/
│       ├── asset/
│       ├── baselib/
│       ├── exlib/
│       ├── shader/
│       ├── shadermod/
│       ├── sound/
│       └── ui/
├── tools/
├── util/
│   ├── etc/
│   ├── skstudio/
│   └── sxtool/
└── work/
    ├── blender_rpgcobo/
    ├── img/
    ├── mot/
    └── plugin-samples/
```

---

## プロジェクト直下のファイル

| ファイル | 説明 |
|---|---|
| `rpgcobo.exe` | RPG-Cobo ツール実行ファイル |
| `sakanagl.dll` | RPG-Cobo で使用されるゲームエンジン `SakanaGL` のネイティブライブラリ |
| `boot.sk` | エンジン起動時のエントリポイント(このファイルは実際には使用されません。ソースの参考用です。) |
| `LICENSE` / `NOTICE.txt` | ライセンス情報 |
| `README.md` / `README.ja.md` | プロジェクト説明（英語・日本語） |

---

## フォルダ説明

### `/addon`

RPG-Cobo が実行時に読み込む DLL プラグインを格納します。`skstudio.dll`（ツール用ユーティリティ）や `voxengine.dll`（ボクセルレンダリングエンジン）など、エンジン拡張モジュールが含まれます。

---

### `/docs`

プロジェクトのドキュメントを格納します。

| フォルダ | 説明 |
|---|---|
| `docs/ja/` | 日本語ドキュメント。sakana 言語仕様・ネイティブ API リファレンス・プラグイン解説などを含む |

---

### `/project`

ゲームプロジェクト本体です。ここ以下のソースコードとデータがゲームの動作を定義します。

#### `/project/conf`

プロジェクト設定ファイル。ロード順の設定 (`load.conf`) やシステム辞書 (`sysdict.json`) を格納します。

#### `/project/data`

ゲームのデータベース一式を JSON 形式で格納します。マップ・キャラクター・アイテム・スキル・敵・クエストなど、ゲームコンテンツのデータが含まれます。

| ファイル例 | 内容 |
|---|---|
| `map.json` | 全マップのプロパティ・イベント定義 |
| `player.json` | プレイヤー情報 |
| `enemy.json` | 敵データ |
| `skill.json` | スキルデータ |
| `item.json` / `weapon.json` / `armor.json` | アイテム・武器・防具 |
| `setting.json` | システム設定 |
| `macro.json` | イベントマクロ |
| `gvar.json` | ゲームグローバル変数定義 |
| `type.json` | タイプ・属性定義 |

#### `/project/plugin`

RPG-Cobo で使用するプラグインを格納します。プラグインは、ゲームの機能拡張やエディタの追加機能などを提供するモジュールで、sakana 言語で実装されます。

`/project/plugin/rpgtools` は RPG-Cobo に同梱の標準プラグインで、ゲーム開発に使う各種エディタ機能を提供します。

| フォルダ | 説明 |
|---|---|
| `rpgtools/common/` | 全エディタ共通のユーティリティ（アクティビティ管理・プラグインダイアログ・プロパティ編集・リソースプレビューなど） |
| `rpgtools/dbeditor/` | データベースエディタ。キャラ・スキル・アイテム・敵・装備・設定など各 JSON データの編集 UI |
| `rpgtools/mapeditor/` | マップエディタ。ブロック配置・イベント配置・マッププロパティ・エンカウント設定などのマップ編集機能 |
| `rpgtools/reseditor/` | リソースエディタ。BGM・SE・ボイス・画像・ボクセル・エフェクト・UI など各リソースの登録・管理 |
| `rpgtools/pm/` | プラグイン内で使用するポリゴンモデル・画像などの静的アセット |

#### `/project/resource`

ゲームで使用するリソースファイル（画像・音声・フォント・ボクセルモデル・モーションなど）を格納します。

| フォルダ例 | 内容 |
|---|---|
| `bgm/` | BGM ファイル |
| `efx/` | エフェクトデータ |
| `enemy_pic/` | 敵キャラクター画像 |
| `event_pic/` | イベントで使用される画像 |
| `font/` | フォントデータ |
| `ibltex/` | IBL（環境光）テクスチャ |
| `icon/` | UI アイコン画像 |
| `mot/` | モーションデータ |
| `snd/` | 効果音ファイル |
| `ui/` | UI レイアウトデータ |
| `vox/` | ボクセルモデル(マップ、キャラなど) |

それぞれのリソースフォルダは、jsonフォーマットのリソース定義ファイル（例: `chara_vox.json`, `enemy_pic.json`, `bgm.json`, `snd.json` など）から参照され、リソースのID・ファイルパス・プロパティなどを定義します。

#### `/project/src`

ゲームランタイムのソースコード（sakana 言語）を格納します。

| フォルダ | 説明 |
|---|---|
| `src/rpg/` | RPG ゲームシステムの中核ロジック |
| `src/rpg/action/` | アクション・フィールドの制御 |
| `src/rpg/battle/` | バトルシステム |
| `src/rpg/setting/` | ゲーム設定処理 |
| `src/rpg/ui/` | ゲーム内 UI（メニュー・HUD など） |
| `src/vox/` | ボクセルモデルの読み込み・変換 |
| `src/shader/` | ゲーム用シェーダーコード |

主要ファイル:

- src/rpg以下

| ファイル | 説明 |
|---|---|
| `RPGMain.sk` | ゲームのメインループ |
| `RPGSystem.sk` | システム全体の初期化・管理 |
| `RPGStage.sk` | ステージ（マップ）管理 |
| `RPGEvent.sk` | イベントシステム |
| `RPGObjects.sk` | ゲームオブジェクト管理 |
| `RPGCamerawork.sk` | カメラ制御 |
| `RPGEffect.sk` | エフェクト制御 |
| `RPGViews.sk` | ゲーム固有UI部品 |

- src/rpg/setting以下

| ファイル | 説明 |
|---|---|
| `BattleCommands.sk` | バトルコマンドの定義 |
| `CharaProps.sk` | キャラクターのプロパティ定義 |
| `EventCommands.sk` | イベントコマンドの定義 |
| `OptionTypes.sk` | オプションタイプの定義 |

#### `/project/system`

ゲームに依存しない汎用システムライブラリ群です。`src/` からも `util/skstudio/` からも共通で利用されます。

| フォルダ | 説明 |
|---|---|
| `system/baselib/` | 汎用ユーティリティ（IO・HTTP・シリアライザ・グラフィックス 2D・イージングなど） |
| `system/ui/` | UI フレームワーク（`SKView` ベースのビュー階層・ダイアログ・リッチテキストなど） |
| `system/3d/` | 3D レンダリング関連 |
| `system/asset/` | アセット管理 |
| `system/sound/` | サウンド管理 |
| `system/shader/` | システム共通シェーダー |
| `system/shadermod/` | シェーダーモジュール |
| `system/exlib/` | 必要に応じてロードする拡張ライブラリ |

---

### `/tools`

開発補助スクリプトと外部ツールのバイナリを格納します。

| ファイル | 説明 |
|---|---|
| `cwebp.exe` / `dwebp.exe` | WebP 画像変換ツール |
| `cwebp_lossless.bat` / `cwebp_lossy.bat` | WebP 変換バッチ |
| `cmgen.exe` / `cmgen128.bat` / `cmgen256.bat` | キューブマップ（IBL 用）生成ツール |
| `toktx.exe` | KTX テクスチャ変換ツール |
| `blender_open.ps1` | Blender を開く PowerShell スクリプト |
| `magicavoxel_open.ps1` | MagicaVoxel を開く PowerShell スクリプト |
| `gettool.psm1` | ツール取得用 PowerShell モジュール |
| `tmpl_install.ps1` | テンプレートインストールスクリプト |
| `unzip_build.ps1` | ビルド成果物展開スクリプト |

---

### `/util`

RPG-Cobo ツールのベースとなる統合開発環境 skstudio 等の実装ソースコードを格納します。

#### `/util/skstudio`

RPG-Cobo のツールベース（skstudio）のソースコードです。ポリゴンモデルエディタ・UI エディタ・エフェクトエディタ・スプライトシート編集など、各種エディタの実装が含まれます。

| フォルダ | 内容 |
|---|---|
| `main/` | ツールのメイン処理 |
| `common/` | ツール共通ライブラリ |
| `imgeditor/` | 画像エディタ |
| `uieditor/` | UI エディタ |
| `efxeditor/` | エフェクトエディタ |
| `pmeditor/` | ポリゴンモデルエディタ |
| `spritesheet/` | スプライトシートエディタ |
| `shader/` | ツール用シェーダー |
| `trans/` | 翻訳・多言語対応 |
| `ui/` | ツール UI 定義 |

#### `/util/sxtool`

SakanaGL の標準パッケージフォーマットである SX パッケージを作成するためのツール群です（キー管理・ライセンス・パッケージング処理など）。

#### `/util/etc`

その他のユーティリティスクリプト（絵文字生成・簡易 Web サーバーなど）。

---

### `/work`

ゲームの素材を作成するための元となる作業用ファイルやサンプル等を格納します。

| フォルダ | 説明 |
|---|---|
| `work/blender_rpgcobo/` | Blender 用アドオンスクリプト（モデル・モーション出力） |
| `work/img/` | スプライトシートで使用されている画像ファイル |
| `work/mot/` | キャラクターモーション作成のための元データ(.blend) |
| `work/plugin-samples/` | プラグインのサンプルファイル（`hello.plugsk` など） |
