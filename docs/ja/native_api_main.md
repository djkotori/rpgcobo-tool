# SakanaGL Main API リファレンス

`core/api/ssapi_main.cpp`で定義されているSakanaGLのメインスレッド専用APIのリファレンスドキュメントです。

ウィンドウやキー入力、ゲームパッド、マウス、タッチ、センサーなどのシステムイベントを処理するためのAPIが含まれています。

---

## 目次

1. [グローバル関数](#グローバル関数)
2. [クラス](#クラス)
   - [Event](#event)
   - [IMString](#imstring)
   - [FileDialog](#filedialog)
   - [WebView](#webview)
   - [MoviePlayer](#movieplayer)
   - [Gamepad](#gamepad)

---

## グローバル関数

### システム情報

#### `skGetSystemFlags()`
```
int skGetSystemFlags()
```
システムフラグを取得します。

**戻り値**: システムフラグ（整数値）

---

### イベント処理

#### `skPeekEvent(event)`
```
bool skPeekEvent(Event event)
```
イベントキューから1つのイベントを取得します。

**引数**:
- `event` (Event): イベントオブジェクト（結果が格納されます）

**戻り値**: イベントが取得できた場合`true`、キューが空の場合`false`

**説明**: 取得したイベントはキューから削除されます。

#### `skPeekEvents(env, callback, event)`
```
void skPeekEvents(object env, closure callback, Event event)
```
イベントキュー内のすべてのイベントを処理します。

**引数**:
- `env` (object): コールバック関数の環境オブジェクト
- `callback` (closure): `function(env, event)`形式のコールバック関数
- `event` (Event): 再利用されるイベントオブジェクト

**説明**: キュー内のすべてのイベントに対してコールバックを呼び出します。エラーが発生すると中断します。

---

### 画面・ウィンドウ管理

#### `skSupportsDisplaySize(width, height)`
```
bool skSupportsDisplaySize(int width, int height)
```
指定された画面サイズがサポートされているか確認します。

**引数**:
- `width` (int): 幅
- `height` (int): 高さ

**戻り値**: サポートされている場合`true`

#### `skCreateScreen(title, width, height, screentype)`
```
bool skCreateScreen(string title, int width, int height, int screentype)
```
ウィンドウを作成します。

**引数**:
- `title` (string): ウィンドウタイトル
- `width` (int): 幅
- `height` (int): 高さ
- `screentype` (int): スクリーンタイプ（フルスクリーン、ウィンドウモードなど）

**戻り値**: 成功した場合`true`

#### `skGetScreenSize(array)`
```
array skGetScreenSize(array result)
```
現在のスクリーンサイズを取得します。

**引数**:
- `result` (array): 結果を格納する配列

**戻り値**: `[width, height, dpiX, dpiY, screentype]`の配列

#### `skGetDisplaySize(array)`
```
array skGetDisplaySize(array result)
```
ディスプレイのサイズを取得します。

**引数**:
- `result` (array): 結果を格納する配列

**戻り値**: `[width, height, dpiX, dpiY, refreshRate, rotation]`の配列

#### `skDisposeScreen()`
```
bool skDisposeScreen()
```
ウィンドウを破棄します。

**戻り値**: 成功した場合`true`

#### `skMinimizeScreen(minimize)`
```
int skMinimizeScreen(bool minimize)
```
ウィンドウを最小化または復元します。

**引数**:
- `minimize` (bool): `true`で最小化、`false`で復元

**戻り値**: 操作結果コード

#### `skMoveScreen(params)`
```
int skMoveScreen(table params)
```
ウィンドウの位置やサイズを変更します。

**引数**:
- `params` (table): パラメータテーブル
  - `flags` (int): 操作フラグ（MOVESCREEN_MINIMIZE、MOVESCREEN_RESTOREなど）
  - `x` (int): X座標
  - `y` (int): Y座標
  - `w` (int): 幅
  - `h` (int): 高さ
  - `name` (string): ディスプレイ名（オプション）

**戻り値**: 操作結果コード

---

### レンダリング

#### `skBeginRender()`
```
int skBeginRender()
```
レンダリングを開始します。

**戻り値**: 結果コード

#### `skEndRender()`
```
int skEndRender()
```
レンダリングを終了します。

**戻り値**: 結果コード

#### `skFlipScreen()`
```
bool skFlipScreen()
```
フレームバッファを画面に表示します（ダブルバッファリング）。

**戻り値**: 成功した場合`true`

**説明**: Preflip関数が登録されている場合、それらが実行されます。

#### `skSkipFlipScreen()`
```
void skSkipFlipScreen()
```
フリップをスキップする場合でもPreflip関数を実行します。

**説明**: フレームをスキップする場合でも、Preflip処理は実行する必要がある場合に使用します。

---

### 入力デバイス

#### `skIsKeyPressed(keycode)`
```
bool skIsKeyPressed(int keycode)
```
指定されたキーが押されているか確認します。

**引数**:
- `keycode` (int): キーコード

**戻り値**: キーが押されている場合`true`

#### `skSetCursorVisible(visible)`
```
void skSetCursorVisible(bool visible = true)
```
カーソルの表示/非表示を設定します。

**引数**:
- `visible` (bool): `true`で表示、`false`で非表示（デフォルト: `true`）

#### `skSetCursorType(type)`
```
void skSetCursorType(int type = 0)
```
カーソルのタイプを設定します。

**引数**:
- `type` (int): カーソルタイプ（0: 標準、1: 手、2: テキストなど）

#### `skGetMousePos(array)`
```
array skGetMousePos(array result)
```
マウスの現在位置を取得します。

**引数**:
- `result` (array): 結果を格納する配列

**戻り値**: `[x, y]`の配列

#### `skSetMousePos(x, y)`
```
void skSetMousePos(float x, float y)
```
マウスカーソルの位置を設定します。

**引数**:
- `x` (float): X座標
- `y` (float): Y座標

#### `skGetModifiers()`
```
int skGetModifiers()
```
現在押されている修飾キーを取得します。

**戻り値**: 修飾キーのビットマスク（Shift、Ctrl、Altなど）

---

### アプリケーション状態

#### `skIsForeProcess()`
```
bool skIsForeProcess()
```
アプリケーションがフォアグラウンドかどうかを確認します。

**戻り値**: フォアグラウンドの場合`true`

#### `skGetAppActiveState()`
```
int skGetAppActiveState()
```
アプリケーションのアクティブ状態を取得します。

**戻り値**: アクティブ状態コード
- `_APPACTIVE_ACTIVE`: アクティブ
- `_APPACTIVE_INACTIVE`: 非アクティブ
- その他のプラットフォーム固有の状態

---

### デバイス情報

#### `skCreateUUID()`
```
string skCreateUUID()
```
新しいUUIDを生成します。

**戻り値**: UUID文字列

#### `skGetDeviceID()`
```
string skGetDeviceID()
```
デバイスの広告ID（Advertising ID）を取得します。

**戻り値**: デバイスID文字列

**説明**: プライバシー設定により取得できない場合があります。

#### `skGetUserName()`
```
string skGetUserName()
```
ユーザー名を取得します。

**戻り値**: ユーザー名文字列

---

### 入力メソッド (IME)

#### `skEnableInputMethods(enable)`
```
void skEnableInputMethods(bool enable)
```
入力メソッド（IME）を有効/無効にします。

**引数**:
- `enable` (bool): `true`で有効、`false`で無効

#### `skSetCandidateLocation(x, y[, height, mode, maxNumChars])`
```
void skSetCandidateLocation(int x, int y [, int height, int mode, int maxNumChars])
```
IME変換候補ウィンドウの位置を設定します。

**引数**:
- `x` (int): X座標
- `y` (int): Y座標
- `height` (int): 高さ（ORBIS専用）
- `mode` (int): OSKモード（0: 通常、1: 英数字、2: メール、3: 数字のみ、16: シークレット）（ORBIS専用）
- `maxNumChars` (int): 最大文字数（ORBIS専用）

---

### ドラッグ＆ドロップ

#### `skEnableDrop(enable)`
```
void skEnableDrop(bool enable)
```
ファイルのドラッグ＆ドロップを有効/無効にします。

**引数**:
- `enable` (bool): `true`で有効、`false`で無効

**説明**: 有効にすると、ファイルがドロップされたときに`EID_DROP`イベントが発生します。

---

### クリップボード

#### `skCheckClipboardType(type)`
```
int skCheckClipboardType(int type)
```
クリップボードに指定タイプのデータがあるか確認します。

**引数**:
- `type` (int): データタイプ
  - `_CLIPBOARD_TEXT`: テキスト
  - `_CLIPBOARD_FILELIST`: ファイルリスト
  - `_CLIPBOARD_IMAGE`: 画像
  - `_CLIPBOARD_DATA`: バイナリデータ

**戻り値**: データが存在する場合は非ゼロ

#### `skGetClipboardData(type)`
```
object skGetClipboardData(int type)
```
クリップボードからデータを取得します。

**引数**:
- `type` (int): データタイプ

**戻り値**: 
- `_CLIPBOARD_TEXT`: `string`
- `_CLIPBOARD_FILELIST`: `FileRef`の配列
- `_CLIPBOARD_IMAGE`: `RGBAImage`
- `_CLIPBOARD_DATA`: `ByteBuffer`

#### `skPutClipboardData(data)`
```
bool skPutClipboardData(data)
```
クリップボードにデータを設定します。

**引数**:
- `data`: 設定するデータ
  - `string`: テキストとして設定
  - `FileRef`の配列: ファイルリストとして設定
  - `RGBAImage`: 画像として設定
  - `StringBuffer`/`ByteBuffer`: テキストとして設定

**戻り値**: 成功した場合`true`

---

### テキスト編集

#### `skSupportsTextEdit()`
```
bool skSupportsTextEdit()
```
プラットフォームがテキスト編集ダイアログをサポートしているか確認します。

**戻り値**: サポートしている場合`true`

**説明**: モバイルプラットフォームでのOSネイティブのテキスト入力UIサポートを確認します。

#### `skStartTextEdit(params)`
```
void skStartTextEdit(table params)
```
テキスト編集を開始します。

**引数**:
- `params` (table): パラメータテーブル
  - `text` (string): 初期テキスト
  - `desc` (string): 説明文/タイトル
  - `maxlen` (int): 最大文字数（1～256、デフォルト: 10）
  - `flags` (int): フラグ（パスワード入力など）
  - `curs` (int): 初期カーソル位置

**説明**: 結果はイベントで返されます。

#### `skEndTextEdit()`
```
void skEndTextEdit()
```
テキスト編集を終了します。

---

### アプリ内課金 (IAP)

#### `skInitializeIAP(config)`
```
void skInitializeIAP(string config)
```
アプリ内課金システムを初期化します。

**引数**:
- `config` (string): プラットフォーム固有の設定文字列

#### `skQueryIAPItemsInfo(itemIds)`
```
void skQueryIAPItemsInfo(array itemIds)
```
商品情報を問い合わせます。

**引数**:
- `itemIds` (array): 商品IDの配列

**説明**: 結果はイベントで返されます。

#### `skQueryIAPOwnItems()`
```
void skQueryIAPOwnItems()
```
購入済みアイテムを問い合わせます。

**説明**: 結果はイベントで返されます。

#### `skRequestIAP(itemId)`
```
void skRequestIAP(string itemId)
```
アイテムの購入をリクエストします。

**引数**:
- `itemId` (string): 商品ID

**説明**: 結果はイベントで返されます。

#### `skConsumeIAP(itemId)`
```
void skConsumeIAP(string itemId)
```
消費型アイテムを消費します。

**引数**:
- `itemId` (string): 商品ID

#### `skRestoreIAP()`
```
void skRestoreIAP()
```
購入履歴を復元します。

**説明**: iOS等での購入復元処理を実行します。

#### `skQueryPurchaseHistory()`
```
void skQueryPurchaseHistory()
```
購入履歴を問い合わせます。

**説明**: 結果はイベントで返されます。

---

### センサー

#### `skStartAcceleroMeter()`
```
int skStartAcceleroMeter()
```
加速度センサーを開始します（60Hz）。

**戻り値**: 結果コード

#### `skStopAcceleroMeter()`
```
int skStopAcceleroMeter()
```
加速度センサーを停止します。

**戻り値**: 結果コード

#### `skStartGyroScope()`
```
int skStartGyroScope()
```
ジャイロスコープを開始します（60Hz）。

**戻り値**: 結果コード

#### `skStopGyroScope()`
```
int skStopGyroScope()
```
ジャイロスコープを停止します。

**戻り値**: 結果コード

---

### ゲームパッド

#### `skScanGamepads()`
```
array skScanGamepads()
```
接続されているゲームパッドをスキャンします。

**戻り値**: `Gamepad`オブジェクトの配列。見つからない場合は`null`。

---

### その他

#### `skShowStoreReview([param])`
```
bool skShowStoreReview([string param])
```
アプリストアのレビュー画面を表示します。

**引数**:
- `param` (string, オプション): プラットフォーム固有のパラメータ

**戻り値**: 成功した場合`true`

#### `skOpenURL(url)`
```
bool skOpenURL(string url)
```
URLをデフォルトブラウザで開きます。

**引数**:
- `url` (string): 開くURL

**戻り値**: 成功した場合`true`

**説明**: パーミッションチェックが行われます。許可されていない場合は失敗します。

---

## クラス

### Event

イベントオブジェクト。`EventSource`から生成され、ユーザー入力やシステムイベントを表します。

#### コンストラクタ

```
Event()
```
Eventオブジェクトを作成します。

#### フィールド

- `id` (int): イベントID（EID_* 定数）
- `mouseid` (int): マウスボタンID
- `x` (float): X座標（スクリーン座標）
- `y` (float): Y座標（スクリーン座標）
- `lx` (float): ローカルX座標
- `ly` (float): ローカルY座標
- `consumed` (int): イベントが消費されたかどうか（0/1）
- `keycode` (int): キーコード
- `keychar` (int): 文字コード
- `modifiers` (int): 修飾キー（Shift、Ctrl、Altなど）
- `count` (int): クリック回数、または繰り返し回数
- `dx` (int): パン/ピンチのX軸差分
- `dy` (int): パン/ピンチのY軸差分
- `time` (int): イベント生成時刻
- `src` (object): イベントソースオブジェクト
- `actioncmd` (object/string): アクションコマンド
- `dragsrc` (object): ドラッグソースオブジェクト

#### メソッド

##### `consume()`
```
void consume()
```
イベントを消費済みにマークします。

**説明**: これにより、イベントは他のハンドラに伝播しなくなります。

##### `computeLocal(matrix)`
```
void computeLocal(Matrix matrix)
```
スクリーン座標をローカル座標に変換します。

**引数**:
- `matrix` (Matrix): 変換行列

**説明**: 結果は`lx`と`ly`フィールドに格納されます。

##### `isShiftDown()`
```
bool isShiftDown()
```
Shiftキーが押されているか確認します。

**戻り値**: 押されている場合`true`

##### `isMouseDown([button])`
```
bool isMouseDown([int button])
```
マウスボタンが押されているか確認します。

**引数**:
- `button` (int, オプション): ボタンマスク（デフォルト: `_BUTTON1_MASK`）

**戻り値**: 押されている場合`true`

##### `isCommandDown()`
```
bool isCommandDown()
```
Ctrlキー（Commandキー）が押されているか確認します。

**戻り値**: 押されている場合`true`

##### `isAltDown()`
```
bool isAltDown()
```
Altキーが押されているか確認します。

**戻り値**: 押されている場合`true`

---

### IMString

入力メソッド（IME）の変換中文字列を表すクラス。

#### コンストラクタ

コンストラクタは呼び出せません。システムから提供されるオブジェクトです。

#### メソッド

##### `charAt(index)`
```
int charAt(int index = 0)
```
指定位置の文字コードを取得します。

**引数**:
- `index` (int): 文字位置（デフォルト: 0）

**戻り値**: 文字コード。範囲外の場合は`null`。

##### `attrAt(index)`
```
int attrAt(int index = 0)
```
指定位置の文字属性（ハイライト情報）を取得します。

**引数**:
- `index` (int): 文字位置（デフォルト: 0）

**戻り値**: 属性値。範囲外の場合は`null`。

##### `len()`
```
int len()
```
文字列の長さを取得します。

**戻り値**: 文字数

##### `caretpos()`
```
int caretpos()
```
キャレット（カーソル）位置を取得します。

**戻り値**: キャレット位置

##### `toWString()`
```
wstring toWString()
```
`wstring`オブジェクトに変換します。

**戻り値**: `wstring`オブジェクト

---

### FileDialog

ファイル選択ダイアログ。

#### コンストラクタ

```
FileDialog()
```
FileDialogオブジェクトを作成します。

#### メソッド

##### `setDirectory(dir)`
```
void setDirectory(FileRef dir)
```
初期ディレクトリを設定します。

**引数**:
- `dir` (FileRef): ディレクトリ

##### `setFile(file)`
```
void setFile(FileRef file)
```
初期ファイルを設定します。

**引数**:
- `file` (FileRef): ファイル

##### `setMode(mode)`
```
void setMode(int mode)
```
ダイアログモードを設定します。

**引数**:
- `mode` (int): モード（0: ファイル選択、1: ディレクトリ選択、2: 保存など）

##### `setTitle(title)`
```
void setTitle(string title)
```
ダイアログのタイトルを設定します。

**引数**:
- `title` (string): タイトル文字列

##### `setFilters(filters)`
```
void setFilters(array filters)
```
ファイルフィルタを設定します。

**引数**:
- `filters` (array): フィルタ文字列の配列（例: `["*.txt", "*.jpg"]`）

**説明**: 最大8個まで設定可能です。

##### `show()`
```
void show()
```
ダイアログを表示します。

**説明**: 非同期で表示されます。結果は`isShown()`と`getResult()`で取得します。

##### `isShown()`
```
bool isShown()
```
ダイアログがまだ表示中（未決定）かどうかを確認します。

**戻り値**: 表示中の場合`true`

##### `getResult()`
```
string getResult()
```
ダイアログの結果を取得します。

**戻り値**: 
- 選択されたファイルパス（文字列）
- `null`: キャンセルされた
- `undefined`: まだ表示中

---

### WebView

Webコンテンツを表示するビュー。プラットフォームによってはサポートされていません。

#### コンストラクタ

```
WebView()
```
WebViewオブジェクトを作成します。

**説明**: サポートされていないOSではエラーが発生します。

#### メソッド

##### `setType(type)`
```
int setType(int type)
```
WebViewのタイプを設定します。

**引数**:
- `type` (int): タイプ番号

**戻り値**: 結果コード

##### `show()`
```
int show()
```
WebViewを表示します。

**戻り値**: 結果コード

##### `hide()`
```
int hide()
```
WebViewを非表示にします。

**戻り値**: 結果コード

##### `close()`
```
int close()
```
WebViewを閉じます。

**戻り値**: 結果コード

##### `setRect(x, y, w, h)`
```
int setRect(int x, int y, int w, int h)
```
WebViewの位置とサイズを設定します。

**引数**:
- `x` (int): X座標
- `y` (int): Y座標
- `w` (int): 幅
- `h` (int): 高さ

**戻り値**: 結果コード

##### `openURL(url[, headers])`
```
int openURL(string url[, string headers])
```
指定されたURLを開きます。

**引数**:
- `url` (string): URL
- `headers` (string, オプション): HTTPヘッダ

**戻り値**: 結果コード

##### `isLoading()`
```
int isLoading()
```
ページ読み込み中かどうかを確認します。

**戻り値**: 読み込み中の場合は非ゼロ

##### `eval(jscode)`
```
object eval(string jscode)
```
JavaScriptコードを実行します。

**引数**:
- `jscode` (string): JavaScriptコード

**戻り値**: 実行結果（型は実行内容による）

**説明**: エラーが発生した場合は例外が発生します。

---

### MoviePlayer

動画を再生するプレイヤー。プラットフォームによってはサポートされていません。

#### コンストラクタ

```
MoviePlayer(SoundMixer mixer)
```
MoviePlayerオブジェクトを作成します。

**引数**:
- `mixer` (SoundMixer): オーディオミキサー

**説明**: サポートされていないOSではエラーが発生します。

#### メソッド

##### `setSource(source[, offset, length])`
```
int setSource(source[, int64 offset, int64 length])
```
動画ソースを設定します。

**引数**:
- `source` (string/FileRef): ファイルパスまたはFileRef
- `offset` (int64, オプション): ファイル内オフセット
- `length` (int64, オプション): 読み込みサイズ

**戻り値**: 結果コード

##### `prepare()`
```
int prepare()
```
動画を準備します。

**戻り値**: 結果コード

**説明**: 非同期処理です。`getState()`で状態を確認します。

##### `getState()`
```
int getState()
```
プレイヤーの状態を取得します。

**戻り値**: 状態コード
- 0: アイドル
- 1: 準備中
- 2: 準備完了
- 3: 再生中
- 4: 一時停止
- 5: エラー

##### `getMovieInfo()`
```
table getMovieInfo()
```
動画情報を取得します。

**戻り値**: 動画情報テーブル
- `width` (int): 幅
- `height` (int): 高さ
- `freq` (int): サンプリング周波数
- `length` (int): 長さ（ミリ秒）

##### `setLoop(loop)`
```
void setLoop(bool loop = true)
```
ループ再生を設定します。

**引数**:
- `loop` (bool): `true`でループ再生（デフォルト: `true`）

##### `setAudioVolume(volume)`
```
void setAudioVolume(int volume)
```
オーディオボリュームを設定します。

**引数**:
- `volume` (int): ボリューム（0～100）

##### `seek(position)`
```
void seek(int position)
```
再生位置をシークします。

**引数**:
- `position` (int): 位置（ミリ秒）

##### `tell()`
```
int tell()
```
現在の再生位置を取得します。

**戻り値**: 位置（ミリ秒）

##### `play()`
```
int play()
```
再生を開始します。

**戻り値**: 結果コード

##### `pause()`
```
int pause()
```
再生を一時停止します。

**戻り値**: 結果コード

##### `close()`
```
void close()
```
動画を閉じます。

##### `capture(texture)`
```
int capture(Texture texture)
```
現在のフレームをテクスチャにキャプチャします。

**引数**:
- `texture` (Texture): キャプチャ先テクスチャ

**戻り値**: 結果コード

##### `captureRGBA(texture, initTex)`
```
int captureRGBA(Texture texture, bool initTex)
```
現在のフレームをRGBA形式でテクスチャにキャプチャします。

**引数**:
- `texture` (Texture): キャプチャ先テクスチャ
- `initTex` (bool): テクスチャを初期化するかどうか

**戻り値**: 結果コード

---

### Gamepad

ゲームパッドを表すクラス。

#### コンストラクタ

コンストラクタは呼び出せません。`skScanGamepads()`から取得します。

#### フィールド

- `type` (int): ゲームパッドタイプ
- `buttonmask` (int): 押されているボタンのビットマスク
- `connected` (int): 接続状態（0/1）
- `axis0` ～ `axis11` (float): アナログスティックや軸の値（-1.0 ～ 1.0）

#### 読み取り専用プロパティ

- `name` (string): ゲームパッド名
- `id` (string): ゲームパッドGUID

#### メソッド

##### `poll([deltaTime])`
```
bool poll([int deltaTime])
```
ゲームパッドの状態を更新します。

**引数**:
- `deltaTime` (int, オプション): 前回のポーリングからの経過時間（ミリ秒、デフォルト: 16）

**戻り値**: 接続されている場合`true`

##### `feedback()`
```
void feedback()
```
フィードバック（振動など）を送信します。

**説明**: 現在は実装されていません。

---

## 注意事項

1. **プラットフォーム依存**: `WebView`、`MoviePlayer`、一部のセンサー機能など、プラットフォームによってサポートされない機能があります。

2. **非同期処理**: `FileDialog`、`startTextEdit`、IAP関連の関数は非同期で動作し、結果はイベントまたは専用の取得メソッドで確認します。

3. **パーミッション**: `skOpenURL`などの一部の機能はパーミッション設定が必要です。
