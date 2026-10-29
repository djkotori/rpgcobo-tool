# RPG-Cobo で使用されている定数の一覧

このドキュメントは、RPG-Cobo の `project` 配下の `.sk` ファイルから抽出した `enum` と `const` の一覧です。

***このドキュメントには、RPG-Cobo ツール、 SKStudioで定義されている定数は含まれていません。***

## system/ui/SKViewProperty.sk

### enum PropertyType

プロパティの型を表す定数です。RPG-Cobo のプロパティシステムで頻繁に使用されます。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| HEADER | -1 | プロパティリストを区切って分かりやすくするためのヘッダです |
| NOEDITOR | 0 | このプロパティタイプは編集不可です |
| SCALAR | 1 | 数値タイプです |
| VEC2 | 2 | 2次元ベクトルの数値タイプです |
| VEC3 | 3 | 3次元ベクトルの数値タイプです |
| STRING | 4 | 文字列タイプです |
| BOOL | 5 | 真偽値タイプです |
| LIST | 6 | リストから選択するタイプです |
| RGB | 7 | カラー（アルファ無し）です |
| RGBA | 8 | カラー（アルファ有り）です |
| PATH | 9 | パスを示す文字列タイプです |
| LANGSTRING | 11 | 言語別に指定できる文字列タイプです |
| CHECKBITS | 13 | ビット列として項目ごとにチェックできるリストです |
| PROPERTYLIST | 14 | プロパティ一覧をさらに内包できます |
| SCRIPT | 15 | スクリプトを示す文字列タイプです |
| CUSTOMBUTTON | 16 | 好きな機能を実行するボタンです |
| BOOL1 | 17 | 省スペースのBOOLタイプです |
| ROT_HEAD | 18 | HEAD回転のタイプです |
| ROT_HPB | 19 | HPB回転のタイプです |
| TEXTSTYLE | 100 | フォント、サイズ、スタイルを指定するタイプです |
| ALIGN_STRETCH | 103 | ビューの形状ストレッチのタイプです |
| VEC2_PIVOT | 104 | ピボットを指定する2次元ベクトルのタイプです |
| PATHLIST | 105 | 複数のパスを指定できるタイプです |
| CAMERA | 106 | カメラの座標情報を示すタイプです |
| SOUNDID | 107 | サウンドIDを示すタイプです |
| BIT8 | 202 | 8bitのビットマスクを指定します |

<!-- 
| VALUELIST | 10 | LISTと同じくリストだが{ lbl="X", val="abccc"}のようにvalを指定するリスト | 
| SCALARBAR | 12 | SCALARと同じ数値だがバーで調整できる |
| STRETCH | 101 | 画像の9スライスのタイプです |
| ROT1 | 102 | special property type |
| SCALAR_RND | 200 | not for SKView |
| VEC3_RND | 201 | not for SKView |
| FILEPATH | 203 | not for SKView |
-->

## src/rpg/RPGConstants.sk

### enum RPGPropertyType

プロパティの型を表す定数です。RPG-Cobo のプロパティシステムで頻繁に使用されます。
この`RPGPropertyType`は、RPG-Cobo 固有のプロパティタイプを定義しています。一方で、`PropertyType`は、汎用的なタイプの定義です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| NAME_ICON | 1001 | 名前、アイコンを同時に指定するタイプです |
| LIST_SCALAR | 1002 | リストと数値を同時に指定するタイプです |
| DATAID | 1003 | データベースのIDを指定するタイプです |
| DATAIDS | 1004 | データベースのIDを複数指定するタイプです |
| RESID | 1005 | リソースのIDを指定するタイプです |
| RESID_PREVIEW | 1006 | プレビュー付きのリソースのIDタイプです |
| VARIABLE | 1007 | 数値、文字列などのリテラル値や、変数を指定するタイプです |
| REQUIREMENTS | 1008 | 条件を複数指定するタイプです |
| EXPCURVE | 1009 | 経験値カーブを指定するタイプです |
| PORTAL | 1012 | マップ移動の移動先を指定するタイプです |
| GRAPHIC | 1013 | 画像やボクセル等を選択するタイプです |
| VOXEL_PARTS | 1014 | voxとその中のパーツを同時に指定するタイプです |
| PALETTEMAP | 1015 | パレット色を置き換えるためのタイプです |
| MESSAGE | 1016 | 会話メッセージのテキスト入力用タイプです |
| ENEMYGROUP | 1017 | エネミーグループを配置するためのタイプです |
| GAMETITLE | 1018 | ゲームタイトル、アイコン等を指定するタイプです |
| UIPOSITION | 1019 | UI表示の位置を指定するタイプです |
| ANIME_INLINE | 1020 | アニメ指定をプロパティ内で表示するタイプです |
| ANIME_POPUP | 1021 | ポップアップ形式でアニメ指定を行うタイプです |
| ANIMEMAP | 1023 | アニメのマッピングを指定するタイプです |
| PLACEASSET | 1024 | マップアセットの配置を指定するタイプです |

<!-- 
| CUSTOMPROP | 1010 | - |
| EMOJI | 1011 | - |
 -->

### enum CollisionGroupID

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| G_VIEW | 0x7F | 表示用の衝突グループ |
| G_CHARA | 0x100 | キャラクターを示す衝突グループ |
| G_OBJECT | 0x200 | オブジェクトを示す衝突グループ |
| G_EVENT | 0x400 | イベントの衝突判定グループ |
| G_STAGE | 0x800 | ステージ用の衝突グループ |
| G_WATER | 0x1000 | 水用の衝突グループ（現在未使用） |
| G_GIZMO | 0x8000 | ツール用 |

### enum ControlID

コントローラー入力で、入力のボタンからアクションを判定するための定数です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| CTRL_STOP | 1 | 停止を指示するコントロール |
| CTRL_MOVE | 2 | 移動を指示するコントロール |
| CTRL_DASH | 3 | ダッシュを指示するコントロール |
| CTRL_JUMP | 4 | ジャンプを指示するコントロール |
| CTRL_SEARCH | 5 | 調べる（話す）を指示するコントロール |
| CTRL_MENU | 6 | メニューを指示するコントロール |
| CAM_ROTATE | 100 | カメラの回転を指示するコントロール |
| CAM_ROLL | 102 | カメラのロールを指示するコントロール |
| CAM_ZOOM | 103 | カメラのズームを指示するコントロール |
| CAM_TARGET | 104 | カメラのターゲットを指示するコントロール |
| CAM_RESET | 107 | カメラのリセットを指示するコントロール |
| CAM_POV | 108 | カメラの視点を指示するコントロール |

### enum VarType

グローバル変数がどの型であるかを示す定数です。RPG-Cobo のイベント変数システムで使用されます。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| VAR_NONE | 0 | このタイプが指定されているグローバル変数は使用不能 |
| VAR_BOOL | 1 | ON, OFF |
| VAR_INT | 2 | 整数型 |
| VAR_FLOAT | 3 | 浮動小数点型 |
| VAR_STRING | 4 | 文字列型 |
| VAR_SCRIPT | 5 | スクリプトを実行して値を取得する型。値の設定は不可 |
| VAR_ANY | 6 | table, arrayも入る。が、シリアライズできないオブジェクトは不可 |

### enum EventTriggerType

