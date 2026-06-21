# SakanaGL Physics3D API リファレンス

このドキュメントは、SakanaGL の 3D 物理シミュレーションおよび衝突判定 API (`core/api/ssapi_physics3d.cpp`) に関するリファレンスです。

## 概要

SakanaGL Physics3D API は Bullet Physics をベースとした 3D 物理シミュレーション機能を提供します。リジッドボディ、コリジョン形状、制約、レイキャスト、接触テストなどの物理演算機能にアクセスできます。

---

## 目次

- [グローバル関数](#グローバル関数)
- [b3Result](#b3result) - 衝突判定結果
- [b3World](#b3world) - 物理ワールド
- [b3Shape](#b3shape) - コリジョン形状
- [b3Body](#b3body) - 剛体
- [b3Constraint](#b3constraint) - 物理拘束
- [b3CompoundChild](#b3compoundchild) - 複合形状の子要素
- [b3ConcaveInterface](#b3concaveinterface) - カスタム凹面インターフェース
- [定数](#定数)
- [使用例](#使用例)

---

## グローバル関数

### skPhysicalPoseToBoneList

```javascript
skPhysicalPoseToBoneList(Matrix, Array)
```

**説明**: 物理演算結果をボーン配列に適用します。スケルタルアニメーション用の物理同期処理です。

**引数**:
- `Matrix`: グローバル変換行列
- `Array`: `Bone` オブジェクトの配列

**戻り値**: なし

### skBonePoseToPhysicalList

```javascript
skBonePoseToPhysicalList(Matrix, Array[, nondynamic])
```

**説明**: ボーン配列の姿勢を物理ワールドに反映します。

**引数**:
- `Matrix`: グローバル変換行列
- `Array`: `Bone` オブジェクトの配列
- `nondynamic` (int, オプション): 非ダイナミックボーンをスキップするフラグ

**戻り値**: なし

### skContactTest

```javascript
skContactTest(mode, srcShape, srcMatrix, dstShape, dstMatrix[, b3Result]) -> b3Result
```

**説明**: 2つの形状間の接触判定を実行します。

**引数**:
- `mode` (int): テストモード (`SK_TEST_ALL` または `SK_TEST_CLOSEST`)
- `srcShape` (b3Shape): ソース形状
- `srcMatrix` (Matrix): ソース変換行列
- `dstShape` (b3Shape): ターゲット形状
- `dstMatrix` (Matrix): ターゲット変換行列
- `b3Result` (オプション): 結果格納先（省略時はグローバルインスタンス使用）

**戻り値**: `b3Result` - 衝突判定結果

### skConvexSweepTest

```javascript
skConvexSweepTest(mode, shape, fromMatrix, toMatrix, dstShape, dstMatrix[, b3Result]) -> b3Result
```

**説明**: 凸包形状のスイープテスト（移動軌跡上の衝突判定）を実行します。

**引数**:
- `mode` (int): テストモード
- `shape` (b3Shape): 凸包形状
- `fromMatrix` (Matrix | Vector3D): 開始位置
- `toMatrix` (Matrix | Vector3D): 終了位置
- `dstShape` (b3Shape): ターゲット形状
- `dstMatrix` (Matrix): ターゲット変換行列
- `b3Result` (オプション): 結果格納先

**戻り値**: `b3Result` - 衝突判定結果

---

## b3Result

衝突判定やレイキャストの結果を格納するクラスです。イテレート可能で、複数の衝突結果を順次処理できます。

### コンストラクタ

```javascript
b3Result([capacity])
```

**引数**:
- `capacity` (int, オプション): 結果格納容量（デフォルト: 16、最大: 1024）

### プロパティ

**読み取り専用**:
- `bodya` (b3Body | null): 衝突したボディA
- `bodyb` (b3Body | null): 衝突したボディB
- `pointa` (Vector3D): ボディA上の衝突点
- `pointb` (Vector3D): ボディB上の衝突点
- `normal` (Vector3D): 衝突法線ベクトル
- `reflect` (Vector3D): 反射ベクトル
- `surfnormal` (Vector3D | null): ポリゴン表面法線（取得可能な場合）
- `fraction` (float): レイキャスト時の衝突距離（0.0～1.0）
- `partida` (int): ボディAのパートID
- `partidb` (int): ボディBのパートID
- `trida` (int): ボディAの三角形インデックス
- `tridb` (int): ボディBの三角形インデックス
- `groupa` (int): ボディAのコリジョングループ
- `groupb` (int): ボディBのコリジョングループ
- `length` (int): 衝突結果の総数
- `index` (int): 現在のインデックス（読み書き可）

### メソッド

##### `len()`
衝突結果の総数を取得します。

**戻り値**: int

##### `getReferences([Array])`
衝突したボディの `ref` プロパティを収集します。

**引数**:
- `Array` (オプション): 既存の配列を再利用

**戻り値**: Array - ボディ参照の配列

##### `dotSurfaceNormal()`
法線ベクトルと表面法線の内積を計算します。

**戻り値**: float（-1.0～1.0、表面法線が取れない場合は 1.0）

### イテレーション

`b3Result` は for-in ループでイテレート可能です:

```javascript
let result = b3Result();
world.rayTest(SK_TEST_ALL, from, to, -1, -1, result);
for(let i, v in result) {
	println("hit: ", v.bodya, " at ", v.pointa);
}
```

---

## b3World

物理シミュレーション空間を表すクラスです。剛体、制約を管理し、シミュレーション更新や衝突判定を実行します。

### コンストラクタ

```javascript
b3World([Rect3D[, flags]])
```

**引数**:
- `Rect3D` (オプション): ワールドの空間範囲（デフォルト: 0,0,0から1000x1000x1000）
- `flags` (int, オプション): 初期化フラグ

### メソッド

##### `setGravity(gravity)`
重力ベクトルを設定します。

**引数**:
- `gravity` (float | Vector3D): Y方向重力（floatの場合）またはベクトル

##### `getGravity()`
重力ベクトルを取得します。

**戻り値**: Vector3D

##### `numBodies()`
ワールド内の剛体数を取得します。

**戻り値**: int

##### `numConstraints()`
ワールド内の拘束数を取得します。

**戻り値**: int

##### `clear()`
ワールドをクリアします（全剛体・拘束を削除）。

##### `addBody(b3Body)`
剛体をワールドに追加します。

**引数**:
- `b3Body`: 追加する剛体

##### `removeBody(b3Body)`
剛体をワールドから削除します。

**引数**:
- `b3Body`: 削除する剛体

##### `getBodies(Array[, mask])`
ワールド内の剛体を収集します。

**引数**:
- `Array`: 結果格納先配列
- `mask` (int, オプション): コリジョングループマスク（デフォルト: -1）

**戻り値**: Array - 剛体の配列

##### `addConstraint(b3Constraint)`
拘束をワールドに追加します。

**引数**:
- `b3Constraint`: 追加する拘束

##### `removeConstraint(b3Constraint)`
拘束をワールドから削除します。

**引数**:
- `b3Constraint`: 削除する拘束

##### `rayTest(mode, from, to[, group[, mask[, b3Result]]])`
レイキャストテストを実行します。

**引数**:
- `mode` (int): `SK_TEST_ALL` または `SK_TEST_CLOSEST`
- `from` (Vector3D): レイの始点
- `to` (Vector3D): レイの終点
- `group` (int, オプション): コリジョングループ（デフォルト: -1）
- `mask` (int, オプション): コリジョンマスク（デフォルト: -1）
- `b3Result` (オプション): 結果格納先

**戻り値**: b3Result

##### `convexSweepTest(mode, b3Shape, fromMatrix, toMatrix[, group[, mask[, b3Result]]])`
凸包スイープテストを実行します。

**引数**:
- `mode` (int): テストモード
- `b3Shape`: 凸包形状
- `fromMatrix` (Matrix | Vector3D): 開始変換
- `toMatrix` (Matrix | Vector3D): 終了変換
- `group` (int, オプション): コリジョングループ
- `mask` (int, オプション): コリジョンマスク
- `b3Result` (オプション): 結果格納先

**戻り値**: b3Result

##### `contactTest(mode, b3Shape, Matrix[, group[, mask[, b3Result]]])`
形状の接触テストを実行します。

**引数**:
- `mode` (int): テストモード
- `b3Shape`: テスト形状
- `Matrix`: 形状の変換行列
- `group` (int, オプション): コリジョングループ
- `mask` (int, オプション): コリジョンマスク
- `b3Result` (オプション): 結果格納先

**戻り値**: b3Result

##### `simulate([timeStep[, substeps[, fixedTimeStep]]])`
物理シミュレーションを更新します。

**引数**:
- `timeStep` (float, オプション): タイムステップ（秒）（デフォルト: 1/60）
- `substeps` (int, オプション): サブステップ数（デフォルト: 1）
- `fixedTimeStep` (float, オプション): 固定タイムステップ（デフォルト: 1/60）

**戻り値**: int - 実行されたサブステップ数

##### `updateAABBs()`
全剛体のAABBを更新します。

##### `computeOverlappingPairs()`
重複ペアを再計算します。

##### `scroll(Vector3D)`
ワールド全体を移動（スクロール）します。

**引数**:
- `Vector3D`: オフセットベクトル

##### `setLoopRegion(x0, z0, x1, z1, margin)`
ループ領域を設定します（無限ワールド用）。

**引数**:
- `x0`, `z0`, `x1`, `z1` (float): 領域境界
- `margin` (float): マージン

---

## b3Shape

コリジョン形状を表すクラスです。球、ボックス、メッシュなど様々な形状を作成できます。

### 静的メソッド（ファクトリ）

##### `b3Shape.createPlane(a, b, c, d)` or `b3Shape.createPlane(Plane)`
平面形状を作成します。

**引数**:
- `a, b, c, d` (float): 平面方程式の係数
- `Plane`: 平面オブジェクト

**戻り値**: b3Shape

##### `b3Shape.createBox(x, y, z)`
ボックス形状を作成します。

**引数**:
- `x, y, z` (float): 半サイズ

**戻り値**: b3Shape

##### `b3Shape.createCylinder(x, y, z)`
円柱形状を作成します。

**引数**:
- `x, y, z` (float): 半径と高さ

**戻り値**: b3Shape

##### `b3Shape.createSphere(radius)`
球形状を作成します。

**引数**:
- `radius` (float): 半径

**戻り値**: b3Shape

##### `b3Shape.createCapsule(radius, height)`
カプセル形状を作成します。

**引数**:
- `radius` (float): 半径
- `height` (float): 高さ

**戻り値**: b3Shape

##### `b3Shape.createCone(radius, height)`
円錐形状を作成します。

**引数**:
- `radius` (float): 半径
- `height` (float): 高さ

**戻り値**: b3Shape

##### `b3Shape.createMesh(vtx, idx)`
メッシュ形状を作成します。

**引数**:
- `vtx` (VertexBufferStream | ByteBuffer): 頂点データ
- `idx` (IndexBuffer | ByteBuffer | Array): インデックスデータ（配列の場合は複数マテリアル）

**戻り値**: b3Shape

##### `b3Shape.createMeshArray(Array)`
メッシュ形状を配列で一括作成します。

**引数**:
- `Array`: `[vtx, idx, ...]` 形式の配列の配列

**戻り値**: Array - b3Shape配列

##### `b3Shape.createMeshArrayAsync(Array)`
メッシュ形状を非同期で一括作成します。

**引数**:
- `Array`: `[vtx, idx, ...]` 形式の配列の配列

**戻り値**: Future - 完了すると b3Shape 配列を返す

##### `b3Shape.createConvexCloud(Array | VertexBufferStream[, optimize])`
凸包形状を点群から作成します。

**引数**:
- `Array | VertexBufferStream`: 頂点座標の配列またはストリーム
- `optimize` (bool, オプション): 最適化フラグ

**戻り値**: b3Shape

##### `b3Shape.createCompound()`
複合形状を作成します。

**戻り値**: b3Shape

##### `b3Shape.createCustomConcave(b3ConcaveInterface)`
カスタム凹面形状を作成します。

**引数**:
- `b3ConcaveInterface`: 凹面インターフェース

**戻り値**: b3Shape

### インスタンスメソッド

##### `addChild(b3Shape | b3CompoundChild, Matrix[, partid[, trid]])`
複合形状に子形状を追加します。

**引数**:
- `b3Shape | b3CompoundChild`: 子形状または複合子要素
- `Matrix`: 変換行列
- `partid` (int, オプション): パートID
- `trid` (int, オプション): 三角形ID

##### `removeChild(index)`
複合形状から子形状を削除します。

**引数**:
- `index` (int): インデックス

##### `clearChildren()`
複合形状の全子形状をクリアします。

##### `len()`
複合形状の子要素数を取得します。

**戻り値**: int

##### `getSize()`
形状のサイズを取得します。

**戻り値**: Vector3D

##### `getBounds([Matrix])`
形状のバウンディングボックスを取得します。

**引数**:
- `Matrix` (オプション): 変換行列

**戻り値**: Rect3D

##### `setLocalScaling(Vector3D | Rect3D | float | x, y, z)`
形状のローカルスケールを設定します。

**引数**:
- `Vector3D | Rect3D | float`: スケール
- `x, y, z` (float): 個別スケール

##### `getLocalScaling()`
形状のローカルスケールを取得します。

**戻り値**: Vector3D

##### `getConcaveInterface()`
カスタム凹面インターフェースを取得します。

**戻り値**: b3ConcaveInterface | null

### プロパティ

- `type` (int, 読み取り専用): 形状タイプ（`SK_SHAPE_*` 定数）

### メタメソッド

- `[index]`: 複合形状の子要素にアクセス（`[b3Shape, Matrix]` タプルを返す）
- `#`: 子要素数を返す

---

## b3Body

剛体を表すクラスです。質量、形状、変換行列を持ち、力や速度を制御できます。

### コンストラクタ

```javascript
b3Body(mass, b3Shape[, Matrix[, group[, mask]]])
```

**引数**:
- `mass` (float): 質量（0の場合は静的オブジェクト）
- `b3Shape`: コリジョン形状
- `Matrix` (オプション): 初期変換行列
- `group` (int, オプション): コリジョングループ（デフォルト: 1）
- `mask` (int, オプション): コリジョンマスク（デフォルト: -1）

### プロパティ

**読み取り専用**:
- `group` (int): コリジョングループ
- `mask` (int): コリジョンマスク

**読み書き**:
- `ref`: 任意の参照オブジェクト

### メソッド

##### `getCollisionFlags()`
コリジョンフラグを取得します。

**戻り値**: int

##### `setCollisionFlags(flags)`
コリジョンフラグを設定します。

**引数**:
- `flags` (int): フラグ（`CF_STATIC_OBJECT`, `CF_KINEMATIC_OBJECT` など）

##### `setCollisionFilter(group, mask)`
コリジョンフィルタを設定します。

**引数**:
- `group` (int): コリジョングループ
- `mask` (int): コリジョンマスク

##### `mute(flag)`
物理演算を一時停止します。

**引数**:
- `flag` (bool): ミュートフラグ

##### `getB3World()`
所属するワールドを取得します。

**戻り値**: b3World | null

##### `convexSweepTest(mode, toMatrix[, group[, mask[, b3Result]]])`
剛体形状のスイープテストを実行します。

**引数**:
- `mode` (int): テストモード
- `toMatrix` (Matrix | Vector3D): 終了位置
- `group` (int, オプション): コリジョングループ
- `mask` (int, オプション): コリジョンマスク
- `b3Result` (オプション): 結果格納先

**戻り値**: b3Result

##### `contactTest(mode[, group[, mask[, b3Result]]])`
剛体の接触テストを実行します。

**引数**:
- `mode` (int): テストモード
- `group` (int, オプション): コリジョングループ
- `mask` (int, オプション): コリジョンマスク
- `b3Result` (オプション): 結果格納先

**戻り値**: b3Result

##### `setActivationState(state)`
アクティベーション状態を設定します。

**引数**:
- `state` (int): 状態（`ACTIVE_TAG` など）

##### `getActivationState()`
アクティベーション状態を取得します。

**戻り値**: int

##### `getTransform([Matrix])`
変換行列を取得します（オフセット考慮）。

**引数**:
- `Matrix` (オプション): 再利用する行列

**戻り値**: Matrix

##### `getRawTransform([Matrix])`
生の変換行列を取得します（オフセット無視）。

**引数**:
- `Matrix` (オプション): 再利用する行列

**戻り値**: Matrix

##### `setTransform(Matrix)`
変換行列を設定します。

**引数**:
- `Matrix`: 新しい変換行列

##### `setOffsetTransform(Matrix | null)`
オフセット変換行列を設定します。

**引数**:
- `Matrix | null`: オフセット行列（nullでクリア）

##### `getOffsetTransform()`
オフセット変換行列を取得します。

**戻り値**: Matrix | null

##### `updateAABB()`
AABBを更新します。

##### `getBounds([Rect3D])`
バウンディングボックスを取得します。

**引数**:
- `Rect3D` (オプション): 再利用するRect3D

**戻り値**: Rect3D

##### `setDamping(linear, angular)`
減衰係数を設定します。

**引数**:
- `linear` (float): 線形減衰
- `angular` (float): 角度減衰

##### `getDamping()`
減衰係数を取得します。

**戻り値**: Array - `[linear, angular]`

##### `applyForce(Vector3D[, relativePos])`
力を適用します。

**引数**:
- `Vector3D`: 力ベクトル
- `relativePos` (Vector3D, オプション): 相対位置

##### `applyTorque(Vector3D)`
トルクを適用します。

**引数**:
- `Vector3D`: トルクベクトル

##### `applyImpulse(Vector3D[, relativePos])`
衝撃を適用します。

**引数**:
- `Vector3D`: 衝撃ベクトル
- `relativePos` (Vector3D, オプション): 相対位置

##### `applyTorqueImpulse(Vector3D)`
回転衝撃を適用します。

**引数**:
- `Vector3D`: 回転衝撃ベクトル

##### `clearForces()`
全ての力をクリアします。

##### `setRestitution(value)`
反発係数を設定します。

**引数**:
- `value` (float): 反発係数（0.0～1.0）

##### `setFriction(value)`
摩擦係数を設定します。

**引数**:
- `value` (float): 摩擦係数

##### `setGravity(Vector3D | float)`
剛体固有の重力を設定します。

**引数**:
- `Vector3D | float`: 重力ベクトルまたはY方向重力

##### `setLinearVelocity(Vector3D)`
線形速度を設定します。

**引数**:
- `Vector3D`: 速度ベクトル

##### `getLinearVelocity([Vector3D])`
線形速度を取得します。

**引数**:
- `Vector3D` (オプション): 再利用するベクトル

**戻り値**: Vector3D

##### `setAngularVelocity(Vector3D)`
角速度を設定します。

**引数**:
- `Vector3D`: 角速度ベクトル

##### `getAngularVelocity([Vector3D])`
角速度を取得します。

**引数**:
- `Vector3D` (オプション): 再利用するベクトル

**戻り値**: Vector3D

##### `setAngularFactor(Vector3D)`
角度要素を設定します（回転制限）。

**引数**:
- `Vector3D`: 角度要素（0.0～1.0）

##### `getAngularFactor([Vector3D])`
角度要素を取得します。

**引数**:
- `Vector3D` (オプション): 再利用するベクトル

**戻り値**: Vector3D

##### `getShape()`
コリジョン形状を取得します。

**戻り値**: b3Shape

##### `setShape(b3Shape)`
コリジョン形状を設定します。

**引数**:
- `b3Shape`: 新しい形状

##### `getContactPairs(Array)`
接触中の剛体を取得します。

**引数**:
- `Array`: 結果格納先配列

**戻り値**: Array | null

##### `isGhost()`
ゴーストオブジェクトかどうかを判定します。

**戻り値**: bool

##### `enableLoop(flag)`
ループ機能を有効化します。

**引数**:
- `flag` (bool): 有効フラグ

##### `enableScroll(flag)`
スクロール機能を有効化します。

**引数**:
- `flag` (bool): 有効フラグ

##### `isDynamic()`
動的オブジェクトかどうかを判定します。

**戻り値**: bool

---

## b3Constraint

剛体間の拘束（Joint）を表すクラスです。

### 静的メソッド（ファクトリ）

##### `b3Constraint.createP2P(bodyA, bodyB, pivotA, pivotB)`
Point-to-Point制約を作成します。

**引数**:
- `bodyA`, `bodyB` (b3Body): 接続する剛体
- `pivotA`, `pivotB` (Vector3D): ピボット点

**戻り値**: b3Constraint

##### `b3Constraint.createDOF6(bodyA, bodyB, frameA, frameB)`
6自由度制約を作成します。

**引数**:
- `bodyA`, `bodyB` (b3Body): 接続する剛体
- `frameA`, `frameB` (Matrix): フレーム行列

**戻り値**: b3Constraint

##### `b3Constraint.createDOF6Spring(bodyA, bodyB, frameA, frameB)`
6自由度スプリング制約を作成します。

**引数**:
- `bodyA`, `bodyB` (b3Body): 接続する剛体
- `frameA`, `frameB` (Matrix): フレーム行列

**戻り値**: b3Constraint

### インスタンスメソッド（DOF6専用）

##### `setAngularLimit(Array)`
角度制限を設定します。

**引数**:
- `Array`: 6要素配列 `[lowerX, lowerY, lowerZ, upperX, upperY, upperZ]`

##### `setLinearLimit(Array)`
線形制限を設定します。

**引数**:
- `Array`: 6要素配列 `[lowerX, lowerY, lowerZ, upperX, upperY, upperZ]`

##### `setLinearRestitution(value)`
線形反発係数を設定します。

**引数**:
- `value` (float): 反発係数

##### `setAngularBounce(x, y, z)`
角度バウンスを設定します。

**引数**:
- `x, y, z` (float): 各軸のバウンス値

##### `setAngularDamping(x, y, z)`
角度減衰を設定します。

**引数**:
- `x, y, z` (float): 各軸の減衰値

##### `setSpring(index, enable, stiffness, damping)`
スプリングを設定します（DOF6Spring専用）。

**引数**:
- `index` (int): 軸インデックス（0-5、負値で全軸）
- `enable` (bool): 有効フラグ
- `stiffness` (float): 剛性
- `damping` (float): 減衰

---

## b3CompoundChild

複合形状の子要素を表すクラスです。

### フィールド

- `tx`, `ty`, `tz` (float): 平行移動
- `rx`, `ry`, `rz`, `rw` (float): 回転クォータニオン
- `shp` (b3Shape): 子形状
- `partid` (int): パートID
- `trid` (int): 三角形ID

### メソッド

##### `setTranslation(Vector3D | Rect3D | x, y, z)`
平行移動を設定します。

**引数**:
- `Vector3D | Rect3D | x, y, z`: 移動量

**戻り値**: 自身

##### `setRotation(Quaternion)`
回転を設定します。

**引数**:
- `Quaternion`: 回転クォータニオン

**戻り値**: 自身

---

## b3ConcaveInterface

カスタム凹面形状のインターフェースクラスです。

### メソッド

##### `getBounds()`
バウンディングボックスを取得します。

**戻り値**: Rect3D

##### `collectPoints(Rect3D, Array[, Matrix])`
指定領域内のポリゴン頂点を収集します。

**引数**:
- `Rect3D`: 収集範囲
- `Array`: 結果格納先配列
- `Matrix` (オプション): 変換行列

**戻り値**: Array - 頂点座標の配列（x, y, z, ...）

---

## 定数

### テストモード

- `SK_TEST_ALL` (0): 全ての衝突を取得
- `SK_TEST_CLOSEST` (1): 最も近い衝突のみ取得

### 形状タイプ

- `SK_SHAPE_PLANE`: 平面
- `SK_SHAPE_BOX`: ボックス
- `SK_SHAPE_CYLINDER`: 円柱
- `SK_SHAPE_CONE`: 円錐
- `SK_SHAPE_SPHERE`: 球
- `SK_SHAPE_CAPSULE`: カプセル
- `SK_SHAPE_TERRAIN`: 地形
- `SK_SHAPE_CLOUD`: 凸包
- `SK_SHAPE_MESH`: メッシュ
- `SK_SHAPE_COMPOUND`: 複合形状
- `SK_SHAPE_CUSTOM`: カスタム形状

### コリジョンフラグ

- `CF_STATIC_OBJECT`: 静的オブジェクト
- `CF_KINEMATIC_OBJECT`: キネマティックオブジェクト
- `CF_NO_CONTACT_RESPONSE`: 接触応答なし
- `CF_CUSTOM_MATERIAL_CALLBACK`: カスタムマテリアルコールバック

---

## 注意事項

1. **質量0は静的オブジェクト**: 質量0のb3Bodyは静的（固定）オブジェクトとして扱われます。
2. **行列の正規化**: スケールが含まれる行列を設定すると、自動的に正規化されます。
3. **スケール設定**: 形状のスケールは `setLocalScaling()` で行います。
4. **メモリ管理**: b3Bodyをワールドから削除しても、オブジェクト自体は破棄されません。
5. **ゴーストオブジェクト**: 物理応答を持たず、接触判定のみ行うオブジェクトです。
6. **サブステップ**: 精度向上のため、`simulate()` のサブステップ数を増やせます。
