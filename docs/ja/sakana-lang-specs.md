# sakana言語 (sk) 仕様

RPG-Cobo で使われる `sakana` 言語（略称 `sk`）は、Squirrel言語というゲーム開発用の組み込み言語をベースに、大幅な高速化と機能強化をしています。  
JavaScript と文法的な親和性があるため、比較的覚えやすく馴染みやすいかと思います。
このページでは、`sk`の基本的な言語仕様を簡単に紹介しつつ、JavaScript と使い方が違うものについてはどう違うのかの説明をしていきます。


## 1. 基本型

- 値型: `int`, `float`, `bool`, `null`, `undefined`
- 文字列: UTF-8 対応
- 配列: `array`
- テーブル: `table`
- クロージャ: `closure`
- ネイティブ関数: `nclosure`
- クラス/インスタンス: `class`, `instance`
- スレッド: `thread`

### undefined
`sk` には`null`の他に`undefined`型があります。値が存在しないことを示す特別な値です。

### string
utf-8フォーマットの文字列です。  
一般的な文字列定義`"abc"`の他に、JavaScript のテンプレート文\``abc${val}`\`や、python式の文字列フォーマット式`"abc %d %s" % (a,b)`も使えます。

### array
`sk` の`array`型は、JavaScriptのArray型と同様の可変長リストです。

### table
`sk` の`table`型は、JavaScriptのobject型と同様のkey/valueテーブルです。

### closure, nclosure
実行可能な関数です。nclosureはC++のコードを実行するネイティブ関数です。

### class, instance
JavaScript との大きな違いとして、skの`class`は最初に`instance`化したときに内部構造がロックされ、以後自由なメンバー変数の追加はできなくなります。  
詳しい使用方法は クラスとメタメソッド の項目を参照ください。

### thread
`sk`は、多数の論理スレッドを持つブロッキング型の言語です。この点がJavaScriptと一番の違いで、ゲームのプログラミングにはとても便利になっています。  
詳しい使用方法は スレッド の項目を参照ください。


## 2. 変数とスコープ

### ローカル変数

```sk
local x, y;
local z = 10;
```

### グローバル変数

グローバル変数の定義・代入には `::` を使います。

```sk
::gvar <- "some";
::[key] <- "some";
```

`::` を使わずにグローバル変数を書き換えるとエラーになるため、明示的にグローバルを指定する必要があります。

### スコープ解決

クラスメソッド内で `gvar` を参照した場合、まず自身のオブジェクトに存在するか確認し、なければグローバルを参照します。

```sk
class X {
    function getgvar(){ return gvar; }
    function setgvar(x){ ::gvar = x; }
}
```

## 3. 関数定義

### 通常の関数

```sk
function foo(a, b, c = 0, ...){
    ;
}
```

### ローカル関数

```sk
local localfoo(a, b){
    ;
}
```

### ラムダ式

```sk
list.sort(@(v) v.id);
local func = @(){ if (x) y = 100; };
```

### 可変長引数

引数は `vargc` と `vargv` で取得します。

```sk
function foo(a, ...){
    local n = vargc;
    local first = vargv[0];
}
```

### レキシカルスコープ

外部変数は読み取り可能ですが、関数内から再代入しようとするとコンパイルエラーになります。

```sk
local outer = "abc";
function getouter(){ return outer; }
function setouter(x){ outer = x; } // エラー
```

### `with` と `#`

- `with` は JavaScript の `with` と類似した振る舞いです。
- `#` は静的初期化子のように、関数の最初の呼び出し時に一度だけ評価され、その後は同じ値を使い回します。

```sk
function func(x){
    local staticval = #(x + 1234);
    ...
}
```

## 4. オブジェクト参照とフィールドアクセス

`sk` では、`obj.key` と `obj["key"]` の動作が異なります。

- `obj.key` はフィールドが存在しない場合、例外をスローします。
- `obj["key"]` は存在しない場合に `undefined` を返します。

この違いは `table`、`instance`、`null` いずれでも共通です。

## 5. 演算子

`sk` で使える主な演算子:

- 算術: `+`, `-`, `*`, `/`, `%`
- ビット演算: `|`, `&`, `<<`, `>>`, `>>>`, `^`, `~`
- 論理: `&&`, `||`, `??`, `!`
- 連結: `..`
- スプレッド: `...`
- 代入: `=`, `<-`, `+=`, `-=`, `*=`, `/=`, `%=`, `|=`, `&=`, `<<=`, `>>=`, `>>>=`
- 比較: `==`, `!=`, `<=`, `<`, `>=`, `>`, `<>`, `instanceof`
- インクリメント/デクリメント: `++`, `--`
- その他: `?:`, `delete`, `clone`, `with`, `#`, `::`