イベントがコマンド列の実行をトリガーする条件を示す定数です。RPG-Cobo のイベントシステムで使用されます。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| TRG_NONE | 0 | トリガーしない。 |
| TRG_SEARCH_S | 1 | 近距離で調べる（話す）ボタン。 |
| TRG_SEARCH_L | 2 | 遠距離で調べる（話す）ボタン。 |
| TRG_CONTACT | 3 | プレイヤーとイベントが接触した |
| TRG_REACH | 4 | プレイヤーがイベントの一定以内に近づいた |
| TRG_INSIDE | 5 | プレイヤーが範囲内に完全に入った。 |
| TRG_SPAWN | 6 | スポーン時に一回だけトリガー |
| TRG_ALWAYS | 7 | 常にトリガーを続ける |

### enum DamageResultType

ダメージの結果を示す定数です。RPG-Cobo のバトルシステムで使用されます。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| DMG_NONE | 0 | 成功。攻撃行動が無かった。これは成功となり追加効果オプションは発動する。 |
| DMG_HIT | 1 | 成功。ダメージが入った |
| DMG_HEAL | 2 | 成功。回復が入った |
| DMG_CRITICAL | 3 | 成功。クリティカルが入った |
| DMG_SKIP | 4 | 失敗。攻撃はスキップされた |
| DMG_MISS | 5 | 失敗。攻撃は外れた |
| DMG_SHIELD | 6 | 失敗。追加効果オプションは発動しない。が、ダメージが入る場合もある。 |

### enum CommandTargetType

バトルコマンドの対象を示す定数です。RPG-Cobo のバトルシステムで使用されます。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| TGT_NONE | 0 | ターゲット指定なし |
| TGT_ENEMY_SINGLE | 1 | 敵単体 |
| TGT_ENEMY_RANDOM | 2 | 敵ランダム単体 |
| TGT_ENEMY_R3 | 3 | 指定した敵から半径3m以内の敵グループ |
| TGT_ENEMY_R6 | 4 | 指定した敵から半径6m以内の敵グループ |
| TGT_ENEMY_LINE | 5 | 指定した敵から横ラインの敵グループ |
| TGT_ENEMY_COLUMN | 6 | 指定した敵から縦ラインの敵グループ |
| TGT_ENEMY_ALL | 7 | 敵全体 |
| TGT_PARTY_SINGLE | 8 | 味方単体 |
| TGT_PARTY_SINGLE_NOTME | 9 | 味方単体(自分以外) |
| TGT_PARTY_COLUMN | 10 | 指定した見方から縦ラインの味方グループ |
| TGT_PARTY_ALL | 11 | ※グループ指定はコマンドで敵指定した時点で他のターゲットも配列に入れちゃう？ |
| TGT_PARTY_ALL_NOTME | 12 | 味方単体(自分以外) |
| TGT_MYSELF | 13 | ※グループ指定はコマンドで敵指定した時点で他のターゲットも配列に入れちゃう？ |
| TGT_ANY_SINGLE | 14 | 敵味方単体 |
| TGT_ANY_RANDOM | 15 | 敵味方単体ランダム |
| TGT_ANY_ALL | 16 | 敵味方全員 |

### enum DamageType

スキルのダメージの種類を示す定数です。RPG-Cobo のバトルシステムで使用されます。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| NO_DAMAGE | 0 | ダメージなし |
| HP_DAMAGE | 1 | HPに対するダメージ |
| HP_HEAL | 2 | HPの回復 |
| MP_DAMAGE | 3 | MPに対するダメージ |
| MP_HEAL | 4 | MPの回復 |
| TP_DAMAGE | 5 | TPに対するダメージ |
| TP_HEAL | 6 | TPの回復 |

### enum SkillFlag

スキルの特性をビット列で示す定数です。RPG-Cobo のバトルシステムで使用されます。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| FLAG_NORMAL_SKILL | 0 | 通常攻撃を示す。このフラグが経っていない場合は必殺技 |
| FLAG_TARGET_ALT | 1 | 攻撃目標が既にやられていた場合に自動で別のターゲットに切り替える |
| FLAG_AVOIDABLE | 2 | 回避オプションが有効 |
| FLAG_SHIELDABLE | 3 | シールドオプションが有効 |
| FLAG_REFLECTABLE | 4 | 反射オプションが有効 |
| FLAG_DRAINABLE | 5 | 吸収オプションが有効 |
| FLAG_COUNTERABLE | 6 | カウンターが有効 |
| FLAG_BACKUPABLE | 7 | かばうが有効 |
| FLAG_NOOP_BOSS | 8 | ボスには効かない |
| FLAG_NOOP_ALIVE | 9 | 生きている敵には効かない |

### enum AnimationPart

アニメーション再生時に、どの範囲を再生するかを示す定数です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| ST_EN | 0 | 最初から最後まで再生 |
| ST_MD | 1 | 最初から中間まで再生 |
| MD_EN | 2 | 中間から最後まで再生 |
| EN_ST | 3 | 最後から最初まで逆再生 |
| ST | 4 | 最初のポーズ |
| MD | 5 | 中間のポーズ |
| EN | 6 | 最後のポーズ |

### const 定数

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| ON | true | RPG-Coboの変数タイプで、ONを示す |
| OFF | false | RPG-Coboの変数タイプで、OFFを示す |
| FLOORANGLE | 0.68 | 坂として上れる床の傾斜を示す定数 |


## plugin/rpgtools/common/AccountActivity.sk

RPG-Cobo のアカウント状態を示す定数です。ACCOUNT_VALID時には、ビルドなどのアカウント認証が必要な処理が可能です。

### enum AccountState

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| ACCOUNT_NONE | 0 | 未ログイン時。 |
| ACCOUNT_VALID | 1 | アカウントは有効。 |
| ACCOUNT_UNAVAIL | 2 | サーバーに確認できてない状態。 |
| ACCOUNT_INVALID | -1 | tokenは読み込めたが無効化されている。 |
| ACCOUNT_LOADERROR | -2 | rpgcobo.authにエラーが起きた。PCの構成が変更されたなど。 |
<!-- 
## plugin/rpgtools/common/RPGToolMesh.sk

### enum PenMode

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| PEN_ERACE | 0 | - |
| PEN_ATTACH | 1 | - |
| PEN_PAINT | 2 | - |
| PEN_BOX | 3 | - |
| PEN_FILL | 4 | - |
| PEN_X1 | 5 | - |
| PEN_X2 | 6 | - |
| PEN_X3 | 7 | - |
| PEN_SPOIT | 8 | - |
| PEN_SELECT | 9 | - |
| PEN_GIZMO | 10 | - |
-->

## src/vox/VoxelConstants.sk

### const 定数

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| VOX_SCALE | 0.0625 | 1ボクセルが何メートルかを指定 |
| VALUE_BLOCKWORLD | 5900 | BlockWorldのシリアライズID |

### enum BlockFlagID

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| BLK_SOLID | 1 | ブロックは当たり判定を持つ |
| BLK_PLANT | 2 | PLANTは基本的に当たり判定は無い。 |
| BLK_LIQUID | 4 | 水のブロック。現在の仕様では進入禁止。 |
| BLK_BARRIOR | 8 | 見た目無しで当たり判定を持つ |
| BLK_SOLIDFB | 16 | フリーブロックとして当たり判定を持つ |
| BLK_DECAL | 32 | デカール、クラックなど当たり判定のない見た目に影響するもの |
| BLK_DIGCLOSE | 128 | コリジョンに穴を掘る。1ブロック単位 |
| BLK_HAS_LIGHT | 4096 | ライトを持つフリーブロック |
| BLK_OCCLUDE_U | 1024 | 上のブロックを隠す |
| BLK_OCCLUDE_F | 2048 | 前のブロックを隠す |
| BLK_OCCLUDE_L | 4096 | 左のブロックを隠す |
| BLK_OCCLUDE_B | 8192 | 奥のブロックを隠す |
| BLK_OCCLUDE_R | 16384 | 右のブロックを隠す |
| BLK_OCCLUDE_D | 32768 | 下のブロックを隠す |
| BLK_FULLOCCLUDE | 64512 | 接する6面全てのブロックを隠す |
| BLK_DRAWUP | 65536 | 描画が1ブロック上にはみ出す |
| BLK_DRAWDOWN | 131072 | 描画が1ブロック下にはみ出す |
| BLK_HASFLOOR | 262144 | 床を持つブロック |
| BLK_DRAWWIDE | 524288 | 描画が1ブロック前後左右にはみ出す |
| BLK_STATE_ROT | 1048576 | ブロックの14-15bitに回転情報を持つ |

