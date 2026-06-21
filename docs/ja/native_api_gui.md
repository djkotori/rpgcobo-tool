# SakanaGL SKView API リファレンス

このドキュメントは、SakanaGL の GUI コンポーネントの基底クラス `SKView` (`core/api/ssapi_skview.cpp`) に関するリファレンスです。

## 概要

`SKView` は SakanaGL の GUI システムの基礎となるクラスです。階層構造、座標変換、入力判定、描画、アニメーション、モーダルダイアログなどの機能を提供します。ボタン、テキストボックス、リストなどのカスタム GUI コンポーネントは `SKView` を継承して作成します。

'SKview' はネイティブのコードと`sk`スクリプトで作成されたコードによって構成されています。詳しくは、SKView.sk を参照してください。

---

## 目次

- [SKView](#skview) - GUIコンポーネント基底クラス
- [階層構造](#階層構造)
- [座標系とトランスフォーム](#座標系とトランスフォーム)
- [ピッキング（入力判定）](#ピッキング入力判定)
- [描画](#描画)
- [可視性と有効性](#可視性と有効性)
- [モーダルとフォーカス](#モーダルとフォーカス)
- [タッチモード](#タッチモード)
- [アニメーション](#アニメーション)
- [使用例](#使用例)

---

## SKView

GUI コンポーネントの基底クラスです。階層構造を持ち、座標変換、入力判定、描画をサポートします。

### フィールド

#### 階層構造

- `parent` (SKView | null): 親ビュー
- `children` (Array): 子ビューの配列

#### 座標・トランスフォーム

- `pos` (Vector3D): 位置（X, Y, Z）
- `scale` (Vector3D): スケール（X, Y, Z）
- `rot` (Vector3D): 回転（HPB: ヘディング、ピッチ、バンク）
- `bnd` (Rect2D): 境界矩形（ローカル座標）
- `mat` (Matrix): ワールド変換行列（自動計算）
- `customtransform` (int): カスタム変換フラグ（1の場合、`mat`を手動設定可能）
- `matdirty` (int): 行列ダーティフラグ（自動更新が必要な場合1）

#### 描画

- `render` (function | null): カスタム描画関数 `function(skview)`
- `buf` (Sprite | null): オフスクリーンバッファ
- `buftype` (int): バッファタイプ
- `bufcolor` (uint): バッファクリアカラー
- `dorepaint` (int): 再描画要求フラグ

#### 状態フラグ

- `visible` (int): 表示フラグ（0=非表示、1=表示）
- `enabled` (int): 有効フラグ（0=無効、1=有効）
- `pickable` (int): ピック可能フラグ（0=不可、1=可）
- `layerflags` (int): レイヤーフラグ（ビット0=描画、ビット1=更新）
- `focused` (int): フォーカスフラグ
- `modal` (int): モーダルフラグ（1の場合、外部のクリックをブロック）

#### タッチモード

- `exclusivetouch` (int): 排他タッチモード
- `multitouch` (int): マルチタッチモード
- `exclusivedrag` (int): 排他ドラッグモード

#### マウスカーソル

- `mousecurs` (int): マウスカーソルID（-1=継承、0以上=カーソル番号）

#### アニメーション

- `framepos` (float): アニメーションフレーム位置
- `loops` (int): ループ回数

#### コールバック

- `innerpick` (function | null): カスタムピック判定関数 `function(skview, x, y) -> bool`

---

## メソッド

### 座標・トランスフォーム

##### `setPosition(x[, y[, z]])`
位置を設定します。

**引数**:
- `x` (float): X座標
- `y` (float, オプション): Y座標
- `z` (float, オプション): Z座標

**説明**: 引数を省略した場合、その軸の値は変更されません。

##### `updateMatrix()`
このビューの変換行列を更新します。

**説明**: `pos`, `scale`, `rot`, `bnd` が変更された場合、行列を再計算します。親ビューの行列も遡って更新します。

##### `updateMatrixAll([force])`
このビューと全ての子ビューの変換行列を再帰的に更新します。

**引数**:
- `force` (bool, オプション): 強制更新（デフォルト: false）

##### `getInvMatrix()`
逆変換行列を取得します。

**戻り値**: Matrix - ワールド座標からローカル座標への変換行列

**説明**: スクリーン座標からローカル座標への変換に使用します。

---

### 階層・検索

##### `getRoot()`
ルートビュー（最上位の親）を取得します。

**戻り値**: SKView

##### `getModalRoot()`
モーダルルート（最も近いモーダルビュー）を取得します。

**戻り値**: SKView | null

##### `contains(child)`
このビューが指定したビューを（直接または間接的に）含んでいるか判定します。

**引数**:
- `child` (SKView): 判定対象のビュー

**戻り値**: bool

##### `findChildFor(value[, fieldName[, depth]])`
指定したフィールドに指定した値を持つ子ビューを検索します。

**引数**:
- `value`: 検索する値
- `fieldName` (string, オプション): フィールド名（デフォルト: `"name"`）
- `depth` (int, オプション): 検索深度（デフォルト: 8）

**戻り値**: SKView | null

**説明**: 子孫ビューの中から、`fieldName` フィールドが `value` と一致するビューを返します。

##### `findOwners(fieldName, outArray)`
指定したフィールドに値が設定されている（!= 0）全ての子孫ビューを配列に格納します。

**引数**:
- `fieldName` (string): フィールド名
- `outArray` (Array): 結果を格納する配列

**戻り値**: Array（引数で渡した配列）

**説明**: 再帰的に全ての子孫を検索し、条件に合うビューを列挙します。

---

### ピッキング（入力判定）

##### `pick(x, y, chooseModal, outVector)`
指定したスクリーン座標 (x, y) でビューをピッキングします。

**引数**:
- `x` (float): スクリーンX座標
- `y` (float): スクリーンY座標
- `chooseModal` (bool): モーダル判定フラグ
- `outVector` (Vector3D): ローカル座標の出力先

**戻り値**: SKView | null - ヒットしたビュー（最前面の子から順に検索）

**説明**: 
- 最前面の子ビューから順にピック判定を行います。
- `chooseModal` が true の場合、モーダルビューの外側をクリックしてもモーダルビューを返します。
- `outVector.x, outVector.y` にはヒットしたビューのローカル座標が格納されます。
- `outVector.z` には、モーダル外をクリックした場合 1.0、それ以外は 0.0 が格納されます。
- 各ビューの `innerpick` コールバックが設定されている場合、カスタム判定を実行します。

##### `pickall(x, y[, outArray])`
指定したスクリーン座標でヒットする全てのビューを取得します（階層順）。

**引数**:
- `x` (float): スクリーンX座標
- `y` (float): スクリーンY座標
- `outArray` (Array, オプション): 結果を格納する配列

**戻り値**: Array - ヒットしたビューの配列（親から子の順）

**説明**: 親から子への順序で、全てのヒット対象を列挙します。

---

### 描画

##### `repaint()`
再描画フラグを設定します。

**説明**: 次回の描画サイクルでこのビューを再描画するようマークします。`buf` が設定されている場合、オフスクリーンバッファを更新します。

##### `repaintCheck(outArray)`
このビューと子ビューの再描画フラグをチェックし、再描画が必要なビューを配列に格納します。

**引数**:
- `outArray` (Array): 再描画対象のビューを格納する配列

**戻り値**: bool - 再描画が必要な場合 true

**説明**: 再描画フラグをクリアしながら走査します。描画システムの内部で使用されます。

##### `renderView()`
このビューと子ビューを再帰的に描画します。

**説明**: 
- `buf` が設定されている場合、スプライトとして描画します。
- `render` コールバックが設定されている場合、それを呼び出します。
- 子ビューを前から順に描画します。
- 通常、ルートビューに対して呼び出します。

---

### 状態取得

##### `isEnabled()`
このビューと全ての親ビューが有効かどうかを判定します。

**戻り値**: bool

**説明**: 階層的に `enabled` フラグをチェックします。親のいずれかが無効なら false を返します。

##### `isVisible()`
このビューと全ての親ビューが表示されているかどうかを判定します。

**戻り値**: bool

**説明**: 階層的に `visible` フラグをチェックします。親のいずれかが非表示なら false を返します。

##### `isAvailable()`
このビューが「利用可能」かどうかを判定します（表示、有効、レイヤーフラグ全てがON）。

**戻り値**: bool

**説明**: `visible && enabled && (layerflags & 1)` を階層的にチェックします。

##### `getMouseCursor()`
このビューに適用されるマウスカーソルIDを取得します。

**戻り値**: int - カーソルID

**説明**: このビューまたは親ビューの `mousecurs` を階層的に検索します。

---

### 矩形計算

##### `getVisibleRect([container[, outRect]])`
このビューの可視矩形を取得します（親ビューのクリッピング領域を考慮）。

**引数**:
- `container` (SKView, オプション): 座標系の基準となるビュー（省略時は自身）
- `outRect` (Rect2D, オプション): 結果を格納する矩形（省略時は新規作成）

**戻り値**: Rect2D | null

**説明**: 親ビューのクリッピングを適用した可視領域を計算します。スクロールビューやクリッピングに使用します。

##### `getWindowRect([outRect])`
親ビューの境界矩形をこのビューのローカル座標系で取得します。

**引数**:
- `outRect` (Rect2D, オプション): 結果を格納する矩形

**戻り値**: Rect2D | null

**説明**: 親ビューの描画領域をローカル座標で表現します。親が存在しない場合は null を返します。

---

## 階層構造

SKView は親子関係を持ちます。親ビューの座標変換は子ビューに継承されます。

### 子ビューの追加

```javascript
local parent = SKView();
local child = SKView();

parent.children = [];
parent.children.append(child);
child.parent = parent;
```

### 階層の走査

```javascript
function printHierarchy(view, indent) {
	println(indent .. view.name);
	foreach( child in view.children) {
		if(child instanceof SKView) {
			printHierarchy(child, indent.."  ");
		}
	}
}

printHierarchy(rootView, "");
```

---

## 座標系とトランスフォーム

SKView はローカル座標系を持ち、親ビューの変換を継承します。

### トランスフォーム計算

変換行列は以下の順序で計算されます:

1. `pos` による平行移動
2. `rot` による回転（クォータニオン）
3. `scale` によるスケーリング
4. `bnd.x, bnd.y` によるオフセット
5. 親ビューの変換行列との合成

### カスタム変換

```javascript
view.customtransform = 1;
view.mat = Matrix.fromTranslate(100, 50, 0);
view.updateMatrix();
```

`customtransform` を 1 に設定すると、`pos`, `scale`, `rot` による自動計算を無効化し、`mat` を直接設定できます。

---

## ピッキング（入力判定）

ピッキングは、スクリーン座標からビューへの入力判定を行う機能です。

### 基本的なピッキング

```javascript
local hitPos = Vector3D();
local hitView = rootView.pick(mouseX, mouseY, false, hitPos);

if(hitView) {
	println("Hit: " .. hitView.name .. " at (" .. hitPos.x .. ", " .. hitPos.y .. ")");
}
```

### カスタムピック判定

`innerpick` コールバックを使用すると、矩形以外の形状でピック判定を実装できます:

```javascript
view.innerpick = function(v, x, y) {
	// 円形の判定
	local dx = x - v.bnd.w/2;
	local dy = y - v.bnd.h/2;
	local dist = Math.sqrt(dx*dx + dy*dy);
	return dist < v.bnd.w/2;
};
```

### モーダルダイアログ

```javascript
local dialog = SKView();
dialog.modal = 1;
dialog.bnd.set(0, 0, 400, 300);

// モーダル外をクリックしてもdialogが返される
local hitPos = Vector3D();
local hit = rootView.pick(mouseX, mouseY, true, hitPos);
if(hit == dialog && hitPos.z == 1.0) {
	// モーダル外をクリックした
	dialog.visible = 0;
}
```

---

## 可視性と有効性

### visible

`visible` フラグは表示/非表示を制御します:

```javascript
view.visible = 0; // 非表示
view.visible = 1; // 表示
```

親ビューが非表示の場合、子ビューも描画されません。

### enabled

`enabled` フラグは有効/無効を制御します:

```javascript
view.enabled = 0; // 無効（ピック不可）
view.enabled = 1; // 有効
```

親ビューが無効の場合、子ビューもピック対象外になります。

### pickable

個別のビューのピック可否を制御します:

```javascript
view.pickable = 0; // このビューはピック不可（子はピック可能）
view.pickable = 1; // ピック可能
```

### layerflags

レイヤーフラグはビット単位で動作を制御します:

- `layerflags & 1`: 描画レイヤー（0で非描画）
- `layerflags & 2`: 更新レイヤー（アプリケーション定義）

```javascript
view.layerflags = 3; // 描画と更新の両方
view.layerflags = 1; // 描画のみ
view.layerflags = 0; // 非アクティブ
```

---

## モーダルとフォーカス

### modal

モーダルフラグが 1 の場合、このビューより検索順序の低いビューの外側へのクリックをブロックします:

```javascript
local dialog = SKView();
dialog.modal = 1;

// ピック時、モーダル外のクリックを検出可能
local hitPos = Vector3D();
local hit = rootView.pick(x, y, true, hitPos);
if(hitPos.z == 1.0) {
	// モーダル外をクリックした
}
```

### focused

フォーカス状態を保存するフィールドです（アプリケーション定義）:

```javascript
view.focused = 1; // フォーカスあり
```

**注意**: SKView は自動的にフォーカス管理を行いません。アプリケーション側で実装する必要があります。

---

## タッチモード

マルチタッチデバイス向けのフラグです:

### exclusivetouch

```javascript
view.exclusivetouch = 1;
```

排他的タッチモード。最初にタッチしたビューのみがタッチイベントを受け取ります。

### multitouch

```javascript
view.multitouch = 1;
```

マルチタッチモード。複数の指で同時にタッチ可能にします。

### exclusivedrag

```javascript
view.exclusivedrag = 1;
```

排他的ドラッグモード。ドラッグ中は他のビューがタッチイベントを受け取りません。

**注意**: これらのフラグはタッチイベント処理システムで使用されます。アプリケーション側でイベントハンドラを実装する必要があります。