### `newslot` 演算子 (`<-`)

`table` やグローバル変数に新しいキーを追加する際は、`<-` を使います。キーが存在しない状態で `=` を使うとエラーになります。

```sk
obj <- { };
obj["newKey"] <- 123;
```

### 比較演算子 `<>`

`a <> b` は 3-way 比較を行い、`-1`, `0`, `1` のいずれかを返します。構造的比較を行うため、参照が異なっても内部値が同じなら等価と見なされます。

### 連結演算子 `..`

`..` は文字列と配列の連結に使えます。

```sk
"string" .. 123        // "string123"
[1, 2, 3] .. 4 .. 5      // [1, 2, 3, 4, 5]
```

配列への連結は自身に要素を追加し、クローンを作成しません。

### 配列に対する~演算子

`sk` では柔軟な関数呼び出しを実現するために、以下のように`~`演算子と配列を組み合わせて関数呼び出しができます。  
`~[function,self,arg1,arg2,...]`

## 6. クラスとメタメソッド

`sk` のクラス定義は JavaScript に近い書式ですが、初回インスタンス化時に構造がロックされ、インスタンス変数はロック後には追加できなくなります（メソッドやスタティック変数は変更可能）。

```sk
class Foo extends BaseFoo
{
    static s = "abc";
    x = 0.0;
    y = "y";
    z = null;

    function foo(a){ ; }
    static function staticfoo(a){ ; }

    <abc, def> tagval = 0;  // メンバー変数にはタグを指定できる
}
```

### メタメソッド

`sk` ではクラスに特殊メソッドを定義して振る舞いを拡張できます。

```sk
class Foo
{
    function _get(k) scp[k]
    function _set(k, v) scp[k] = v
    function _newslot(k, v) scp[k] <- v
    function _call(caller, ...){ ; }
    function _cloned(org){ ; }
    function _cmp(b) id <> b.id
}
```

- `_get` / `_set`: 未定義フィールドのアクセス制御
- `_newslot`: 新しいフィールド追加時の挙動
- `_call`: オブジェクト呼び出し時の振る舞い
- `_cloned`: コピー時の動作
- `_cmp`: 3-way 比較の定義

## 7. スレッド

`sk` は多数の論理スレッドが同時並行で動作するブロッキングスタイルのスレッディングモデルを採用しています。  
JavaScript とは異なり、協調的なスレッド制御が可能です。

```sk
local t = newthread("thread name");
```

### 自立型スレッド

```sk
t.start(func, self, arg0, arg1, ...);
```

毎フレーム自動的に実行されます。

### 協調型スレッド

```sk
t.call(func, self, arg0, arg1, ...);
t.wakeup(dt);
```

`call` 後に `wakeup` を使うことで、実行タイミングを任意に制御できます。

### スレッドの中断

`sk` のスレッドは協調型なので、無限ループを避けるために処理中の適切な場所で `suspend()` や `sleep(16)` を呼ぶ必要があります。

```sk
suspend();
sleep(16);
```

## 8. 制御構文

以下の構文は JavaScript とほぼ同じ使い方ができます。使い方の違うものについては、個別に説明します。

- `if`
- `switch`
- `while`
- `do` / `while`
- `for`
- `foreach`
- `break`
- `continue`
- `local`
- `return`
- `try` / `catch`
- `goto`
- `enum`
- `import`

### foreach

`foreach` は JavaScript の `for-of` 相当です。

```sk
foreach(val in obj){
    ;
}

foreach(idx, val in obj){
    ;
}
```

### removei

`foreach` のループ中に要素を安全に削除するには `removei` を使います。

```sk
foreach(val in obj){
    if (val == 0) removei;
}
```

### goto

`goto` は関数内のラベルに飛びます。ブロックの内外をまたぐジャンプも可能ですが、ローカル変数の状態が不安定になる場合があります。

```sk
LABEL:
    ;
if (cond) goto LABEL;
```

### enum

`enum` は列挙型を定義します。

```sk
enum Color { Red, Green, Blue }
local c = Color.Red;
```

### import

`sk` の `import` は JavaScriptのものとは異なり、モジュールではなく定数や関数をソース内のグローバルスコープに登録するための構文です。  
例えば、以下のように `import` を使うことで、`VirtualKeyCode`の定数(VK_Aなど)を直接指定することができます。

```sk
import VirtualKeyCode;
```

`import` で指定できるのは、enumで定義された定数、事前に定義されたテーブル、またはクラスです。