<!-- 
	BLK_HASFLOOR = 1<<18,		//	床がある
	BLK_DRAWWIDE = 1<<19,		//	XZにはみ出す。カーペット、水、草花
| BLK_HAS_W | 512 | FreeBlock用 |
| BLK_HAS_W | 512 | FreeBlock用 |
| BLK_HAS_H | 1024 | FreeBlock用 |
| BLK_HAS_D | 2048 | FreeBlock用 |
 -->

### enum BlockPlacementID

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| PLC_ANY | 0 | 床にも壁にもつく |
| PLC_FLOOR | 1 | 床の設置 |
| PLC_WALL | 2 | 壁の設置 |
| PLC_DOOR | 3 | ドアの設置 |
| PLC_BRIDGE | 4 | ブリッジの設置 |

### enum FreeBlockCategoryID

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| FB_EXDOOR | 1 | - |
| FB_EXLAMP | 2 | - |
| FB_EXTERIOR | 4 | - |
| FB_INDOOR | 8 | - |
| FB_INLAMP | 16 | - |
| FB_INTERIOR | 32 | - |
| FB_COLUMN | 64 | - |
| FB_LADDER | 128 | - |
| FB_SLOPE | 256 | - |
| FB_STAIR | 512 | - |
| FB_ROOF | 1024 | - |
| FB_TREE | 2048 | - |
| FB_ROCK | 4096 | - |
| FB_CRACK | 8192 | - |

## system/3d/SK3DRenderer.sk

### enum ViewportSize

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| VP_FULL | -1 | レンダーターゲットは画面サイズと同じ解像度 |
| VP_HALF | -2 | レンダーターゲットは画面サイズの半分の解像度 |
| VP_QUAT | -3 | レンダーターゲットは画面サイズの4分の1の解像度 |
| VP_EIGHTH | -4 | レンダーターゲットは画面サイズの8分の1の解像度 |

## system/baselib/Easing.sk

### enum TweenType

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| CONST | 0 | - |
| LINEAR | 1 | - |
| SINE_EASEIN | 2 | - |
| SINE_EASEOUT | 3 | - |
| SINE_EASEINOUT | 4 | - |
| QUAD_EASEIN | 5 | - |
| QUAD_EASEOUT | 6 | - |
| QUAD_EASEINOUT | 7 | - |
| CUBIC_EASEIN | 8 | - |
| CUBIC_EASEOUT | 9 | - |
| CUBIC_EASEINOUT | 10 | - |
| QUART_EASEIN | 11 | - |
| QUART_EASEOUT | 12 | - |
| QUART_EASEINOUT | 13 | - |
| EXPO_EASEIN | 14 | - |
| EXPO_EASEOUT | 15 | - |
| EXPO_EASEINOUT | 16 | - |
| ELASTIC_EASEIN | 17 | - |
| ELASTIC_EASEOUT | 18 | - |
| ELASTIC_EASEINOUT | 19 | - |
| BACK_EASEIN | 20 | - |
| BACK_EASEOUT | 21 | - |
| BACK_EASEINOUT | 22 | - |
| BOUNCE_EASEIN | 23 | - |
| BOUNCE_EASEOUT | 24 | - |
| BOUNCE_EASEINOUT | 25 | - |

## system/consts.sk

### const 定数

