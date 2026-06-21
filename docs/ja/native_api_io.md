# SakanaGL I/O API リファレンス

`core/api/ssapi_io.cpp`で定義されているSakanaGLのI/O関連APIのリファレンスドキュメントです。

ファイル操作、ネットワーク通信、データエンコーディング、圧縮、パッケージング、暗号化などの機能を提供します。

---

## 目次

1. [グローバル関数](#グローバル関数)
   - [JSON](#json)
   - [エンコーディング](#エンコーディング)
   - [圧縮](#圧縮)
   - [その他](#その他)
2. [クラス](#クラス)
   - [ByteBuffer](#bytebuffer)
   - [Date](#date)
   - [Timezone](#timezone)
   - [FileRef](#fileref)
   - [FileStream](#filestream)
   - [SxrFile](#sxrfile)
   - [SxrEntity](#sxrentity)
   - [MD5](#md5)
   - [Blowfish](#blowfish)
   - [IPAddress](#ipaddress)
   - [TCPConnection](#tcpconnection)
   - [UDPSocket](#udpsocket)
   - [TCPServer](#tcpserver)
   - [HTTPRequest](#httprequest)
   - [SSLContext](#sslcontext)
   - [SSLConnection](#sslconnection)

---

## グローバル関数

### JSON

#### `decodeJSON(source[, from, size])`
```
object decodeJSON(string|ByteBuffer source[, int from, int size])
```
JSON文字列またはバイトバッファをデコードします。

**引数**:
- `source` (string/ByteBuffer): JSON文字列またはバイトバッファ
- `from` (int, オプション): バイトバッファの開始位置
- `size` (int, オプション): デコードするサイズ

**戻り値**: デコードされたオブジェクト

**説明**: 
- プレレキシング済みのJSON（先頭が`0xfafa`）にも対応
- BOM（`0xef`で始まる）は自動的にスキップされます
- エラーが発生すると例外が発生します

#### `encodeJSON(object[, format, dest])`
```
string|ByteBuffer encodeJSON(object obj[, int format, ByteBuffer dest])
```
オブジェクトをJSON文字列にエンコードします。

**引数**:
- `obj` (object): エンコードするオブジェクト
- `format` (int, オプション): フォーマットフラグ
  - `1`: フォーマット（改行・インデント）
  - `2`: ワイド文字をエスケープ
  - `4`: キーをソート
- `dest` (ByteBuffer, オプション): 出力先バッファ

**戻り値**: JSON文字列またはバイトバッファ

**説明**: エンコードに失敗した場合は`null`を返します。

---

### エンコーディング

#### `encodeBASE64(data[, dest])`
```
string|ByteBuffer encodeBASE64(string|ByteBuffer data[, ByteBuffer dest])
```
BASE64エンコードを行います。

**引数**:
- `data` (string/ByteBuffer): エンコードするデータ
- `dest` (ByteBuffer, オプション): 出力先バイトバッファ

**戻り値**: BASE64エンコードされた文字列またはバイトバッファ

#### `decodeBASE64(data, dest)`
```
ByteBuffer decodeBASE64(string|ByteBuffer data, ByteBuffer dest)
```
BASE64デコードを行います。

**引数**:
- `data` (string/ByteBuffer): デコードするデータ
- `dest` (ByteBuffer): 出力先バイトバッファ

**戻り値**: デコードされたバイトバッファ

#### `encodeURL(str)`
```
string encodeURL(string str)
```
URLエンコードを行います。

**引数**:
- `str` (string): エンコードする文字列

**戻り値**: URLエンコードされた文字列

#### `decodeURL(str)`
```
string decodeURL(string str)
```
URLデコードを行います。

**引数**:
- `str` (string): デコードする文字列

**戻り値**: URLデコードされた文字列

#### `encodeESC(str)`
```
string encodeESC(string str)
```
エスケープシーケンスエンコードを行います（`\n`, `\t`, `\"` など）。

**引数**:
- `str` (string): エンコードする文字列

**戻り値**: エスケープされた文字列

#### `decodeESC(str)`
```
string decodeESC(string str)
```
エスケープシーケンスデコードを行します（`\n`, `\t`, `\uXXXX` など）。

**引数**:
- `str` (string): デコードする文字列

**戻り値**: デコードされた文字列

---

### 圧縮

#### `compressZ(input, output[, level])`
```
ByteBuffer compressZ(ByteBuffer input, ByteBuffer output[, int level])
```
zlibで圧縮します。

**引数**:
- `input` (ByteBuffer): 入力バッファ
- `output` (ByteBuffer): 出力バッファ
- `level` (int, オプション): 圧縮レベル（1～9、デフォルト: 4）

**戻り値**: 出力バッファ

#### `compressZAsync(input, output[, level])`
```
future compressZAsync(ByteBuffer input, ByteBuffer output[, int level])
```
zlibで非同期圧縮します。

**引数**:
- `input` (ByteBuffer): 入力バッファ
- `output` (ByteBuffer): 出力バッファ
- `level` (int, オプション): 圧縮レベル（デフォルト: 4）

**戻り値**: 完了を待つ`future`オブジェクト

#### `uncompressZ(input, output)`
```
ByteBuffer uncompressZ(ByteBuffer input, ByteBuffer output)
```
zlib圧縮データを解凍します。

**引数**:
- `input` (ByteBuffer): 圧縮データ
- `output` (ByteBuffer): 出力バッファ

**戻り値**: 出力バッファ

#### `uncompressZAsync(input, output)`
```
future uncompressZAsync(ByteBuffer input, ByteBuffer output)
```
zlib圧縮データを非同期解凍します。

**引数**:
- `input` (ByteBuffer): 圧縮データ
- `output` (ByteBuffer): 出力バッファ

**戻り値**: 完了を待つ`future`オブジェクト

#### `compressZSTDBound(size)`
```
int compressZSTDBound(int size)
```
ZSTD圧縮後の最大サイズを取得します。

**引数**:
- `size` (int): 入力サイズ

**戻り値**: 圧縮後の最大サイズ

#### `compressZSTD(input[, output, level])`
```
ByteBuffer compressZSTD(ByteBuffer input[, ByteBuffer output, int level])
```
ZSTDで圧縮します。

**引数**:
- `input` (ByteBuffer): 入力バッファ
- `output` (ByteBuffer, オプション): 出力バッファ（省略時は新規作成）
- `level` (int, オプション): 圧縮レベル（デフォルト: ZSTD_CLEVEL_DEFAULT）

**戻り値**: 圧縮されたバイトバッファ

#### `compressZSTDAsync(input[, level])`
```
future compressZSTDAsync(ByteBuffer input[, int level])
```
ZSTDで非同期圧縮します。

**引数**:
- `input` (ByteBuffer): 入力バッファ
- `level` (int, オプション): 圧縮レベル

**戻り値**: 完了を待つ`future`オブジェクト

#### `uncompressZSTD(input[, output])`
```
ByteBuffer uncompressZSTD(ByteBuffer input[, ByteBuffer output])
```
ZSTD圧縮データを解凍します。

**引数**:
- `input` (ByteBuffer): 圧縮データ
- `output` (ByteBuffer, オプション): 出力バッファ

**戻り値**: 解凍されたバイトバッファ

---

### その他

#### `globMatch(pattern, path[, flags])`
```
bool globMatch(string pattern, string path[, int flags])
```
Globパターンマッチングを行います。

**引数**:
- `pattern` (string): Globパターン
- `path` (string): マッチング対象のパス
- `flags` (int, オプション): フラグ（`1`: 大文字小文字を区別しない）

**戻り値**: マッチした場合`true`

#### `getFDSetSize()`
```
int getFDSetSize()
```
FD_SETSIZEを取得します（ソケット接続の最大数）。

**戻り値**: FD_SETSIZE

#### `changeStdOutFile(fileRef)`
```
void changeStdOutFile(FileRef fileRef)
```
標準出力を指定ファイルにリダイレクトします。

**引数**:
- `fileRef` (FileRef): 出力先ファイル（`null`でリダイレクト解除）

**説明**: ログファイルへの出力などに使用します。

#### `flushStdOut()`
```
void flushStdOut()
```
標準出力バッファをフラッシュします。

---

## クラス

### ByteBuffer

バイナリデータを扱うバッファクラス。読み書き位置（`pos`）とサイズ（`size`）を持ちます。

#### コンストラクタ

```
ByteBuffer([int|ByteBuffer|Void|Transfer capacity])
```
ByteBufferオブジェクトを作成します。

**引数**:
- `capacity` (int): 初期容量
- (ByteBuffer): 別のByteBufferをコピー
- (Void): Voidオブジェクトからムーブ
- (Transfer): Transferオブジェクトからムーブ

#### フィールド

- `pos` (int): 現在の読み書き位置
- `size` (int): データサイズ
- `capacity` (int): バッファ容量

#### メソッド

##### データ読み取り

##### `getv()`
```
bool getv()
```
1バイトをbool値として読み取ります。

**戻り値**: bool値

##### `getb()`
```
int getb()
```
1バイト（符号なし）を読み取ります。

**戻り値**: 0～255の整数

##### `gets()`
```
int gets()
```
2バイト（short）を読み取ります。

**戻り値**: 整数値

##### `geti()`
```
int geti()
```
4バイト（int）を読み取ります。

**戻り値**: 整数値

##### `getl()`
```
long getl()
```
8バイト（long）を読み取ります。

**戻り値**: `long`オブジェクト

##### `getf()`
```
float getf()
```
4バイト（float）を読み取ります。

**戻り値**: 浮動小数点数

##### `geth()`
```
float geth()
```
2バイト（half float）を読み取ります。

**戻り値**: 浮動小数点数

##### `getp()`
```
int getp()
```
パックド整数を読み取ります。

**戻り値**: 整数値

**説明**: 可変長エンコードされた整数を読み取ります。

##### `get4Code()`
```
string get4Code()
```
4文字コードを読み取ります。

**戻り値**: 4文字の文字列

##### `getUTF()`
```
string getUTF()
```
UTF-8文字列を読み取ります（長さプレフィックス付き）。

**戻り値**: 文字列

---

##### データ書き込み

##### `putv(value)`
```
void putv(bool value)
```
bool値を1バイトとして書き込みます。

**引数**:
- `value` (bool): 書き込む値

##### `putb(value)`
```
void putb(int value)
```
1バイト（0～255）を書き込みます。

**引数**:
- `value` (int): 書き込む値

##### `puts(value)`
```
void puts(int value)
```
2バイト（short）を書き込みます。

**引数**:
- `value` (int): 書き込む値

##### `puti(value)`
```
void puti(int value)
```
4バイト（int）を書き込みます。

**引数**:
- `value` (int): 書き込む値

##### `putl(value)`
```
void putl(int|float|long value)
```
8バイト（long）を書き込みます。

**引数**:
- `value` (int/float/long): 書き込む値

##### `putf(value)`
```
void putf(float value)
```
4バイト（float）を書き込みます。

**引数**:
- `value` (float): 書き込む値

##### `puth(value)`
```
void puth(float value)
```
2バイト（half float）を書き込みます。

**引数**:
- `value` (float): 書き込む値

##### `putp(value)`
```
void putp(int value)
```
パックド整数を書き込みます。

**引数**:
- `value` (int): 書き込む値

**説明**: 可変長エンコードで整数を書き込みます（1～5バイト）。

##### `put4Code(code)`
```
void put4Code(string code)
```
4文字コードを書き込みます。

**引数**:
- `code` (string): 4文字以上の文字列

##### `putUTF(str)`
```
void putUTF(string str)
```
UTF-8文字列を書き込みます（長さプレフィックス付き）。

**引数**:
- `str` (string): 書き込む文字列

##### `putText(str)`
```
void putText(string str)
```
文字列をそのまま書き込みます（長さプレフィックスなし）。

**引数**:
- `str` (string): 書き込む文字列

##### `putBuffer(buffer[, size])`
```
void putBuffer(ByteBuffer buffer[, int size])
```
別のバッファからデータをコピーします。

**引数**:
- `buffer` (ByteBuffer): コピー元バッファ
- `size` (int, オプション): コピーするサイズ（省略時はbuffer残り全体）

##### `extendBuffer(buffer[, size])`
```
void extendBuffer(ByteBuffer buffer[, int size])
```
バッファの末尾にデータを追加します。

**引数**:
- `buffer` (ByteBuffer): コピー元バッファ
- `size` (int, オプション): コピーするサイズ

**説明**: 現在の`pos`を変更せず、`size`の位置に追加します。

---

##### バッファ操作

##### `resize(newSize)`
```
ByteBuffer resize(int newSize)
```
バッファサイズを変更します。

**引数**:
- `newSize` (int): 新しいサイズ

**戻り値**: 自身

##### `clear()`
```
ByteBuffer clear()
```
バッファをクリアします（`pos`と`size`を0に設定）。

**戻り値**: 自身

##### `trim()`
```
void trim()
```
`pos`の位置からバッファの先頭へデータを移動します。

**説明**: 既に読み取った部分を削除し、メモリを詰めます。

##### `shrink()`
```
ByteBuffer shrink()
```
未使用領域を解放してメモリを縮小します。

**戻り値**: 自身

##### `fill([value])`
```
ByteBuffer fill([int value])
```
`pos`から`size`まで指定値で埋めます。

**引数**:
- `value` (int, オプション): 埋める値（デフォルト: 0）

**戻り値**: 自身

---

##### 変換・その他

##### `asText()`
```
string asText()
```
バッファ内容を文字列として取得します。

**戻り値**: 文字列

**説明**: `pos`から`size`までを文字列として解釈します。末尾がnull文字の場合は削除されます。

##### `compile([sourceName, persist])`
```
closure compile([string sourceName, bool persist])
```
バッファ内容をSKスクリプトとしてコンパイルします。

**引数**:
- `sourceName` (string, オプション): ソース名（デフォルト: "unknown"）
- `persist` (bool, オプション): 永続化するかどうか

**戻り値**: コンパイルされたクロージャ

##### `prelex(dest)`
```
ByteBuffer prelex(ByteBuffer dest)
```
SKスクリプトをプレレキシング（事前字句解析）します。

**引数**:
- `dest` (ByteBuffer): 出力先バッファ

**戻り値**: 出力先バッファ

##### `sum()`
```
int sum()
```
バッファ内の全バイトの合計を計算します。

**戻り値**: 合計値

##### `hashcode([seed])`
```
int hashcode([int seed])
```
XXHash32ハッシュ値を計算します。

**引数**:
- `seed` (int, オプション): シード値（デフォルト: 91166281）

**戻り値**: ハッシュ値

##### `hash64([seed])`
```
long hash64([int seed])
```
XXHash64ハッシュ値を計算します。

**引数**:
- `seed` (int, オプション): シード値

**戻り値**: `long`オブジェクト

##### `crypt(key[, start, length])`
```
int crypt(int key[, int start, int length])
```
XORベースの暗号化を行います。

**引数**:
- `key` (int): 暗号化キー
- `start` (int, オプション): 開始位置
- `length` (int, オプション): 暗号化する長さ

**戻り値**: 新しい鍵

**説明**: 単純なXOR暗号化です。セキュリティ用途には不十分です。

##### `ucrypt([seed])`
```
void ucrypt([int seed])
```
ユーザー固有情報を使った暗号化を行います。

**引数**:
- `seed` (int, オプション): 追加シード

**説明**: ユーザー名、ホスト名、デバイスID、シークレットからキーを生成します。

---

### Date

日時を表すクラス。

#### コンストラクタ

```
Date([int|long|string|array value, Timezone tz])
```
Dateオブジェクトを作成します。

**引数**:
- `value`: 初期値
  - (int/long): UNIXタイムスタンプ（ミリ秒）
  - (string): ISO8601形式の日時文字列
  - (array): `[year, month, day, hour, min, sec, msec]`
- `tz` (Timezone, オプション): タイムゾーン

#### フィールド

- `year` (int): 年
- `month` (int): 月（1～12）
- `day` (int): 日（1～31）
- `hour` (int): 時（0～23）
- `min` (int): 分（0～59）
- `sec` (int): 秒（0～59）
- `msec` (int): ミリ秒（0～999）
- `dayofweek` (int): 曜日（0: 日曜、6: 土曜）
- `dayofyear` (int): 年内の日数（1～366）

#### メソッド

##### `getTime()`
```
long getTime()
```
UNIXタイムスタンプ（ミリ秒）を取得します。

**戻り値**: `long`オブジェクト

##### `setTime(time)`
```
void setTime(int|long time)
```
UNIXタイムスタンプを設定します。

**引数**:
- `time` (int/long): UNIXタイムスタンプ（ミリ秒）

##### `format([format])`
```
string format([string format])
```
フォーマットされた日時文字列を取得します。

**引数**:
- `format` (string, オプション): フォーマット文字列

**戻り値**: フォーマットされた文字列

**フォーマット指定子**:
- `%Y`: 年（4桁）
- `%m`: 月（2桁）
- `%d`: 日（2桁）
- `%H`: 時（2桁）
- `%M`: 分（2桁）
- `%S`: 秒（2桁）
- その他、標準的なstrftime形式

---

### Timezone

タイムゾーンを表すクラス。

#### コンストラクタ

```
Timezone([string name])
```
Timezoneオブジェクトを作成します。

**引数**:
- `name` (string, オプション): タイムゾーン名（例: "UTC", "JST"）

#### メソッド

##### `getOffset(date)`
```
int getOffset(Date date)
```
指定日時のUTCからのオフセット（ミリ秒）を取得します。

**引数**:
- `date` (Date): 日時

**戻り値**: オフセット（ミリ秒）

---

### FileRef

ファイルやディレクトリへの参照を表すクラス。

#### コンストラクタ

```
FileRef([string|FileRef path])
```
FileRefオブジェクトを作成します。

**引数**:
- `path` (string/FileRef, オプション): ファイルパス

**説明**: パスが空の場合、現在のディレクトリを参照します。

#### 読み取り専用プロパティ

- `name` (string): ファイル名
- `path` (string): 論理パス
- `nativepath` (string): ネイティブパス
- `created` (long): 作成日時（UNIXタイムスタンプ）
- `lastmodified` (long): 最終更新日時
- `size` (int): ファイルサイズ
- `flags` (int): フラグ（FILE_EXISTS, FILE_DIRECTORY, FILE_WRITABLEなど）

#### メソッド

##### `refresh()`
```
void refresh()
```
ファイル情報を更新します。

**説明**: ファイルシステムからメタ情報を再取得します。

##### `getList([filter])`
```
array getList([string filter])
```
ディレクトリ内のファイル一覧を取得します。

**引数**:
- `filter` (string, オプション): Globパターンフィルタ

**戻り値**: `FileRef`の配列

##### `copyTo(dest[, flags])`
```
bool copyTo(FileRef dest[, int flags])
```
ファイルをコピーします。

**引数**:
- `dest` (FileRef): コピー先
- `flags` (int, オプション): フラグ

**戻り値**: 成功した場合`true`

**説明**: パーミッションチェックが行われます。

##### `copyToAsync(dest[, flags])`
```
future copyToAsync(FileRef dest[, int flags])
```
ファイルを非同期コピーします。

**引数**と**戻り値**は`copyTo`と同じですが、`future`を返します。

##### `moveTo(dest[, flags])`
```
bool moveTo(FileRef dest[, int flags])
```
ファイルを移動します。

**引数**:
- `dest` (FileRef): 移動先
- `flags` (int, オプション): フラグ

**戻り値**: 成功した場合`true`

##### `deleteFile()`
```
bool deleteFile()
```
ファイルまたはディレクトリを削除します。

**戻り値**: 成功した場合`true`

##### `mkdirs()`
```
bool mkdirs()
```
ディレクトリを作成します（親ディレクトリも含む）。

**戻り値**: 成功した場合`true`

##### `open(mode)`
```
FileStream open(string mode)
```
ファイルを開きます。

**引数**:
- `mode` (string): オープンモード
  - `"r"`: 読み取り
  - `"w"`: 書き込み（新規作成）
  - `"a"`: 追記
  - `"r+"`: 読み書き
  - `"w+"`: 読み書き（新規作成）

**戻り値**: `FileStream`オブジェクト。失敗時は`null`。

##### `isDirectory()`
```
bool isDirectory()
```
ディレクトリかどうかを確認します。

**戻り値**: ディレクトリの場合`true`

##### `isLocked()`
```
bool isLocked()
```
書き込みロックされているかどうかを確認します。

**戻り値**: 書き込み不可の場合`true`

##### `exists()`
```
bool exists()
```
ファイルが存在するかどうかを確認します。

**戻り値**: 存在する場合`true`

##### `transfer()`
```
Transfer transfer()
```
Transferオブジェクトに変換します。

**戻り値**: `Transfer`オブジェクト

**説明**: ワーカースレッド間でFileRefを転送する際に使用します。

---

### FileStream

ファイルの読み書きを行うストリームクラス。

#### コンストラクタ

コンストラクタは呼び出せません。`FileRef.open()`から取得します。

#### メソッド

##### `tell()`
```
int tell()
```
現在のファイル位置を取得します。

**戻り値**: ファイル位置

##### `seek(offset, origin)`
```
int seek(int offset, int origin)
```
ファイル位置を変更します。

**引数**:
- `offset` (int): オフセット
- `origin` (int): 基準位置
  - `0`: ファイル先頭
  - `1`: 現在位置
  - `2`: ファイル末尾

**戻り値**: 新しいファイル位置

##### `ready()`
```
bool ready()
```
ストリームが使用可能かどうかを確認します。

**戻り値**: 使用可能な場合`true`

##### `read(buffer[, size])`
```
int read(ByteBuffer buffer[, int size])
```
ファイルからデータを読み取ります。

**引数**:
- `buffer` (ByteBuffer): 読み取り先バッファ
- `size` (int, オプション): 読み取るサイズ（省略時はバッファ残り全体）

**戻り値**: 読み取ったバイト数

##### `write(buffer[, size])`
```
int write(ByteBuffer buffer[, int size])
```
ファイルにデータを書き込みます。

**引数**:
- `buffer` (ByteBuffer): 書き込むデータ
- `size` (int, オプション): 書き込むサイズ（省略時はバッファ残り全体）

**戻り値**: 書き込んだバイト数

##### `flush()`
```
int flush()
```
バッファをフラッシュします。

**戻り値**: 成功時0

##### `close()`
```
int close()
```
ストリームを閉じます。

**戻り値**: 成功時0

##### `eof()`
```
bool eof()
```
ファイル終端に達したかどうかを確認します。

**戻り値**: ファイル終端の場合`true`

---

### SxrFile

SXRパッケージファイルを扱うクラス。

#### コンストラクタ

```
SxrFile()
```
SxrFileオブジェクトを作成します。

#### メソッド

##### `open(fileRef[, key])`
```
bool open(FileRef fileRef[, int key])
```
SXRファイルを開きます。

**引数**:
- `fileRef` (FileRef): SXRファイル
- `key` (int, オプション): 復号化キー

**戻り値**: 成功した場合`true`

##### `close()`
```
void close()
```
SXRファイルを閉じます。

##### `getEntityCount()`
```
int getEntityCount()
```
エンティティ数を取得します。

**戻り値**: エンティティ数

##### `getEntity(index|name)`
```
SxrEntity getEntity(int|string indexOrName)
```
エンティティを取得します。

**引数**:
- `indexOrName` (int/string): インデックスまたは名前

**戻り値**: `SxrEntity`オブジェクト。見つからない場合は`null`。

##### `extract(entity, dest)`
```
bool extract(SxrEntity entity, ByteBuffer dest)
```
エンティティのデータを展開します。

**引数**:
- `entity` (SxrEntity): エンティティ
- `dest` (ByteBuffer): 出力先バッファ

**戻り値**: 成功した場合`true`

---

### SxrEntity

SXRパッケージ内のエンティティ（ファイル）を表すクラス。

#### 読み取り専用プロパティ

- `name` (string): エンティティ名
- `size` (int): 展開後のサイズ
- `compressedSize` (int): 圧縮後のサイズ
- `offset` (long): ファイル内オフセット
- `flags` (int): フラグ
- `crc` (int): CRC32チェックサム

---

### MD5

MD5ハッシュを計算するクラス。

#### コンストラクタ

```
MD5()
```
MD5オブジェクトを作成します。

#### メソッド

##### `clear()`
```
void clear()
```
状態をクリアします。

##### `update(buffer)`
```
void update(ByteBuffer buffer)
```
データを追加します。

**引数**:
- `buffer` (ByteBuffer): データ

##### `finish()`
```
void finish()
```
ハッシュ計算を完了します。

##### `getDigest()`
```
string getDigest()
```
ハッシュ値を16進数文字列として取得します。

**戻り値**: 32文字の16進数文字列

#### 静的メソッド

##### `MD5.toDigest(buffer[, length])`
```
string MD5.toDigest(ByteBuffer buffer[, int length])
```
バッファのMD5ハッシュを計算します。

**引数**:
- `buffer` (ByteBuffer): データ
- `length` (int, オプション): 計算するサイズ

**戻り値**: 32文字の16進数文字列

---

### Blowfish

Blowfish暗号化を行うクラス。

#### コンストラクタ

```
Blowfish(key)
```
Blowfishオブジェクトを作成します。

**引数**:
- `key` (ByteBuffer/string): 暗号化キー

#### メソッド

##### `encrypt(input, output)`
```
void encrypt(ByteBuffer input, ByteBuffer output)
```
データを暗号化します。

**引数**:
- `input` (ByteBuffer): 入力データ（8バイトの倍数）
- `output` (ByteBuffer): 出力バッファ

##### `decrypt(input, output)`
```
void decrypt(ByteBuffer input, ByteBuffer output)
```
データを復号化します。

**引数**:
- `input` (ByteBuffer): 暗号化データ（8バイトの倍数）
- `output` (ByteBuffer): 出力バッファ

---

### IPAddress

IPアドレス（IPv4/IPv6）とポートを表すクラス。

#### コンストラクタ

```
IPAddress([string|array address])
```
IPAddressオブジェクトを作成します。

**引数**:
- `address`: IPアドレス
  - (string): "192.168.0.1:8080" 形式
  - (array): IPv4の場合`[a, b, c, d, port]`、IPv6の場合`[a0, a1, ..., a7, port]`

#### プロパティ

- `port` (int): ポート番号（読み書き可能）
- `[0]`, `[1]`, `[2]`, `[3]` (int): IPv4アドレスの各オクテット（読み取り専用）

#### メソッド

##### `isValid()`
```
bool isValid()
```
有効なIPアドレスかどうかを確認します。

**戻り値**: 有効な場合`true`

##### `isLoopback()`
```
bool isLoopback()
```
ループバックアドレスかどうかを確認します。

**戻り値**: ループバックの場合`true`（127.0.0.1など）

##### `isSameAddress(other)`
```
bool isSameAddress(IPAddress other)
```
IPアドレス部分が同じかどうかを比較します（ポートは無視）。

**引数**:
- `other` (IPAddress): 比較対象

**戻り値**: 同じアドレスの場合`true`

##### `addressHash()`
```
int addressHash()
```
アドレスのハッシュ値を取得します。

**戻り値**: ハッシュ値

##### `getData(buffer)`
```
void getData(ByteBuffer buffer)
```
IPアドレスデータをバイトバッファに書き込みます。

**引数**:
- `buffer` (ByteBuffer): 出力バッファ

##### `setData(buffer)`
```
void setData(ByteBuffer buffer)
```
バイトバッファからIPアドレスデータを読み取ります。

**引数**:
- `buffer` (ByteBuffer): 入力バッファ

#### 静的メソッド

##### `IPAddress.getNetInterfaceInfoList()`
```
array IPAddress.getNetInterfaceInfoList()
```
ネットワークインターフェース情報の一覧を取得します。

**戻り値**: インターフェース情報のテーブルの配列

**テーブルフィールド**:
- `name` (string): インターフェース名
- `flags` (int): フラグ
- `macaddr` (array): MACアドレス（8バイト配列）
- `ipaddr` (array): IPv4アドレス（4要素配列）
- `ipaddr6` (array, オプション): IPv6アドレス（8要素配列）

---

### TCPConnection

TCP接続を扱うクラス。

#### コンストラクタ

```
TCPConnection()
```
TCPConnectionオブジェクトを作成します。

#### メソッド

##### `connect(ipAddress)`
```
void connect(IPAddress ipAddress)
```
指定アドレスに接続します。

**引数**:
- `ipAddress` (IPAddress): 接続先

##### `getState()`
```
int getState()
```
接続状態を取得します。

**戻り値**: 状態コード
- `0`: 切断
- `1`: 接続中
- `2`: 接続完了
- `3`: エラー

##### `write(data[, offset, length])`
```
int write(string|ByteBuffer data[, int offset, int length])
```
データを送信します。

**引数**:
- `data` (string/ByteBuffer): 送信データ
- `offset` (int, オプション): バイトバッファの開始位置
- `length` (int, オプション): 送信サイズ

**戻り値**: 送信したバイト数

##### `setReader(func)`
```
void setReader(closure func)
```
データ受信時のコールバックを設定します。

**引数**:
- `func` (closure): `function(connection, buffer)`形式の関数

**説明**: データを受信すると、`buffer`に受信データが格納されてコールバックが呼ばれます。

##### `setListener(func)`
```
void setListener(closure func)
```
接続イベント時のコールバックを設定します。

**引数**:
- `func` (closure): `function(connection, event)`形式の関数

**イベント種類**:
- 接続完了
- 接続エラー
- 切断

##### `setOption(name, value)`
```
void setOption(string name, value)
```
ソケットオプションを設定します。

**引数**:
- `name` (string): オプション名（"nodelay", "keepalive"など）
- `value`: オプション値

##### `close()`
```
void close()
```
接続を閉じます。

---

### UDPSocket

UDPソケットを扱うクラス。

#### コンストラクタ

```
UDPSocket()
```
UDPSocketオブジェクトを作成します。

#### メソッド

##### `bind(ipAddress)`
```
bool bind(IPAddress ipAddress)
```
指定アドレスにバインドします。

**引数**:
- `ipAddress` (IPAddress): バインドアドレス

**戻り値**: 成功した場合`true`

##### `sendTo(data, ipAddress[, offset, length])`
```
int sendTo(string|ByteBuffer data, IPAddress ipAddress[, int offset, int length])
```
指定アドレスにデータを送信します。

**引数**:
- `data` (string/ByteBuffer): 送信データ
- `ipAddress` (IPAddress): 送信先
- `offset` (int, オプション): バイトバッファの開始位置
- `length` (int, オプション): 送信サイズ

**戻り値**: 送信したバイト数

##### `setReader(func)`
```
void setReader(closure func)
```
データ受信時のコールバックを設定します。

**引数**:
- `func` (closure): `function(socket, buffer, fromAddress)`形式の関数

##### `close()`
```
void close()
```
ソケットを閉じます。

---

### TCPServer

TCPサーバーを扱うクラス。

#### コンストラクタ

```
TCPServer()
```
TCPServerオブジェクトを作成します。

#### メソッド

##### `listen(ipAddress, maxConnections)`
```
bool listen(IPAddress ipAddress, int maxConnections)
```
指定アドレスで接続を待ち受けます。

**引数**:
- `ipAddress` (IPAddress): リッスンアドレス
- `maxConnections` (int): 最大接続数

**戻り値**: 成功した場合`true`

##### `setListener(func)`
```
void setListener(closure func)
```
クライアント接続時のコールバックを設定します。

**引数**:
- `func` (closure): `function(server, connection)`形式の関数

**説明**: 新しいクライアントが接続すると、`TCPConnection`オブジェクトが渡されます。

##### `close()`
```
void close()
```
サーバーを閉じます。

---

### HTTPRequest

HTTP/HTTPSリクエストを送信するクラス。

#### コンストラクタ

```
HTTPRequest()
```
HTTPRequestオブジェクトを作成します。

#### メソッド

##### `setURL(url)`
```
void setURL(string url)
```
リクエストURLを設定します。

**引数**:
- `url` (string): URL（`http://`または`https://`）

##### `setMethod(method)`
```
void setMethod(string method)
```
HTTPメソッドを設定します。

**引数**:
- `method` (string): "GET", "POST", "PUT", "DELETE"など

##### `setHeader(name, value)`
```
void setHeader(string name, string value)
```
HTTPヘッダーを設定します。

**引数**:
- `name` (string): ヘッダー名
- `value` (string): ヘッダー値

##### `setBody(data)`
```
void setBody(string|ByteBuffer data)
```
リクエストボディを設定します。

**引数**:
- `data` (string/ByteBuffer): ボディデータ

##### `send([callback])`
```
void send([closure callback])
```
リクエストを送信します。

**引数**:
- `callback` (closure, オプション): `function(request, response)`形式の関数

**説明**: コールバックを指定した場合は非同期、指定しない場合は同期送信します。

##### `getState()`
```
int getState()
```
リクエストの状態を取得します。

**戻り値**: 状態コード
- `0`: 未送信
- `1`: 送信中
- `2`: 完了
- `3`: エラー

##### `getStatusCode()`
```
int getStatusCode()
```
HTTPステータスコードを取得します。

**戻り値**: ステータスコード（200, 404など）

##### `getResponseHeader(name)`
```
string getResponseHeader(string name)
```
レスポンスヘッダーを取得します。

**引数**:
- `name` (string): ヘッダー名

**戻り値**: ヘッダー値

##### `getResponseBody()`
```
ByteBuffer getResponseBody()
```
レスポンスボディを取得します。

**戻り値**: `ByteBuffer`オブジェクト

##### `abort()`
```
void abort()
```
リクエストを中止します。

---

### SSLContext

SSL/TLSコンテキストを扱うクラス（プラットフォーム依存）。

#### コンストラクタ

```
SSLContext()
```
SSLContextオブジェクトを作成します。

**説明**: 一部のプラットフォームでのみ利用可能です。

---

### SSLConnection

SSL/TLS接続を扱うクラス（プラットフォーム依存）。

#### コンストラクタ

```
SSLConnection([SSLContext context])
```
SSLConnectionオブジェクトを作成します。

**引数**:
- `context` (SSLContext, オプション): SSLコンテキスト

#### メソッド

##### `setHostName(hostname)`
```
void setHostName(string hostname)
```
SNI（Server Name Indication）用のホスト名を設定します。

**引数**:
- `hostname` (string): ホスト名

##### `connect(ipAddress)`
```
void connect(IPAddress ipAddress)
```
SSL/TLS接続を開始します。

**引数**:
- `ipAddress` (IPAddress): 接続先

##### その他のメソッド

`TCPConnection`と同様のメソッド（`getState`, `write`, `setReader`, `setListener`, `close`）を持ちます。

---

## 注意事項

1. **パーミッション**: 多くのファイル操作とネットワーク操作にはパーミッションチェックが行われます。`skSetPermissionMap()`で適切な権限を設定してください。

2. **非同期処理**: `*Async`関数や非同期コールバックはバックグラウンドスレッドで実行されます。

3. **ByteBuffer**: `pos`と`size`を適切に管理する必要があります。`pos`が`size`を超えるとエラーが発生します。

4. **ネットワーク**: TCPConnectionやUDPSocketはイベント駆動型です。コールバックを設定してデータを受信します。

5. **圧縮**: ZSTDはzlibより高速で圧縮率も良好です。大容量データにはZSTDの使用を推奨します。

6. **プラットフォーム依存**: SSL/TLS機能、一部のシステム情報取得機能はプラットフォームによって利用できない場合があります。
