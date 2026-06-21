# SakanaGL グローバルAPI リファレンス

このドキュメントは、`ssapi_global.cpp`で定義されているSakanaGLのグローバル機能APIのリファレンスです。

## 目次

- [時間関数](#時間関数)
- [環境情報関数](#環境情報関数)
- [システム制御関数](#システム制御関数)
- [ガベージコレクション関数](#ガベージコレクション関数)
- [インターバル・タイマー関数](#インターバルタイマー関数)
- [アドオン・パーミッション](#アドオンパーミッション)
- [フレーム制御](#フレーム制御)
- [基本クラス](#基本クラス)
  - [StringBuffer](#stringbuffer-クラス)
  - [SortTable](#sorttable-クラス)
  - [MessageQueue](#messagequeue-クラス)
  - [WorkerThread](#workerthread-クラス)
  - [future](#future-クラス)
  - [bitvec](#bitvec-クラス)
  - [SKProfiler](#skprofiler-クラス-windows専用)

---

## 時間関数

### skGetTime([baseTime])
現在時刻をミリ秒単位で取得します。
- **引数**:
  - `baseTime` - (オプション) 基準時刻からの相対時刻を取得
- **戻り値**: 整数（ミリ秒）
- **説明**: 引数なしの場合、アプリケーション起動時からの経過時間を返します

### skSleep(milliseconds)
指定時間スリープします。**このメソッドでは他のスレッドに処理が回らず、sk処理系全てがスリープします。基本的には使うべきではないでしょう。**
- **引数**:
  - `milliseconds` - スリープ時間（ミリ秒）、省略時は1ms
- **戻り値**: なし
- **説明**: スレッドをブロックして指定時間待機します

---

## 環境情報関数

### skGetBinBaseDir()
バイナリベースディレクトリを取得します。
- **戻り値**: 文字列（ディレクトリパス）

### skGetAddonDir()
アドオンディレクトリを取得します。
- **戻り値**: 文字列（ディレクトリパス）

### skGetCacheDir()
キャッシュディレクトリを取得します。
- **戻り値**: 文字列（ディレクトリパス）

### skGetDataDir()
データディレクトリを取得します。
- **戻り値**: 文字列（ディレクトリパス）

### skGetDocumentDir()
ドキュメントディレクトリを取得します。
- **戻り値**: 文字列（ディレクトリパス）

### skGetCurrentDir()
カレントディレクトリを取得します。
- **戻り値**: 文字列（ディレクトリパス）

### skGetOSName()
OS名を取得します。
- **戻り値**: 文字列（OS名）

### skGetOSVersion()
OSバージョンを取得します。
- **戻り値**: 文字列（バージョン情報）

### skGetHostName()
ホスト名を取得します。
- **戻り値**: 文字列（ホスト名）

### skGetProcessID()
プロセスIDを取得します。
- **戻り値**: 整数（プロセスID）

### skGetVersion()
SakanaGLのバージョンを取得します。
- **戻り値**: 整数（バージョン番号）

### skGetCodebase()
コードベースパスを取得します。
- **戻り値**: 文字列（コードベースパス）

### skGetMainSK()
メインスクリプトファイル名を取得します。
- **戻り値**: 文字列（メインスクリプト名）

### skGetLanguage()
システム言語を取得します。
- **戻り値**: 文字列（言語コード）

### skGetWorkerID()
ワーカースレッドIDを取得します。
- **戻り値**: 整数（ワーカーID、メインスレッドは0）

### skGetSystemInfo()
システム情報を取得します。
- **戻り値**: テーブル
  - `cpuname` - CPU名
  - `apname` - アプリケーション名
  - `cores` - コア数
  - `cpuload` - CPU負荷（%）
  - `totalmem` - 全メモリ（KB）
  - `freemem` - 空きメモリ（KB）
  - `processmem` - プロセスメモリ（KB）

---

## システム制御関数

### skExit([exitCode], [message])
アプリケーションを終了します。
- **引数**:
  - `exitCode` - (オプション) 終了コード
  - `message` - (オプション) 終了メッセージ
- **戻り値**: 中断フラグ
- **説明**: アプリケーションの実行を停止し、終了処理を開始します

### skRestart([argsArray])
アプリケーションを再起動します。
- **引数**:
  - `argsArray` - (オプション) 新しい起動引数の配列
- **戻り値**: なし
- **注意**: 配列に`"-main"`を含めることはできません

### skCatchSignal(signal1, signal2, ...)
シグナルをキャッチします。
- **引数**: シグナル番号の可変長引数
- **戻り値**: なし

---

## ガベージコレクション関数

### skSetGCLevel([level])
ガベージコレクションレベルを設定します。
- **引数**:
  - `level` - (オプション) GCレベル（0-2、デフォルト: 最大レベル）
- **戻り値**: なし

### skCollectGarbage([generation])
ガベージコレクションを実行します。
- **引数**:
  - `generation` - (オプション) GC世代（0-2、デフォルト: 全世代）
- **戻り値**: なし
- **説明**: 明示的にGCを実行してメモリを解放します

---

## インターバル・タイマー関数

### setInterval(closure, milliseconds)
指定間隔で関数を繰り返し実行します（JavaScript互換）。
- **引数**:
  - `closure` - 実行する関数
  - `milliseconds` - 実行間隔（ミリ秒）
- **戻り値**: 整数（インターバルID）
- **説明**: 
  - 関数は`closure(deltaTime, ...)`の形式で呼ばれます
  - `undefined`を返すと自動的に停止します

### setTimeout(closure, milliseconds)
指定時間後に1回だけ関数を実行します（JavaScript互換）。
- **引数**:
  - `closure` - 実行する関数
  - `milliseconds` - 待機時間（ミリ秒）
- **戻り値**: 整数（タイマーID）

### clearInterval(intervalID)
インターバルまたはタイムアウトを停止します（JavaScript互換）。
- **引数**:
  - `intervalID` - インターバル/タイマーID
- **戻り値**: 真偽値（成功したか）

### executeInterval(deltaTime)
登録されたインターバルを実行します。
- **引数**:
  - `deltaTime` - 経過時間（ミリ秒）
- **戻り値**: なし
- **説明**: フレームループ内で呼び出してインターバルを処理します

### getIntervals()
現在登録されているインターバルの情報を取得します。
- **戻り値**: 配列
  - 各要素は`[closure, id, isLoop, time]`のタプル

---

## アドオン・パーミッション

### skLoadAddon(addonName)
アドオンをロードします。
- **引数**:
  - `addonName` - アドオン名（文字列）
- **戻り値**: 真偽値（成功したか）
- **説明**: パーミッションが必要です

### skSetPermissionMap(permissionTable, templateArgs)
パーミッションマップを設定します。
- **引数**:
  - `permissionTable` - パーミッション定義テーブル
  - `templateArgs` - テンプレート引数（ディレクトリ情報など）
- **戻り値**: なし
- **説明**: 
  - boot.skから1回だけ呼び出し可能
  - 以降のパーミッションチェックに使用されます

### skGetPermission(category, target, [defaultValue])
パーミッションを取得します。
- **引数**:
  - `category` - カテゴリ（文字列）
  - `target` - 対象（文字列）
  - `defaultValue` - (オプション) デフォルト値（デフォルト: -1）
- **戻り値**: 整数（パーミッション値）

---

## フレーム制御

### skGetFrameFlag()
フレームフラグを取得します。
- **戻り値**: 整数（フラグ値）

### skSetFrameFlag(flag)
フレームフラグを設定します。
- **引数**:
  - `flag` - フラグ値（整数）
- **戻り値**: なし

### skSetTemporalAllocator(memorySize)
テンポラリアロケータのサイズを設定します。
- **引数**:
  - `memorySize` - メモリサイズ（バイト、最大256MB）
- **戻り値**: なし

---

## 基本クラス

### StringBuffer クラス

文字列を効率的に構築するためのバッファクラス。

#### コンストラクタ

```sk
StringBuffer()
```

#### メソッド

##### clear()
バッファをクリアします。
- **戻り値**: 自身

##### len()
バッファの長さを返します。
- **戻り値**: 整数（文字数）

##### append(value)
値を追加します。
- **引数**: `value` - 文字列、整数、またはStringBuffer
- **戻り値**: 自身

##### printf(format, ...)
書式付きで文字列を追加します。
- **引数**:
  - `format` - フォーマット文字列
  - `...` - 可変長引数
- **戻り値**: 整数（追加された文字数）

##### compile([sourceName], [persistent])
バッファの内容をコンパイルします。
- **引数**:
  - `sourceName` - (オプション) ソース名
  - `persistent` - (オプション) 永続化するか
- **戻り値**: コンパイル済みクロージャ

##### toByteBuffer()
ByteBufferに変換します。
- **戻り値**: ByteBufferインスタンス

#### メタメソッド

- `_concat` - 文字列連結（`sb1 + value`）
- `_tostring` - 文字列に変換
- `_newslot` - インデックスに文字を挿入（`sb[index] = char`）

---

### SortTable クラス

スコア付きソートテーブル。スコアと参照のペアを管理し、高速にソートします。

#### コンストラクタ

```sk
SortTable([keyType], [descending])
```

- **引数**:
  - `keyType` - (オプション) `SS_INTEGER`または`SS_FLOAT`（デフォルト: `SS_FLOAT`）
  - `descending` - (オプション) 降順か（デフォルト: false=昇順）

#### フィールド

- `size` - (読み取り専用) 要素数
- `desc` - (読み取り専用) 降順モードか
- `dirty` - (読み取り専用) ソートが必要か

#### メソッド

##### clear()
すべての要素をクリアします。
- **戻り値**: なし

##### append(score, reference)
要素を追加します。
- **引数**:
  - `score` - スコア（整数または浮動小数点数）
  - `reference` - 参照オブジェクト
- **戻り値**: なし

##### remove(reference)
参照で検索して削除します。
- **引数**: `reference` - 削除する参照
- **戻り値**: 真偽値（見つかったか）
- **注意**: ソート結果には影響しません

##### update(reference, newScore)
参照で検索してスコアを更新します。
- **引数**:
  - `reference` - 更新する参照
  - `newScore` - 新しいスコア
- **戻り値**: 真偽値（見つかったか）

##### sort()
要素をソートします。
- **戻り値**: なし
- **説明**: 自動的に呼ばれますが、明示的にも呼べます

##### toArray(array)
ソート済み配列を作成します。
- **引数**: `array` - 出力先の配列
- **戻り値**: 配列（参照のみ、スコアを除く）

##### loadArray(array)
配列からデータをロードします。
- **引数**: `array` - `[score, ref, score, ref, ...]`形式の配列
- **戻り値**: なし

##### indexOfScore(score)
スコアに一致する最初の要素のインデックスを返します。
- **引数**: `score` - 検索するスコア（完全一致）
- **戻り値**: 整数（インデックス、または-1）

##### indexOfRef(reference)
参照に一致する要素のインデックスを返します。
- **引数**: `reference` - 検索する参照
- **戻り値**: 整数（インデックス、または-1）

##### adjustIndexR(index)
同一スコアグループの終端インデックスを返します。
- **引数**: `index` - 基準インデックス
- **戻り値**: 整数（終端インデックス）
- **説明**: ランキング表示用

#### メタメソッド

- `_newslot` - `st[score] = ref`でappendと同じ動作

---

### future クラス

非同期処理の結果を表す未来値。OSネイティブスレッドを使用した圧縮／展開処理の並列化などで使用されます。

#### メソッド

##### tryget([milliseconds])
結果の取得を試みます。
- **引数**: `milliseconds` - (オプション) タイムアウト時間（デフォルト: 0）
- **戻り値**: 
  - 結果の値（取得成功時）
  - undefined（まだ完了していない場合）

##### get()
結果を取得します（完了まで待機）。
- **戻り値**: 
  - 結果の値（完了時）
  - undefined（失敗時）

---

### bitvec クラス

ビットベクター。大量のフラグを効率的に管理します。

#### メソッド

##### setregion(index, length, [value])
指定範囲のビットを設定します。
- **引数**:
  - `index` - 開始インデックス
  - `length` - 長さ
  - `value` - (オプション) 値（0または1、デフォルト: 1）
- **戻り値**: なし

##### isanyset(index, length)
指定範囲にセットされたビットがあるかチェックします。
- **引数**:
  - `index` - 開始インデックス
  - `length` - 長さ
- **戻り値**: 整数（1=あり、0=なし）

##### searchspace(length, [startIndex])
指定長の連続した空きスペースを検索します。
- **引数**:
  - `length` - 必要な長さ
  - `startIndex` - (オプション) 検索開始位置
- **戻り値**: 整数（見つかった位置、または-1）

##### shrink()
末尾の0ビットを削除してサイズを縮小します。
- **戻り値**: なし

##### last()
最後にセットされているビットのインデックスを返します。
- **戻り値**: 整数（インデックス、または-1）

#### メタメソッド

- `_get` - ビットを取得（`bv[index]`）
- `_set` - ビットを設定（`bv[index] = value`）

---

### SKProfiler クラス (Windows専用)

chrome://tracing/で表示可能なプロファイルログを出力するプロファイラ。

#### メソッド

##### start()
プロファイリングを開始します。
- **戻り値**: なし
- **説明**: 別スレッドで定期的にスタックトレースを記録します

##### stop()
プロファイリングを停止します。
- **戻り値**: なし

##### write(fileStream)
プロファイル結果をファイルに書き出します。
- **引数**: `fileStream` - 書き込み先のFileStreamインスタンス
- **戻り値**: なし
- **説明**: JSON形式でトレースイベントとスタックフレームを出力します

#### 使用例

```sk
local profiler = SKProfiler();
profiler.start();
// ... プロファイリングしたい処理 ...
profiler.stop();

local fs = FileStream("profile.json", "w");
profiler.write(fs);
fs.close();
```

その後、chrome://tracing/ または https://www.speedscope.app/ で開きます。

---

## 注意事項

### インターバル
- WeakRefで登録した場合、参照が切れると自動的に削除されます
- 関数が`undefined`を返すと自動停止します
- 例外が発生すると自動停止してエラーを出力します

### パーミッション
- `skSetPermissionMap`はboot.skから1回だけ呼び出し可能です
- その後はパーミッションマップは変更できません
- globパターンとテンプレート展開をサポートします