イベントのIDや、テクスチャのフォーマット、レンダリング用の定数など、システム全体で使用されている様々な定数が定義されています。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| QUIT_REQUESTED | 1 | - |
| APP_ACTIVATED | 2 | - |
| APP_DEACTIVATED | 3 | - |
| SCREEN_RESIZED | 4 | - |
| SCREEN_REPAINT | 5 | - |
| SIGNAL_CAUGHT | 6 | - |
| ACTIVESTATE_CHANGED | 7 | - |
| MOUSE_CLICKED | 100 | - |
| MOUSE_PRESSED | 101 | - |
| MOUSE_RELEASED | 102 | - |
| MOUSE_MOVED | 103 | - |
| MOUSE_DRAGGED | 104 | - |
| MOUSE_WHEEL_MOVED | 105 | - |
| MOUSE_HWHEEL_MOVED | 106 | - |
| MOUSE_ENTERED | 107 | - |
| MOUSE_EXITED | 108 | - |
| MOUSE_CANCELLED | 109 | - |
| MOUSE_PAN | 110 | - |
| MOUSE_PINCH | 111 | - |
| MODAL_MOUSE_CLICKED | 120 | - |
| MODAL_MOUSE_PRESSED | 121 | - |
| MODAL_MOUSE_RELEASED | 122 | - |
| MODAL_MOUSE_MOVED | 123 | - |
| MODAL_MOUSE_DRAGGED | 124 | - |
| MODAL_MOUSE_WHEEL_MOVED | 125 | - |
| MODAL_HMOUSE_WHEEL_MOVED | 126 | - |
| MODAL_MOUSE_OFFSET | 20 | - |
| KEY_TYPED | 200 | - |
| KEY_PRESSED | 201 | - |
| KEY_REPEATED | 202 | - |
| KEY_RELEASED | 203 | - |
| IMTEXT_CHANGED | 300 | - |
| ACTION_PERFORMED | 400 | - |
| ACTION_CANCELED | 401 | - |
| ITEM_SELECTED | 500 | - |
| ITEM_REMOVE | 501 | - |
| ITEM_HOVER | 502 | - |
| ITEM_DESELECTED | 503 | - |
| ITEM_SORT | 504 | - |
| ITEM_SELECTIONS | 505 | - |
| VALUE_CHANGED | 510 | - |
| TEXT_CHANGED | 600 | - |
| TEXT_RESTART | 601 | - |
| FOCUS_GAINED | 700 | - |
| FOCUS_LOST | 701 | - |
| SOURCE_DRAG_BEGIN | 800 | - |
| SOURCE_DRAG_ENTER | 801 | - |
| SOURCE_DRAG_EXIT | 802 | - |
| SOURCE_DRAG_OVER | 803 | - |
| SOURCE_DROP | 804 | - |
| SOURCE_DROP_ACTION_CHANGED | 805 | - |
| TARGET_DRAG_ENTER | 900 | - |
| TARGET_DRAG_EXIT | 901 | - |
| TARGET_DRAG_OVER | 902 | - |
| TARGET_DROP | 903 | - |
| TARGET_DROP_ACTION_CHANGED | 904 | - |
| TEXTINPUT_DONE | 1000 | - |
| TEXTINPUT_CANCELED | 1001 | - |
| TEXTINPUT_CHANGED | 1002 | - |
| TEXTINPUT_VIEWPORT | 1003 | - |
| TEXTINPUT_IMTEXT_CHANGED | 1004 | - |
| TEXTINPUT_SEND | 1005 | - |
| IAP_INIT_SUCCESS | 1100 | - |
| IAP_INIT_FAIL | 1101 | - |
| IAP_INFO_SUCCESS | 1102 | - |
| IAP_INFO_FAIL | 1103 | - |
| IAP_OWN_SUCCESS | 1104 | - |
| IAP_OWN_FAIL | 1105 | - |
| IAP_PURCHASE_SUCCESS | 1106 | - |
| IAP_PURCHASE_FAIL | 1107 | - |
| IAP_CONSUME_SUCCESS | 1108 | - |
| IAP_CONSUME_FAIL | 1109 | - |
| EVENT_REPOST | 1200 | - |
| NOTIFY_STATUS | 1300 | - |
| NOTIFY_ERROR | 1301 | - |
| BROADCAST | 1400 | - |
| GPUI_PRESSED | 1500 | - |
| GPUI_REPEATED | 1501 | - |
| GPUI_RELEASED | 1502 | - |
| GPUI_SELECTED | 1503 | - |
| GPUI_DESELECTED | 1504 | - |
| GPUI_GAMEPAD_CHANGED | 1510 | - |
| GPUI_GAMEPAD_NOTICE | 1511 | - |
| APP_EVENT | 0 | - |
| MOUSE_EVENT | 1 | - |
| KEY_EVENT | 2 | - |
| IM_EVENT | 3 | - |
| ACTION_EVENT | 4 | - |
| ITEM_EVENT | 5 | - |
| VALUE_EVENT | 5 | - |
| TEXT_EVENT | 6 | - |
| FOCUS_EVENT | 7 | - |
| DRAGSOURCE_EVENT | 8 | - |
| DROPTARGET_EVENT | 9 | - |
| TEXTINPUT_EVENT | 10 | - |
| IAP_EVENT | 11 | - |
| NOTIFY_EVENT | 13 | const COMMAND_EVENT = 12 |
| BROADCAST_EVENT | 14 | - |
| GPUI_EVENT | 15 | - |
| SO_LINGER | 1 | - |
| SO_SNDBUF | 2 | - |
| SO_RCVBUF | 3 | - |
| SO_REUSEADDR | 4 | - |
| SO_KEEPALIVE | 5 | - |
| TCP_NODELAY | 6 | - |
| SOCKET_NOTOPEN | 0 | - |
| SOCKET_CONNECTING | 1 | - |
| SOCKET_CONNECTED | 2 | - |
| SOCKET_BOUND | 2 | - |
| SOCKET_CLOSED | 3 | - |
| SOCKET_ERROR | 4 | - |
| SOCKET_DISPOSED | 5 | - |
| SOCKET_ACCEPTED | 6 | - |
| SK_CLEAR_COLOR | 1 | Clear buffer bit |
| SK_CLEAR_DEPTH | 2 | - |
| SK_CLEAR_STENCIL | 4 | - |
| SK_RGBA8 | 0 | const SKImage/FBO format |
| SK_SRGBA8 | 1 | - |
| SK_R16I | 9 | FBO format |
| SK_RGBA16I | 10 | - |
| SK_R16F | 11 | - |
| SK_RGBA16F | 12 | - |
| SK_R32F | 13 | - |
| SK_RG32F | 14 | - |
| SK_RGBA32F | 15 | - |
| SK_DEPTH16 | 16 | - |
| SK_DEPTH24 | 17 | - |
| SK_R8 | 18 | - |
| SK_DEPTH32 | 19 | - |
| SK_R32I | 20 | - |
| SK_RG32I | 21 | - |
| SK_R11G11B10F | 22 | - |
| SK_RGB9E5 | 23 | - |
| SK_RGBA32UI | 24 | - |
| SK_R32UI | 25 | - |
| SK_RG32UI | 26 | - |
| SK_R16UI | 27 | - |
| SK_POSITION | 0 | VertexBuffer bind |
| SK_NORMAL | 1 | - |
| SK_COLOR1 | 2 | - |
| SK_COLOR2 | 3 | - |
| SK_UV1 | 4 | - |
| SK_UV2 | 5 | - |
| SK_UV3 | 6 | - |
| SK_UV4 | 7 | - |
| SK_UV5 | 8 | - |
| SK_EDGENORMAL | 5 | alias |
| SK_WEIGHTIDX | 6 | - |
| SK_WEIGHT | 7 | - |
| SK_TANGENT | 8 | - |
| SK_MATRIX_WORLD | 0 | Matrix type |
| SK_MATRIX_VIEW | 1 | - |
| SK_MATRIX_PROJECTION | 2 | - |
| SK_MATRIX_WV | 3 | - |
| SK_MATRIX_WVP | 4 | - |
| SK_MATRIX_P | 5 | - |
| SK_FLOAT | 1 | component type |
| SK_HALF | 2 | - |
| SK_USHORT | 3 | - |
| SK_SHORT | 4 | - |
| SK_UBYTE | 5 | - |
| SK_BYTE | 6 | - |
| SK_UINT | 7 | - |
| SK_INT | 8 | - |
| SK_VBO_STATIC | 0 | VertexBuffer / IndexBuffer |
| SK_VBO_DYNAMIC | 1 | - |
| SK_VBO_MEMORY | 2 | - |
| SK_MIPMAP | 1 | Texture flags |
| SK_MIPMAP_AUTOGEN | 2 | - |
| SK_CUBE | 4 | - |
| SK_RENDER_TARGET | 8 | - |
| SK_WRITE_ONLY | 16 | - |
| SK_POINTS | 1 | Primitive type |
| SK_LINES | 2 | - |
| SK_LINESTRIP | 3 | - |
| SK_TRIANGLES | 4 | - |
| SK_TRIANGLESTRIP | 5 | - |
| SK_TRIANGLEFAN | 6 | - |
| SK_WORLD | 0 | Matrix ID |
| SK_VIEW | 1 | - |
| SK_PROJECTION | 2 | - |
| SK_WV | 3 | auto gen |
| SK_WVP | 4 | auto gen |
| SK_DEPTHTEST | 1 | const SK State type |
| SK_DEPTHMASK | 2 | - |
| SK_FILLMODE | 3 | - |
| SK_SHADEMODE | 4 | - |
| SK_BLEND | 5 | - |
| SK_BLENDALPHA | 6 | - |
| SK_BLENDCOLOR | 7 | - |
| SK_CULLFACE | 8 | - |
| SK_INVERTFACE | 9 | - |
| SK_STENCILTEST | 10 | - |
| SK_COLORMASK | 11 | - |
| SK_POLYGONOFFSET | 12 | - |
| SK_DEPTHRANGE | 13 | - |
| SK_OFF | 0 | const SK State value / off/on |
| SK_NONE | 0 | - |
| SK_ON | 1 | - |
| SK_LESS | 1 | alpha depth stencil func |
| SK_LEQUAL | 2 | - |
| SK_GREATER | 3 | - |
| SK_GEQUAL | 4 | - |
| SK_EQUAL | 5 | - |
| SK_NOTEQUAL | 6 | - |
| SK_ALWAYS | 7 | - |
| SK_NEVER | 8 | - |
| SK_MIX | 1 | blend type |
| SK_PMAMIX | 2 | - |
| SK_ADD | 3 | - |
| SK_MULT | 4 | - |
| SK_MIXADD | 5 | - |
| SK_MASKMIX | 6 | - |
| SK_MASKALPHA | 7 | - |
| SK_PMASRCMIX | 9 | - |
| SK_MIXDST | 10 | - |
| SK_FILL | 0 | fill mode |
| SK_LINE | 1 | - |
| SK_POINT | 2 | - |
| SK_SMOOTH | 0 | shade mode |
| SK_FLAT | 1 | - |
| SK_CW | 1 | cull mode |
| SK_CCW | 2 | - |
| SK_INHERIT | 127 | material use |
| SK_WRAP | 1 | const SK Texture Sampling States |
| SK_CLAMP | 2 | - |
| SK_CLAMPBORDER | 3 | - |
| SK_MIRROR | 4 | - |
| SK_LINEAR | 1 | - |
| SK_NEAREST | 2 | - |
| SK_LINEAR_MIP_LINEAR | 3 | - |
| SK_VISIBLE_MAIN | 7 | - |
| SK_VISIBLE_OPAQUE | 1 | - |
| SK_VISIBLE_TRANSPARENT | 2 | - |
| SK_VISIBLE_DECAL | 4 | - |
| SK_VISIBLE_SELECTOR | 8 | - |
| SK_VISIBLE_DEPTH | 16 | - |
| SK_VISIBLE_DEBUG | 32 | - |
| SK_VISIBLE_SHADOW_CASTER | 64 | - |
| SK_VISIBLE_SHADOW_RECEIVER | 128 | - |
| SK_VISIBLE_WATER | 1024 | - |
| SK_VISIBLE_TRANSPARENT_INWATER | 2048 | - |
| SK_VISIBLE_OVERLAY | 12288 | - |
| SK_RGBAIMAGE | 1 | - |
| SK_KTXIMAGE | 2 | - |
| SK_JPEG | 1 | Image codec |
| SK_PNG24 | 2 | - |
| SK_PNG32 | 3 | - |
| SK_FONT_MONO | 1 | - |
| SK_FONT_BOLD | 2 | - |
| SK_FONT_ITALIC | 4 | - |
| SK_FONT_UNDELINE | 8 | - |

