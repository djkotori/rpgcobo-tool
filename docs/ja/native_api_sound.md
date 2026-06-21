# SakanaGL Sound API リファレンス

このドキュメントは、SakanaGL のサウンド API (`core/api/ssapi_sound.cpp`) に関するリファレンスです。

## 概要

SakanaGL Sound API は、波形データの管理、オーディオ再生、3Dサウンド、ミキシング、リバーブエフェクト、ストリーミング再生などのオーディオ機能を提供します。Ogg Vorbis デコーダーも含まれています。

---

## 目次

- [SoundContext](#soundcontext) - サウンドコンテキスト
- [SoundMixer](#soundmixer) - サウンドミキサー
- [SoundSource](#soundsource) - サウンドソース
- [WaveBuffer](#wavebuffer) - 波形データバッファ
- [VorbisDecoder](#vorbisdecoder) - Ogg Vorbisデコーダー
- [Reverb](#reverb) - リバーブエフェクト
- [Source3DParam](#source3dparam) - 3Dサウンドパラメータ
- [SoundRenderInterface](#soundrenderinterface) - カスタムサウンドレンダーインターフェース
- [パラメータ定数](#パラメータ定数)
- [使用例](#使用例)

---

## SoundContext

サウンドシステムの中核となるコンテキストです。ミキサー、サウンドソース、リバーブを作成・管理します。

### 静的メソッド

##### `SoundContext.createContext(flags)`
サウンドコンテキストを作成します。

**引数**:
- `flags` (int): 初期化フラグ

**戻り値**: SoundContext

### インスタンスメソッド

##### `createMixer([mix3d])`
ミキサーを作成します。

**引数**:
- `mix3d` (int, オプション): 3Dミキシングフラグ（デフォルト: 0）

**戻り値**: SoundMixer

##### `createWaveSoundSource(WaveBuffer)`
波形データからサウンドソースを作成します。

**引数**:
- `WaveBuffer`: 波形データバッファ

**戻り値**: SoundSource

##### `createStreamSoundSource(freq, ch, fmt, ringbufsize)`
ストリーミング再生用のサウンドソースを作成します。

**引数**:
- `freq` (int): サンプリング周波数（Hz）
- `ch` (int): チャンネル数（1=モノラル、2=ステレオ）
- `fmt` (int): フォーマット（`SK_SND_FORMAT_*`）
- `ringbufsize` (int): リングバッファサイズ

**戻り値**: SoundSource

##### `createCustomSoundSource(SoundRenderInterface)`
カスタムレンダーインターフェースを使用したサウンドソースを作成します。

**引数**:
- `SoundRenderInterface`: レンダーインターフェース

**戻り値**: SoundSource

##### `createReverb(WaveBuffer)`
リバーブエフェクトを作成します。

**引数**:
- `WaveBuffer`: インパルス応答データ

**戻り値**: Reverb

##### `gc()`
終了したサウンドソースをガベージコレクションします。

**説明**: 再生終了（`SK_SND_DONE`状態）のサウンドソースを解放します。定期的に呼び出すことでメモリリークを防ぎます。

##### `setReverb(index, Reverb | null)`
リバーブスロットを設定します。

**引数**:
- `index` (int): リバーブスロット（0-3）
- `Reverb | null`: リバーブオブジェクト（nullで解除）

**戻り値**: 成功した場合true

##### `scroll(Vector3D)`
全3Dサウンドソースをスクロールします。

**引数**:
- `Vector3D`: オフセットベクトル

### パラメータアクセス

SoundContext は以下のパラメータに `[SK_SND_*]` でアクセスできます:

- `[SK_SND_LISTENER]`: リスナー位置・方向（Matrix | Camera）
- `[SK_SND_MASTEFX]`: マスターエフェクトパラメータ（Array、16要素）

**例**:
```javascript
ctx[SK_SND_LISTENER] = camera;
```

---

## SoundMixer

サウンドミキサーです。複数のサウンドソースを混合して出力します。

### プロパティ

**読み取り専用**:
- `ctx` (SoundContext): 所属するコンテキスト

### メソッド

##### `connect()`
ミキサーをコンテキストに接続します。

**戻り値**: bool - 成功した場合true

##### `disconnect()`
ミキサーをコンテキストから切断します。

**戻り値**: bool - 成功した場合true

##### `findDuplicatedSound(id[, pan])`
同じIDとパンを持つ再生中のサウンドソースを検索します（重複再生抑制用）。

**引数**:
- `id` (int): サウンドソースID
- `pan` (float, オプション): パン値（-1.0～1.0、デフォルト: 0）

**戻り値**: SoundSource | null

**説明**: 同じ音が重複して再生されるのを防ぐために使用します。再生開始から8192サンプル以内で、最も近いパン値を持つソースを返します。

### パラメータアクセス

SoundMixer は以下のパラメータに `[SK_SND_*]` でアクセスできます:

**設定可能**:
- `[SK_SND_GAIN]` (float): ゲイン（音量）
- `[SK_SND_PAN]` (float): パン（-1.0～1.0）
- `[SK_SND_PITCH]` (float): ピッチ
- `[SK_SND_MIX3D]` (int): 3Dミキシングモード
- `[SK_SND_PANMODEL]` (int): パンモデル
- `[SK_SND_SEND]` (int): センド先
- `[SK_SND_INSEFX]` (Array): インサートエフェクトパラメータ（16要素）
- `[SK_SND_SENDEFX]` (Array): センドエフェクトパラメータ（16要素）
- `[SK_SND_POSITION]` (Matrix): 3D位置

**読み取り専用**:
- `[SK_SND_MUTECOUNT]` (int): ミュートカウント

---

## SoundSource

サウンドソース（再生可能な音源）です。

### プロパティ

**読み書き**:
- `id` (int): サウンドID（ユーザー定義）

**読み取り専用**:
- `ctx` (SoundContext): 所属するコンテキスト
- `wav` (WaveBuffer): 波形データ（波形ソースの場合）

### メソッド

##### `play(SoundMixer)`
サウンドを再生します。

**引数**:
- `SoundMixer`: 再生先ミキサー

**戻り値**: bool - 成功した場合true

##### `stop()`
再生を停止します。

**戻り値**: int - 停止結果コード

##### `getState()`
再生状態を取得します。

**戻り値**: int - 状態コード（`SK_SND_DONE`, `SK_SND_PLAYING`, `SK_SND_PAUSED`）

### パラメータアクセス

SoundSource は以下のパラメータに `[SK_SND_*]` でアクセスできます:

**設定可能**:
- `[SK_SND_GAIN]` (float): ゲイン（音量）
- `[SK_SND_PAN]` (float): パン（-1.0～1.0）
- `[SK_SND_PITCH]` (float): ピッチ
- `[SK_SND_MIX3D]` (int): 3Dミキシングモード
- `[SK_SND_PANMODEL]` (int): パンモデル
- `[SK_SND_SEND]` (int): センド先
- `[SK_SND_LOOP]` (bool): ループフラグ
- `[SK_SND_PAUSE]` (bool): ポーズフラグ
- `[SK_SND_CALC3D]` (bool): 3D計算フラグ
- `[SK_SND_POSITION]` (Matrix): 3D位置
- `[SK_SND_INSEFX]` (Array): インサートエフェクトパラメータ（16要素）
- `[SK_SND_SENDEFX]` (Array): センドエフェクトパラメータ（16要素）
- `[SK_SND_SOURCE3D]` (Source3DParam): 3Dサウンドパラメータ
- `[SK_SND_PUSHSTREAM]` (ByteBuffer): ストリームデータプッシュ（ストリームソース専用）

**読み取り専用**:
- `[SK_SND_BUFREMAINING]` (int): 残バッファサイズ
- `[SK_SND_MUTECOUNT]` (int): ミュートカウント
- `[SK_SND_PCMTIME]` (int): 再生位置（サンプル数）

---

## WaveBuffer

PCM波形データを保持するバッファです。

### 静的メソッド

##### `WaveBuffer.load(ByteBuffer)`
ByteBufferから波形データをロードします（WAV、AIFF等のフォーマットを自動判別）。

**引数**:
- `ByteBuffer`: 波形ファイルデータ

**戻り値**: WaveBuffer | null

##### `WaveBuffer.create(ByteBuffer, freq, ch, fmt, length)`
生のPCMデータから波形バッファを作成します。

**引数**:
- `ByteBuffer`: PCMデータ
- `freq` (int): サンプリング周波数（Hz）
- `ch` (int): チャンネル数
- `fmt` (int): フォーマット
- `length` (int): データ長

**戻り値**: WaveBuffer

### プロパティ

**読み取り専用**:
- `length` (int): PCMサンプル数
- `totaltime` (float): 総再生時間（秒）
- `freq` (int): サンプリング周波数（Hz）
- `ch` (int): チャンネル数（1=モノラル、2=ステレオ）
- `format` (int): フォーマット

### メソッド

##### `decode([ByteBuffer[, pos[, len]]])`
PCMデータをfloat配列にデコードします。

**引数**:
- `ByteBuffer` (オプション): 出力先バッファ（省略時は新規作成）
- `pos` (int, オプション): 開始位置（サンプル数、デフォルト: 0）
- `len` (int, オプション): デコード長（サンプル数、デフォルト: 全体）

**戻り値**: ByteBuffer - float配列（4バイト/サンプル）

##### `decode16([ByteBuffer[, pos[, len]]])`
PCMデータを16bit整数配列にデコードします。

**引数**:
- `ByteBuffer` (オプション): 出力先バッファ
- `pos` (int, オプション): 開始位置
- `len` (int, オプション): デコード長

**戻り値**: ByteBuffer - short配列（2バイト/サンプル）

---

## VorbisDecoder

Ogg Vorbis ファイルをデコードするクラスです。バックグラウンドデコードに対応しています。

### コンストラクタ

```javascript
VorbisDecoder(ByteBuffer)
```

**引数**:
- `ByteBuffer`: Ogg Vorbisファイルデータ

### プロパティ

**読み取り専用**:
- `pcmlength` (int): PCMサンプル数
- `format` (int): フォーマット
- `freq` (int): サンプリング周波数（Hz）
- `ch` (int): チャンネル数

### メソッド

##### `getComments()`
Vorbisコメント（メタデータ）を取得します。

**戻り値**: Array - コメント文字列の配列

##### `close()`
デコーダーを閉じます。

##### `setRegion(start, end, looppoint)`
デコード領域とループポイントを設定します。

**引数**:
- `start` (int, オプション): 開始位置（サンプル数、デフォルト: 0）
- `end` (int, オプション): 終了位置（サンプル数、デフォルト: -1=最後まで）
- `looppoint` (int, オプション): ループポイント（サンプル数、デフォルト: -1=なし）

##### `startDecode(length)`
バックグラウンドデコードを開始します。

**引数**:
- `length` (int): デコード長（サンプル数）

**戻り値**: bool - 開始成功した場合true

##### `isDecoding()`
デコード中かどうかを判定します。

**戻り値**: bool

##### `getResult(ByteBuffer)`
デコード結果を取得します（ByteBuffer内容と入れ替え）。

**引数**:
- `ByteBuffer`: 結果受け取り用バッファ

**戻り値**: bool - 結果があった場合true

**説明**: バッファの内容を高速に入れ替えます（メモリコピーなし）。

##### `getResultWave()`
デコード結果をWaveBufferとして取得します。

**戻り値**: WaveBuffer | null

##### `tell()`
現在のデコード位置を取得します。

**戻り値**: int - サンプル位置

---

## Reverb

リバーブ（残響）エフェクトです。インパルス応答を使用したコンボリューションリバーブです。

### 説明

Reverbオブジェクトは `SoundContext.createReverb()` で作成します。コンストラクタでの直接作成はできません。

---

## Source3DParam

3Dサウンドのパラメータを管理するクラスです。

### コンストラクタ

```javascript
Source3DParam()
```

### フィールド

**読み書き**:
- `conein` (float): 内側コーン角度（ラジアン）
- `coneout` (float): 外側コーン角度（ラジアン）
- `conegain` (float): コーンゲイン
- `maxdist` (float): 最大距離
- `refdist` (float): 参照距離
- `rolloff` (float): ロールオフ係数
- `distmodel` (int): 距離モデル

---

## SoundRenderInterface

カスタムサウンドレンダリング用のインターフェースクラスです。

### 説明

このインターフェースを実装したクラスを `SoundContext.createCustomSoundSource()` に渡すことで、独自のサウンド生成ロジックを実装できます。

---

## パラメータ定数

サウンドパラメータへのアクセスに使用する定数です。

### 共通パラメータ

- `SK_SND_GAIN`: ゲイン（音量、float）
- `SK_SND_PAN`: パン（-1.0～1.0、float）
- `SK_SND_PITCH`: ピッチ（float）
- `SK_SND_LOOP`: ループフラグ（bool）
- `SK_SND_PAUSE`: ポーズフラグ（bool）
- `SK_SND_MIX3D`: 3Dミキシングモード（int）
- `SK_SND_PANMODEL`: パンモデル（int）
- `SK_SND_SEND`: センド先（int）
- `SK_SND_POSITION`: 3D位置（Matrix）
- `SK_SND_LISTENER`: リスナー位置・方向（Matrix）
- `SK_SND_CALC3D`: 3D計算フラグ（bool）
- `SK_SND_SOURCE3D`: 3Dサウンドパラメータ（Source3DParam）

### エフェクトパラメータ

- `SK_SND_INSEFX`: インサートエフェクト（Array、16要素）
- `SK_SND_SENDEFX`: センドエフェクト（Array、16要素）
- `SK_SND_MASTEFX`: マスターエフェクト（Array、16要素）

### ストリームパラメータ

- `SK_SND_PUSHSTREAM`: ストリームデータプッシュ（ByteBuffer）

### 読み取り専用パラメータ

- `SK_SND_BUFREMAINING`: 残バッファサイズ（int）
- `SK_SND_MUTECOUNT`: ミュートカウント（int）
- `SK_SND_PCMTIME`: 再生位置サンプル数（int）

### 再生状態

- `SK_SND_DONE`: 再生終了
- `SK_SND_PLAYING`: 再生中
- `SK_SND_PAUSED`: 一時停止中

---

## 注意事項

1. **メモリ管理**: `ctx.gc()` を定期的に呼び出して、終了したサウンドソースを解放してください。
2. **ストリーム供給**: ストリームソースは `SK_SND_BUFREMAINING` を監視し、データ不足を避けてください。
3. **3Dサウンドの位置**: リスナー（カメラ）と音源の位置は毎フレーム更新してください。
4. **リバーブのコスト**: リバーブは計算コストが高いため、送信するソース数を制限してください。
5. **ミキサーの切断**: ミキサーを `disconnect()` すると、再生中の全サウンドが停止します。
6. **パラメータのスレッドセーフ性**: パラメータ取得・設定は内部でロックされますが、頻繁な変更は避けてください。
