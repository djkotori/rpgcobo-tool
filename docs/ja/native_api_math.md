# SakanaGL Math API リファレンス

`core/api/ssapi_math.cpp`で定義されているSakanaGLの数学・座標計算関連APIのリファレンスドキュメントです。

3D座標計算、ベクトル演算、行列変換、四元数、カメラ、衝突判定など、3Dグラフィックスやゲーム開発に必要な数学機能を提供します。

---

## 目次

1. [Math（数学関数）](#math数学関数)
2. [クラス](#クラス)
   - [Random](#random)
   - [Vector3D](#vector3d)
   - [Quaternion](#quaternion)
   - [Plane](#plane)
   - [Matrix](#matrix)
   - [Rect2D](#rect2d)
   - [Rect3D](#rect3d)
   - [Transform](#transform)
   - [TransformTimeline](#transformtimeline)
   - [Camera](#camera)
   - [bigint](#bigint)

---

## Math（数学関数）

数学関数は`Math`テーブルに格納されています。

### 定数

```javascript
Math.PI      // 円周率（約3.14159）
Math.DTOR    // 度→ラジアン変換係数（PI / 180）
Math.RTOD    // ラジアン→度変換係数（180 / PI）
Math.PI2     // 円周率×2
Math.HPI     // 円周率÷2
```

### 基本数学関数

#### `Math.abs(value)`
絶対値を返します。

**引数**:
- `value` (int/float): 入力値

**戻り値**: 絶対値

#### `Math.sqrt(value)`
平方根を返します。

**引数**:
- `value` (float): 入力値

**戻り値**: 平方根

#### `Math.saturate(value)`
値を0～1の範囲にクランプします。

**引数**:
- `value` (float): 入力値

**戻り値**: 0～1の範囲にクランプされた値

#### `Math.sign(value)`
符号を返します（-1, 0, 1）。

**引数**:
- `value` (int/float): 入力値

**戻り値**: -1（負）、0（ゼロ）、1（正）

### 三角関数

#### `Math.sin(rad)`, `Math.cos(rad)`, `Math.tan(rad)`
三角関数。

**引数**:
- `rad` (float): ラジアン

**戻り値**: 三角関数の値

#### `Math.asin(value)`, `Math.acos(value)`, `Math.atan(value)`
逆三角関数。

**引数**:
- `value` (float): 入力値

**戻り値**: ラジアン

**説明**: `asin`と`acos`は範囲外の値（-1～1）を自動的にクランプします。

#### `Math.atan2(y, x)`
2引数版のアークタンジェント。

**引数**:
- `y` (float): Y成分
- `x` (float): X成分

**戻り値**: ラジアン（-π～π）

### 対数・指数関数

#### `Math.log(value)`, `Math.log2(value)`, `Math.log10(value)`
対数関数（自然対数、底2、底10）。

**引数**:
- `value` (float): 入力値

**戻り値**: 対数値

#### `Math.logn(value, base)`
任意の底の対数。

**引数**:
- `value` (float): 入力値
- `base` (float): 底

**戻り値**: 対数値

#### `Math.exp(value)`, `Math.exp2(value)`
指数関数（e^x、2^x）。

**引数**:
- `value` (float): 指数

**戻り値**: 指数値

#### `Math.pow(base, exp)`
累乗計算。

**引数**:
- `base` (float): 底
- `exp` (float): 指数

**戻り値**: base^exp

### 丸め関数

#### `Math.floor(value)`, `Math.ceil(value)`, `Math.round(value)`
丸め関数（切り捨て、切り上げ、四捨五入）。

**引数**:
- `value` (float): 入力値

**戻り値**: 丸められたfloat値

#### `Math.ifloor(value)`, `Math.iceil(value)`, `Math.iround(value)`
整数として丸めます。

**引数**:
- `value` (float): 入力値

**戻り値**: 丸められたint値

#### `Math.floor2(value)`
2の累乗で切り捨て。

**引数**:
- `value` (float): 入力値

**戻り値**: 2の累乗で切り捨てられた値

### 最大・最小・範囲

#### `Math.max(value1, value2, ...)`
最大値を返します（可変長引数）。

**引数**:
- `value1, value2, ...` (int/float): 比較する値

**戻り値**: 最大値

#### `Math.min(value1, value2, ...)`
最小値を返します（可変長引数）。

**引数**:
- `value1, value2, ...` (int/float): 比較する値

**戻り値**: 最小値

#### `Math.clamp(value, min, max)`
値を指定範囲にクランプします。

**引数**:
- `value` (int/float): 入力値
- `min` (int/float): 最小値
- `max` (int/float): 最大値

**戻り値**: クランプされた値

### 補間

#### `Math.lerp(a, b, t)`
線形補間。

**引数**:
- `a` (float): 開始値
- `b` (float): 終了値
- `t` (float): 補間係数（0～1）

**戻り値**: 補間された値（a + (b-a)*t）

#### `Math.lerpcolor(color1, color2, t)`
色の線形補間。

**引数**:
- `color1` (int): 開始色（RGBA形式）
- `color2` (int): 終了色（RGBA形式）
- `t` (float): 補間係数（0～1）

**戻り値**: 補間された色（int）

### ビット演算

#### `Math.shift(value, shift)`
ビットシフト。

**引数**:
- `value` (int): 値
- `shift` (int): シフト量（正：左シフト、負：右シフト）

**戻り値**: シフトされた値

#### `Math.bitcount(value)`
セットされているビット数を返します。

**引数**:
- `value` (int): 値

**戻り値**: 1になっているビットの数

#### `Math.pot(value)`
次の2の累乗を返します。

**引数**:
- `value` (int): 入力値

**戻り値**: value以上の最小の2の累乗

#### `Math.msb(value)`
最上位ビットの位置を返します。

**引数**:
- `value` (int): 値

**戻り値**: 最上位ビットのインデックス

#### `Math.lsb(value)`
最下位ビットの位置を返します。

**引数**:
- `value` (int): 値

**戻り値**: 最下位ビットのインデックス

### その他

#### `Math.mod2(value, min, max)`
範囲内にループする剰余。

**引数**:
- `value` (float): 値
- `min` (float): 最小値
- `max` (float): 最大値

**戻り値**: min～maxの範囲にループされた値

#### `Math.digit(value, precision)`
指定精度に丸めます。

**引数**:
- `value` (float): 値
- `precision` (int): 精度

**戻り値**: 丸められた値

#### `Math.vtohp(x, y, z)` / `Math.vtohp(vector)` / `Math.vtohp(array)`
ベクトルから方位角・仰角を計算します。

**引数**:
- `x, y, z` (float): ベクトル成分
- または `vector` (Vector3D): ベクトル
- または `array` (array): `[x, y, z]`の配列

**戻り値**: `[heading, pitch]`のタプル（ラジアン）

#### `Math.length(...values)`
複数の値から長さを計算します。

**引数**:
- `...values` (float): 各成分の値

**戻り値**: `sqrt(sum(values))`

---

## クラス

### Random

疑似乱数生成器（Xorshift）。

#### コンストラクタ

```javascript
Random([seed[, warmup]])
```

**引数**:
- `seed` (int, オプション): シード値（省略時は現在時刻）
- `warmup` (int, オプション): ウォームアップ回数

#### フィールド

- `x`, `y`, `z`, `w` (int): 内部状態（読み取り専用）

#### メソッド

##### `setSeed(seed[, warmup])`
シード値を設定します。

**引数**:
- `seed` (int): シード値
- `warmup` (int, オプション): ウォームアップ回数

##### `next([bits])`
ランダムビットを生成します。

**引数**:
- `bits` (int, オプション): ビット数（デフォルト: 24）

**戻り値**: ランダムな整数

##### `nexti([min,] max)`
整数範囲のランダム値を生成します。

**引数**:
- `min` (int, オプション): 最小値（省略時: 0）
- `max` (int): 最大値（**含まない**）

**戻り値**: min以上max未満のランダムな整数

##### `nextf([min,] max)`
浮動小数点範囲のランダム値を生成します。

**引数**:
- `min` (float, オプション): 最小値（省略時: 0.0）
- `max` (float, オプション): 最大値（省略時: 1.0）

**戻り値**: min以上max未満のランダムなfloat

##### `crypt(buffer[, length])`
バッファを乱数でXOR暗号化します。

**引数**:
- `buffer` (ByteBuffer): 暗号化するバッファ
- `length` (int, オプション): 暗号化する長さ

##### `choose(value1, value2, ...)`
引数からランダムに1つ選びます。

**引数**:
- `value1, value2, ...`: 選択肢

**戻り値**: ランダムに選ばれた値

##### `choosea(array)`
配列の要素からランダムに1つ選びます。

**引数**:
- `array` (array): 配列

**戻り値**: ランダムに選ばれた要素

#### 呼び出し演算子

```javascript
rnd(max)              // 0～max
rnd(min, max)         // min～max
```

**説明**: `nexti`または`nextf`を呼び出します（引数の型に応じて自動判別）。

---

### Vector3D

3次元ベクトルクラス。

#### コンストラクタ

```javascript
Vector3D()                          // (0, 0, 0)
Vector3D(value)                     // (value, value, value)
Vector3D(x, y)                      // (x, y, 0)
Vector3D(x, y, z)                   // (x, y, z)
Vector3D(vector)                    // コピー
Vector3D([x, y, z])                 // 配列から
```

#### フィールド

- `x`, `y`, `z` (float): 各成分
- `[0]`, `[1]`, `[2]` (float): インデックスアクセス（エイリアス）

#### メソッド

##### 設定・取得

##### `set(x, y, z)` / `set(value)` / `set(vector)` / `set([x,y,z])`
値を設定します。

**戻り値**: 自身

##### `iszero()`
ゼロベクトルかどうか判定します。

**戻り値**: すべての成分が0の場合`true`

##### `equals(other)`
別のベクトルと等しいか判定します。

**引数**:
- `other` (Vector3D): 比較対象

**戻り値**: 等しい場合`true`

##### 算術演算

##### `add(x, y, z)` / `add(value)` / `add(vector)`
加算します。

**戻り値**: 自身

##### `sub(x, y, z)` / `sub(value)` / `sub(vector)`
減算します。

**戻り値**: 自身

##### `mul(x, y, z)` / `mul(value)` / `mul(vector)`
乗算します。

**戻り値**: 自身

##### `div(x, y, z)` / `div(value)` / `div(vector)`
除算します。

**戻り値**: 自身

##### `scale(x, y, z)` / `scale(value)` / `scale(vector)`
スケール（乗算のエイリアス）。

**戻り値**: 自身

##### ベクトル演算

##### `length()`
ベクトルの長さを返します。

**戻り値**: `sqrt(x*x + y*y + z*z)`

##### `lengthSq()`
ベクトルの長さの2乗を返します。

**戻り値**: `x*x + y*y + z*z`

##### `normalize()`
正規化します（長さを1にする）。

**戻り値**: 自身

##### `dot(other)`
内積を計算します。

**引数**:
- `other` (Vector3D): 別のベクトル

**戻り値**: 内積値

##### `cross(other[, result])`
外積を計算します。

**引数**:
- `other` (Vector3D): 別のベクトル
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: 外積ベクトル（新規または`result`）

##### `hypot(other)`
2つのベクトル間の距離を返します。

**引数**:
- `other` (Vector3D): 別のベクトル

**戻り値**: 距離

##### `hypotSq(other)`
2つのベクトル間の距離の2乗を返します。

**引数**:
- `other` (Vector3D): 別のベクトル

**戻り値**: 距離の2乗

##### 変換

##### `transform(matrix)`
行列で変換します（平行移動を含む）。

**引数**:
- `matrix` (Matrix): 変換行列

**戻り値**: 自身

##### `transform0(matrix)`
行列で変換します（平行移動を含まない）。

**引数**:
- `matrix` (Matrix): 変換行列

**戻り値**: 自身

##### `transformw(matrix)`
行列で変換し、wコンポーネントを返します。

**引数**:
- `matrix` (Matrix): 変換行列

**戻り値**: w成分（float）

##### `rotate(quaternion)` / `rotate(h, p, b)` / `rotate(vector)`
回転を適用します。

**引数**:
- `quaternion` (Quaternion): 回転クォータニオン
- または `h, p, b` (float): heading, pitch, bank（ラジアン）
- または `vector` (Vector3D): 回転ベクトル

**戻り値**: 自身

##### その他

##### `saturate()`
各成分を0～1にクランプします。

**戻り値**: 自身

##### `floor()`, `ceil()`, `round()`
各成分を丸めます。

**戻り値**: 自身

##### `lerp(other, t[, result])`
線形補間します。

**引数**:
- `other` (Vector3D): 終了ベクトル
- `t` (float): 補間係数（0～1）
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: 補間されたベクトル

##### `min(other)`, `max(other)`
各成分の最小・最大をとります。

**引数**:
- `other` (Vector3D): 別のベクトル

**戻り値**: 自身

##### `hasNaN()`
NaNを含むかチェックします。

**戻り値**: NaNを含む場合`true`

##### `nanCheck()`
NaN/Inf情報をビットフィールドで返します。

**戻り値**: ビットフィールド（int）

#### 静的メソッド

##### `Vector3D.fromRandom(min, max)`
ランダムなベクトルを生成します。

**引数**:
- `min` (float): 各成分の最小値
- `max` (float): 各成分の最大値

**戻り値**: ランダムなベクトル

#### 演算子

```javascript
v1 + v2          // 加算（新規ベクトル）
v1 - v2          // 減算（新規ベクトル）
v1 * v2          // 乗算（新規ベクトル）
v1 / v2          // 除算（新規ベクトル）
v1 % v2          // 剰余（新規ベクトル）
v1 << v2         // 代入（v1 = v2）
-v               // 反転（新規ベクトル）
v1 | v2          // 内積（float）
v1 ^ v2          // 外積（新規ベクトル）
v(x, y, z)       // 呼び出し演算子で設定
```

---

### Quaternion

四元数（回転）クラス。

#### コンストラクタ

```javascript
Quaternion()                              // 単位クォータニオン
Quaternion(x, y, z, w)                    // 直接指定
Quaternion(angle, axis)                   // 軸まわりの回転
Quaternion(quaternion)                    // コピー
Quaternion(matrix)                        // 行列から
Quaternion([x, y, z, w])                  // 配列から
```

#### フィールド

- `x`, `y`, `z`, `w` (float): 各成分
- `[0]`, `[1]`, `[2]`, `[3]` (float): インデックスアクセス

#### メソッド

##### `set(x, y, z, w)` / `set(angle, axis)` / `set(other)`
値を設定します。

**戻り値**: 自身

##### `iszero()`
単位クォータニオンかどうか判定します。

**戻り値**: 単位クォータニオンの場合`true`（w=1, x=y=z=0）

##### `equals(other)`
別のクォータニオンと等しいか判定します。

**引数**:
- `other` (Quaternion): 比較対象

**戻り値**: 等しい場合`true`

##### `norm()`
ノルム（長さ）を返します。

**戻り値**: ノルム

##### `normalize()`
正規化します。

**戻り値**: 自身

##### `toMatrix()`
3x3行列に変換します。

**戻り値**: `Matrix`オブジェクト

##### `lerp(other, t[, result])`, `slerp(other, t[, result])`
線形補間・球面線形補間します。

**引数**:
- `other` (Quaternion): 終了クォータニオン
- `t` (float): 補間係数（0～1）
- `result` (Quaternion, オプション): 結果の格納先

**戻り値**: 補間されたクォータニオン

##### `synthesize(other)`
クォータニオンを合成します（乗算）。

**引数**:
- `other` (Quaternion): 合成するクォータニオン

**戻り値**: 自身

##### `getHPB([result])`
Heading-Pitch-Bank角を取得します。

**引数**:
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: `Vector3D(h, p, b)`

##### `setHPB(h, p, b)` / `setHPB(vector)`
Heading-Pitch-Bank角から設定します。

**引数**:
- `h, p, b` (float): Heading, Pitch, Bank（ラジアン）
- または `vector` (Vector3D): HPBベクトル

**戻り値**: 自身

##### `setAxis(angle, x, y, z)`
軸まわりの回転を設定します。

**引数**:
- `angle` (float): 回転角（ラジアン）
- `x, y, z` (float): 回転軸

#### 静的メソッド

##### `Quaternion.fromAxis(angle, axis)`
軸まわりの回転クォータニオンを作成します。

**引数**:
- `angle` (float): 回転角（ラジアン）
- `axis` (Vector3D): 回転軸

**戻り値**: `Quaternion`オブジェクト

##### `Quaternion.from2Axis(from, to)`
2つのベクトル間の回転を作成します。

**引数**:
- `from` (Vector3D): 開始ベクトル
- `to` (Vector3D): 終了ベクトル

**戻り値**: `Quaternion`オブジェクト

##### `Quaternion.fromHPB(h, p, b)` / `Quaternion.fromHPB(vector)` / `Quaternion.fromHPB([h,p,b])`
HPB角からクォータニオンを作成します。

**引数**:
- `h, p, b` (float): Heading, Pitch, Bank
- または `vector` (Vector3D)
- または `[h, p, b]` (array)

**戻り値**: `Quaternion`オブジェクト

#### 演算子

```javascript
q1 * q2          // 合成（新規クォータニオン）
q * v            // ベクトル回転（新規ベクトル）
q1 << q2         // 代入（q1 = q2）
-q               // 共役（新規クォータニオン）
q(...)           // 呼び出し演算子で設定
```

---

### Plane

平面クラス（ax + by + cz + d = 0）。

#### コンストラクタ

```javascript
Plane()                        // (0, 0, 0, 1)
Plane(a, b, c, d)              // 直接指定
Plane(plane)                   // コピー
Plane([a, b, c, d])            // 配列から
```

#### フィールド

- `a`, `b`, `c`, `d` (float): 平面の係数
- `[0]`, `[1]`, `[2]`, `[3]` (float): インデックスアクセス

#### メソッド

##### `set(a, b, c, d)` / `set(plane)`
値を設定します。

**戻り値**: 自身

##### `equals(other)`
別の平面と等しいか判定します。

**引数**:
- `other` (Plane): 比較対象

**戻り値**: 等しい場合`true`

##### `normalize()`
正規化します（法線ベクトルを長さ1に）。

**戻り値**: 自身

##### `lerp(other, t)`
線形補間します。

**引数**:
- `other` (Plane): 終了平面
- `t` (float): 補間係数

**戻り値**: 新しい`Plane`オブジェクト

##### `setParam(nx, ny, nz, px, py, pz)` / `setParam(normal, position)`
法線と位置から設定します。

**引数**:
- `nx, ny, nz` (float): 法線ベクトル
- `px, py, pz` (float): 平面上の位置
- または `normal`, `position` (Vector3D)

**戻り値**: 自身

##### `getHeight(x, y, z)` / `getHeight(position)`
指定点の平面からの高さを返します。

**引数**:
- `x, y, z` (float): 位置
- または `position` (Vector3D)

**戻り値**: 高さ（float、符号付き距離）

##### `inside(x, y, z)` / `inside(vector)` / `inside(rect3d)`
指定オブジェクトが平面の内側かどうか判定します。

**引数**:
- `x, y, z` (float): 位置
- または `vector` (Vector3D)
- または `rect3d` (Rect3D)

**戻り値**: 内側の場合`true`

##### `project(position, direction)`
平面への投影点を計算します。

**引数**:
- `position` (Vector3D): 開始位置
- `direction` (Vector3D): 方向ベクトル

**戻り値**: 投影点（`Vector3D`）

##### `getIntersectTime(position, direction)`
平面との交点までの時間を計算します。

**引数**:
- `position` (Vector3D): 開始位置
- `direction` (Vector3D): 方向ベクトル

**戻り値**: 交点までの時間（float）、交差しない場合は負の値

##### `dot(vector)`
法線ベクトルとの内積を計算します。

**引数**:
- `vector` (Vector3D): ベクトル

**戻り値**: 内積値

##### `transform(matrix)`
行列で変換します。

**引数**:
- `matrix` (Matrix): 変換行列

**戻り値**: 自身

#### 演算子

```javascript
p1 << p2         // 代入（p1 = p2）
p(...)           // 呼び出し演算子で設定
```

---

### Matrix

4x4行列クラス。

#### コンストラクタ

```javascript
Matrix()                                   // 単位行列
Matrix(e0, e1, ..., e15)                   // 16要素を直接指定
Matrix(matrix)                             // コピー
```

#### フィールド

- `[0]`～`[15]` (float): 行列の要素（列優先）

**説明**: 行列要素は列優先で格納されています。

```
[0  4  8  12]
[1  5  9  13]
[2  6  10 14]
[3  7  11 15]
```

#### メソッド

##### 基本操作

##### `set(e0, ..., e15)` / `set(matrix)`
値を設定します。

**戻り値**: 自身

##### `identity()`
単位行列に設定します。

**戻り値**: 自身

##### `abs()`
行列の絶対値（各要素の絶対値の合計）を返します。

**戻り値**: float値

##### 行列演算

##### `mult33(other[, result])`, `mult34(other[, result])`, `mult44(other[, result])`
行列の乗算（3x3、3x4、4x4）。

**引数**:
- `other` (Matrix): 乗算する行列
- `result` (Matrix, オプション): 結果の格納先

**戻り値**: 結果行列（新規または`result`）

##### `invert34([result])`, `invert34u([result])`, `invert44([result])`
逆行列を計算します。

**説明**:
- `invert34`: 3x4逆行列
- `invert34u`: 3x4逆行列（均一スケールのみ）
- `invert44`: 4x4逆行列

**引数**:
- `result` (Matrix, オプション): 結果の格納先

**戻り値**: 逆行列

##### `transpose33([result])`, `transpose44([result])`
転置行列を計算します。

**引数**:
- `result` (Matrix, オプション): 結果の格納先

**戻り値**: 転置行列

##### 変換操作

##### `translate(x, y, z)`, `translate(vector)`
平行移動を適用します。

**引数**:
- `x, y, z` (float): 移動量
- または `vector` (Vector3D/Rect3D)

**戻り値**: 自身

##### `ltranslate(x, y, z)`, `ltranslate(vector)`
ローカル座標系での平行移動を適用します。

**引数**: `translate`と同じ

**戻り値**: 自身

##### `scale(x, y, z)`, `scale(vector)`, `scale(value)`
スケールを適用します。

**引数**:
- `x, y, z` (float): スケール係数
- または `vector` (Vector3D)
- または `value` (float): 均一スケール

**戻り値**: 自身

##### `lscale(x, y, z)`, `lscale(vector)`
ローカル座標系でのスケールを適用します。

**引数**: `scale`と同じ

**戻り値**: 自身

##### `rotate(quaternion)` / `rotate(h, p, b)` / `rotate(vector)` / `rotate([h,p,b])`
回転を適用します。

**引数**:
- `quaternion` (Quaternion): 回転クォータニオン
- または `h, p, b` (float): Heading-Pitch-Bank
- または `vector` (Vector3D): HPBベクトル
- または `[h, p, b]` (array)

**戻り値**: 自身

##### 要素の取得・設定

##### `setTranslation(x, y, z)` / `setTranslation(vector)`
平行移動成分を設定します。

**引数**:
- `x, y, z` (float): 位置
- または `vector` (Vector3D/Rect3D)

**戻り値**: 自身

##### `getTranslation([result])`
平行移動成分を取得します。

**引数**:
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: 位置ベクトル（`Vector3D`）

##### `getRotation([result])`
回転成分を取得します。

**引数**:
- `result` (Quaternion, オプション): 結果の格納先

**戻り値**: 回転クォータニオン（`Quaternion`）

##### `getHPB([result])`
Heading-Pitch-Bank角を取得します。

**引数**:
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: HPBベクトル（`Vector3D`）

##### `getScale([result])`
スケール成分を取得します。

**引数**:
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: スケールベクトル（`Vector3D`）

##### `getAverageScale([result])`
平均スケール値を取得します。

**引数**:
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: 均一スケールベクトル（`Vector3D(s,s,s)`）

##### Transform関連

##### `setSRT(t, s, r)`
Transform（位置・スケール・回転）から設定します。

**引数**:
- `t` (Vector3D): 位置
- `s` (Vector3D): スケール
- `r` (Quaternion): 回転

**戻り値**: 自身

##### `setTransform(transform[, pivot])`
Transformオブジェクトから設定します。

**引数**:
- `transform` (Transform): Transformオブジェクト
- `pivot` (Vector3D, オプション): ピボット位置

**戻り値**: 自身

##### `getTransform([result])`
Transformオブジェクトを取得します。

**引数**:
- `result` (Transform, オプション): 結果の格納先

**戻り値**: `Transform`オブジェクト

##### その他

##### `normalize()`
回転成分を正規化します。

**戻り値**: 自身

##### `lerp(other, t[, result])`
線形補間します。

**引数**:
- `other` (Matrix): 終了行列
- `t` (float): 補間係数
- `result` (Matrix, オプション): 結果の格納先

**戻り値**: 補間された行列

##### `integrate(array|...transforms)`
複数のTransformまたはMatrixを統合します。

**引数**:
- `array` (array): TransformまたはMatrixの配列
- または `...transforms`: 可変長引数

**戻り値**: 自身

##### `nanCheck()`
NaN/Inf情報をビットフィールドで返します。

**戻り値**: ビットフィールド（int）

##### `print([with4thRow])`
行列をコンソールに出力します。

**引数**:
- `with4thRow` (bool, オプション): 4行目も表示するか

#### 静的メソッド

##### `Matrix.fromOrtho(left, right, bottom, top, near, far)`
正射影行列を作成します。

**引数**: 投影範囲のパラメータ

**戻り値**: `Matrix`オブジェクト

##### `Matrix.fromPerspective(fovy, aspect, near, far)`
透視投影行列を作成します。

**引数**:
- `fovy` (float): 視野角（ラジアン）
- `aspect` (float): アスペクト比
- `near` (float): ニアクリップ
- `far` (float): ファークリップ

**戻り値**: `Matrix`オブジェクト

##### `Matrix.fromTranslate(x, y, z)` / `Matrix.fromTranslate(vector)`
平行移動行列を作成します。

**戻り値**: `Matrix`オブジェクト

##### `Matrix.fromScale(x, y, z)` / `Matrix.fromScale(vector)`
スケール行列を作成します。

**戻り値**: `Matrix`オブジェクト

##### `Matrix.fromHPB(h, p, b)`
回転行列を作成します。

**引数**:
- `h, p, b` (float): Heading-Pitch-Bank

**戻り値**: `Matrix`オブジェクト

##### `Matrix.fromHSV(h, s, v)` / `Matrix.fromHSV(vector)`
HSV色空間変換行列を作成します。

**引数**:
- `h, s, v` (float): Hue-Saturation-Value

**戻り値**: `Matrix`オブジェクト

#### 演算子とプロパティ

```javascript
m1 * m2          // 行列乗算（新規行列）
m1 << m2         // 代入（m1 = m2）
m["m0"]～m["m3"] // 列ベクトルの取得（Vector3D）
m["n0"]～m["n3"] // 行ベクトルの取得（Vector3D）
```

---

### Rect2D

2次元矩形クラス。

#### コンストラクタ

```javascript
Rect2D()                    // (0, 0, 0, 0)
Rect2D(x, y, w, h)          // 直接指定
Rect2D(rect)                // コピー
```

#### フィールド

- `x`, `y`, `w`, `h` (float): 矩形の位置とサイズ
- `[0]`, `[1]`, `[2]`, `[3]` (float): インデックスアクセス

#### メソッド

##### `set(x, y, w, h)` / `set(rect)`
値を設定します。

**戻り値**: 自身

##### `expand(rect|value)`
矩形を拡大します。

**引数**:
- `rect` (Rect2D): 統合する矩形
- または `value` (float): 拡大量

**戻り値**: 自身

##### `clip(rect)`
矩形をクリップ（交差領域のみ残す）します。

**引数**:
- `rect` (Rect2D): クリップする矩形

**戻り値**: 自身

##### `valid()`
有効な矩形かどうか判定します。

**戻り値**: `w > 0 && h > 0`の場合`true`

##### `add(x, y)` / `add(vector)` / `add(rect)`
位置を移動します。

**引数**:
- `x, y` (float): 移動量
- または `vector` (Vector3D)
- または `rect` (Rect2D)

**戻り値**: 自身

##### `scale(sx, sy)` / `scale(rect)`
スケールします。

**引数**:
- `sx, sy` (float): スケール係数
- または `rect` (Rect2D)

**戻り値**: 自身

##### `transform(matrix)`, `transform0(matrix)`
行列で変換します。

**引数**:
- `matrix` (Matrix): 変換行列

**戻り値**: 自身

##### `contacts(rect)`, `contains(rect)`
矩形が接触・包含しているか判定します。

**引数**:
- `rect` (Rect2D): 対象矩形

**戻り値**: 接触・包含している場合`true`

##### `lerp(other, t)`
線形補間します。

**引数**:
- `other` (Rect2D): 終了矩形
- `t` (float): 補間係数

**戻り値**: 新しい`Rect2D`オブジェクト

##### `floor()`, `ceil()`, `round()`
各成分を丸めます。

**戻り値**: 自身

##### `getdir(px, py, vx, vy)`
方向ベクトルと矩形の角度を計算します。

**引数**:
- `px, py` (float): 基準位置
- `vx, vy` (float): 方向ベクトル

**戻り値**: 角度（ラジアン）

##### `getFrontMostDistance(px, py)`
矩形の最も近い点までの距離を計算します。

**引数**:
- `px, py` (float): 位置

**戻り値**: 距離（float）

#### 演算子

```javascript
r1 | r2          // 統合（新規矩形）
r1 & r2          // 交差（新規矩形）
r * m            // 行列変換（新規矩形）
r * v            // スケール（新規矩形）
r << r2          // 代入
```

---

### Rect3D

3次元バウンディングボックスクラス。

#### コンストラクタ

```javascript
Rect3D()                          // (0, 0, 0, 1, 1, 1)
Rect3D(x, y, z, r, s, t)          // 直接指定
Rect3D(rect)                      // コピー
Rect3D([x, y, z, r, s, t])        // 配列から
```

#### フィールド

- `x`, `y`, `z` (float): 中心座標
- `r`, `s`, `t` (float): 各軸の半径
- `[0]`～`[5]` (float): インデックスアクセス

**説明**: `(x-r, y-s, z-t)`が最小座標、`(x+r, y+s, z+t)`が最大座標です。

#### メソッド

##### `set(x, y, z, r, s, t)` / `set(rect)` / `set([...])`
値を設定します。

**戻り値**: 自身

##### `invalidate()`
無効な状態に設定します。

**戻り値**: 自身

##### `valid()`
有効なボックスかどうか判定します。

**戻り値**: すべての半径が正の場合`true`

##### `expand(rect|vector|value)`
ボックスを拡大します。

**引数**:
- `rect` (Rect3D): 統合するボックス
- または `vector` (Vector3D): 包含する点
- または `value` (float): 拡大量

**戻り値**: 自身

##### `offset(x, y, z)` / `offset(vector)` / `offset(rect)`
位置を移動します。

**引数**:
- `x, y, z` (float): 移動量
- または `vector` (Vector3D)
- または `rect` (Rect3D)

**戻り値**: 自身

##### `transform(matrix)`, `transform0(matrix)`
行列で変換します。

**引数**:
- `matrix` (Matrix): 変換行列

**戻り値**: 自身

##### `contacts(rect)`, `insideof(rect)`
ボックスが接触・包含されているか判定します。

**引数**:
- `rect` (Rect3D): 対象ボックス

**戻り値**: 接触・包含されている場合`true`

##### `contactTest(rect[, overlap])`
接触テストを行い、重なりを返します。

**引数**:
- `rect` (Rect3D): 対象ボックス
- `overlap` (Vector3D, オプション): 重なり量の格納先

**戻り値**: 重なり量（float）、接触していない場合は負の値

##### `sweepTest(target, direction[, normal])`
スイープテスト（移動衝突判定）を行います。

**引数**:
- `target` (Rect3D/Vector3D): 対象
- `direction` (Vector3D): 移動方向
- `normal` (Vector3D, オプション): 衝突法線の格納先

**戻り値**: 衝突までの時間（0～1）、衝突しない場合は負の値

##### `getFrontMostDistance(position)`, `getRearMostDistance(position)`
ボックスの最前面・最背面までの距離を計算します。

**引数**:
- `position` (Vector3D): 基準位置

**戻り値**: 距離（float）

#### 演算子

```javascript
r1 + v           // 移動（新規ボックス）
r1 | r2          // 統合（新規ボックス）
r1 | v           // 点を含む（新規ボックス）
r1 & r2          // 交差（新規ボックス）
r * v            // スケール（新規ボックス）
r * f            // 均一スケール（新規ボックス）
r << r2          // 代入
```

---

### Transform

位置・回転・スケールを表すSRT変換クラス。

#### コンストラクタ

```javascript
Transform()                                 // 初期状態
Transform(x, y, z)                          // 位置のみ指定
Transform(transform)                        // コピー
Transform([tx,ty,tz,sx,sy,sz,rx,ry,rz,rw])  // 配列から
```

#### フィールド

- `tx`, `ty`, `tz` (float): 位置（Translation）
- `sx`, `sy`, `sz` (float): スケール（Scale）
- `rx`, `ry`, `rz`, `rw` (float): 回転（Rotation、クォータニオン）

#### メソッド

##### `set(...)` / `clear()`
値を設定・クリアします。

**戻り値**: 自身

##### `setSRT(t, s, r)`
位置・スケール・回転を設定します。

**引数**:
- `t` (Vector3D): 位置
- `s` (Vector3D): スケール
- `r` (Quaternion): 回転

**戻り値**: 自身

##### `translate(x, y, z)` / `translate(vector)`
平行移動を適用します。

**引数**:
- `x, y, z` (float): 移動量
- または `vector` (Vector3D/Rect3D)

**戻り値**: 自身

##### `scale(x, y, z)` / `scale(vector)`
スケールを適用します。

**引数**:
- `x, y, z` (float): スケール係数
- または `vector` (Vector3D)

**戻り値**: 自身

##### `rotate(quaternion)`
回転を適用します。

**引数**:
- `quaternion` (Quaternion): 回転クォータニオン

**戻り値**: 自身

#### 静的メソッド

##### `Transform.integrate(array)`
Transform配列を統合します。

**引数**:
- `array` (array): `Transform`の配列

**戻り値**: 統合された`Transform`

#### 演算子

```javascript
t1 + t2          // 統合（新規Transform）
t1 << t2         // 代入
```

---

### TransformTimeline

Transformのタイムラインアニメーション。

#### コンストラクタ

```javascript
TransformTimeline()
```

#### フィールド

- `start` (int): 開始フレーム（読み取り専用）
- `end` (int): 終了フレーム（読み取り専用）

#### メソッド

##### `loadData(buffer)`
バイトバッファからタイムラインデータをロードします。

**引数**:
- `buffer` (ByteBuffer): タイムラインデータ

##### `evaluate(frame[, result])`
指定フレームのTransformを評価します。

**引数**:
- `frame` (float): フレーム番号（補間される）
- `result` (Transform, オプション): 結果の格納先

**戻り値**: `Transform`オブジェクト

---

### Camera

3Dカメラクラス。

#### コンストラクタ

```javascript
Camera()
```

#### フィールド

- `prjtype` (float): 投影タイプ（0: 正射影、1: 透視投影）
- `znear`, `zfar` (float): ニア・ファークリップ
- `fovy` (float): 視野角（ラジアン）
- `focus` (float): フォーカス距離
- `aspect` (float): アスペクト比
- `eye` (Vector3D): 視点位置
- `fw` (Vector3D): 前方ベクトル
- `ri` (Vector3D): 右方向ベクトル
- `pivot` (Vector3D): ピボット位置
- `viewmat` (Matrix): ビュー行列
- `prjmat` (Matrix): 投影行列

**説明**: `pos`は`eye`のエイリアスです。

#### メソッド

##### `set(camera)`
別のカメラから設定をコピーします。

**引数**:
- `camera` (Camera): コピー元

**戻り値**: 自身

##### `move(x, y, z)`
カメラを移動します。

**引数**:
- `x, y, z` (float): 移動量

##### `lookat(eye, target[, up])` / `lookat(matrix)`
視点と注視点を設定します。

**引数**:
- `eye` (Vector3D): 視点位置
- `target` (Vector3D): 注視点
- `up` (Vector3D, オプション): アップベクトル（デフォルト: (0,1,0)）
- または `matrix` (Matrix): カメラ行列から設定

##### `perspective(fovy, aspect, near, far)`
透視投影を設定します。

**引数**:
- `fovy` (float): 視野角（ラジアン）
- `aspect` (float): アスペクト比
- `near` (float): ニアクリップ
- `far` (float): ファークリップ

##### `ortho(left, right, bottom, top, near, far)`
正射影を設定します。

**引数**: 投影範囲のパラメータ

##### `project(vector[, result])`
3D座標をスクリーン座標に投影します。

**引数**:
- `vector` (Vector3D): ワールド座標
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: スクリーン座標（`Vector3D`）

##### `unproject(vector[, result])`
スクリーン座標を3D座標に逆投影します。

**引数**:
- `vector` (Vector3D): スクリーン座標
- `result` (Vector3D, オプション): 結果の格納先

**戻り値**: ワールド座標（`Vector3D`）

##### `getDistance(object)`
カメラからオブジェクトまでの距離を取得します。

**引数**:
- `object` (Vector3D/Rect3D): オブジェクト

**戻り値**: 距離（float）

##### `isInside(object[, margin])`
オブジェクトが視錐台内にあるか判定します。

**引数**:
- `object` (Vector3D/Rect3D): オブジェクト
- `margin` (float, オプション): マージン

**戻り値**: 視錐台内の場合`true`

##### `setViewport(array)`
ビューポートを設定します。

**引数**:
- `array` (array): `[x, y, width, height]`

##### `changeZClip(near, far)`
ニア・ファークリップを変更します。

**引数**:
- `near` (float): ニアクリップ
- `far` (float): ファークリップ

##### `getWVP([result])`
ワールド・ビュー・投影行列（WVP）を取得します。

**引数**:
- `result` (Matrix, オプション): 結果の格納先

**戻り値**: WVP行列（`Matrix`）

##### `updatePlanes()`
視錐台平面を更新します。

**説明**: `isInside`を使う前に呼び出す必要があります。

##### `getPlanes(array)`
視錐台の6つの平面を取得します。

**引数**:
- `array` (array): 6つの`Plane`オブジェクトの配列

**戻り値**: 同じ配列

##### `getSubplanes(rect, array)`
矩形領域の視錐台平面を取得します。

**引数**:
- `rect` (Rect2D): スクリーン矩形
- `array` (array): 4つの`Plane`オブジェクトの配列

**戻り値**: 同じ配列

##### `getWorldBounds([result])`
ワールド座標でのビュー範囲を取得します。

**引数**:
- `result` (Rect3D, オプション): 結果の格納先

**戻り値**: バウンディングボックス（`Rect3D`）

#### 演算子

```javascript
c1 << c2         // 代入
```

---

### bigint

多倍長整数クラス。

#### コンストラクタ

```javascript
bigint()                                 // 0
bigint(value)                            // 整数から
bigint(string[, radix])                  // 文字列から（10進または16進）
bigint(buffer[, offset, length])         // バイトバッファから
```

**引数**:
- `value` (int/long): 初期値
- `string` (string): 10進または16進文字列
- `radix` (int, オプション): 基数（16で16進）
- `buffer` (ByteBuffer): バイトバッファ
- `offset`, `length` (int, オプション): 読み取り範囲

#### フィールド

- `sign` (int): 符号（読み取り専用）
- `size` (int): サイズ（内部配列の要素数、読み取り専用）
- `[index]` (int): 内部配列の要素（読み取り専用）

#### メソッド

##### `add(other)`, `sub(other)`, `mul(other)`, `div(other)`, `mod(other)`
算術演算を行います。

**引数**:
- `other` (bigint): 演算対象

**戻り値**: 自身

**説明**: 自身を変更します（破壊的操作）。

##### `powmod(p, n)`
べき乗剰余を計算します（this^p mod n）。

**引数**:
- `p` (bigint): 指数
- `n` (bigint): 法

**戻り値**: 自身

##### `tostring([radix])`
文字列に変換します。

**引数**:
- `radix` (int, オプション): 16で16進（デフォルトは10進）

**戻り値**: 文字列

##### `getbytes([buffer])`
バイト列として取得します。

**引数**:
- `buffer` (ByteBuffer, オプション): 書き込み先バッファ

**戻り値**: バイトバッファ（新規または引数の`buffer`）

#### 演算子

```javascript
bi[index]        // 内部配列要素の取得
bi(...)          // 呼び出し演算子で値を設定
bi.tostring()    // 文字列化（"<123>"形式）
```

---

## 注意事項

1. **座標系**: SakanaGLは右手座標系を使用しています。

2. **角度の単位**: すべての角度はラジアンで指定します。度からラジアンへの変換には`Math.DTOR`を使用してください。

3. **クォータニオン**: 回転の合成は右から左へ（`q1 * q2`は`q2`の後に`q1`を適用）。

4. **行列**: 列優先で格納されています。OpenGLと互換性があります。

5. **Transform**: `Transform + Transform`は階層的な変換の合成を行います。

6. **バウンディングボックス**: `Rect3D`は中心座標と半径で表現されます（最小・最大座標ではない）。

7. **カメラ**: `updatePlanes()`を呼び出さないと`isInside()`は正しく動作しません。

8. **演算子オーバーロード**: `+`, `-`, `*`, `/`, `|`, `^`, `<<`などの演算子が多くのクラスでオーバーロードされています。

9. **破壊的操作**: `add()`, `sub()`, `mul()`などのメソッドは自身を変更します。新しいオブジェクトを作成するには演算子（`+`, `-`, `*`）を使用してください。