### enum VirtualKeyCode

キーボードからの入力キーに対応しているキーコードです。 `Event.keycode` で取得できる値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| VK_UNDEFINED | 0 | basic keycode |
| VK_CANCEL | 3 | basic keycode |
| VK_BACK_SPACE | 8 | basic keycode |
| VK_TAB | 9 | basic keycode |
| VK_ENTER | 10 | basic keycode |
| VK_CLEAR | 12 | basic keycode |
| VK_SHIFT | 16 | basic keycode |
| VK_CONTROL | 17 | basic keycode |
| VK_ALT | 18 | basic keycode |
| VK_PAUSE | 19 | basic keycode |
| VK_CAPS_LOCK | 20 | basic keycode |
| VK_KANA | 21 | basic keycode |
| VK_FINAL | 24 | basic keycode |
| VK_KANJI | 25 | basic keycode |
| VK_ESCAPE | 27 | basic keycode |
| VK_CONVERT | 28 | basic keycode |
| VK_NONCONVERT | 29 | basic keycode |
| VK_ACCEPT | 30 | basic keycode |
| VK_MODECHANGE | 31 | basic keycode |
| VK_SPACE | 32 | basic keycode |
| VK_PAGE_UP | 33 | basic keycode |
| VK_PAGE_DOWN | 34 | basic keycode |
| VK_END | 35 | basic keycode |
| VK_HOME | 36 | basic keycode |
| VK_LEFT | 37 | basic keycode |
| VK_UP | 38 | basic keycode |
| VK_RIGHT | 39 | basic keycode |
| VK_DOWN | 40 | basic keycode |
| VK_COMMA | 44 | basic keycode |
| VK_MINUS | 45 | basic keycode |
| VK_PERIOD | 46 | basic keycode |
| VK_SLASH | 47 | basic keycode |
| VK_0 | 48 | basic keycode |
| VK_1 | 49 | basic keycode |
| VK_2 | 50 | basic keycode |
| VK_3 | 51 | basic keycode |
| VK_4 | 52 | basic keycode |
| VK_5 | 53 | basic keycode |
| VK_6 | 54 | basic keycode |
| VK_7 | 55 | basic keycode |
| VK_8 | 56 | basic keycode |
| VK_9 | 57 | basic keycode |
| VK_COLON | 58 | basic keycode |
| VK_SEMICOLON | 59 | basic keycode |
| VK_EQUALS | 61 | basic keycode |
| VK_A | 65 | basic keycode |
| VK_B | 66 | basic keycode |
| VK_C | 67 | basic keycode |
| VK_D | 68 | basic keycode |
| VK_E | 69 | basic keycode |
| VK_F | 70 | basic keycode |
| VK_G | 71 | basic keycode |
| VK_H | 72 | basic keycode |
| VK_I | 73 | basic keycode |
| VK_J | 74 | basic keycode |
| VK_K | 75 | basic keycode |
| VK_L | 76 | basic keycode |
| VK_M | 77 | basic keycode |
| VK_N | 78 | basic keycode |
| VK_O | 79 | basic keycode |
| VK_P | 80 | basic keycode |
| VK_Q | 81 | basic keycode |
| VK_R | 82 | basic keycode |
| VK_S | 83 | basic keycode |
| VK_T | 84 | basic keycode |
| VK_U | 85 | basic keycode |
| VK_V | 86 | basic keycode |
| VK_W | 87 | basic keycode |
| VK_X | 88 | basic keycode |
| VK_Y | 89 | basic keycode |
| VK_Z | 90 | basic keycode |
| VK_OPEN_BRACKET | 91 | basic keycode |
| VK_BACK_SLASH | 92 | basic keycode |
| VK_CLOSE_BRACKET | 93 | basic keycode |
| VK_NUMPAD0 | 96 | basic keycode |
| VK_NUMPAD1 | 97 | basic keycode |
| VK_NUMPAD2 | 98 | basic keycode |
| VK_NUMPAD3 | 99 | basic keycode |
| VK_NUMPAD4 | 100 | basic keycode |
| VK_NUMPAD5 | 101 | basic keycode |
| VK_NUMPAD6 | 102 | basic keycode |
| VK_NUMPAD7 | 103 | basic keycode |
| VK_NUMPAD8 | 104 | basic keycode |
| VK_NUMPAD9 | 105 | basic keycode |
| VK_MULTIPLY | 106 | basic keycode |
| VK_ADD | 107 | basic keycode |
| VK_SEPARATER | 108 | basic keycode |
| VK_SUBTRACT | 109 | basic keycode |
| VK_DECIMAL | 110 | basic keycode |
| VK_DIVIDE | 111 | basic keycode |
| VK_F1 | 112 | basic keycode |
| VK_F2 | 113 | basic keycode |
| VK_F3 | 114 | basic keycode |
| VK_F4 | 115 | basic keycode |
| VK_F5 | 116 | basic keycode |
| VK_F6 | 117 | basic keycode |
| VK_F7 | 118 | basic keycode |
| VK_F8 | 119 | basic keycode |
| VK_F9 | 120 | basic keycode |
| VK_F10 | 121 | basic keycode |
| VK_F11 | 122 | basic keycode |
| VK_F12 | 123 | basic keycode |
| VK_DELETE | 127 | basic keycode |
| VK_DEAD_GRAVE | 128 | basic keycode |
| VK_DEAD_ACUTE | 129 | basic keycode |
| VK_DEAD_CIRCUMFLEX | 130 | basic keycode |
| VK_DEAD_TILDE | 131 | basic keycode |
| VK_DEAD_MACRON | 132 | basic keycode |
| VK_DEAD_BREVE | 133 | basic keycode |
| VK_DEAD_ABOVEDOT | 134 | basic keycode |
| VK_DEAD_DIAERESIS | 135 | basic keycode |
| VK_DEAD_ABOVERING | 136 | basic keycode |
| VK_DEAD_DOUBLEACUTE | 137 | basic keycode |
| VK_DEAD_CARON | 138 | basic keycode |
| VK_DEAD_CEDILLA | 139 | basic keycode |
| VK_DEAD_OGONEK | 140 | basic keycode |
| VK_DEAD_IOTA | 141 | basic keycode |
| VK_DEAD_VOICED_SOUND | 142 | basic keycode |
| VK_DEAD_SEMIVOICED_SOUND | 143 | basic keycode |
| VK_NUM_LOCK | 144 | basic keycode |
| VK_SCROLL_LOCK | 145 | basic keycode |
| VK_AMPERSAND | 150 | basic keycode |
| VK_ASTERISK | 151 | basic keycode |
| VK_QUOTEDBL | 152 | basic keycode |
| VK_LESS | 153 | basic keycode |
| VK_PRINTSCREEN | 154 | basic keycode |
| VK_INSERT | 155 | basic keycode |
| VK_HELP | 156 | basic keycode |
| VK_META | 157 | basic keycode |
| VK_GREATER | 160 | basic keycode |
| VK_BRACELEFT | 161 | basic keycode |
| VK_BRACERIGHT | 162 | basic keycode |
| VK_BACK_QUOTE | 192 | basic keycode |
| VK_F13 | 200 | extra keycode |
| VK_F14 | 201 | extra keycode |
| VK_F15 | 202 | extra keycode |
| VK_F16 | 203 | extra keycode |
| VK_F17 | 204 | extra keycode |
| VK_F18 | 205 | extra keycode |
| VK_F19 | 206 | extra keycode |
| VK_F20 | 207 | extra keycode |
| VK_F21 | 208 | extra keycode |
| VK_F22 | 209 | extra keycode |
| VK_F23 | 210 | extra keycode |
| VK_F24 | 211 | extra keycode |
| VK_QUOTE | 212 | extra keycode |
| VK_KP_UP | 213 | extra keycode |
| VK_KP_DOWN | 214 | extra keycode |
| VK_KP_LEFT | 215 | extra keycode |
| VK_KP_RIGHT | 216 | extra keycode |
| VK_ALPHANUMERIC | 217 | extra keycode |
| VK_KATAKANA | 218 | extra keycode |
| VK_HIRAGANA | 219 | extra keycode |
| VK_FULL_WIDTH | 220 | extra keycode |
| VK_HALF_WIDTH | 221 | extra keycode |
| VK_ROMAN_CHARACTERS | 222 | extra keycode |
| VK_ALL_CANDIDATES | 223 | extra keycode |
| VK_PREVIOUS_CANDIDATE | 224 | extra keycode |
| VK_CODE_INPUT | 225 | extra keycode |
| VK_JAPANESE_KATAKANA | 226 | extra keycode |
| VK_JAPANESE_HIRAGANA | 227 | extra keycode |
| VK_JAPANESE_ROMAN | 228 | extra keycode |
| VK_KANA_LOCK | 229 | extra keycode |
| VK_INPUT_METHOD_ON_OFF | 230 | extra keycode |
| VK_AT | 231 | extra keycode |
| VK_COLON | 232 | extra keycode |
| VK_CIRCUMFLEX | 233 | extra keycode |
| VK_DOLLAR | 234 | extra keycode |
| VK_EURO_SIGN | 235 | extra keycode |
| VK_EXCLAMATION_MARK | 236 | extra keycode |
| VK_INVERTED_EXCLAMATION_MARK | 237 | extra keycode |
| VK_LEFT_PARENTHESIS | 238 | extra keycode |
| VK_NUMBER_SIGN | 239 | extra keycode |
| VK_PLUS | 240 | extra keycode |
| VK_RIGHT_PARENTHESIS | 241 | extra keycode |
| VK_UNDERSCORE | 242 | extra keycode |
| VK_CUT | 243 | extra keycode |
| VK_COPY | 244 | extra keycode |
| VK_PASTE | 245 | extra keycode |
| VK_UNDO | 246 | extra keycode |
| VK_AGAIN | 247 | extra keycode |
| VK_FIND | 248 | extra keycode |
| VK_PROPS | 249 | extra keycode |
| VK_MOUSE_BUTTON1 | 250 | mouse button vk |
| VK_MOUSE_BUTTON2 | 251 | mouse button vk |
| VK_MOUSE_BUTTON3 | 252 | mouse button vk |
| VK_MOUSE_BUTTON4 | 253 | mouse button vk |
| VK_MOUSEWHEEL_DEC | 254 | mouse button vk |
| VK_MOUSEWHEEL_INC | 255 | mouse button vk |

