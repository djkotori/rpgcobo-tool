# SakanaGL Image API リファレンス

`core/api/ssapi_image.cpp`で定義されているSakanaGLの画像処理とフォント関連APIのリファレンスドキュメントです。

画像のロード・エンコード・デコード、フォント処理、テキストレンダリング、ビットマップ操作、絵文字対応などの機能を提供します。

---

## 目次

1. [グローバル関数](#グローバル関数)
2. [クラス](#クラス)
   - [RGBAImage](#rgbaimage)
   - [KTXImage](#ktximage)
   - [Font](#font)
   - [FontAttribute](#fontattribute)
   - [FontMetrics](#fontmetrics)
   - [TextBox](#textbox)
   - [Bitmap](#bitmap)
   - [BitmapRasterizer](#bitmaprasterizer)
   - [Emoji](#emoji)

---

## グローバル関数

### `skLoadImage(buffer[, option])`

バイトバッファから画像をロードします。

**引数**:
- `buffer` (ByteBuffer): 画像データを含むバッファ
- `option` (string, オプション): ロードオプション

**戻り値**: `RGBAImage`または`KTXImage`オブジェクト

**説明**: 
- PNG、JPEG、WebP、KTXなどの形式に対応しています。
- 画像フォーマットはバイナリから自動判別されます。
- ロード成功時、バッファの位置は画像データの末尾に移動します。
- 画像にメタデータが含まれている場合、返されたオブジェクトの`metadata`フィールドに`ByteBuffer`として格納されます。

**例**:
```javascript
local imgData = FileRef("image.png").load();
local image = skLoadImage(imgData);
print("画像サイズ: " .. image.width .. "x" .. image.height);
```

---

## クラス

### RGBAImage

RGBA形式の画像クラス。各ピクセルは32ビット（8ビット×4チャンネル）で表現されます。

#### 継承

`TexImage` ← `RGBAImage`

#### コンストラクタ

```javascript
RGBAImage(width, height[, fillColor])
RGBAImage(width, height, buffer)
RGBAImage(transfer)
```

**引数**:
- `width` (int): 画像の幅（1～8192）
- `height` (int): 画像の高さ（1～8192）
- `fillColor` (int, オプション): 初期塗りつぶし色（RGBA形式）
- `buffer` (ByteBuffer, オプション): 初期ピクセルデータ
- `transfer` (Transfer): 転送オブジェクト

**説明**: サイズは1～8192の範囲でなければなりません。

#### フィールド

- `width` (int, 読み取り専用): 画像の幅
- `height` (int, 読み取り専用): 画像の高さ
- `depth` (int, 読み取り専用): 画像の深度（通常1、3Dテクスチャの場合はレイヤー数）
- `dpi` (float): DPI（解像度）
- `metadata` (ByteBuffer, 読み取り専用): 画像のメタデータ

#### メソッド

##### `setSize(width, height[, depth])`
画像のサイズを変更します。

**引数**:
- `width` (int): 新しい幅（1～8192）
- `height` (int): 新しい高さ（1～8192）
- `depth` (int, オプション): 深度（デフォルト: 1）

**説明**: 既存のピクセルデータは破棄されます。

##### `clear(color[, x, y, w, h])`
画像全体または指定領域をクリアします。

**引数**:
- `color` (int): クリア色（RGBA形式）
- `x, y, w, h` (int, オプション): クリア領域

**例**:
```javascript
img.clear(0xff0000ff);           // 全体を赤でクリア
img.clear(0x00ff00ff, 10, 10, 50, 50);  // 部分的にクリア
```

##### `draw(srcImage, dx, dy[, op])`
##### `draw(srcImage, sx, sy, sw, sh, dx, dy[, op])`
別の画像を描画します。

**引数**:
- `srcImage` (RGBAImage): 転送元画像
- `sx, sy, sw, sh` (int): 転送元矩形
- `dx, dy` (int): 転送先座標
- `op` (int, オプション): 描画演算モード（デフォルト: 0）

**描画演算モード**:
- `0`: 通常コピー
- 他のモードは実装依存

##### `hasAlpha()`
画像がアルファチャンネル（透明度）を含むかチェックします。

**戻り値**: bool

**説明**: すべてのピクセルのアルファ値が255の場合`false`を返します。

##### `premultAlpha()`
アルファプリマルチプライ処理を行います。

**説明**: RGB値にアルファ値をあらかじめ乗算します（合成処理の高速化）。

##### `swapEndian()`
ピクセルデータのエンディアンを入れ替えます。

**説明**: バイトオーダーを反転します（RGBA ↔ ABGR）。

##### `encodePNG([buffer])`
PNG形式にエンコードします。

**引数**:
- `buffer` (ByteBuffer, オプション): 書き込み先バッファ

**戻り値**: PNG画像データを含む`ByteBuffer`

**例**:
```javascript
local pngData = img.encodePNG();
FileRef("output.png").save(pngData);
```

##### `encodeJpeg([quality[, buffer]])`
JPEG形式にエンコードします。

**引数**:
- `quality` (int, オプション): 品質（1～100、デフォルト: 80）
- `buffer` (ByteBuffer, オプション): 書き込み先バッファ

**戻り値**: JPEG画像データを含む`ByteBuffer`

##### `encodeWebp([quality[, buffer]])`
WebP形式にエンコードします。

**引数**:
- `quality` (int, オプション): 品質（1～100、デフォルト: 80）
- `buffer` (ByteBuffer, オプション): 書き込み先バッファ

**戻り値**: WebP画像データを含む`ByteBuffer`

##### `texture2d(u, v)`
2Dテクスチャサンプリング（バイリニア補間）を行います。

**引数**:
- `u` (float): U座標（0～1、ラップモード）
- `v` (float): V座標（0～1、ラップモード）

**戻り値**: サンプリングされた色（int、RGBA形式）

**説明**: 座標は0～1の範囲で指定し、範囲外の場合はラップします。

##### `getRow(y, array)`
指定行のピクセルデータを配列に取得します。

**引数**:
- `y` (int): 行番号
- `array` (array): 結果を格納する配列

**戻り値**: 引数の`array`

**説明**: 配列のサイズは自動的に`width`に調整されます。

##### `setRow(y, array)`
指定行のピクセルデータを配列から設定します。

**引数**:
- `y` (int): 行番号
- `array` (array): ピクセルデータの配列

**戻り値**: 引数の`array`

##### `filter(kernel, kernelWidth, dstImage)`
畳み込みフィルタを適用します。

**引数**:
- `kernel` (array): カーネル配列
- `kernelWidth` (int): カーネルの幅
- `dstImage` (RGBAImage): 結果の格納先画像

**戻り値**: `dstImage`

**説明**: 
- カーネルの高さは`kernel.length / kernelWidth`として計算されます。
- 出力画像のサイズは`(width - kernelWidth + 1) x (height - kernelHeight + 1)`になります。
- カーネル内の0要素はスキップされます（高速化）。

##### `load(buffer)`
バイトバッファから生のピクセルデータをロードします。

**引数**:
- `buffer` (ByteBuffer): ピクセルデータ

**戻り値**: 自身

**説明**: 画像サイズは事前に設定されている必要があります。

##### `store(buffer)`
生のピクセルデータをバイトバッファに保存します。

**引数**:
- `buffer` (ByteBuffer): 書き込み先バッファ

**説明**: `width * height * depth * 4`バイトのデータが書き込まれます。

#### インデックスアクセス

```javascript
img[index]          // ピクセル取得（1次元インデックス）
img[index] = color  // ピクセル設定
```

**説明**: インデックスは`y * width + x`として計算されます。

#### 呼び出し演算子

```javascript
img(x, y)            // ピクセル取得（範囲外の場合はクランプ）
img(x, y, default)   // ピクセル取得（範囲外の場合はdefaultを返す）
```

**引数**:
- `x, y` (int): ピクセル座標
- `default` (int, オプション): 範囲外時のデフォルト値

**戻り値**: ピクセル色（int）

#### 比較演算子

```javascript
img1 == img2   // サイズとピクセルデータで比較
```

---

### KTXImage

Khronos Texture (KTX,KTX2)形式の圧縮テクスチャ画像クラス。

#### 継承

`TexImage` ← `KTXImage`

#### コンストラクタ

**説明**: コンストラクタは直接呼び出せません。`skLoadImage()`を使用してください。

#### フィールド

- `width` (int, 読み取り専用): 画像の幅
- `height` (int, 読み取り専用): 画像の高さ
- `depth` (int, 読み取り専用): 画像の深度
- `mipnum` (int, 読み取り専用): ミップマップレベル数
- `facenum` (int, 読み取り専用): キューブマップフェイス数
- `arraynum` (int, 読み取り専用): テクスチャ配列の要素数
- `metadata` (ByteBuffer, 読み取り専用): 画像のメタデータ

**説明**: KTX画像は主にGPU向けの圧縮テクスチャフォーマット（ETC、DXTなど）を格納します。

---

### Font

フォントクラス。TrueType/OpenTypeフォントをロードして使用します。

#### コンストラクタ

```javascript
Font(buffer[, scale[, faceIndex]])
```

**引数**:
- `buffer` (ByteBuffer): フォントファイルデータ
- `scale` (float, オプション): スケール係数（デフォルト: 1.0）
- `faceIndex` (int, オプション): フォントコレクション内のフェイスインデックス（デフォルト: 0）

**説明**: 
- TrueType (.ttf)、OpenType (.otf)、TrueTypeコレクション (.ttc) に対応しています。
- `faceIndex`はコレクションファイル内の特定のフォントを選択します。

#### フィールド

- `name` (string, 読み取り専用): フォント名

#### メソッド

##### `getFontMetrics(size)`
指定サイズのフォントメトリクスを取得します。

**引数**:
- `size` (int): フォントサイズ（ピクセル単位）

**戻り値**: `FontMetrics`オブジェクト

##### `getCodePoints([start, length[, array]])`
フォントがサポートするコードポイントのリストを取得します。

**引数**:
- `start` (int, オプション): 開始インデックス（デフォルト: 0）
- `length` (int, オプション): 取得数（デフォルト: 8192）
- `array` (array, オプション): 結果を格納する配列

**戻り値**: コードポイントの配列

**説明**: フォントに含まれる文字のUnicodeコードポイントを列挙します。

##### `hasCodePoint(codePoint)`
フォントが指定コードポイントをサポートしているかチェックします。

**引数**:
- `codePoint` (int): Unicodeコードポイント

**戻り値**: サポートされている場合`true`

**例**:
```javascript
local fontData = FileRef("font.ttf").load();
local font = Font(fontData);
print("フォント名: " .. font.name);
if (font.hasCodePoint(0x3042)) {  // 'あ'
	print("ひらがな対応");
}
```

---

### FontAttribute

フォント属性クラス。フォント、サイズ、色、装飾などの設定を保持します。

#### コンストラクタ

```javascript
FontAttribute(font[, size[, color[, flags[, advance[, linespace]]]]])
```

**引数**:
- `font` (Font): 使用するフォント
- `size` (int, オプション): フォントサイズ（4～100、デフォルト: 12）
- `color` (int, オプション): 文字色（RGBA形式、デフォルト: 0xffffffff）
- `flags` (int, オプション): フラグ（デフォルト: 0）
- `advance` (float, オプション): 文字間隔調整
- `linespace` (float, オプション): 行間調整

#### フィールド

- `font` (Font): フォント
- `size` (int): フォントサイズ
- `color` (int): 文字色（RGBA形式）
- `strokecolor` (int): アウトライン色（RGBA形式、デフォルト: 0x000000ff）
- `flags` (int): フラグ
- `advance` (float): 文字間隔調整（ピクセル単位）
- `linespace` (float): 行間調整（倍率）
- `linebreak` (int): 改行モード

**読み取り専用プロパティ**:
- `strokesize` (int): アウトライン幅（0～15、`flags`から計算）
- `strokex` (int): アウトラインX方向オフセット（-15～15、`flags`から計算）
- `strokey` (int): アウトラインY方向オフセット（-15～15、`flags`から計算）

**説明**: 
- `flags`の各ビットフィールド:
  - ビット0-3: 予約
  - ビット4-7: `strokesize`（0～15）
  - ビット8-11: `strokex`（0～15、8を引いて-7～8に）
  - ビット12-15: `strokey`（0～15、8を引いて-7～8に）

#### メソッド

##### `getFontMetrics()`
現在の設定でのフォントメトリクスを取得します。

**戻り値**: `FontMetrics`オブジェクト

---

### FontMetrics

フォントメトリクス（サイズ情報）を保持するクラス。

#### コンストラクタ

```javascript
FontMetrics()
```

**説明**: 通常は`Font.getFontMetrics()`または`FontAttribute.getFontMetrics()`から取得します。

#### フィールド

- `x` (int): X方向オフセット
- `y` (int): Y方向オフセット（ベースラインからの距離）
- `w` (int): 文字幅
- `h` (int): 文字高さ
- `advance` (float): 次の文字への送り幅
- `linespace` (float): 行間

**説明**: 値は指定されたフォントサイズに基づいて計算されます。

---

### TextBox

複数行テキストの整形とレイアウトを行うクラス。フォント属性の切り替え、折り返し、配置などに対応します。

#### コンストラクタ

```javascript
TextBox(fontAttribute[, text])
```

**引数**:
- `fontAttribute` (FontAttribute): 初期フォント属性
- `text` (string/WString, オプション): 初期テキスト

#### フィールド

**位置・サイズ**:
- `x`, `y` (float): テキストボックスの位置
- `width`, `height` (int): テキストボックスのサイズ
- `lx`, `ly` (int, 読み取り専用): レイアウト後の実際のテキスト位置
- `bnd` (Rect2D, 読み取り専用): テキストのバウンディングボックス

**マージン**:
- `marginl`, `margint`, `marginr`, `marginb` (int): 左・上・右・下マージン

**表示設定**:
- `align` (int): テキスト配置（0: 左、1: 中央、2: 右）
- `wrapmode` (int): 折り返しモード（0: なし、1: 単語、2: 文字）
- `colormask` (int): 色マスク（RGBA形式）
- `drawstart` (int): 描画開始文字インデックス
- `drawlen` (int): 描画文字数（0で全て）
- `autofitw` (float): 自動フィット幅（0で無効）
- `clip` (int): クリッピングモード

**テキスト情報**:
- `length` (int, 読み取り専用): テキストの文字数

#### メソッド

##### テキスト操作

##### `setText(text[, fontAttribute])`
テキストを設定します。

**引数**:
- `text` (string/WString): 新しいテキスト
- `fontAttribute` (FontAttribute, オプション): フォント属性（指定時は既存属性を置き換え）

##### `getText()`
テキストをUTF-8文字列として取得します。

**戻り値**: string

**説明**: 絵文字が含まれている場合、絵文字コードをUTF-8にデコードします。

##### `getTextW()`
テキストをワイド文字列として取得します。

**戻り値**: WString

##### `appendText(text[, fontAttribute])`
テキストを追加します。

**引数**:
- `text` (string/WString): 追加するテキスト
- `fontAttribute` (FontAttribute, オプション): 追加部分のフォント属性

##### 属性操作

##### `setAttribute(fontAttribute[, start[, end]])`
テキストの範囲にフォント属性を設定します。

**引数**:
- `fontAttribute` (FontAttribute): フォント属性
- `start` (int, オプション): 開始文字インデックス（デフォルト: 0）
- `end` (int, オプション): 終了文字インデックス（デフォルト: 100000）

##### `getAttribute([index])`
指定位置のフォント属性を取得します。

**引数**:
- `index` (int, オプション): 文字インデックス（デフォルト: 0）

**戻り値**: `FontAttribute`オブジェクト

##### レイアウト操作

##### `setSize(width, height)`
テキストボックスのサイズを設定します。

**引数**:
- `width` (int): 幅（1～4096）
- `height` (int): 高さ（1～4096）

##### `setRect(x, y, width, height)`
テキストボックスの位置とサイズを設定します。

**引数**:
- `x`, `y` (float): 位置
- `width` (int): 幅（1～4096）
- `height` (int): 高さ（1～4096）

##### 位置・情報取得

##### `charIndexAt(x, y)`
指定座標の文字インデックスを取得します。

**引数**:
- `x`, `y` (int): ローカル座標

**戻り値**: 文字インデックス

**説明**: テキスト編集時のカーソル位置計算に使用できます。

##### `getCharPos(index, array)`
指定文字の位置を取得します。

**引数**:
- `index` (int): 文字インデックス
- `array` (array): 結果を格納する配列（最低2要素、オプションで3要素）

**戻り値**: `array`（`[x, y]`または`[x, y, width]`）

**説明**: 
- `x`, `y`は絶対座標（`this.x + lx + ...`）です。
- 配列が3要素以上の場合、3番目に文字幅が格納されます。

##### `getLineIndex(charIndex)`
指定文字が属する行インデックスを取得します。

**引数**:
- `charIndex` (int): 文字インデックス

**戻り値**: 行インデックス

##### `getLineInfo(lineIndex, array)`
行情報を取得します。

**引数**:
- `lineIndex` (int): 行インデックス
- `array` (array): 結果を格納する配列

**戻り値**: `array`（`[start, end, maxDescent, maxLineSpace, y, width]`）または`null`

**説明**: 
- `start`, `end`: 行の開始・終了文字インデックス
- `maxDescent`: 最大ディセント
- `maxLineSpace`: 最大行間
- `y`: 行のY座標
- `width`: 行の幅

##### `strwidth(startIndex, endIndex)`
指定範囲の文字列幅を取得します。

**引数**:
- `startIndex` (int): 開始文字インデックス
- `endIndex` (int): 終了文字インデックス

**戻り値**: 幅（float）

##### 非推奨メソッド

以下のメソッドは後方互換性のために残されていますが、`getLineInfo()`の使用を推奨します:
- `getColumnLine(index, array)` 
- `getLineCharRange(lineIndex, array)`
- `getLineHeightRange(lineIndex, array)`

#### インデックスアクセス

```javascript
textbox[index]  // 指定位置の文字コード（utf-32）を取得
```

---

### Bitmap

1ビット単位のビットマップクラス。フォントマスク、衝突マップなどに使用します。

#### コンストラクタ

```javascript
Bitmap()
Bitmap(width, height[, bitValue])
```

**引数**:
- `width` (int): 幅（1～16384）
- `height` (int): 高さ（1～16384）
- `bitValue` (int, オプション): 初期ビット値（0または1）

#### フィールド

- `w` (int, 読み取り専用): 幅
- `h` (int, 読み取り専用): 高さ
- `row` (int, 読み取り専用): 行あたりの`uint`要素数

**説明**: ビットマップは内部で32ビット単位で格納され、行は4バイト境界にアラインされます。

#### メソッド

##### `setSize(width, height[, bitValue])`
ビットマップのサイズを変更します。

**引数**:
- `width` (int): 新しい幅（1～16384）
- `height` (int): 新しい高さ（1～16384）
- `bitValue` (int, オプション): 初期ビット値

##### `get(x, y)`
指定位置のビット値を取得します。

**引数**:
- `x`, `y` (int): 座標

**戻り値**: ビット値（0または1）

##### `set(x, y[, value])`
指定位置のビット値を設定します。

**引数**:
- `x`, `y` (int): 座標
- `value` (int, オプション): ビット値（省略時は1）

##### `empty()`
ビットマップが空（すべて0）かチェックします。

**戻り値**: すべて0の場合`true`

##### `setall(bit0, bit1, ...)`
可変長引数でビットマップを設定します。

**引数**:
- `bit0, bit1, ...` (int): 各ビット値（0または1、左から右、上から下の順）

**説明**: 引数の数は`width * height`と一致する必要があります。

##### `halfen()`
ビットマップを半分のサイズに縮小します。

**戻り値**: 自身

**説明**: 2x2ピクセルブロックで1つ以上が1の場合、縮小後のピクセルは1になります。

##### `doublen()`
ビットマップを2倍のサイズに拡大します。

**戻り値**: 自身

##### `rotate([count])`
ビットマップを90度回転します。

**引数**:
- `count` (int, オプション): 回転回数（デフォルト: 1、最大3）

**戻り値**: 自身

**説明**: `count`は0～3の範囲でビット演算されます。

##### `draw(srcBitmap, dx, dy)`
##### `draw(srcBitmap, sx, sy, sw, sh, dx, dy)`
別のビットマップを描画します。

**引数**:
- `srcBitmap` (Bitmap): 転送元ビットマップ
- `sx, sy, sw, sh` (int): 転送元矩形
- `dx, dy` (int): 転送先座標

##### `load(buffer)`
バイトバッファからビットマップをロードします。

**引数**:
- `buffer` (ByteBuffer): ビットマップデータ

**戻り値**: `buffer`

**説明**: データ形式は`[width(short), height(short), bits...]`です。

##### `store(buffer)`
ビットマップをバイトバッファに保存します。

**引数**:
- `buffer` (ByteBuffer): 書き込み先バッファ

**戻り値**: `buffer`

##### `toRGBAImage(rgbaImage[, color0, color1])`
ビットマップをRGBA画像に変換します。

**引数**:
- `rgbaImage` (RGBAImage): 変換先画像
- `color0` (int, オプション): ビット0の色（デフォルト: 0x00000000）
- `color1` (int, オプション): ビット1の色（デフォルト: 0xffffffff）

**戻り値**: `rgbaImage`

##### `hashcode()`
ビットマップのハッシュ値を計算します。

**戻り値**: ハッシュ値（int）

##### `toString([reverse])`
ビットマップを文字列で表現します。

**引数**:
- `reverse` (bool, オプション): 反転（0を'#'、1を' 'に）

**戻り値**: string

**説明**: ASCII文字でビットマップパターンを表示します（デバッグ用）。

---

### BitmapRasterizer

3Dメッシュを32x32ビットマップにラスタライズするクラス。

#### コンストラクタ

```javascript
BitmapRasterizer()
```

#### フィールド

- `drawn` (int, 読み取り専用): 描画された三角形の数
- `side` (float): サイド判定の閾値

#### メソッド

##### `begin(matrix)`
ラスタライズを開始します。

**引数**:
- `matrix` (Matrix): 変換行列

**戻り値**: 自身

##### `draw(v0, v1, v2)`
三角形を描画します。

**引数**:
- `v0`, `v1`, `v2` (Vector3D): 三角形の頂点（時計回り）

**戻り値**: 自身

##### `toBitmap([bitmap])`
ラスタライズ結果をビットマップに変換します。

**引数**:
- `bitmap` (Bitmap, オプション): 変換先ビットマップ

**戻り値**: 32x32の`Bitmap`オブジェクト

---

### Emoji

絵文字（カスタム絵文字）の管理を行う静的クラス。絵文字システムは全体で1つのグローバルな設定として動作します。  
レイヤーに分けて複数の絵文字を登録できます。レイヤーは0～6までの7層で、後から追加・削除可能です。

#### 静的メソッド

##### `Emoji.registerEmoji(emojiArray, imageBuffer[, layer])`
絵文字を登録します。

**引数**:
- `emojiArray` (array): 絵文字定義の配列（各要素はテーブル）
- `imageBuffer` (ByteBuffer): 絵文字画像データ（PNG等）
- `layer` (int, オプション): レイヤー番号（0～6、デフォルト: 0）

**絵文字定義テーブルの構造**:
- `cp` (int): コードポイント（Unicodeまたは結合文字列の最初の文字）
- `offs` (int): `imageBuffer`内のオフセット
- `size` (int): 画像データサイズ（バイト）
- `w`, `h` (int, オプション): 画像サイズ（省略時32x32）
- `nexts` (array, オプション): 結合文字の配列（ネストした絵文字定義）

**説明**: 
- 複数のコードポイントを組み合わせた絵文字（例: 国旗、肌色指定）にも対応。
- `nexts`を使って階層的な定義が可能。
- レイヤーは後から追加・削除できます。

##### `Emoji.encodeEmojiString(text)`
テキスト内の絵文字を内部コードに変換します。

**引数**:
- `text` (string/WString): 変換するテキスト

**戻り値**: 変換されたWString（変換が発生しない場合は元の値）

**説明**: 
- Unicode絵文字シーケンスを1つの内部コードに変換します。
- `TextBox.setText()`等の内部で自動的に呼ばれます。

##### `Emoji.encodeEmojiIMString(imstring)`
IMString（入力メソッド文字列）内の絵文字を変換します。

**引数**:
- `imstring` (IMString): 変換するIMString

**戻り値**: 変換されたIMString（変換が発生しない場合は元の値）

**説明**: キャレット位置などのメタ情報を保持したまま変換します。

##### `Emoji.decodeEmojiString(wstring)`
内部絵文字コードをUTF-8文字列にデコードします。

**引数**:
- `wstring` (WString): デコードするワイド文字列

**戻り値**: UTF-8文字列

**説明**: 絵文字コードを元のUnicodeシーケンスに戻します。

##### `Emoji.getEmojiImage(emojiCode)`
絵文字の画像を取得します。

**引数**:
- `emojiCode` (int): 絵文字コード（`EMOJI_BIT | index`形式）

**戻り値**: `RGBAImage`オブジェクト、または`null`

##### `Emoji.getEmojiLayer(emojiCode)`
絵文字が属するレイヤー番号を取得します。

**引数**:
- `emojiCode` (int): 絵文字コード

**戻り値**: レイヤー番号（0～6）、または-1（無効な絵文字）

##### `Emoji.getEmojiCode(textOrCodePoint)`
テキストまたはコードポイントから絵文字コードを取得します。

**引数**:
- `textOrCodePoint` (int/WString): Unicodeコードポイントまたは文字列

**戻り値**: 絵文字コード（int）、または0（該当なし）

**説明**: 
- 文字列の場合、完全一致する絵文字のみを返します（部分一致は0）。
- 登録された絵文字かどうかのチェックに使用できます。

##### `Emoji.getLayerEmojiList(layer)`
指定レイヤーの絵文字リストを取得します。

**引数**:
- `layer` (int): レイヤー番号（0～6）

**戻り値**: 絵文字のUTF-8文字列配列
