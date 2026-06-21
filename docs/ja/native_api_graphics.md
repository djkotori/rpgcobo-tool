# SakanaGL Graphics API リファレンス

`core/api/ssapi_graphics.cpp`で定義されているSakanaGLのGPU描画関連APIのリファレンスドキュメントです。

OpenGL/OpenGL ES/WebGLベースの3Dグラフィックス描画、シェーダー管理、テクスチャ、フレームバッファ、レンダーステート、ライティング、パーティクルシステムなどの機能を提供します。

---

## 目次

1. [グローバル関数](#グローバル関数)
   - [システム情報](#システム情報)
   - [レンダリング制御](#レンダリング制御)
   - [レンダーターゲット](#レンダーターゲット)
   - [レンダーステート](#レンダーステート)
   - [行列操作](#行列操作)
   - [バッファバインド](#バッファバインド)
   - [描画コマンド](#描画コマンド)
   - [ビューポート](#ビューポート)
   - [オクルージョンクエリ](#オクルージョンクエリ)
   - [シェーダー管理](#シェーダー管理)
   - [ライティング](#ライティング)
   - [その他](#その他)
2. [クラス](#クラス)
   - [VertexBufferStream](#vertexbufferstream)
   - [VertexBuffer](#vertexbuffer)
   - [IndexBuffer](#indexbuffer)
   - [PixelBuffer](#pixelbuffer)
   - [ClearParam](#clearparam)
   - [SamplerState](#samplerstate)
   - [RenderStates](#renderstates)
   - [Texture](#texture)
   - [RenderBuffer](#renderbuffer)
   - [FrameBuffer](#framebuffer)
   - [ShaderSource](#shadersource)
   - [SKFXTechnique](#skfxtechnique)
   - [SKFXEffect](#skfxeffect)
   - [Material](#material)
   - [ShadowMap](#shadowmap)
   - [Light](#light)
   - [Fog](#fog)
   - [Environment](#environment)
   - [Sprite](#sprite)
   - [ParticleEmitter](#particleemitter)
   - [ParticleGroup](#particlegroup)
   - [OcclusionQuery](#occlusionquery)
   - [PolygonFace](#polygonface)
   - [Bone / BoneParts](#bone--boneparts)
   - [Animation / AnimationState](#animation--animationstate)
   - [ShapeKeyList / ShapeState](#shapekeylist--shapestate)
   - [SK3DRenderNode / SK3DDisplayList](#sk3drendernode--sk3ddisplaylist)
   - [その他のグラフィックスクラス](#その他のグラフィックスクラス)

---

## グローバル関数

### システム情報

#### `skGetSupportedTextureFormats()`
サポートされているテクスチャ圧縮フォーマットのリストを取得します。

**戻り値**: 文字列の配列（例: `["etc2", "dxt", "astc"]`）

**対応フォーマット**:
- `"etc2"`: ETC2（Android、iOS等）
- `"etc1"`: ETC1（古いAndroid）
- `"pvr1"`: PVRTC（iOS）
- `"dxt"`: DXT/S3TC（Windows、コンソール）
- `"astc"`: ASTC（最新デバイス）

#### `skIsGLEnabled()`
OpenGLコンテキストが有効かどうかを返します。

**戻り値**: bool

---

### レンダリング制御

#### `skFlush([gpuFlush])`
描画コマンドをフラッシュします。

**引数**:
- `gpuFlush` (bool, オプション): GPU同期を行うか（デフォルト: `false`）

**説明**: 
- 通常のフラッシュは、バッファされている書き込み途中のスプライトやパーティクルを確実に描画します。
- `gpuFlush = true`の場合、GPUの完了を待機します（パフォーマンス低下に注意）。

#### `skFinish()`
GPUの描画完了を待機します。

**説明**: `glFinish()`を呼び出し、すべての描画コマンドの完了を保証します（パフォーマンスに大きな影響）。

#### `skFence([option])`
GPUフェンスオブジェクトを作成します。

**引数**:
- `option` (int, オプション): フェンスオプション

**戻り値**: フェンスID（int）

**説明**: 非同期にGPU完了を確認するために使用します。

#### `skWaitFence(fenceId[, timeoutMs])`
フェンスの完了を待機します。

**引数**:
- `fenceId` (int): フェンスID
- `timeoutMs` (int, オプション): タイムアウト（ミリ秒、デフォルト: 1）

**戻り値**: 完了状態（int）

---

### レンダーターゲット

#### `skClearScreen([clearParam])`
#### `skClearScreen([clearMask])`
画面またはレンダーターゲットをクリアします。

**引数**:
- `clearParam` (ClearParam, オプション): クリアパラメータ
- `clearMask` (int, オプション): クリアマスク

**クリアマスク定数**:
- `SK_CLEAR_COLOR` (1): カラーバッファ
- `SK_CLEAR_DEPTH` (2): デプスバッファ
- `SK_CLEAR_STENCIL` (4): ステンシルバッファ

**例**:
```javascript
// カラーとデプスをクリア
skClearScreen(SK_CLEAR_COLOR | SK_CLEAR_DEPTH);

// ClearParamを使用
local cp = ClearParam(0.2, 0.3, 0.4, 1.0);
skClearScreen(cp);
```

#### `skClearParam(clearParam)`
デフォルトのクリアパラメータを設定します。

**引数**:
- `clearParam` (ClearParam): クリアパラメータ

#### `skSetRenderTarget(renderTarget)`
レンダーターゲットを設定します。`null`を指定すると画面（スワップチェーン）に戻ります。

**引数**:
- `renderTarget` (RenderTarget/Texture/FrameBuffer/null): レンダーターゲット

**戻り値**: 以前のレンダーターゲット

**例**:
```javascript
local tex = Texture();
tex.create(512, 512, SK_RGBA8, 1);

local oldRT = skSetRenderTarget(tex);
// テクスチャに描画...
skSetRenderTarget(oldRT);  // 元に戻す
```

#### `skGetRenderTarget()`
現在のレンダーターゲットを取得します。

**戻り値**: レンダーターゲット

#### `skReadPixels(x, y, width, height, image)`
レンダーターゲットからピクセルを読み取ります。

**引数**:
- `x`, `y` (int): 読み取り開始座標
- `width`, `height` (int): 読み取りサイズ（最大4096x4096）
- `image` (RGBAImage): 読み取り先画像

**戻り値**: `image`

**説明**: 現在のレンダーターゲットから画像データをCPUメモリに転送します（低速）。

---

### レンダーステート

#### `skSetRenderStates(renderStates)`
レンダーステートを一括設定します。

**引数**:
- `renderStates` (RenderStates): レンダーステート

#### `skGetRenderStates([renderStates])`
現在のレンダーステートを取得します。

**引数**:
- `renderStates` (RenderStates, オプション): 結果の格納先

**戻り値**: `RenderStates`オブジェクト

#### `skPushRenderStates()`
現在のレンダーステートをスタックにプッシュします。

**戻り値**: 成功した場合`true`

**説明**: スタックの深さには制限があります（通常64程度）。

#### `skPopRenderStates()`
スタックからレンダーステートをポップして復元します。

**戻り値**: 成功した場合`true`

#### `skSetRenderState(stateType, value[, value2, value3, value4])`
個別のレンダーステートを設定します。

**引数**:
- `stateType` (int): ステートタイプ
- `value`, `value2`, ... (int/float): 値

**説明**: 複数の値を指定すると`float[]`として設定されます。

#### `skSetPMAMode(mode)`
プリマルチプライドアルファモードを設定します。

**引数**:
- `mode` (int): PMAモード

---

### 行列操作

#### `skSetMatrix(matrixType, matrix)`
指定タイプの行列を設定します。

**引数**:
- `matrixType` (int): 行列タイプ（`SK_WORLD`, `SK_VIEW`, `SK_PROJECTION`）
- `matrix` (Matrix): 設定する行列

**例**:
```javascript
local worldMat = Matrix.fromTranslate(10, 5, 0);
skSetMatrix(SK_WORLD, worldMat);
```

#### `skGetMatrix(matrixType, matrix)`
指定タイプの行列を取得します。

**引数**:
- `matrixType` (int): 行列タイプ
- `matrix` (Matrix): 取得先行列

#### `skMultMatrix(matrixType, matrix)`
指定タイプの行列に右から乗算します。

**引数**:
- `matrixType` (int): 行列タイプ
- `matrix` (Matrix): 乗算する行列

**説明**: `currentMatrix = currentMatrix * matrix`

#### `skInitMatrix(matrixType)`
指定タイプの行列を単位行列にします。

**引数**:
- `matrixType` (int): 行列タイプ

#### `skPushMatrix(matrixType[, matrixType2, ...])`
行列をスタックにプッシュします。

**引数**:
- `matrixType` (int): 行列タイプ（複数指定可）

**説明**: 複数の行列を一度にプッシュできます。

#### `skPopMatrix(matrixType[, matrixType2, ...])`
行列をスタックからポップします。

**引数**:
- `matrixType` (int): 行列タイプ（複数指定可）

#### `skBillboardMatrix([bank])`
ビルボード行列を設定します。

**引数**:
- `bank` (float, オプション): バンク角（ラジアン）

**説明**: ワールド行列をカメラ方向に向けます。スケール成分は保持されます。

**例**:
```javascript
// パーティクルなどの描画前に
skPushMatrix(SK_WORLD);
skSetMatrix(SK_WORLD, particleMat);
skBillboardMatrix();  // カメラの方を向く
// ... 描画 ...
skPopMatrix(SK_WORLD);
```

#### `skSetCamera(camera)`
カメラのビュー・プロジェクション行列を一括設定します。

**引数**:
- `camera` (Camera): カメラオブジェクト

**説明**: `skSetMatrix(SK_VIEW, camera.viewmat)`と`skSetMatrix(SK_PROJECTION, camera.prjmat)`を実行します。

---

### バッファバインド

#### `skBindVertexBuffer(vertexBuffer)`
#### `skBindVertexBuffer(vertexBufferArray)`
頂点バッファをバインドします。

**引数**:
- `vertexBuffer` (VertexBuffer): 頂点バッファ
- `vertexBufferArray` (array): 頂点バッファの配列

**説明**: 複数の頂点バッファを同時にバインドできます（マルチストリーム）。

#### `skBindEnvironment(environment)`
環境設定をバインドします。

**引数**:
- `environment` (Environment): 環境オブジェクト

**説明**: 環境マップ、環境光などをシェーダーに渡します。

#### `skBindBonePoses(boneArray)`
ボーン行列配列をバインドします。

**引数**:
- `boneArray` (array): `Bone`オブジェクトの配列、または`null`でクリア

**説明**: スキンメッシュアニメーション用のボーン変換をGPUに送信します。

#### `skCalculateBonePoses(boneArray, animationState[, physicsMatrix[, reflectDynamic]])`
アニメーションステートからボーンポーズを計算します（線形補間）。

**引数**:
- `boneArray` (array): `Bone`オブジェクトの配列
- `animationState` (AnimationState): アニメーション状態
- `physicsMatrix` (Matrix, オプション): 物理演算用の変換行列
- `reflectDynamic` (int, オプション): 動的ボーンに反映するか（デフォルト: 0）

**戻り値**: 成功した場合`true`

**説明**: 
- `animationState`の現在フレームを評価し、ボーン行列を更新します。
- フェードアウト中のアニメーションとブレンドします。
- 物理ボディがある場合、リジッドボディに反映できます。

#### `skCalculateBonePosesSlerp(boneArray, animationState[, physicsMatrix[, reflectDynamic]])`
アニメーションステートからボーンポーズを計算します（球面線形補間）。

**引数**: `skCalculateBonePoses`と同じ

**説明**: 回転に球面線形補間（slerp）を使用します。より滑らかですが若干遅いです。

---

### 描画コマンド

#### `skDrawIndexBuffer(material, mode, indexBuffer[, offset[, length[, instanceCount[, vertexOffset]]]])`
インデックスバッファを描画します。

**引数**:
- `material` (Material): マテリアル
- `mode` (int): プリミティブモード（`SK_TRIANGLES`, `SK_LINES`等）
- `indexBuffer` (IndexBuffer): インデックスバッファ
- `offset` (int, オプション): インデックス開始位置（デフォルト: 0）
- `length` (int, オプション): 描画インデックス数（デフォルト: バッファ全体）
- `instanceCount` (int, オプション): インスタンス描画数（デフォルト: 0 = 通常描画）
- `vertexOffset` (int, オプション): 頂点オフセット（デフォルト: 0）

**戻り値**: 成功した場合`true`

**プリミティブモード定数**:
- `SK_POINTS`: 点
- `SK_LINES`: ライン
- `SK_LINE_STRIP`: ラインストリップ
- `SK_LINE_LOOP`: ラインループ
- `SK_TRIANGLES`: 三角形
- `SK_TRIANGLE_STRIP`: 三角形ストリップ
- `SK_TRIANGLE_FAN`: 三角形ファン

#### `skDrawSprite(sprite[, x, y])`
#### `skDrawSprite(sprite, x, y, width, height)`
スプライトを描画します。

**引数**:
- `sprite` (Sprite): スプライト
- `x`, `y` (float, オプション): 描画位置
- `width`, `height` (float, オプション): 描画サイズ

**説明**: 
- 引数なしの場合、`sprite.bnd`の位置・サイズで描画。
- `x, y`指定の場合、`sprite.bnd`のサイズを保持してオフセット。
- `x, y, width, height`指定の場合、完全に上書き。

#### `skDrawSprites(...sprites)`
#### `skDrawSprites(spriteArray)`
複数のスプライトを描画します。

**引数**:
- `sprites` (Sprite, 可変長): スプライト
- `spriteArray` (array): スプライトの配列

**説明**: 可視かつ`bnd`が設定されているスプライトのみ描画されます。

#### `skDrawTextBox(textbox)`
テキストボックスを描画します。

**引数**:
- `textbox` (TextBox): テキストボックス

#### `skDrawParticleGroup(particleGroup)`
パーティクルグループを描画します。

**引数**:
- `particleGroup` (ParticleGroup): パーティクルグループ

#### `skDrawParticleGroups(...particleGroups)`
複数のパーティクルグループを描画します。

**引数**:
- `particleGroups` (ParticleGroup/array, 可変長): パーティクルグループまたは配列

#### `skDrawPolygonMesh(vertexBuffer, boneArray, polygonFaces[, visibleMask[, worldMatrix[, material]]])`
ポリゴンメッシュを一括描画します。

**引数**:
- `vertexBuffer` (VertexBuffer/array): 頂点バッファ
- `boneArray` (array): ボーン配列（不要な場合は`null`）
- `polygonFaces` (PolygonFace/array): ポリゴンフェース
- `visibleMask` (int, オプション): 可視マスク（デフォルト: -1 = すべて）
- `worldMatrix` (Matrix, オプション): ワールド行列
- `material` (Material, オプション): 強制マテリアル

**説明**: 
- 頂点バッファ、ボーン、フェースのバインドと描画を一括で行います。
- パフォーマンス向上のための最適化された描画パス。

---

### ビューポート

#### `skSetViewport(x, y, width, height)`
#### `skSetViewport([x, y, width, height])`
#### `skSetViewport()`
ビューポートを設定します。

**引数**:
- `x`, `y` (int): ビューポート左上座標
- `width`, `height` (int): ビューポートサイズ
- `array` (array): `[x, y, width, height]`
- 引数なしの場合、レンダーターゲット全体にリセット

#### `skGetViewport(array)`
現在のビューポートを取得します。

**引数**:
- `array` (array): 結果を格納する配列（4要素にリサイズ）

**説明**: `array[0..3]`に`[x, y, width, height]`が格納されます。

---

### オクルージョンクエリ

#### `skBeginQuery(occlusionQuery)`
オクルージョンクエリを開始します。

**引数**:
- `occlusionQuery` (OcclusionQuery): クエリオブジェクト

#### `skEndQuery()`
オクルージョンクエリを終了します。

#### `skQueryResult(occlusionQuery[, mode])`
オクルージョンクエリの結果を取得します。

**引数**:
- `occlusionQuery` (OcclusionQuery): クエリオブジェクト
- `mode` (int, オプション): 取得モード（デフォルト: 0）

**戻り値**: クエリ結果（int、レンダリングされたピクセル数など）

**説明**: 結果がまだ利用できない場合は待機します。

---

### シェーダー管理

#### `skSetShaderDefine(defineString)`
シェーダーのプリプロセッサ定義を設定します。

**引数**:
- `defineString` (string): `#define`文字列

**説明**: 次回のシェーダーコンパイル時に適用されます。

**例**:
```javascript
skSetShaderDefine("#define USE_SHADOWS 1\n#define MAX_LIGHTS 4\n");
```

#### `skSetDefaultSpriteShader(shaderSource)`
デフォルトのスプライトシェーダーを設定します。

**引数**:
- `shaderSource` (ShaderSource): シェーダーソース

#### `skGetDefaultSpriteShader()`
デフォルトのスプライトシェーダーを取得します。

**戻り値**: `ShaderSource`または`null`

#### `skSetDefaultFontShader(shaderSource)`
デフォルトのフォントシェーダーを設定します。

**引数**:
- `shaderSource` (ShaderSource): シェーダーソース

#### `skGetDefaultFontShader()`
デフォルトのフォントシェーダーを取得します。

**戻り値**: `ShaderSource`または`null`

#### `skSetFontResolution(resolution)`
フォントテクスチャの解像度スケールを設定します。

**引数**:
- `resolution` (float): 解像度スケール（0.1～2.0）

**説明**: 1.0より大きい値は高解像度フォント、小さい値は省メモリになります。

#### `skFXCompile(source[, sourceName])`
SKFXシェーダーソースをコンパイルします。

**引数**:
- `source` (string/ByteBuffer): シェーダーソースコード
- `sourceName` (string, オプション): ソース名（エラー表示用）

**戻り値**: `SKFXEffect`オブジェクト

**説明**: SakanaGL独自のエフェクトファイル形式をコンパイルします。

**例**:
```javascript
local src = FileRef( "shader.skfx").load();
local effect = skFXCompile(src, "shader.skfx");
```

#### `skFXRegisterModule(moduleName, effect)`
エフェクトをモジュールとして登録します。

**引数**:
- `moduleName` (string): モジュール名
- `effect` (SKFXEffect): エフェクト

**説明**: 登録されたエフェクトは`skFXFindTechnique`で検索できます。

#### `skFXUnregisterModule(moduleName)`
エフェクトモジュールを登録解除します。

**引数**:
- `moduleName` (string): モジュール名

#### `skFXFindTechnique(techniqueName)`
テクニックを検索します。

**引数**:
- `techniqueName` (string): `"モジュール名.テクニック名"`形式

**戻り値**: `SKFXTechnique`オブジェクト

**例**:
```javascript
skFXRegisterModule("MyShader", effect);
local technique = skFXFindTechnique("MyShader.Default");
```

#### `skFXSetDefaultTechnique(technique)`
デフォルトのテクニックを設定します。

**引数**:
- `technique` (SKFXTechnique): テクニック

#### `skFXGetDefaultTechnique()`
デフォルトのテクニックを取得します。

**戻り値**: `SKFXTechnique`または`null`

#### `skFXGetEffects()`
登録されているすべてのエフェクトを取得します。

**戻り値**: `SKFXEffect`の配列

---

### ライティング

#### `skClearLights()`
すべてのライトをクリアします。

#### `skGetShadowLights()`
シャドウマップを持つ最初のライトを取得します。

**戻り値**: `Light`または`null`

#### `skCullLights(camera, lightsTexture, indexTexture, expansionFactor, resultArray, ...lights)`
ライトカリングを実行し、3Dテクスチャにライトインデックスを書き込みます。

**引数**:
- `camera` (Camera): カメラ
- `lightsTexture` (Texture): ライトパラメータテクスチャ（出力）
- `indexTexture` (Texture): ライトインデックステクスチャ（出力、3D）
- `expansionFactor` (float): 拡張係数
- `resultArray` (array): `[znear, zfar]`を格納する配列
- `lights` (Light/array, 可変長): ライト

**説明**: 
- フォワード+／ディファードレンダリング用のライトカリング。
- スクリーン空間を3Dグリッドに分割し、各セルに影響するライトのインデックスを格納します。
- `lightsTexture`は事前に作成しておく必要があります。

---

### その他

#### `skBlitFrameBuffer(srcRenderTarget, dstRenderTarget[, sx, sy, sw, sh, dx, dy, dw, dh, mask, filter])`
フレームバッファ間でブリットします。

**引数**:
- `srcRenderTarget` (RenderTarget): 転送元
- `dstRenderTarget` (RenderTarget): 転送先
- `sx`, `sy`, `sw`, `sh` (int, オプション): 転送元矩形
- `dx`, `dy`, `dw`, `dh` (int, オプション): 転送先矩形
- `mask` (int, オプション): 転送マスク
- `filter` (int, オプション): フィルタ（0: nearest, 1: linear）

**戻り値**: 成功した場合`true`

**説明**: 
- 引数省略時はレンダーターゲット全体を転送します。
- ハードウェアブリットを使用（高速）。

---

## クラス

### ClearParam

クリアパラメータクラス。画面やレンダーターゲットのクリア色・深度などを指定します。

#### コンストラクタ

```javascript
ClearParam()
ClearParam(r[, g, b, a[, depth[, clearMask]]])
ClearParam([r, g, b, a, depth, clearMask])
```

**引数**:
- `r`, `g`, `b` (float): クリア色（0～1）
- `a` (float, オプション): アルファ（デフォルト: 1.0）
- `depth` (float, オプション): デプス値（デフォルト: 1.0）
- `clearMask` (int, オプション): クリアマスク

**説明**: 
- 引数なしの場合、黒（RGB=0）、アルファ=1、デプス=1。
- `clearMask`は自動設定されますが、明示的に指定可能。

#### フィールド

- `R`, `G`, `B`, `A` (float): クリア色（0～1）
- `depth` (float): デプス値（0～1）
- `stencil` (int): ステンシル値
- `clearmask` (int): クリアマスク

---

### SamplerState

テクスチャサンプラーステートクラス。テクスチャのフィルタリングやラップモードを設定します。

#### コンストラクタ

```javascript
SamplerState()
SamplerState(wrapS, wrapT, minFilter, magFilter[, lodBias])
```

**引数**:
- `wrapS` (int): S軸（U軸）ラップモード
- `wrapT` (int): T軸（V軸）ラップモード
- `minFilter` (int): 縮小フィルタ
- `magFilter` (int): 拡大フィルタ
- `lodBias` (int, オプション): LODバイアス

**ラップモード定数**:
- `SK_REPEAT`: リピート
- `SK_CLAMP`: クランプ
- `SK_CLAMP_TO_EDGE`: エッジクランプ
- `SK_MIRRORED_REPEAT`: ミラーリピート

**フィルタ定数**:
- `SK_NEAREST`: ニアレスト
- `SK_LINEAR`: リニア
- `SK_LINEAR_MIPMAP_LINEAR`: トライリニア

#### フィールド

- `wraps` (int): S軸ラップモード
- `wrapt` (int): T軸ラップモード
- `minfilter` (int): 縮小フィルタ
- `magfilter` (int): 拡大フィルタ
- `lodbias` (int): LODバイアス

#### メソッド

##### `set(wrapS, wrapT, minFilter, magFilter[, lodBias])`
サンプラーステートを設定します。

**例**:
```javascript
local sampler = SamplerState(
	SK_REPEAT,              // 繰り返し
	SK_REPEAT,
	SK_LINEAR_MIPMAP_LINEAR,  // トライリニア
	SK_LINEAR
);
texture.setSamplerState(sampler);
```

---

### RenderStates

レンダーステートクラス。デプステスト、ブレンド、カリング等の設定をまとめて管理します。

#### コンストラクタ

```javascript
RenderStates()
```

**説明**: デフォルト値で初期化されます。

#### フィールド

**デプス**:
- `depthtest` (int): デプステスト（0: off, 1: less, 2: lequal等）
- `depthmask` (int): デプス書き込み（0: off, 1: on）
- `depthrange0`, `depthrange1` (float): デプス範囲

**ブレンド**:
- `blend` (int): ブレンドモード
- `blendcolor` (int): ブレンド色

**ラスタライズ**:
- `fillmode` (int): フィルモード（0: fill, 1: line, 2: point）
- `cullface` (int): カリングモード（0: none, 1: back, 2: front）
- `invertface` (int): 面の反転（0: off, 1: on）
- `reversez` (int): Zの反転（0: off, 1: on）
- `polygonoffset0`, `polygonoffset1` (float): ポリゴンオフセット

**カラー**:
- `colormask` (int): カラーマスク（ビットフィールド: R=1, G=2, B=4, A=8）

**例**:
```javascript
local rs = RenderStates();
rs.depthtest = 2;        // SK_LEQUAL
rs.blend = SK_BLEND_ALPHA;
rs.cullface = 1;         // バックフェースカリング
skSetRenderStates(rs);
```

---

### Texture

テクスチャクラス。2D/3Dテクスチャの作成、ロード、管理を行います。

#### 継承

`RenderTarget` ← `Texture`

#### コンストラクタ

```javascript
Texture()
```

#### フィールド

**読み取り専用**:
- `texo` (int): OpenGLテクスチャオブジェクトID
- `width` (int): 幅
- `height` (int): 高さ
- `depth` (int): 深度（3Dテクスチャまたは配列レイヤー数）
- `target` (int): OpenGLターゲット（`GL_TEXTURE_2D`等）
- `format` (int): 内部フォーマット
- `flags` (int): フラグ

**読み書き**:
- `ref`: 任意の参照を保持するフィールド

#### メソッド

##### `create(width, height, format, flags[, levels[, data]])`
2Dテクスチャを作成します。

**引数**:
- `width`, `height` (int): サイズ（1以上）
- `format` (int): テクスチャフォーマット
- `flags` (int): フラグ
- `levels` (int, オプション): ミップマップレベル数（デフォルト: 1）
- `data` (ByteBuffer, オプション): 初期データ

**戻り値**: 成功した場合`true`

**フォーマット定数**:
- `SK_RGBA8`: RGBA 8ビット/チャンネル
- `SK_RGB8`: RGB 8ビット/チャンネル
- `SK_RGBA16F`: RGBA 16ビット浮動小数点
- `SK_RGBA32F`: RGBA 32ビット浮動小数点
- `SK_DEPTH24_STENCIL8`: デプス24ビット + ステンシル8ビット
- など

**フラグ定数**:
- `SK_RENDERTARGET`: レンダーターゲットとして使用可能
- `SK_MIPMAP`: ミップマップ生成
- その他

**例**:
```javascript
local tex = Texture();
tex.create(512, 512, SK_RGBA8, SK_MIPMAP);
```

##### `create3D(width, height, depth, format, flags[, data])`
3Dテクスチャまたはテクスチャ配列を作成します。

**引数**:
- `width`, `height`, `depth` (int): サイズ
- `format` (int): テクスチャフォーマット
- `flags` (int): フラグ
- `data` (ByteBuffer, オプション): 初期データ

**戻り値**: 成功した場合`true`

##### `load(image[, flags])`
画像からテクスチャをロードします。

**引数**:
- `image` (RGBAImage/KTXImage): ソース画像
- `flags` (int, オプション): フラグ

**説明**: 画像のサイズとフォーマットに基づいてテクスチャを自動作成します。

**例**:
```javascript
local imgData = FileRef("texture.png").load();
local image = skLoadImage(imgData);
local tex = Texture();
tex.load(image, SK_MIPMAP);
```

##### `subload(image[, level[, srcX, srcY[, srcW, srcH[, dstX, dstY]]]])`
画像の一部をテクスチャに転送します。

**引数**:
- `image` (RGBAImage): ソース画像
- `level` (int, オプション): ミップマップレベル
- `srcX`, `srcY`, `srcW`, `srcH` (int, オプション): ソース矩形
- `dstX`, `dstY` (int, オプション): 転送先座標

**説明**: テクスチャアトラスの更新などに使用します。

##### `unload()`
テクスチャをアンロードします。

**説明**: GPUメモリを解放しますが、オブジェクト自体は残ります。

##### `getSamplerState([samplerState])`
サンプラーステートを取得します。

**引数**:
- `samplerState` (SamplerState, オプション): 結果の格納先

**戻り値**: `SamplerState`オブジェクト

##### `setSamplerState(samplerState)`
サンプラーステートを設定します。

**引数**:
- `samplerState` (SamplerState): サンプラーステート

##### `generateMipmap()`
ミップマップを生成します。

**説明**: テクスチャ内容からミップマップを自動生成します。

##### `selectRenderFace(face, level)`
キューブマップのレンダリングフェイスを選択します。

**引数**:
- `face` (int): フェイス（0～5）
- `level` (int): ミップマップレベル

**戻り値**: 成功した場合`true`

**フェイス定数**:
- `SK_TEXTURE_CUBE_MAP_POSITIVE_X` (0): +X
- `SK_TEXTURE_CUBE_MAP_NEGATIVE_X` (1): -X
- `SK_TEXTURE_CUBE_MAP_POSITIVE_Y` (2): +Y
- `SK_TEXTURE_CUBE_MAP_NEGATIVE_Y` (3): -Y
- `SK_TEXTURE_CUBE_MAP_POSITIVE_Z` (4): +Z
- `SK_TEXTURE_CUBE_MAP_NEGATIVE_Z` (5): -Z

---

### RenderBuffer

OpenGLレンダーバッファオブジェクト。フレームバッファのアタッチメントとして使用します。

#### 継承

`RenderTarget` ← `RenderBuffer`

#### コンストラクタ

```javascript
RenderBuffer()
```

#### フィールド

**読み取り専用**:
- `rbo` (int): OpenGLレンダーバッファオブジェクトID
- `width` (int): 幅
- `height` (int): 高さ

**読み書き**:
- `ref`: 任意の参照を保持するフィールド

#### メソッド

##### `create(width, height, format)`
レンダーバッファを作成します。

**引数**:
- `width`, `height` (int): サイズ
- `format` (int): フォーマット（`SK_DEPTH24_STENCIL8`等）

**戻り値**: 成功した場合`true`

**説明**: 
- レンダーバッファはテクスチャとしてサンプリングできませんが、マルチサンプルに対応します。
- デプス・ステンシルバッファに適しています。

---

### FrameBuffer

フレームバッファオブジェクト（FBO）。複数のテクスチャやレンダーバッファをアタッチして、オフスクリーンレンダリングを行います。

#### 継承

`RenderTarget` ← `FrameBuffer`

#### コンストラクタ

```javascript
FrameBuffer()
```

**説明**: 詳細な実装は提供されたコード範囲外ですが、以下のような用途があります：
- 複数のカラーアタッチメント（MRT: Multiple Render Targets）
- デプス・ステンシルアタッチメント
- キューブマップの各面へのレンダリング

---

### VertexBufferStream

頂点バッファ内の単一のストリームを表します。個々の頂点属性（位置、法線、UV座標など）のデータレイアウトを定義します。

#### フィールド

**読み取り専用**:
- `attr` (int): 頂点属性ID（例: `SK_POSITION`, `SK_NORMAL`, `SK_TEXCOORD0`）
- `type` (int): データ型（例: `SK_FLOAT`, `SK_HALF`, `SK_UBYTE`）
- `normalize` (int): 正規化フラグ（0 or 1）
- `elems` (int): 要素数（例: 位置なら3、UVなら2）
- `offset` (int): バッファ内のオフセット（バイト）
- `stride` (int): ストライド（バイト）

#### メソッド

##### `describe()`
ストリームの内容をデバッグ出力します。

**説明**: データ型、要素数、実際のデータ値を標準出力に表示します。

##### `toints([array])`
ストリームデータをint配列に変換します。

**引数**:
- `array` (Array, オプション): 既存の配列を再利用

**戻り値**: int配列

##### `tofloats([array])`
ストリームデータをfloat配列に変換します。

**引数**:
- `array` (Array, オプション): 既存の配列を再利用

**戻り値**: float配列

---

### VertexBuffer

頂点データを格納するGPUバッファです。複数のストリーム（属性）を持つことができます。

#### コンストラクタ

```javascript
VertexBuffer()
```

#### メソッド

##### `create(streamArray, datasize[, flags])`
頂点バッファを作成します。

**引数**:
- `streamArray` (Array): ストリーム定義の配列
- `datasize` (int): データサイズ（バイト）
- `flags` (int, オプション): バッファフラグ

**ストリーム定義の例**:
```javascript
{
    attr: SK_POSITION,
    type: SK_FLOAT,
    elems: 3,
    normalize: 0,
    offset: 0,
    stride: 32
}
```

##### `loadData(ByteBuffer)`
ByteBufferからデータをロードします。

**引数**:
- `ByteBuffer`: データソース

##### `storeData(ByteBuffer)`
ByteBufferにデータを保存します。

**引数**:
- `ByteBuffer`: データ出力先

##### `copyFrom(VertexBuffer)`
他のVertexBufferからコピーします。

**引数**:
- `VertexBuffer`: コピー元

**戻り値**: 自身

##### `extractFrom(srcVB, extractParams)`
指定属性を抽出して新しいバッファを作成します。

**引数**:
- `srcVB` (VertexBuffer): ソースバッファ
- `extractParams` (Array): 抽出パラメータの配列

**戻り値**: 自身

##### `morph(baseVB, ShapeState)`
モーフターゲットを適用します。

**引数**:
- `baseVB` (VertexBuffer): ベース頂点バッファ
- `ShapeState`: モーフ状態

**戻り値**: 成功した場合true

##### `subload(ByteBuffer, offset)`
部分的にデータをロードします。

**引数**:
- `ByteBuffer`: データソース
- `offset` (int): バッファ内のオフセット

**戻り値**: 成功した場合true

##### `getStream(attr)`
指定属性のストリームを取得します。

**引数**:
- `attr` (int): 頂点属性ID

**戻り値**: `VertexBufferStream`または`null`

##### `getVBO()`
OpenGL VBOハンドルを取得します。

**戻り値**: int（VBO ID）

##### `len()`
頂点数を取得します。

**戻り値**: int

##### `load(ByteBuffer)`
バッファからロードします（旧API）。

**引数**:
- `ByteBuffer`: データ�ース

##### `unload()`
バッファを解放します。

#### メタメソッド

- `[index]`: インデックスでストリームにアクセス

**例**:
```javascript
local vb = VertexBuffer();
vb.create([
    {attr:SK_POSITION, type:SK_FLOAT, elems:3, offset:0, stride:32},
    {attr:SK_TEXCOORD0, type:SK_FLOAT, elems:2, offset:12, stride:32},
    {attr:SK_NORMAL, type:SK_FLOAT, elems:3, offset:20, stride:32}
], datasize);
vb.loadData(byteBuffer);

local posStream = vb.getStream(SK_POSITION);
local posData = posStream.tofloats();
```

---

### IndexBuffer

インデックスデータを格納するGPUバッファです。

#### コンストラクタ

```javascript
IndexBuffer()
```

#### フィールド

**読み取り専用**:
- `length` (int): インデックス数
- `type` (int): データ型（`SK_UBYTE`, `SK_USHORT`, `SK_UINT`）
- `mode` (int): プリミティブモード（`SK_TRIANGLES`など）

#### メソッド

##### `create([type])`
インデックスバッファを作成します。

**引数**:
- `type` (int, オプション): データ型（デフォルト: `SK_USHORT`）

##### `loadData(ByteBuffer)`
ByteBufferからデータをロードします。

**引数**:
- `ByteBuffer`: データソース

##### `storeData(ByteBuffer)`
ByteBufferにデータを保存します。

**引数**:
- `ByteBuffer`: データ出力先

##### `describe()`
バッファの内容をデバッグ出力します。

##### `toints([array])`
データをint配列に変換します。

**引数**:
- `array` (Array, オプション): 既存の配列を再利用

**戻り値**: int配列

##### `getIBO()`
OpenGL IBOハンドルを取得します。

**戻り値**: int（IBO ID）

##### `load(ByteBuffer[, type[, length]])`
バッファからロードします。

**引数**:
- `ByteBuffer`: データソース
- `type` (int, オプション): データ型
- `length` (int, オプション): インデックス数

##### `unload()`
バッファを解放します。

**例**:
```javascript
local ib = IndexBuffer();
ib.create(SK_USHORT);
ib.loadData(indexData);
```

---

### PixelBuffer

ピクセルデータの転送用バッファです。テクスチャとCPU間でのデータ転送を高速化します。

#### メソッド

##### `readPixels( rendertarget, x, y, w, h)`
ピクセルデータの転送を開始します。このメソッドは直ちに抜けますが、ピクセル転送は遅れて実行されます。

**引数**:
- `renderTarget` (RenderTarget/Texture/FrameBuffer/null): レンダーターゲット
- `x` (int): X座標
- `y` (int): Y座標
- `w` (int): 幅
- `h` (int): 高さ

**戻り値**: bool

##### `isDone()`
readPixelsの転送が完了したかチェックします。

**戻り値**: bool


##### `getData()`
readPixelsの転送が完了していれば、ピクセルデータをByteBufferで取得します。

**戻り値**: ByteBufferまたはnull


---

### ShaderSource

シェーダーのコンパイル前ソースコードとコンパイル済みプログラムを管理します。

#### メソッド

##### `isProgramLoaded(mask)`
指定マスクのプログラムがロード済みかチェックします。

**引数**:
- `mask` (int): シェーダーマスク

**戻り値**: bool

##### `precompile(mask[, definebits])`
シェーダーを事前コンパイルします。

**引数**:
- `mask` (int): シェーダーマスク
- `definebits` (int, オプション): 定義ビット

**戻り値**: 成功した場合true

##### `getCompiledShaderBits()`
コンパイル済みシェーダーのビットマスク一覧を取得します。

**戻り値**: int配列

##### `getDefineBits()`
定義ビットを取得します。

**戻り値**: int

##### `getProgramBinary(mask[, ByteBuffer])`
プログラムバイナリを取得します。

**引数**:
- `mask` (int): シェーダーマスク
- `ByteBuffer` (ByteBuffer, オプション): 出力先

**戻り値**: ByteBufferまたはnull

##### `loadProgramBinary(mask, ByteBuffer)`
プログラムバイナリをロードします。

**引数**:
- `mask` (int): シェーダーマスク
- `ByteBuffer`: データソース

**戻り値**: 成功した場合true

##### `getParameters()`
シェーダーパラメータ情報を取得します。

**戻り値**: Array（パラメータ情報のテーブル配列）

##### `setDefaultTexture(index, Texture)`
デフォルトテクスチャを設定します。

**引数**:
- `index` (int): サンプラーインデックス（0-7）
- `Texture`: デフォルトテクスチャ

##### `hash64([seed])`
シェーダーソースのハッシュ値を計算します。

**引数**:
- `seed` (int, オプション): ハッシュシード

**戻り値**: long（64ビット整数）

---

### SKFXTechnique

SKFXエフェクトのテクニック（シェーダーパスの集合）を表します。

#### メソッド

##### `getShaderSource(passIndex)`
指定パスのShaderSourceを取得します。

**引数**:
- `passIndex` (int): パスインデックス

**戻り値**: `ShaderSource`または`null`

#### フィールド

- `name`: テクニック名
- `tag`: タグ

---

### SKFXEffect

SKFXエフェクト（複数のテクニックを持つシェーダーエフェクト）を表します。

#### メソッド

##### `len()`
テクニック数を取得します。

**戻り値**: int

#### メタメソッド

- `[index]`: インデックスまたは名前でテクニックにアクセス
- イテレーション対応（for-in）

**例**:
```javascript
local effect = skFXCompile(effectSource);
local technique = effect["forward"];
local shader = technique.getShaderSource(0);
```

---

### Material

マテリアル（シェーダー、テクスチャ、レンダーステートのセット）を表します。

#### コンストラクタ

```javascript
Material()
```

**デフォルト値**:
- `Kd`: 0xffffffff（拡散色）
- `Ka`: 0x808080ff（環境色）
- `Ks`: 0x80808000（鏡面色）
- `Kmul`: 0xffffffff（乗算色）
- `chmask`: 0xffffffff（チャンネルマスク）
- `cullface`: `SK_CCW`（カリング）
- `depthmask`: 1（デプス書き込み有効）
- `depthtest`: -1（環境デフォルト）
- `visiblemask`: -1（全て表示）
- `alpharef`: 1.0
- `shiness`: 10.0

#### フィールド

**色**:
- `Ka` (int): 環境色
- `Kd` (int): 拡散色
- `Ks` (int): 鏡面色
- `Ke` (int): 発光色
- `Kmul` (int): 乗算色
- `basecol` (int): ベース色（PBR）

**マテリアルパラメータ**:
- `shiness` (float): 光沢度
- `reflection` (float): 反射率
- `refraction` (float): 屈折率
- `fresnel` (float): フレネル係数
- `shadowblack` (float): 影の濃さ
- `rough` (float): 粗さ（PBR）
- `metal` (float): 金属度（PBR）

**レンダーステート**:
- `alphatest` (int): アルファテストモード
- `alpharef` (float): アルファ参照値
- `blend` (int): ブレンドモード
- `depthtest` (int): デプステストモード
- `depthmask` (int): デプスマスク
- `cullface` (int): カリングモード
- `polygonoffset0`, `polygonoffset1` (float): ポリゴンオフセット
- `visiblemask` (int): 表示マスク
- `passfilter` (int): パスフィルタ
- `fillmode` (int): 塗りつぶしモード
- `chmask` (int): チャンネルマスク
- `uvbits` (int): UVビット

**テクスチャ**:
- `tex0`, `tex1`, `tex2`, `tex3`: テクスチャスロット
- `texw0`, `texw1`, `texw2`, `texw3` (float): テクスチャウェイト

**行列**:
- `tec`: `SKFXTechnique`
- `uvmat`: UV変換行列
- `colormat`: カラー変換行列
- `m iscmat0`, `miscmat1`, `miscmat2`, `miscmat3`: 汎用行列

**その他**:
- `misccol0`, `misccol1` (int): 汎用カラー
- `mtype` (int): PBRマテリアルタイプ
- `mparam` (int): PBRマテリアルパラメータ
- `texmap` (int): テクスチャUVマップ
- `gsel` (int): グループセレクタ
- `name`: マテリアル名

---

### ShadowMap

シャドウマップ設定を表します。

#### フィールド

- `type` (int): シャドウマップタイプ
- `casnum` (int): カスケード数
- `texsize` (int): テクスチャサイズ
- `depth` (float): 深度
- `zfar` (float): 遠距離
- `raylen` (float): レイ長
- `softness` (float): ソフトネス
- `shadowtex` (Texture): シャドウテクスチャ
- `[index]`: パラメータベクタへのアクセス

---

### Light

ライト（光源）を表します。

#### コンストラクタ

```javascript
Light()
```

**デフォルト値が初期化されます。**

#### フィールド

- `ref`: 任意の参照
- `enabled` (int): 有効フラグ
- `pixellight` (int): ピクセルライトフラグ
- `ch` (int): チャンネル
- `type` (int): ライトタイプ（1:方向性, 2:点光源, 3:スポット, 4:IBL）
- `power` (float): 光の強さ
- `color` (int): ライト色
- `scolor` (int): スペキュラー色
- `k1` (float): 減衰係数（線形）
- `k2` (float): 減衰係数（二次）
- `spotout` (float): スポットライト外角
- `spotsharp` (float): スポットライト鋭さ
- `prio` (float): 優先度
- `vx`, `vy`, `vz` (float): 方向ベクトル
- `px`, `py`, `pz` (float): 位置
- `shadow` (ShadowMap): シャドウマップ設定
- `name`: ライト名

#### メソッド

##### `setMatrix(Matrix)`
行列からライトの位置と方向を設定します。

**引数**:
- `Matrix`: 変換行列

##### `lerpset(Light0, Light1, weight)`
2つのライトを補間して設定します。

**引数**:
- `Light0`, `Light1` (Light): 補間元
- `weight` (float): 補間ウェイト（0.0-1.0）

**戻り値**: 自身

---

### Fog

フォグ（霧）設定を表します。

#### フィールド

- `type` (int): フォグタイプ
- `[index]`: フォグパラメータへのアクセス（0-23）

#### メソッド

##### `setParams(p0, p1, ...)`
フォグパラメータを設定します（最大24個）。

**引数**:
- `p0, p1, ...` (float): パラメータ値

##### `getParams([array])`
フォグパラメータを取得します。

**引数**:
- `array` (Array, オプション): 既存の配列を再利用

**戻り値**: float配列（24要素）

---

### Environment

環境設定（環境マップ、環境光、フォグなど）を表します。

#### コンストラクタ

```javascript
Environment()
```

#### フィールド

- `exponent` (float): 指数
- `ambup` (int): 上半球環境色
- `ambdown` (int): 下半球環境色
- `fog` (Fog): フォグ設定
- `aotex` (Texture): AOテクスチャ
- `envtex` (Texture): 環境マップテクスチャ
- `depthtex` (Texture): デプステクスチャ
- `wavetex` (Texture): 波テクスチャ
- `dfgtex` (Texture): DFGテクスチャ
- `litprmtex` (Texture): ライトパラメータテクスチャ
- `litidxtex` (Texture): ライトインデックステクスチャ
- `gtex0`, `gtex1`, `gtex2`, `gtex3` (Texture): 汎用テクスチャスロット
- `depthtest` (int): デプステスト
- `zfar`, `znear` (float): クリッピング平面
- `earlyz` (int): Early-Zフラグ
- `passfilter` (int): パスフィルタ
- `visiblemask` (int): 表示マスク
- `eyepos` (Vector3D): 視点位置
- `envcolor` (int): 環境色
- `worldpos` (Vector3D): ワールド位置
- `passmode` (int): パスモード
- `envmat0`, `envmat1`, `envmat2`, `envmat3` (Matrix): 環境行列
- `timer0`, `timer1`, `timer2`, `timer3` (float): タイマー
- `sh` (SphericalHarmonics): 球面調和関数
- `dirshadow` (ShadowMap): 方向性シャドウ

---

### Sprite

2Dスプライトを表します。

#### コンストラクタ

```javascript
Sprite()
```

#### フィールド

- `shadersrc` (ShaderSource): シェーダーソース
- `bnd` (Rect2D): バウンディング
- `streach` (Rect2D): ストレッチ
- `mat` (Matrix): 変換行列
- `pos` (Vector3D): 位置
- `miscmat` (Matrix): 汎用行列
- `colormat` (Matrix): カラー行列
- `visible` (int): 表示フラグ
- `pixelfit` (int): ピクセルフィット
- `blend` (int): ブレンドモード
- `punch` (int): パンチスルー
- `color`, `color0` (int): カラー
- `subcolor` (int): サブカラー
- `uvmat0`, `uvmat1` (Matrix): UV行列
- `tex0`, `tex1` (Texture): テクスチャ
- `reso` (float): 解像度

---

### ParticleEmitter

パーティクル発生源の基底クラスです。

#### フィールド

- `num` (int): 発生数
- `start` (int): 開始時間
- `start_spr` (int): 開始時間のばらつき
- `life` (int): 生存時間
- `life_spr` (int): 生存時間のばらつき
- `posx`, `posy`, `posz` (float): 発生位置
- `pos_sprx`, `pos_spry`, `pos_sprz` (float): 発生位置のばらつき
- `dirx`, `diry`, `dirz` (float): 発生方向
- `dir_sprx`, `dir_spry`, `dir_sprz` (float): 発生方向のばらつき
- `linearbits` (int): 線形補間ビット
- `seed` (int): 乱数シード

---

### ParticleGroup

パーティクルシステム（パーティクル集合）を表します。

#### コンストラクタ

```javascript
ParticleGroup()
```

#### フィールド

- `vtx` (VertexBuffer): 頂点バッファ
- `idx` (IndexBuffer): インデックスバッファ
- `mode` (int): プリミティブモード
- `m` (Material): マテリアル
- `gmat` (Matrix): グローバル行列
- `lmat` (Matrix): ローカル行列
- `emitmat` (Matrix): 発生行列
- `mods` (ParticleModifiers): モディファイア
- `aimtype` (int): エイムタイプ
- `ptcw`, `ptch`, `ptcd`, `ptcr` (float): パーティクルサイズパラメータ
- `ptcaxis` (int): パーティクル軸
- `colortarget` (int): カラーターゲット
- `alive` (int): 生存パーティクル数
- `nume`, `numc` (int, 読み取り専用): エミッタ数、コレクション数
- `defseed` (int): デフォルトシード
- `elemr` (float): 要素半径

#### メソッド

##### `update(deltaTime)`
パーティクルを更新します。

**引数**:
- `deltaTime` (float): デルタ時間（ミリ秒）

**戻り値**: 生存パーティクル数

##### `emit(ParticleEmittable[, Matrix])`
パーティクルを発生させます。

**引数**:
- `ParticleEmittable`: 発生源
- `Matrix` (オプション): ローカル行列

##### `emit1()`
単一のパーティクルを発生させます。

**戻り値**: `ParticleElement`

##### `beginElement(ParticleElement)`
パーティクル走査を開始します。

**引数**:
- `ParticleElement`: 結果格納先

**戻り値**: 成功した場合true

##### `nextElement(ParticleElement)`
次のパーティクルを取得します。

**引数**:
- `ParticleElement`: 現在の要素

**戻り値**: 次があればtrue

##### `getBounds([Rect3D])`
バウンディングボックスを取得します。

**引数**:
- `Rect3D` (オプション): 結果格納先

**戻り値**: `Rect3D`

##### `scroll(Vector3D)`
全パーティクルをスクロールします。

**引数**:
- `Vector3D`: オフセット

##### `clear()`
全パーティクルをクリアします。

---

### OcclusionQuery

オクルージョンクエリ（遮蔽判定）を表します。

#### コンストラクタ

```javascript
OcclusionQuery()
```

**説明**: GPUによる可視性判定を行うためのクエリオブジェクトです。

---

### PolygonFace

ポリゴンフェース（メッシュの一部分）を表します。

#### フィールド

- `mode` (int): プリミティブモード
- `offs` (int): インデックスオフセット
- `len` (int): インデックス数
- `voffs` (int): 頂点オフセット
- `visiblemask` (int): 表示マスク
- `idx` (IndexBuffer): インデックスバッファ
- `m` (Material): マテリアル

#### 静的メソッド

##### `PolygonFace.drawFaces(faces, visiblemask[, Material])`
ポリゴンフェースを描画します。

**引数**:
- `faces` (Array or PolygonFace): フェース配列または単一フェース
- `visiblemask` (int): 表示マスク
- `Material` (オプション): 上書きマテリアル

---

### Bone / BoneParts

スケルタルアニメーション用のボーン構造を表します。

#### BoneParts

**フィールド**:
- `id` (int): パーツID
- `parentid` (int): 親ID
- `pivot` (Vector3D): ピボット点
- `bindpose` (Matrix): バインドポーズ
- `invbindpose` (Matrix): 逆バインドポーズ
- `transline` (TransformTimeline): トランスフォームタイムライン
- `length` (float): 長さ
- `name`: パーツ名

**メソッド**:
- `setMixWeights(Array)`: ミックスウェイトを設定
- `getMixWeights(Array)`: ミックスウェイトを取得

#### Bone

**フィールド**:
- `parts` (BoneParts): パーツ定義
- `lastparts` (BoneParts): 前回のパーツ
- `invbindpose` (Matrix): 逆バインドポーズ
- `mat` (Matrix): 現在の行列
- `trans` (Transform): トランスフォーム
- `adjust` (Transform): 調整トランスフォーム
- `parentbone` (Bone): 親ボーン
- `name`: ボーン名

**メソッド**:
- `setTransform(Transform[, Matrix])`: トランスフォームを設定

---

### Animation / AnimationState

アニメーション再生状態を表します。

#### Animation

**コンストラクタ**:
```javascript
Animation()
```

**フィールド**:
- `starttime` (float): 開始時間
- `endtime` (float): 終了時間
- `speed` (float): 再生速度
- `loop` (int): ループフラグ
- `animating` (int): 再生中フラグ
- `frametime` (float): 現在のフレーム時間
- `motion`: モーション参照

**メソッド**:
- `set(start, end, speed, loop[, motion])`: アニメーションを設定
- `update(deltaTime)`: 更新
- `setSpeed(speed)`: 速度を設定

#### AnimationState

**コンストラクタ**:
```javascript
AnimationState()
```

**フィールド**:
- `fadew` (float): フェードウェイト
- `fadespd` (float): フェード速度
- `fadestopped` (int): フェード停止フラグ
- `time` (float): 現在時刻（読み取り）
- `animating` (bool): 再生中（読み書き）

**メソッド**:
- `set(start, end, speed, loop)`: アニメーションを設定
- `fade(start, end, speed, loop, fadeTime)`: フェード切り替え
- `update(deltaTime)`: 更新
- `setSpeed(speed)`: 速度を設定

---

### ShapeKeyList / ShapeState

モーフターゲット（シェイプキー）アニメーション用のクラスです。

#### ShapeKeyList

**メソッド**:
- `loadData(ByteBuffer)`: データをロード
- `attrlen()`: 属性数を取得
- `keylen()`: キー数を取得
- `attrAt(index)`: 指定インデックスの属性を取得
- `elemsAt(index)`: 指定インデックスの要素数を取得
- `keymap`: キー名→インデックスのマップ

#### ShapeState

**フィールド**:
- `shapekeys` (ShapeKeyList): シェイプキーリスト
- `hash` (int): ハッシュ
- `[index]`: ウェイト値へのアクセス（0-255）

**メソッド**:
- `clear()`: 全ウェイトをクリア
- `rehash()`: ハッシュを再計算
- `interpolate(ShapeState1, weight, dstShapeState)`: 補間

---

### SK3DRenderNode / SK3DDisplayList

3Dシーンのカリング・ソート・描画管理用のクラスです。

#### SK3DRenderNode

**フィールド**:
- `parent` (SK3DRenderNode): 親ノード
- `visible` (int): 表示フラグ
- `incamera` (int): カメラ内フラグ
- `inwater` (int): 水中フラグ
- `depth` (float): 深度
- `depthvolume` (float): 深度ボリューム
- `sortscale`, `sortoffset`, `sortval` (float): ソート用パラメータ
- `occrate` (float): オクルージョン率
- `billboard` (int): ビルボードモード
- `billboardbank` (float): ビルボードバンク
- `visiblemask` (int): 表示マスク
- `gmat` (Matrix): グローバル行列
- `gbnd` (Rect3D): グローバルバウンド
- `mesh`: メッシュ参照
- `ptc`: パーティクル参照
- `occluder`, `occludee`: オクルーダー/オクルーディー参照
- `groupcull` (int): グループカリングフラグ
- `occluded` (int): 遮蔽フラグ
- `children`: 子ノード配列

#### SK3DDisplayList

**メソッド**:
- `clear()`: リストをクリア
- `setCamera(Camera)`: カメラを設定
- `isInside(Rect3D)`: バウンド内判定
- `collect(visiblemask, Array)`: ノードを収集
- `collectOccludees(Array)`: オクルーディーを収集
- `cullNodes(nodeArray, visiblemask)`: カリング実行
- `sort()`: ノードをソート
- `remove(SK3DRenderNode)`: ノードを削除
- `clearOccludedFlag()`: 遮蔽フラグをクリア
- `occlusionCull(queryTable)`: オクルージョンカリング
- `filterZFar(zfar, Array)`: 遠方フィルタ
- `filterVisibleMask(mask, Array)`: 表示マスクフィルタ
- `[index]`: インデックスでノードにアクセス
- `#`: 長さを取得
- `<<`: ノードを追加

**フィールド**:
- `state` (int): 状態

---

## 定数

### 行列タイプ

- `SK_WORLD` (0): ワールド行列
- `SK_VIEW` (1): ビュー行列
- `SK_PROJECTION` (2): プロジェクション行列

### クリアマスク

- `SK_CLEAR_COLOR` (1): カラーバッファ
- `SK_CLEAR_DEPTH` (2): デプスバッファ
- `SK_CLEAR_STENCIL` (4): ステンシルバッファ

### プリミティブモード

- `SK_POINTS`: 点
- `SK_LINES`: ライン
- `SK_LINE_STRIP`: ラインストリップ
- `SK_LINE_LOOP`: ラインループ
- `SK_TRIANGLES`: 三角形
- `SK_TRIANGLE_STRIP`: 三角形ストリップ
- `SK_TRIANGLE_FAN`: 三角形ファン

### テクスチャフォーマット

**カラー**:
- `SK_RGBA8`: RGBA 8ビット/チャンネル
- `SK_RGB8`: RGB 8ビット/チャンネル
- `SK_RGBA16F`: RGBA 16ビット浮動小数点
- `SK_RGBA32F`: RGBA 32ビット浮動小数点
- `SK_R8`: R 8ビット
- `SK_RG8`: RG 8ビット

**デプス・ステンシル**:
- `SK_DEPTH16`: デプス 16ビット
- `SK_DEPTH24`: デプス 24ビット
- `SK_DEPTH24_STENCIL8`: デプス 24ビット + ステンシル 8ビット
- `SK_DEPTH32F`: デプス 32ビット浮動小数点

**圧縮**:
- `SK_COMPRESSED_ETC2_RGB8`
- `SK_COMPRESSED_ETC2_RGBA8`
- `SK_COMPRESSED_DXT1_RGB`
- `SK_COMPRESSED_DXT5_RGBA`
- など

### サンプラーステート

**ラップモード**:
- `SK_REPEAT`: リピート
- `SK_CLAMP`: クランプ
- `SK_CLAMP_TO_EDGE`: エッジクランプ
- `SK_MIRRORED_REPEAT`: ミラーリピート

**フィルタ**:
- `SK_NEAREST`: ニアレスト
- `SK_LINEAR`: リニア
- `SK_NEAREST_MIPMAP_NEAREST`: ニアレスト（ミップマップ）
- `SK_LINEAR_MIPMAP_NEAREST`: バイリニア
- `SK_LINEAR_MIPMAP_LINEAR`: トライリニア