### enum ModifiersMask

キーボードやマウスからの入力時の修飾キーです。 `Event.modifiers` でビット列として取得できる値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| SHIFT_MASK | 1 | modifiers |
| CTRL_MASK | 2 | modifiers |
| META_MASK | 4 | modifiers |
| ALT_MASK | 8 | modifiers |
| ALT_GRAPH_MASK | 16 | modifiers |
| BUTTPO0_MASK | 32 | TouchPad down |
| BUTTON1_MASK | 64 | modifiers |
| BUTTON2_MASK | 128 | modifiers |
| BUTTON3_MASK | 256 | modifiers |
| BUTTON4_MASK | 512 | modifiers |
| TOUCH_MASK | 32768 | modifiers |
| VIRTUAL_MASK | 65536 | modifiers |
| GPUI_MASK | 131072 | modifiers |

### enum GamepadType

ゲームパッドの種類です。 `Gamepad.type` で取得できる値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| GAMEPAD_XINPUT | 1 | - |
| GAMEPAD_DS4 | 2 | - |
| GAMEPAD_SWITCH | 3 | - |
| GAMEPAD_MISC | 4 | - |
| GAMEPAD_VIRTUAL | 9 | - |

### enum GamepadButtonCode

RPG-Coboで共通化されているゲームパッドのボタン、スティック、トリガーのコードです。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| BTN_UP | 0 | 上ボタン |
| BTN_DOWN | 1 | 下ボタン |
| BTN_LEFT | 2 | 左ボタン |
| BTN_RIGHT | 3 | 右ボタン |
| BTN_START | 4 | スタートボタン |
| BTN_BACK | 5 | バックボタン |
| BTN_LS | 6 | 左スティック押し込み |
| BTN_RS | 7 | 右スティック押し込み |
| BTN_LB | 8 | 左手前ボタン |
| BTN_RB | 9 | 右手前ボタン |
| BTN_A | 10 | A/× ボタン |
| BTN_B | 11 | B/〇 ボタン |
| BTN_X | 12 | X/□ ボタン |
| BTN_Y | 13 | Y/△ ボタン |
| BTN_ZL | 14 | 左奥ボタン |
| BTN_ZR | 15 | 右奥ボタン |
| AXIS_L_U | 32 | 左スティック上 |
| AXIS_L_D | 33 | 左スティック下 |
| AXIS_L_L | 34 | 左スティック左 |
| AXIS_L_R | 35 | 左スティック右 |
| AXIS_R_U | 36 | 右スティック上 |
| AXIS_R_D | 37 | 右スティック下 |
| AXIS_R_L | 38 | 右スティック左 |
| AXIS_R_R | 39 | 右スティック右 |
| AXIS_ZL | 40 | axis - 取るときに&31する |
| AXIS_ZR | 41 | axis - 取るときに&31する |
| BTN_CURSOR | -1 | 特殊用途 |
| BTN_LR | -2 | 特殊用途 |
| BTN_ZLR | -3 | 特殊用途 |

### enum AppActiveState

アプリの実行状態がどの状態かを表す定数です。 `skGetAppActiveState` で取得できる値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| APPACTIVE_NOTLAUNCH | 0 | アプリは起動していない |
| APPACTIVE_ACTIVE | 1 | アプリはアクティブ |
| APPACTIVE_INACTIVE | 2 | アプリは非アクティブ |
| APPACTIVE_BACKGROUND | 3 | アプリはバックグラウンド |
| APPACTIVE_SUSPENDED | 4 | アプリはサスペンド状態 |

