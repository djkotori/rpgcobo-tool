# SakanaGL VoxEngine API リファレンス

このドキュメントは、SakanaGL の VoxEngine アドオン (`voxengine/sakana_addon.cpp`, `voxengine/sakana_block.cpp`) に関するリファレンスです。

## 概要

VoxEngine API は、ボクセルベースの3D環境を構築するための包括的なシステムです。ボクセルデータの生成・編集、ポリゴンメッシュ化、ブロックワールド（チャンク管理、フリーブロック配置）、衝突判定などをサポートします。

---

## 目次

### 数学・変換
- [IMat](#imat) - 整数行列（ボクセル・ブロック座標変換用）
- [IPos](#ipos) - 整数位置（x, y, z, rot）
- [IRect3D](#irect3d) - 整数3D矩形

### ボクセルデータ
- [VoxelPalette](#voxelpalette) - ボクセルカラーパレット
- [VoxelData](#voxeldata) - 32bitボクセルデータ
- [VoxelData8](#voxeldata8) - 8bitパレットボクセルデータ
- [VoxelParts](#voxelparts) - ボクセルパーツ（階層構造）
- [VoxelContainer](#voxelcontainer) - ボクセルコンテナ（複数パーツ管理）
- [VoxelCanvas](#voxelcanvas) - ボクセルキャンバス（32bit描画）
- [VoxelCanvas8](#voxelcanvas8) - ボクセルキャンバス（8bit描画）

### ブロックワールド
- [BlockWorld](#blockworld) - ブロックワールド（チャンク管理）
- [Block](#block) - ブロック定義
- [FreeBlock](#freeblock) - 自由配置ブロック
- [BlockChunkData](#blockchunkdata) - チャンクデータ（保存・復元用）
- [HitBlock](#hitblock) - ブロック衝突情報
- [BlockColiderInterface](#blockcoliderinterface) - ブロック物理衝突インターフェース
- [BlockRenderer](#blockrenderer) - ブロックレンダラー

### メッシュ化・描画
- [VoxelMeshData](#voxelmeshdata) - ボクセルメッシュデータ
- [VoxelMeshBuilder](#voxelmeshbuilder) - ボクセルメッシュビルダー
- [VoxelSelecter](#voxelselecter) - ボクセル選択ツール

### 使用例
- [基本的なボクセル操作](#基本的なボクセル操作)
- [ブロックワールドの構築](#ブロックワールドの構築)
- [メッシュ化と描画](#メッシュ化と描画)

---

## IMat

整数行列クラス。ボクセル座標の回転・平行移動変換を行います。  
- 回転はY軸回転のみの90度単位で、0-3の整数で指定します。
- スケール変換は大きさが1以外になる変換はできません。

### コンストラクタ

```javascript
IMat()
IMat(rot)
IMat(x, y, z)
IMat(a, b, c, d, u, v, r)
```

**引数**:
- `rot` (int, オプション): 回転（0-3、90度単位）
- `x, y, z` (int): 平行移動成分
- `a, b, c, d, u, v, r` (int): 回転行列成分 + 平行移動成分

### フィールド

- `u` (int): X平行移動
- `v` (int): Y平行移動
- `r` (int): Z平行移動
- `a, b, c, d` (int): 回転行列成分

### メソッド

##### `set(...)`
行列を設定します。

**引数**: コンストラクタと同じ

**戻り値**: IMat（自身）

##### `identity()`
単位行列に設定します。

**戻り値**: IMat（自身）

##### `rotate([times])`
90度回転を適用します。

**引数**:
- `times` (int, オプション): 回転回数（デフォルト: 1）

**戻り値**: IMat（新規）

##### `translate(x, y, z)`
平行移動を適用します。

**引数**:
- `x, y, z` (int): 移動量

**戻り値**: IMat（新規）

##### `scale(sx, sz)`
スケール変換を適用します（反転のみ）。

**引数**:
- `sx, sz` (int): -1 または 1

**戻り値**: IMat（新規）

##### `mult(other[, out])`
行列積を計算します。

**引数**:
- `other` (IMat): 右側の行列
- `out` (IMat, オプション): 結果の出力先

**戻り値**: IMat

##### `invert()`
逆行列を計算します。

**戻り値**: IMat（自身）

##### `getRot()`
現在の回転値を取得します。

**戻り値**: int（0-3）

##### `transform(target)`
座標やRect3Dを変換します。

**引数**:
- `target` (IRect3D | IPos | Array): 変換対象

**戻り値**: 変換後の同じオブジェクト

##### `toMatrix(mat[, scale])`
Matrix（float行列）に変換します。

**引数**:
- `mat` (Matrix): 出力先
- `scale` (float, オプション): スケール係数（デフォルト: 1.0）

**戻り値**: Matrix

**例**:
```javascript
local m = IMat(1); // 90度回転
m.translate(10, 5, 8);
local pos = IPos(0, 0, 0);
m.transform(pos);
println("変換後: " + pos.x + ", " + pos.y + ", " + pos.z);
```

---

## IPos

整数座標と回転を持つ位置クラスです。

### コンストラクタ

```javascript
IPos(x, y, z[, rot])
IPos([x, y, z[, rot]])
IPos(IPos)
```

### フィールド

- `x` (int): X座標
- `y` (int): Y座標
- `z` (int): Z座標
- `rot` (int): 回転（0-3）

### メソッド

##### `set(...)`
値を設定します（コンストラクタと同じ引数）。

**戻り値**: IPos（自身）

---

## IRect3D

整数3D矩形クラスです。ボクセル領域の指定に使用します。

### コンストラクタ

```javascript
IRect3D(x, y, z, w, h, d)
IRect3D([x, y, z, w, h, d])
IRect3D(IRect3D)
IRect3D(Rect3D)
```

### フィールド

- `x, y, z` (int): 位置
- `w, h, d` (int): サイズ

### メソッド

##### `set(x, y, z, w, h, d)`
矩形を設定します。

**戻り値**: IRect3D（自身）

##### `expand(value)`
##### `expand([dx, dy, dz])`
矩形を拡大します。

**戻り値**: IRect3D（自身）

##### `merge(other)`
他の矩形と結合します。

**戻り値**: IRect3D（自身）

##### `clip(other)`
他の矩形でクリッピングします。

**戻り値**: IRect3D（自身）

##### `valid()`
矩形が有効か判定します（サイズ > 0）。

**戻り値**: bool

##### `toRect3D()`
Rect3D（float矩形）に変換します。

**戻り値**: Rect3D

##### `rotate([times])`
90度回転します。

**戻り値**: IRect3D（自身）

##### `transform(imat)`
IMat で変換します。

**戻り値**: IRect3D（自身）

##### `scale(value)`
スケール変換します。

**戻り値**: IRect3D（自身）

##### `offset(x, y, z)`
オフセットします。

**戻り値**: IRect3D（自身）

##### `contacts(other)`
##### `contacts(x, y, z)`
他の矩形または点と接触しているか判定します。

**戻り値**: bool

##### `pushAxis(axis, value)`
指定軸方向に矩形を伸縮します。

**引数**:
- `axis` (int): 軸（0=-X, 1=+X, 2=-Y, 3=+Y, 4=-Z, 5=+Z）
- `value` (int): 伸縮量

**戻り値**: IRect3D（自身）

### 演算子

- `rect << n` - 左シフト（スケール縮小）
- `rect >> n` - 右シフト（スケール拡大）

**例**:
```javascript
local r = IRect3D(10, 5, 8, 20, 10, 15);
r.expand(2); // 全方向に2拡大
r.clip(IRect3D(0, 0, 0, 32, 32, 32)); // クリッピング

if(r.contacts(15, 10, 12)) {
	println("座標 (15,10,12) は矩形内");
}
```

---

## VoxelPalette

8bitボクセル用の256色パレットです。各カラーは上位ビットからABGRの順で格納されます。

### コンストラクタ

```javascript
VoxelPalette()
```

### アクセス

配列のようにインデックスでアクセスできます。

```javascript
local pal = voxelData8.pal;
pal[1] = 0xff0000ff; // インデックス1を赤に設定
local color = pal[1]; // 色取得
```

---

## VoxelData

32bit RGBA ボクセルデータです。

### コンストラクタ

```javascript
VoxelData(w, h, d[, isTmp[, clear]])
```

**引数**:
- `w, h, d` (int): サイズ
- `isTmp` (bool, オプション): 一時バッファフラグ（デフォルト: false）
- `clear` (bool, オプション): 初期化（デフォルト: true）

### フィールド（読み取り専用）

- `w, h, d` (int): サイズ
- `allocsize` (int): 確保サイズ
- `flags` (int): フラグ

### メソッド

##### `dispose()`
メモリを解放します。

##### `clear(color)`
ボクセルを指定色でクリアします。

**引数**:
- `color` (int): RGBA色

##### `rotate([times])`
90度回転します。

**引数**:
- `times` (int, オプション): 回転回数

##### `transform(matrix, dstVoxelData)`
Matrix で変換した結果を別のボクセルデータに書き込みます。

**引数**:
- `matrix` (Matrix): 変換行列
- `dstVoxelData` (VoxelData): 出力先

##### `getByteBuffer()`
ボクセルデータへの共有ByteBufferを取得します。

**戻り値**: ByteBuffer

### インデックスアクセス

```javascript
vd[index] = 0xff00ff00; // インデックス指定でボクセル色を設定
local color = vd[index]; // 色取得
```

**例**:
```javascript
local vd = VoxelData(16, 16, 16);
vd.clear(0);
vd[0] = 0xff0000ff; // 最初のボクセルを赤に
```

---

## VoxelData8

8bitパレットボクセルデータです。メモリ効率が良く、MagicaVoxelと互換性があります。

### コンストラクタ

```javascript
VoxelData8(w, h, d[, isTmp[, clear]])
```

### フィールド（読み取り専用）

- `w, h, d` (int): サイズ
- `allocsize` (int): 確保サイズ
- `flags` (int): フラグ
- `pal` (VoxelPalette): パレット

### メソッド

##### `dispose()`
メモリを解放します。

##### `clear(colorIndex)`
ボクセルを指定パレットインデックスでクリアします。

##### `rotate([times])`
90度回転します。

##### `transform(matrix, dstVoxelData8)`
Matrix で変換します。

##### `loadXYZI(ByteBuffer, num)`
MagicaVoxel XYZI形式をロードします。

**引数**:
- `ByteBuffer`: XYZI データ
- `num` (int): ボクセル数

##### `sharedclone()`
パレットを共有した複製を作成します（パレット変更用）。

**戻り値**: VoxelData8（新規、ボクセルデータは共有）

##### `getUsingColors()`
使用中のパレットインデックスを取得します。

**戻り値**: Array（パレットインデックスのリスト）

### インデックスアクセス

```javascript
vd8[index] = 5; // パレットインデックス5を設定
local idx = vd8[index]; // パレットインデックス取得
```

**例**:
```javascript
local vd8 = VoxelData8(32, 32, 32);
vd8.pal[1] = 0xff0000ff; // パレット1を赤に
vd8.pal[2] = 0x00ff00ff; // パレット2を緑に
vd8[0] = 1; // 最初のボクセルを赤に
vd8[1] = 2; // 2番目のボクセルを緑に

local colors = vd8.getUsingColors();
println("使用色: " + colors); // [1, 2]
```

---

## VoxelParts

ボクセルパーツの階層構造を管理します。VoxelContainerから取得され、親子関係を持つパーツツリーを構成します。

### フィールド（読み取り専用）

- `vpid` (int): パーツID
- `vdid` (int): VoxelData8のインデックス（-1の場合はボクセルデータなし）
- `x, y, z` (int): 位置
- `rot` (int): 回転（0-3）
- `name` (string): パーツ名（メタメソッド経由）
- `parent` (VoxelParts | null): 親パーツ（メタメソッド経由）
- `children` (VoxelParts | null): 最初の子パーツ（メタメソッド経由）
- `next` (VoxelParts | null): 次の兄弟パーツ（メタメソッド経由）
- `vc` (VoxelContainer): 所属コンテナ（メタメソッド経由）
- `vd8` (VoxelData8 | null): ボクセルデータ（メタメソッド経由）

### メソッド

##### `mat([outMat])`
このパーツのローカル変換行列を取得します。

**引数**:
- `outMat` (IMat, オプション): 出力先

**戻り値**: IMat

##### `gmat([outMat])`
このパーツのグローバル変換行列を取得します（親の変換を含む）。

**引数**:
- `outMat` (IMat, オプション): 出力先

**戻り値**: IMat

##### `voxbnd([outRect])`
このパーツのボクセル境界矩形を取得します。

**戻り値**: IRect3D | null（ボクセルデータがない場合）

##### `wholebnd([outRect])`
このパーツと全子パーツを含む境界矩形を取得します。

**戻り値**: IRect3D

##### `findChild(name)`
指定名の子パーツを検索します（再帰的）。

**引数**:
- `name` (string): パーツ名

**戻り値**: VoxelParts | null

##### `getUsingColors()`
このパーツと全子パーツで使用中のパレットインデックスを取得します。

**戻り値**: Array（パレットインデックスのリスト）

**例**:
```javascript
local vc = VoxelContainer.getGlobal("player");
local head = vc.findParts("head");
local m = head.gmat(); // グローバル変換行列
local bnd = head.wholebnd(); // 境界
```

---

## VoxelContainer

複数のVoxelData8とVoxelPartsを管理するコンテナクラスです。階層構造を持つボクセルモデルを構築します。

### コンストラクタ

```javascript
VoxelContainer(modelArray, partsArray)
```

**引数**:
- `modelArray` (Array): VoxelData8の配列
- `partsArray` (Array): パーツ定義の配列（`{name, vdid, x, y, z, rot, parentid?}`）

### フィールド（読み取り専用）

- `vcid` (int): コンテナID（グローバル登録後に設定）
- `partsnum` (int): パーツ数
- `mdlnum` (int): モデル数
- `name` (string): コンテナ名（メタメソッド経由）

### メソッド

##### `partsAt(index)`
指定インデックスのパーツを取得します。

**引数**:
- `index` (int): パーツインデックス

**戻り値**: VoxelParts | null

##### `findParts(name)`
指定名のパーツを検索します。

**引数**:
- `name` (string): パーツ名

**戻り値**: VoxelParts | null

##### `modelAt(index)`
指定インデックスのVoxelData8を取得します。

**引数**:
- `index` (int): モデルインデックス

**戻り値**: VoxelData8

##### `getPartsList()`
ルートパーツ（親を持たないパーツ）のリストを取得します。

**戻り値**: Array（VoxelPartsのリスト）

##### `getUsingColors()`
全モデルで使用中のパレットインデックスを取得します。

**戻り値**: Array

##### `registerGlobal(name[, reservedId])`
グローバルに登録します。登録すると名前で取得可能になります。

**引数**:
- `name` (string): 登録名（1-31文字）
- `reservedId` (int, オプション): 予約ID（1-100）

**戻り値**: int（割り当てられたvcid）

##### `getGlobal(name)` (静的)
グローバル登録されたVoxelContainerを取得します。

**引数**:
- `name` (string): 登録名

**戻り値**: VoxelContainer | null

**例**:
```javascript
// モデルとパーツ定義
local models = [vd8_body, vd8_head];
local parts = [
    {name: "body", vdid: 0, x: 0, y: 0, z: 0, rot: 0},
    {name: "head", vdid: 1, x: 0, y: 8, z: 0, rot: 0, parentid: 0}
];

local vc = VoxelContainer(models, parts);
vc.registerGlobal("player", 10);

// 後で取得
local vc2 = VoxelContainer.getGlobal("player");
local head = vc2.findParts("head");
```

---

## VoxelCanvas

32bitボクセルデータへの描画キャンバスです。変換行列を使って複数のボクセルを合成できます。

### コンストラクタ

```javascript
VoxelCanvas(voxelData)
```

**引数**:
- `voxelData` (VoxelData): 描画対象の32bitボクセルデータ

### フィールド

- `vd` (VoxelData, 読み取り専用): ボクセルデータ
- `vm` (IMat): ビュー変換行列

### メソッド

##### `clear([color])`
ボクセルをクリアします。

**引数**:
- `color` (int, オプション): RGBA色（デフォルト: 0）

##### `fill([color])`
ビューポート全体を塗りつぶします。

**引数**:
- `color` (int, オプション): RGBA色（デフォルト: 0）

##### `getViewport()`
現在のビューポートを取得します。

**戻り値**: IRect3D

##### `setViewport(rect)`
ビューポートを設定します。

**引数**:
- `rect` (IRect3D): ビューポート

##### `draw(srcVoxelData, mat[, mode])`
ボクセルデータを描画します。

**引数**:
- `srcVoxelData` (VoxelData | VoxelData8): ソースボクセルデータ
- `mat` (IMat): 変換行列
- `mode` (int, オプション): 描画モード

**例**:
```javascript
local vd = VoxelData(64, 64, 64);
local canvas = VoxelCanvas(vd);
canvas.vm = IMat(0, 0, 0); // ビュー変換

local vd8 = VoxelData8(16, 16, 16);
// vd8にボクセル描画...

local m = IMat(1); // 90度回転
m.translate(20, 10, 15);
canvas.draw(vd8, m);
```

---

## VoxelCanvas8

8bitパレットボクセルデータへの描画キャンバスです。

### コンストラクタ

```javascript
VoxelCanvas8(voxelData8)
```

**引数**:
- `voxelData8` (VoxelData8): 描画対象の8bitボクセルデータ

### フィールド

- `vd` (VoxelData8, 読み取り専用): ボクセルデータ
- `vm` (IMat): ビュー変換行列

### メソッド

VoxelCanvasと同じメソッドを持ちます（`clear`, `fill`, `getViewport`, `setViewport`, `draw`）。
ただし `draw()` は VoxelData8 のみ受け付けます。

---

## BlockWorld

チャンク管理されたブロックワールドです。大規模なボクセル環境を効率的に管理します。

### コンストラクタ

```javascript
BlockWorld([w, h, d])
```

**引数**:
- `w, h, d` (int, オプション): ワールドサイズ（ブロック数）

### フィールド（読み取り専用）

- `w, h, d` (int): ワールドサイズ（ブロック数）
- `seq` (int): シーケンス番号（変更検出用）

### サイズ設定

##### `setSize(w, h, d)`
ワールドサイズを設定します。

**引数**:
- `w, h, d` (int): サイズ（1-1024, 1-128, 1-1024）

##### `clearBlocks()`
全ブロックをクリアします。

##### `refreshAllBlocks()`
全チャンクを再生成します。

##### `nextfbuid()`
次のフリーブロックUIDを取得します。

**戻り値**: int

### ブロック操作

##### `blockat(x, y, z)`
##### `blockat(IPos | Vector3D | Array)`
指定位置のブロックIDを取得します。

**戻り値**: int（ブロックID、0=空）

##### `placeBlock(pos, blockId[, flags])`
ブロックを配置します。

**引数**:
- `pos` (IPos | Vector3D | Array): 位置
- `blockId` (int): ブロックID
- `flags` (int, オプション): 配置フラグ

**戻り値**: int（配置結果、0xffff=失敗）

##### `fillBlock(rect, blockId)`
矩形領域をブロックで埋めます。

**引数**:
- `rect` (IRect3D): 領域
- `blockId` (int): ブロックID

**戻り値**: bool（変更があった場合 true）

### フリーブロック操作

##### `placeFreeBlock(FreeBlock)`
##### `placeFreeBlock(fbtype, fbparam, pos, fbuid)`
フリーブロックを配置します。

**引数**:
- `FreeBlock`: フリーブロックオブジェクト
- または
- `fbtype` (int): タイプ
- `fbparam` (int): パラメータ
- `pos` (IPos): 位置
- `fbuid` (int): UID

**戻り値**: int（UID）

##### `removeFreeBlock(uid)`
フリーブロックを削除します。

**引数**:
- `uid` (int): フリーブロックUID

**戻り値**: bool

##### `getFreeBlock(uid)`
フリーブロックを取得します。

**戻り値**: FreeBlock | null

##### `fblockat(x, y, z)`
指定位置のフリーブロックを取得します。

**戻り値**: FreeBlock | null

**注意**: 同じ位置に2つある場合、1つしか返しません。

##### `collectFreeBlocks(rect | flags, outArray)`
条件に合うフリーブロックを収集します。

**引数**:
- `rect` (IRect3D): 領域
- または `flags` (int): フラグマスク
- `outArray` (Array): 結果格納先

**戻り値**: Array

### バウンディング

##### `wholebnd([outRect])`
フリーブロックを含めた全体のバウンディングを取得します。

**戻り値**: IRect3D

### 描画用

##### `collectDrawChunks(table[, camera, margin])`
描画対象のチャンクを収集します。

**引数**:
- `table` (table): 結果格納先（チャンク位置 -> シーケンス番号）
- `camera` (Camera, オプション): カメラ（フラスタムカリング用）
- `margin` (float, オプション): マージン

**戻り値**: table

##### `getStatics([camera])`
統計情報を取得します。

**引数**:
- `camera` (Camera, オプション): カメラ

**戻り値**: `{ chunks: int, blks: int, fblks: int }`

### ワールド操作

##### `createResized(w, h, d, align, fill)`
リサイズしたワールドを生成します。

**引数**:
- `w, h, d` (int): 新サイズ
- `align` (int): アライメント（0-8）
- `fill` (int): 境界を埋めるか

**戻り値**: BlockWorld（新規）

##### `createCopy(rect)`
指定領域のコピーを生成します。

**戻り値**: BlockWorld（新規）

##### `createHOffset(rect, dh)`
高さオフセットを適用したワールドを生成します。

**戻り値**: BlockWorld（新規）

##### `drawWorld(srcWorld, imat[, mode])`
別のワールドを描画（合成）します。

**引数**:
- `srcWorld` (BlockWorld): ソースワールド
- `imat` (IMat): 変換行列
- `mode` (int, オプション): 描画モード

##### `clearRegion(rect)`
指定領域をクリアします。

### チャンクデータ

##### `getChunkData(cx, cy, cz)`
チャンクデータを取得します（保存用）。

**引数**:
- `cx, cy, cz` (int): チャンク座標

**戻り値**: BlockChunkData | null

##### `restoreChunkData(chunkData | null, cx, cy, cz)`
チャンクデータを復元します（null でクリア）。

**引数**:
- `chunkData` (BlockChunkData | null): チャンクデータ
- `cx, cy, cz` (int): チャンク座標

### I/O

##### `load(ByteBuffer)`
ワールドをロードします。

**戻り値**: bool

##### `store(ByteBuffer)`
ワールドを保存します。

**例**:
```javascript
local bw = BlockWorld(64, 32, 64);
bw.placeBlock(IPos(10, 5, 8), 1);
bw.fillBlock(IRect3D(0, 0, 0, 64, 1, 64), 2); // 地面

// フリーブロック配置
local fbuid = bw.nextfbuid();
bw.placeFreeBlock(100, 0, IPos(20, 5, 20), fbuid);

// 保存
local buf = ByteBuffer();
bw.store(buf);
FileRef("world.dat").open().write(buf);
```

---

## Block

ブロック定義を管理する静的クラスです。

### 静的メソッド

##### `registerBlock(blockId, definition)`
ブロックをグローバル登録します。

**引数**:
- `blockId` (int): ブロックID（1-31）
- `definition` (table): ブロック定義
  - `cls` (string): ブロッククラス名
  - `variations` (Array): バリエーション配列

**戻り値**: bool（成功時 true）

##### `getFlags(blockId)`
ブロックのフラグを取得します。

**引数**:
- `blockId` (int): ブロックID

**戻り値**: int（フラグ）

##### `isFullOcclude(blockId)`
ブロックが完全遮蔽か判定します。

**戻り値**: bool

##### `hasFlag(blockId, flag)`
ブロックが指定フラグを持つか判定します。

**引数**:
- `blockId` (int): ブロックID
- `flag` (int): フラグ（例: `BLK_STATE_ROT`）

**戻り値**: bool

##### `setState(blockId, flag, value)`
ブロックの状態を設定します。

**引数**:
- `blockId` (int): ブロックID
- `flag` (int): 状態フラグ
- `value` (int): 値

**戻り値**: int（更新後のブロックID）

##### `mergeStates(blockA, blockB)`
2つのブロックの状態をマージします。

**引数**:
- `blockA, blockB` (int): ブロックID

**戻り値**: int（マージ後のブロックID）

**例**:
```javascript
Block.registerBlock(1, {
    cls: "NormalBlock",
    variations: [
        {
            vcvp: [[vcid, vpid]],
            pal: [palette],
            color: 0xff00ff00,
            floortype: 0,
            edgeshp: 0,
            shape: 0,
            trns: 0
        }
    ]
});

local flags = Block.getFlags(1);
if(Block.hasFlag(1, BLK_STATE_ROT)) {
    local rotated = Block.setState(1, BLK_STATE_ROT, 2); // 180度回転
}
```

---

## FreeBlock

自由配置ブロックです。グリッドに拘束されず任意の位置・回転で配置できます。

### フィールド（読み取り専用）

- `fbuid` (int): UID
- `fbtype` (int): タイプ
- `fbparam` (int): パラメータ
- `flags` (int): フラグ
- `x, y, z` (int): 位置
- `rot` (int): 回転（0-3）
- `br` (IRect3D): バウンディングボックス（メタメソッド経由）
- `ir` (IRect3D): 内部バウンディング（メタメソッド経由）
- `vr` (IRect3D): ボクセルバウンディング（メタメソッド経由）

### 静的メソッド

##### `registerFreeBlock(fbtype, definition)`
フリーブロックをグローバル登録します。

**引数**:
- `fbtype` (int): フリーブロックタイプ（1-4095）
- `definition` (table): 定義
  - `cls` (string): クラス名
  - `flags` (int): フラグ（デフォルト: `BLK_SOLIDFB`）
  - `variations` (Array): バリエーション配列

**戻り値**: bool

##### `create(definition)`
フリーブロックを作成します（プレビュー用）。

**引数**:
- `definition` (table): `{fbuid, fbtype, fbparam, pos: [x,y,z], rot}`

**戻り値**: FreeBlock

### メソッド

##### `mat([outMat])`
ブロック座標系のIMatを取得します。

**戻り値**: IMat

##### `fpmat(partsIndex[, outMat])`
指定パーツのボクセル座標系IMatを取得します。

**引数**:
- `partsIndex` (int): パーツインデックス

**戻り値**: IMat

##### `renderVoxels(voxelCanvas)`
ボクセルキャンバスに描画します。

**引数**:
- `voxelCanvas` (VoxelCanvas): 描画先

##### `collisionAt(pos)`
指定位置の衝突情報を取得します。

**引数**:
- `pos` (IPos | Array): 位置

**戻り値**: int（衝突形状とrot、0=衝突なし）

##### `contacts(rect)`
指定矩形と接触しているか判定します。

**引数**:
- `rect` (IRect3D): 矩形

**戻り値**: bool

##### `refresh()`
フリーブロックを再構築します。

##### `hashcode()`
ハッシュコードを取得します。

**戻り値**: int

**例**:
```javascript
FreeBlock.registerFreeBlock(100, {
    cls: "Tree",
    flags: BLK_SOLIDFB,
    variations: [{vcvp: [[vcid, vpid]], pal: [palette], ...}]
});

local fb = FreeBlock.create({
    fbtype: 100,
    fbparam: 0,
    pos: [10, 5, 20],
    rot: 1
});

local canvas = VoxelCanvas(vd);
fb.renderVoxels(canvas);
```

---

## BlockChunkData

チャンクデータの保存・復元用クラスです（アンドゥ・リドゥに使用）。

**説明**: `BlockWorld.getChunkData()` で取得し、`BlockWorld.restoreChunkData()` で復元します。

---

## HitBlock

ブロック衝突情報を格納するクラスです。

### フィールド

- `bx, by, bz` (int): ブロック座標
- `f` (int): 面インデックス（0-5）
- `blk` (int): ブロックID
- `fbuid` (int): フリーブロックUID
- `fbtype` (int): フリーブロックタイプ
- `fbparam` (int): フリーブロックパラメータ
- `nx, ny, nz` (int): 法線ベクトル
- `fx, fy, fz` (float): 衝突位置（float）

### メソッド

##### `set(hitBlock)`
他のHitBlockからコピーします。

**引数**:
- `hitBlock` (HitBlock): コピー元

**戻り値**: HitBlock（自身）

##### `setFace(face)`
面インデックスを設定し、法線を更新します。

**引数**:
- `face` (int): 面インデックス（0-5）

**戻り値**: HitBlock（自身）

##### `push(distance)`
法線方向に押し出します。

**引数**:
- `distance` (int): 距離

**戻り値**: HitBlock（自身）

**例**:
```javascript
local hb = HitBlock();
hb.setFace(1); // +X面
hb.push(1); // 1ブロック押し出し
println("衝突座標: (" + hb.bx + ", " + hb.by + ", " + hb.bz + ")");
```

---

## BlockColiderInterface

BlockWorldの物理衝突インターフェースです。Bullet物理エンジンと統合します。

### コンストラクタ

```javascript
BlockColiderInterface(blockWorld)
```

**引数**:
- `blockWorld` (BlockWorld): 対象ワールド

### フィールド

- `bw` (BlockWorld): BlockWorld
- `lock` (int): ロックフラグ
- `flagmask` (int, 読み取り専用): フラグマスク

### メソッド

##### `createCollisions(rect)`
指定領域のコリジョンを生成します。

**引数**:
- `rect` (IRect3D): 領域

##### `setFlagMask(mask)`
衝突判定に使用するフラグマスクを設定します。

**引数**:
- `mask` (int): フラグマスク

##### `setFinMode(mode)`
フィンモードを設定します。

**引数**:
- `mode` (int): モード

##### `getHitBlock(hitPos, partId, triId, outHitBlock)`
衝突情報からHitBlockを取得します。

**引数**:
- `hitPos` (Vector3D): 衝突位置
- `partId` (int): パートID
- `triId` (int): トライアングルID
- `outHitBlock` (HitBlock): 出力先

**戻り値**: HitBlock

##### `setBarriorMap(bitmap)`
バリアマップを設定します。

**引数**:
- `bitmap` (Bitmap | null): バリアマップ

##### `calcSeq(rect)`
指定領域のシーケンス番号を計算します。

**引数**:
- `rect` (Rect3D): 領域

**戻り値**: int

##### `collectCollisions(rect, outArray)`
指定領域のコリジョンデータを収集します。

**引数**:
- `rect` (IRect3D): 領域
- `outArray` (Array): 出力先

**戻り値**: Array

##### `convertCollisionVoxel(voxelData8)` (静的)
VoxelData8をコリジョンボクセルに変換します。

**引数**:
- `voxelData8` (VoxelData8): 変換元

**戻り値**: VoxelData8（コリジョンボクセル）

**例**:
```javascript
local bw = BlockWorld(64, 32, 64);
local colInterface = BlockColiderInterface(bw);
colInterface.createCollisions(IRect3D(0, 0, 0, 64, 32, 64));
colInterface.setFlagMask(BLK_SOLIDFB);

// 物理エンジンで使用...
```

---

## BlockRenderer

BlockWorldからVoxelDataやVoxelMeshDataを並列生成する静的クラスです。

### 静的メソッド

##### `createVoxelMeshDatas(requestArray)`
複数のチャンクをボクセル→メッシュに並列変換します。

**引数**:
- `requestArray` (Array): リクエスト配列
  - 各要素: `{id, bw, br: IRect3D, border, flags, vs, rembottom, hash, orgpos?}`

**戻り値**: table（id -> VoxelMeshData | rescode）

**結果コード**:
- `0`: 成功（VoxelMeshData）
- `1`: 変化なし（hash一致）
- `2`: 空ボクセル
- `-1`: 失敗

##### `createVoxelDatas(requestArray)`
複数のチャンクをVoxelDataに並列変換します。

**引数**:
- `requestArray` (Array): リクエスト配列
  - 各要素: `{id, bw, br: IRect3D, vd, flags}`

**戻り値**: table（id -> VoxelData | rescode）

**例**:
```javascript
local bw = BlockWorld(64, 32, 64);
// ... ブロック配置 ...

local requests = [];
for(local y = 0; y < 4; y++) {
    for(local x = 0; x < 8; x++) {
        for(local z = 0; z < 8; z++) {
            local id = (y * 64) + (z * 8) + x;
            requests.append({
                id: id,
                bw: bw,
                br: IRect3D(x*8, y*8, z*8, 8, 8, 8),
                border: 1,
                flags: 0,
                vs: 63,
                rembottom: true,
                hash: 0
            });
        }
    }
}

local results = BlockRenderer.createVoxelMeshDatas(requests);

// 結果処理
foreach( id, vmd in results) {
    if(typeof(vmd) == "integer") {
        println("チャンク " + id + " は rescode=" + vmd);
    } else {
        println("チャンク " + id + " メッシュ生成: vtx=" + vmd.vtxnum + " idx=" + vmd.idxnum);
    }
}
```

---

## VoxelMeshData

ボクセルメッシュデータです。頂点・インデックスバッファとフェース情報を保持します。

### フィールド（読み取り専用）

- `datasize` (int): データサイズ（バイト）
- `idxnum` (int): インデックス数
- `vtxnum` (int): 頂点数
- `facenum` (int): フェース数
- `dt0, dt1, dt2, dt3` (int): デバッグ用タイミング情報
- `hash` (uint64, メタメソッド経由): ハッシュ値

### メソッド

##### `getVertexData()`
頂点データの共有ByteBufferを取得します。

**戻り値**: ByteBuffer

##### `getIndexData()`
インデックスデータの共有ByteBufferを取得します。

**戻り値**: ByteBuffer

##### `getFaceInfo(index, outArray)`
フェース情報を取得します。

**引数**:
- `index` (int): フェースインデックス
- `outArray` (Array): 出力先（4要素以上）

**戻り値**: Array（`[type, offs, len, voffs]`）

##### `getBounds()`
境界矩形を取得します。

**戻り値**: IRect3D

##### `getSubBounds()`
サブ境界矩形を取得します。

**戻り値**: IRect3D

##### `dispose()`
メモリを解放します。

**例**:
```javascript
local vmd = VoxelMeshBuilder.createVoxelMeshData(vd8, rect);
println("頂点数: " + vmd.vtxnum);
println("インデックス数: " + vmd.idxnum);
println("フェース数: " + vmd.facenum);

local vtxBuf = vmd.getVertexData();
local idxBuf = vmd.getIndexData();

// 描画に使用...
vmd.dispose();
```

---

## VoxelMeshBuilder

ボクセルデータからVoxelMeshDataを生成する静的クラスです。

### 静的メソッド

##### `createVoxelMeshData(voxelData, [rect[, flags[, vsmask[, orgpos]]]])`
VoxelMeshDataを生成します。

**引数**:
- `voxelData` (VoxelData | VoxelData8): ボクセルデータ
- `rect` (IRect3D, オプション): 生成範囲（デフォルト: 全体）
- `flags` (int, オプション): フラグ
- `vsmask` (int, オプション): 可視面マスク（0-63、デフォルト: 63）
- `orgpos` (Array, オプション): 原点位置 `[x, y, z]`

**戻り値**: VoxelMeshData | null

##### `createVoxelMeshDatas(requestArray)`
複数のVoxelMeshDataを並列生成します。

**引数**:
- `requestArray` (Array): リクエスト配列
  - 各要素: `{id, vd, r: IRect3D, flags?, vs?, orgpos?}`

**戻り値**: table（id -> VoxelMeshData | rescode）

**例**:
```javascript
local vd8 = VoxelData8(32, 32, 32);
// ... ボクセル描画 ...

// 単一メッシュ生成
local vmd = VoxelMeshBuilder.createVoxelMeshData(vd8);

// 複数メッシュ並列生成
local requests = [
    {id: 0, vd: vd8, r: IRect3D(0, 0, 0, 16, 16, 16), vs: 63},
    {id: 1, vd: vd8, r: IRect3D(16, 0, 0, 16, 16, 16), vs: 63}
];
local results = VoxelMeshBuilder.createVoxelMeshDatas(requests);

for(id, vmd in results) {
    if(typeof(vmd) == "integer") {
        println("ID " + id + " は失敗: " + vmd);
    } else {
        println("ID " + id + " 成功: vtx=" + vmd.vtxnum);
    }
}
```

---

## VoxelSelecter

ボクセル選択ツールです。レイキャストでボクセルを選択します。

### 静的メソッド

##### `raytest(voxelData, rayOrigin, rayDir, mask, outSelectedVoxel)`
レイキャストでボクセルを検出します。

**引数**:
- `voxelData` (VoxelData8): ボクセルデータ
- `rayOrigin` (Vector3D): レイ原点
- `rayDir` (Vector3D): レイ方向
- `mask` (int): マスク
- `outSelectedVoxel` (SelectedVoxel): 出力先

**戻り値**: bool（ヒットした場合 true）

**SelectedVoxelフィールド**:
- `x, y, z` (int): ボクセル座標
- `vox` (int): ボクセル値
- `face` (int): 面インデックス（0-5）
- `t` (float): レイパラメータ

**例**:
```javascript
local vd8 = VoxelData8(32, 32, 32);
// ... ボクセル描画 ...

local sel = SelectedVoxel();
local origin = Vector3D(-10, 16, 16);
local dir = Vector3D(1, 0, 0);

if(VoxelSelecter.raytest(vd8, origin, dir, -1, sel)) {
    println("ヒット: (" + sel.x + ", " + sel.y + ", " + sel.z + ")");
    println("面: " + sel.face + " t=" + sel.t);
}
```

---

## 使用例

### 基本的なボクセル操作

```javascript
// 32bitボクセルデータ作成
local vd = VoxelData(16, 16, 16);
vd.clear(0);

// ボクセル設定
for(local x = 0; x < 16; x++) {
	for(local z = 0; z < 16; z++) {
		local idx = z + x * 16; // y=0
		vd[idx] = 0xff00ff00; // 緑
	}
}

// 回転
vd.rotate(1); // 90度回転
```

---

### 8bitパレットボクセル

```javascript
// 8bitボクセルデータ作成
local vd8 = VoxelData8(32, 32, 32);

// パレット設定
vd8.pal[1] = 0xff0000ff; // 赤
vd8.pal[2] = 0x00ff00ff; // 緑
vd8.pal[3] = 0x0000ffff; // 青

// ボクセル描画
for(local y = 0; y < 10; y++) {
	local idx = y; // x=0, z=0
	vd8[idx] = (y % 3) + 1; // パレット1-3を交互に
}

// 使用色取得
local colors = vd8.getUsingColors();
println("使用パレット: " + colors);
```

---

### ブロックワールドの構築

```javascript
// ワールド作成
local bw = BlockWorld(128, 64, 128);

// 地面を敷く
bw.fillBlock(IRect3D(0, 0, 0, 128, 1, 128), 1);

// 壁を作る
for(local x = 0; x < 20; x++) {
	for(local y = 1; y < 5; y++) {
		bw.placeBlock(IPos(x, y, 10), 2);
	}
}

// フリーブロック配置（例: 木）
local treeType = 100;
local fbuid = bw.nextfbuid();
bw.placeFreeBlock(treeType, 0, IPos(50, 1, 50), fbuid);

// 統計取得
local stats = bw.getStatics();
println("チャンク数: " + stats.chunks);
println("ブロック数: " + stats.blks);
println("フリーブロック数: " + stats.fblks);
```

---

### ワールドのリサイズ

```javascript
local bw = BlockWorld(64, 32, 64);
bw.fillBlock(IRect3D(10, 0, 10, 20, 10, 20), 1);

// 128x32x128にリサイズ（中央寄せ）
local bw2 = bw.createResized(128, 32, 128, 4, 0);
// align: 0=左上, 1=上中央, 2=右上
//        3=左中央, 4=中央, 5=右中央
//        6=左下, 7=下中央, 8=右下
```

---

### 部分コピー

```javascript
local bw = BlockWorld(128, 64, 128);
// ... ワールド構築 ...

// 一部をコピー
local region = IRect3D(20, 0, 20, 40, 32, 40);
local bw2 = bw.createCopy(region);

println("コピー結果: " + bw2.w + "x" + bw2.h + "x" + bw2.d);
```

---

### 座標変換

```javascript
local m = IMat(1); // 90度回転
m.translate(10, 5, 8);

local pos = IPos(5, 0, 3);
m.transform(pos);
println("変換後: (" + pos.x + ", " + pos.y + ", " + pos.z + ")");

// IRect3D変換
local rect = IRect3D(0, 0, 0, 10, 10, 10);
m.transform(rect);
```

---

### ワールドの保存・読み込み

```javascript
// 保存
local bw = BlockWorld(64, 32, 64);
// ... 構築 ...
local buf = ByteBuffer();
bw.store(buf);
FileRef("world.dat").open().write(buf);

// 読み込み
local loadBuf = FileRef("world.dat").open().read();
local bw2 = BlockWorld();
if(bw2.load(loadBuf)) {
	println("ロード成功: " + bw2.w + "x" + bw2.h + "x" + bw2.d);
}
```

---

### チャンクデータの保存・復元（アンドゥ・リドゥ）

```javascript
local bw = BlockWorld(64, 32, 64);

// 編集前のチャンクデータを保存
local cx = 5, cy = 2, cz = 3;
local oldData = bw.getChunkData(cx, cy, cz);

// 編集
bw.fillBlock(IRect3D(40, 16, 24, 8, 8, 8), 5);

// 新しいデータを保存
local newData = bw.getChunkData(cx, cy, cz);

// アンドゥ
bw.restoreChunkData(oldData, cx, cy, cz);

// リドゥ
bw.restoreChunkData(newData, cx, cy, cz);
```

---

### 描画対象チャンク収集

```javascript
local bw = BlockWorld(128, 64, 128);
local camera = Camera();
camera.lookAt(Vector3D(64, 32, 64), Vector3D(0, 0, 0));

// カメラ視野内のチャンクを収集
local chunks = {};
bw.collectDrawChunks(chunks, camera, 5.0);

foreach( cpos, seq in chunks) {
	println("チャンク " + cpos + " (seq=" + seq + ")");
	// チャンクを描画...
}
```

---

### フリーブロックの収集

```javascript
// 特定領域のフリーブロックを収集
local rect = IRect3D(0, 0, 0, 64, 32, 64);
local freeBlocks = [];
bw.collectFreeBlocks(rect, freeBlocks);

foreach( fb in freeBlocks) {
	println("フリーブロック UID=" + fb.fbuid + " type=" + fb.fbtype);
}

// 特定フラグを持つフリーブロックを収集
local FLAG_ENEMY = 0x1;
local enemies = [];
bw.collectFreeBlocks(FLAG_ENEMY, enemies);
```

---

### ワールド合成

```javascript
local bw1 = BlockWorld(64, 32, 64);
local bw2 = BlockWorld(32, 16, 32);
// ... bw2を構築 ...

// bw2をbw1の座標(20, 5, 20)に90度回転して描画
local m = IMat(1); // 90度回転
m.translate(20, 5, 20);
bw1.drawWorld(bw2, m, 0);
```

---

## パフォーマンス最適化

### チャンク管理

BlockWorld は 8x8x8 ブロックのチャンクで管理されています。空のチャンクはメモリを消費しません。

```javascript
// 大きなワールドでも空の部分はメモリ効率的
local bw = BlockWorld(1024, 64, 1024);
// 実際に使用されるメモリは配置されたチャンク数に依存
```

### 一括配置

`placeBlock()` を大量に呼ぶ代わりに、可能な限り `fillBlock()` を使用してください。

```javascript
// 遅い
for(local x = 0; x < 64; x++) {
	for(local z = 0; z < 64; z++) {
		bw.placeBlock(IPos(x, 0, z), 1);
	}
}

// 速い
bw.fillBlock(IRect3D(0, 0, 0, 64, 1, 64), 1);
```

### シーケンス番号による変更検出

```javascript
local oldSeq = bw.seq;

// ... 編集 ...

if(bw.seq != oldSeq) {
	println("ワールドが変更されました");
	// メッシュ再生成など
}
```