### enum ScreenType

アプリの画面を作成するときに指定する画面タイプです。 `skCreateScreen` で指定する値です。
#### ※要修正

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| SCREENTYPE_FULLSCREEN | 0 | フルスクリーン画面 |
| SCREENTYPE_GAMEWINDOW | 1 | ゲームウィンドウ画面 |
| SCREENTYPE_APPWINDOW | 2 | アプリウィンドウ画面 |
| SCREENTYPE_POPUPWINDOW | 3 | ポップアップウィンドウ画面 |

### enum CursorType

マウスカーソルの形状を指定する定数です。 `skSetCursorType` で指定する値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| CURSOR_ARROW | 0 | - |
| CURSOR_IBEAM | 1 | - |
| CURSOR_CROSS | 2 | - |
| CURSOR_HAND | 3 | - |
| CURSOR_NO | 4 | - |
| CURSOR_SIZE | 5 | - |
| CURSOR_WAIT | 6 | - |
| CURSOR_NONE | 7 | - |

### enum TextEditFlags

テキスト入力欄の種類やオプションを指定する定数です。 `skStartTextEdit` で指定する値です。  
**スマートフォンのテキスト入力用です。**

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| TEXTEDIT_TEXT | 0 | type flags &15 |
| TEXTEDIT_PASSWORD | 1 | type flags &15 |
| TEXTEDIT_EMAIL | 2 | type flags &15 |
| TEXTEDIT_NUMBER | 3 | type flags &15 |
| TEXTEDIT_PHONE | 4 | type flags &15 |
| TEXTEDIT_SEARCH | 5 | type flags &15 |
| TEXTEDIT_MULTILINE | 6 | type flags &15 |
| TEXTEDIT_CHAT | 7 | type flags &15 |
| TEXTEDIT_NOFULLSCREEN | 16 | option flags |
| TEXTEDIT_INLINE | 32 | option flags |

### enum FileDialogMode

ファイルダイアログのモードを指定する定数です。 `FileDialog.setMode` で指定する値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| FILEDIALOG_OPEN | 0 | ファイル読み込み |
| FILEDIALOG_SAVE | 1 | ファイル保存 |
| FILEDIALOG_SELECT | 2 | ファイル選択 |
| FILEDIALOG_SELECTDIR | 3 | ディレクトリ選択 |

### enum ClipboardType

クリップボードの取得するデータの種類を指定する定数です。 `skGetClipboardData` / `skCheckClipboardType` で指定する値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| CLIPBOARD_TEXT | 1 | - |
| CLIPBOARD_FILELIST | 2 | - |
| CLIPBOARD_IMAGE | 3 | - |
| CLIPBOARD_WAVE | 4 | - |
| CLIPBOARD_DATA | 5 | - |

### enum SoundID

サウンドの様々な状態を取得、設定するための定数です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| SK_WAVE_UBYTE | 1 | - |
| SK_WAVE_SHORTLE | 2 | - |
| SK_WAVE_MSADPCM | 3 | - |
| SK_WAVE_IMEADPCM | 4 | - |
| SK_WAVE_FLOAT | 5 | - |
| SK_SND_TYPE | 10 | - |
| SK_SND_GAIN | 11 | - |
| SK_SND_PAN | 12 | - |
| SK_SND_PITCH | 13 | - |
| SK_SND_SEND | 14 | - |
| SK_SND_LOOP | 15 | - |
| SK_SND_PAUSE | 16 | - |
| SK_SND_PCMTIME | 17 | - |
| SK_SND_INSEFX | 20 | - |
| SK_SND_SENDEFX | 21 | - |
| SK_SND_MASTEFX | 22 | - |
| SK_SND_PUSHSTREAM | 30 | - |
| SK_SND_BUFREMAINING | 31 | - |
| SK_SND_MIX3D | 40 | - |
| SK_SND_PANMODEL | 41 | - |
| SK_SND_POSITION | 42 | - |
| SK_SND_LISTENER | 43 | - |
| SK_SND_SOURCE3D | 44 | - |
| SK_SND_DIRECTION | 45 | - |
| SK_SND_MUTECOUNT | 46 | - |
| SK_SND_CALC3D | 50 | - |
| SK_SND_READY | 0 | - |
| SK_SND_PLAYING | 1 | - |
| SK_SND_PAUSED | 2 | - |
| SK_SND_STOPPED | 3 | - |
| SK_SND_DONE | 4 | - |
| SK_SND_NO3D | 0 | - |
| SK_SND_STEREO3D | 1 | - |
| SK_SND_HRTF3D | 2 | - |
| SK_SND_HRTF3DFFT | 2 | - |
| SK_SND_HRTF3DFIR | 3 | - |

### enum MoviePlayerState

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| STATE_INIT | 0 | - |
| STATE_OPEN | 1 | - |
| STATE_LOAD | 2 | - |
| STATE_READY | 3 | - |
| STATE_PLAY | 4 | - |
| STATE_PAUSE | 5 | - |
| STATE_CLOSE | 6 | - |
| STATE_ERROR | -1 | - |

### enum SystemFlags

現在使用しているコンピューターがどの入力デバイスを持っているかを表す定数です。 `skGetSystemFlags` でビット列として取得できる値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| SYSFLAG_MOUSE | 1 | - |
| SYSFLAG_TOUCHPANEL | 2 | - |
| SYSFLAG_KEYBOARD | 4 | - |
| SYSFLAG_TOUCHPAD | 8 | - |
| SYSFLAG_TOUCHPEN | 16 | - |

### enum MoveScreenFlags

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| MOVESCREEN_DELTA | 1 | - |
| MOVESCREEN_ABS | 2 | - |
| MOVESCREEN_SIZE | 4 | - |
| MOVESCREEN_MINIMIZE | 8 | - |
| MOVESCREEN_MAXIMIZE | 16 | - |
| MOVESCREEN_RESTORE | 32 | - |
| MOVESCREEN_HIDE | 40 | - |

### enum JsonEncodingBit

encodeJSON関数のオプションを指定する定数です。 `encodeJSON` でビット列として指定できる値です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| JSON_FORMAT | 1 | - |
| JSON_ESCAPE_WCHAR | 2 | - |
| JSON_KEYSORT | 4 | - |

## system/ui/GPUI.sk

### enum UIFeature

ゲームがどのデバイスの入力を使用するかを表す定数です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| UI_KEYBOARD | 1 | - |
| UI_GAMEPAD | 2 | - |
| UI_TOUCH | 4 | - |
| UI_MOUSE | 8 | - |

### enum GamepadStateID

ゲームパッドの接続状態を表す定数です。

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| GAMEPAD_NOTCONNECTED | 0 | 未接続 |
| GAMEPAD_PENDING | 1 | 接続したが、使用するか未決定 |
| GAMEPAD_ENABLED | 2 | 接続したゲームパッドを使用 |
| GAMEPAD_DISABLED | 3 | 接続したゲームパッドを未使用 |
| GAMEPAD_DISCONNECTED | 4 | 使用中のゲームパッドが予期せず外れた。 |

### enum GamepadConnectActionID

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| ACTION_DISABLE | 0 | 無効化する |
| ACTION_ASK | 1 | 有効化するか確認する |
| ACTION_ENABLE | 2 | 有効化する |


<!-- 以下、リスト表示不要の定数

## plugin/rpgtools/common/EventCommandItemView.sk

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| LINEH | 26 | 固定値。中のEventCommandItemViewは全てLINEHの倍数の高さの必要あり |

## system/baselib/IO.sk

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| SKTP_FLUSHDELAY | 50 | これが大きいとtcp->writeの回数が減ってオーバーヘッドは減るが細かい通信のラグが大きくなる。 |

## system/ui/GPUIViews.sk

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| VIEW_ENABLED | 123456 | - |
| VIEW_DISABLED | 123457 | - |
| TARGET_DRAG_ENTER | 900 | - |
| TARGET_DRAG_EXIT | 901 | - |
| TARGET_DRAG_OVER | 902 | - |

## system/ui/SKViewFX.sk

### enum SKViewFXPropertyID

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| ENABLED | 10000 | common |
| HSV | 10001 | common |
| POWER | 10002 | common |
| BLURSIZE | 10100 | blur |
| CLIPBORDER | 10101 | blur |
| BLURDIR | 10102 | motion blur |
| CENTERUV | 10103 | zoom blur |
| UVOFFSET | 10202 | zoom blur |
| MASKIMAGE | 10300 | universal mask |
| MASKDEPTH | 10301 | universal mask |
| MASKSPREAD | 10302 | universal mask |
| MASKINVERT | 10303 | universal mask |
| HALOSIZE | 10400 | halo |
| HALOCOLOR | 10401 | halo |
| HALORAY | 10402 | halo |
| HALOGLOW | 10403 | halo |
| SHADOWCOLOR | 10500 | solid shadow |
| SHADOWDELTA | 10501 | solid shadow |
| LENSK | 10600 | cubic lens |
| LENSKCUBE | 10601 | cubic lens |
| CIRCLESIZE | 10701 | circle mask |
| CIRCLEBLUR | 10702 | circle mask |
| CIRCLEREVERSE | 10703 | circle mask |
| CIRCLEANGLE | 10800 | piechart mask |
| HSV0 | 10900 | gradation |
| HSV1 | 10901 | gradation |
| OFFSET | 11000 | stroke blur |
| SHARPNESS | 11001 | stroke blur |
| TIME | 11100 | shine |
| ANGLE | 11101 | shine |
| COREWEIGHT | 11102 | shine |
| GLOWWEIGHT | 11103 | shine |
| CORECOLOR | 11104 | shine |
| GLOWCOLOR | 11105 | shine |
| NOISE | 11106 | shine |
| UVSCALE | 11200 | wave |
| SLICE | 11300 | slice |

### enum SKViewPropertyID

| 定数名 | 値 | 意味 |
| --- | --- | --- |
| POSITION | 1001 | COMPONENT BASE ID RANGE = 1000-1099 |
| SCALE | 1002 | COMPONENT BASE ID RANGE = 1000-1099 |
| ROTATION | 1003 | COMPONENT BASE ID RANGE = 1000-1099 |
| VISIBLE | 1004 | COMPONENT BASE ID RANGE = 1000-1099 |
| ENABLED | 1005 | COMPONENT BASE ID RANGE = 1000-1099 |
| SIZE | 1006 | bnd.w  bnd.h |
| PIVOT | 1007 | -bnd.x -bnd.y |
| BUFFER | 1009 | COMPONENT BASE ID RANGE = 1000-1099 |
| BUFFERCOLOR | 1010 | COMPONENT BASE ID RANGE = 1000-1099 |
| METADATA | 1011 | COMPONENT BASE ID RANGE = 1000-1099 |
| STRETCHALIGN | 1012 | COMPONENT BASE ID RANGE = 1000-1099 |
| TIPS | 1013 | COMPONENT BASE ID RANGE = 1000-1099 |
| ENABLED_STATIC | 1014 | COMPONENT BASE ID RANGE = 1000-1099 |
| ACTIONMAP | 1015 | NO EDITOR |
| IMAGE | 1100 | IMAGE FIGURE ID RANGE = 1100-1199 |
| IMAGECOLOR | 1101 | IMAGE FIGURE ID RANGE = 1100-1199 |
| IMAGEBLEND | 1102 | IMAGE FIGURE ID RANGE = 1100-1199 |
| IMAGEALIGN | 1103 | IMAGE FIGURE ID RANGE = 1100-1199 |
| IMAGESTRETCH | 1104 | IMAGE FIGURE ID RANGE = 1100-1199 |
| IMAGEDATA | 1105 | IMAGE FIGURE ID RANGE = 1100-1199 |
| IMAGELIST | 1110 | multi image view |
| IMAGEFRAME | 1111 | multi image view |
| BORDERWIDTH | 1120 | border |
| LABEL | 1200 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| FONT | 1201 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| TEXTCOLOR | 1202 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| TEXTALIGN | 1203 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| WRAPTEXT | 1204 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| MAXCHARS | 1205 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| EDITABLE | 1206 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| SPRITESHEET | 1207 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| TEXTADVANCE | 1208 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| PATHFORMAT | 1209 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| AUTOFITWEIGHT | 1211 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| TEXTCLIP | 1212 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| USETEMPLATE | 1213 | LABEL/TEXTFIELD ID RANGE = 1200-1299 |
| SYNC_ANIMATION | 1400 | GROUP 1400-1499 |
| SCALEWEIGHT | 1410 | SCALESTRETCH 1410-1419 |
| SDPATH | 1500 | SK3DVIEW 1500-1599 |
| CAMERANAME | 1501 | SK3DVIEW 1500-1599 |
| CAMERADATA | 1503 | SK3DVIEW 1500-1599 |
| BGCOLOR | 1504 | SK3DVIEW 1500-1599 |
| CLEARBG | 1505 | SK3DVIEW 1500-1599 |
| DUMMYMODEL | 1506 | SK3DVIEW 1500-1599 |
| BUTTONTYPE | 1600 | GPUIBUTTON 1600-1649 |
| BUTTONANIMETYPE | 1601 | GPUIBUTTON 1600-1649 |
| PUSHSOUND | 1602 | GPUIBUTTON 1600-1649 |
| CURSMOVABLE | 1603 | GPUIBUTTON 1600-1649 |
| TOGGLABLE | 1604 | GPUIBUTTON 1600-1649 |
| ROWPATH | 1650 | GPUILISTVIEW 1650-1679 |
| BARPATH | 1651 | GPUILISTVIEW 1650-1679 |
| ORIENT | 1652 | GPUILISTVIEW 1650-1679 |
| BORDERCOLOR | 1653 | GPUILISTVIEW 1650-1679 |
| ENVPATH | 1654 | GPUILISTVIEW 1650-1679 |
| INSET | 1655 | GPUILISTVIEW 1650-1679 |
| LISTALIGN | 1656 | GPUILISTVIEW 1650-1679 |
| ROWSTRETCH | 1657 | GPUILISTVIEW 1650-1679 |
| PREVIEROWWNUM | 1658 | GPUILISTVIEW 1650-1679 |
| LOOPCURS | 1659 | GPUILISTVIEW 1650-1679 |
| TEXTEDIT_ANIMETYPE | 1670 | GPUITEXTEDIT |
| TEXTEDIT_INPUTTYPE | 1671 | GPUITEXTEDIT |
| TEXTEDIT_REVERTTEXT | 1672 | GPUITEXTEDIT |
| TEXTEDIT_FOCUSTYPE | 1673 | GPUITEXTEDIT |
| SIZE_STATIC | 2000 | bnd.w  bnd.h |
| PIVOT_STATIC | 2001 | -bnd.x -bnd.y |
| SIZE_CHANGEABLE | 2002 | - |
| EXPORTS | 2003 | string |
| EDITOR_BGCOLOR | 3000 | editor use |
| EDITOR_GRID | 3001 | editor use |
-->
