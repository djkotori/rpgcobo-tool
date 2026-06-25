# SakanaGL Steamworks API リファレンス

このドキュメントは、SakanaGL の Steamworks SDK アドオン (`addon/steam/sakana_addon.cpp`) に関するリファレンスです。

## 概要

sksteam アドオンは、Steam プラットフォームの機能を SakanaGL アプリケーションから利用可能にします。ユーザー情報の取得、実績（Achievement）管理、統計（Stats）、ゲーム内課金、認証、Steam Deck 対応などをサポートします。

**アドオンのロード方法**:
```javascript
skLoadAddon( "sksteam");
```

---

## 目次

- [初期化](#初期化)
- [Steam ユーザー情報](#steamユーザー情報)
- [認証・チケット](#認証チケット)
- [実績（Achievement）](#実績achievement)
- [統計（Stats）](#統計stats)
- [ゲーム内課金（Micro Transaction）](#ゲーム内課金microtransaction)
- [Steam Deck / Big Picture モード](#steamdeckbigpictureモード)
- [ゲームパッドテキスト入力](#ゲームパッドテキスト入力)
- [その他のユーティリティ](#その他のユーティリティ)
- [使用例](#使用例)

---

## 初期化

### `SteamAPI.init()`

Steam API を初期化します。アプリケーション起動時に最初に呼び出す必要があります。

**戻り値**: bool - 初期化成功時 true

**説明**: 初期化に失敗した場合、Steam クライアントが起動していない、または steam_appid.txt が見つからない可能性があります。

**例**:
```javascript
if(!SteamAPI.init()) {
	println("Steam初期化失敗");
	exit(1);
}
```

---

### `SteamAPI.runSteamCallbacks()`

Steam のコールバックを処理します。メインループで定期的に呼び出してください。

**説明**: 実績解除、課金承認、認証チケット結果などのイベントを受信するために必須です。

**例**:
```javascript
function update() {
	SteamAPI.runSteamCallbacks();
	// ゲームロジック...
}
```

---

### `SteamAPI.restartAppIfNecessary(appid)`

Steam 経由でアプリが起動されていない場合、Steam 経由で再起動します。

**引数**:
- `appid` (int): Steam アプリ ID

**戻り値**: bool - 再起動が必要な場合 true（アプリは終了すべき）

**説明**: アプリが Steam 経由で起動されていない場合に自動的に Steam 経由で再起動します。通常、アプリケーションの最初に呼び出します。

**例**:
```javascript
if(SteamAPI.restartAppIfNecessary(YOUR_APP_ID)) {
	// Steam経由で再起動されるので終了
	exit(0);
}
```

---

## Steam ユーザー情報

### `SteamAPI.getSteamID64(long)`

現在のユーザーの Steam ID（64bit）を取得します。

**引数**:
- `long`: 結果を格納する long オブジェクト

**戻り値**: long - 渡した long オブジェクト

**説明**: Steam ID を 64bit 整数として取得します。

**例**:
```javascript
local steamID = SteamAPI.getSteamID64( long());
println("Steam ID: " .. steamID);
```

---

### `SteamAPI.getSteamIDString()`

Steam ID を文字列形式で取得します。

**戻り値**: string - `"<アカウントタイプ>_<アカウントID>"` 形式

**説明**: Steam ID を識別しやすい文字列として取得します。

**例**:
```javascript
local idStr = SteamAPI.getSteamIDString();
println("Steam ID String: " .. idStr);
```

---

### `SteamAPI.getSteamAccountID()`

Steam アカウント ID（32bit）を取得します。

**戻り値**: int - アカウント ID

**例**:
```javascript
local accountID = SteamAPI.getSteamAccountID();
println("Account ID: " .. accountID);
```

---

### `SteamAPI.getPlayerSteamLevel()`

プレイヤーの Steam レベルを取得します。

**戻り値**: int - Steam レベル

**例**:
```javascript
local level = SteamAPI.getPlayerSteamLevel();
println("Steam Level: " .. level);
```

---

### `SteamAPI.getPersonaName()`

プレイヤーの Steam 表示名を取得します。

**戻り値**: string - 表示名

**例**:
```javascript
local name = SteamAPI.getPersonaName();
println("Welcome, " .. name .. "!");
```

---

### `SteamAPI.getCurrentGameLanguage()`

現在のゲーム言語コードを取得します。

**戻り値**: string - 言語コード（例: "english", "japanese", "schinese"）

**説明**: Steam の言語設定に基づいてゲームの表示言語を切り替える際に使用します。

**例**:
```javascript
local lang = SteamAPI.getCurrentGameLanguage();
if(lang == "japanese") {
	loadJapaneseLocalization();
} else {
	loadEnglishLocalization();
}
```

---

## 認証・チケット

### `SteamAPI.getAuthTicketForWebApi([identity])`

Web API 向けの認証チケットを取得します。

**引数**:
- `identity` (string, オプション): サービス識別子（省略可能）

**戻り値**: `ticketHandle (int)`

**説明**: 
- Web API での認証に使用します（`getSteamAuthSessionTicket` の代わりに使用してください）。
- `runSteamCallbacks()` を呼び続け、`getAuthTicketResult()` で結果を確認します。

---

### `SteamAPI.getAuthTicketResult()`

認証チケット取得の結果を取得します。

**戻り値**: string | int | null - 成功時 チケットの文字列、失敗時 エラーコード(EResult)、未完了の場合 null

**説明**: `getAuthTicketForWebApi()` を呼び出した後、Steam側の処理が完了するまで null が返されます。

**例**:
```javascript
local result = SteamAPI.getAuthTicketResult();
if(result == null) {
	println("認証チケット取得中...");
} else if(typeof( result) == SS_INTEGER) {
	println("認証チケット取得失敗: " .. result);
} else {
	println("認証チケット取得成功: " .. result);
}
```

---

### `SteamAPI.getSteamAuthSessionTicket()`

セッション認証チケットを取得します。

**戻り値**: Array - `[ticketHandle (int), hexToken (string), tokenBytes (ByteBuffer)]`

**説明**: 
- Web API 認証には `getAuthTicketForWebApi` を使用してください。
- P2P ネットワークプレイなど限定的な用途で使用可能です。

---

### `SteamAPI.getSteamAuthSessionResult()`

セッション認証チケット取得の結果を取得します。

**戻り値**: int | null - 結果コード

**説明**: `getSteamAuthSessionTicket()` の結果確認用。

---

### `SteamAPI.cancelSteamAuthSessionTicket(ticketHandle)`

認証チケットをキャンセルします。

**引数**:
- `ticketHandle` (int): チケットハンドル

**説明**: 取得した認証チケットを無効化します。セッション終了時に呼び出してください。

**例**:
```javascript
SteamAPI.cancelSteamAuthSessionTicket(ticketHandle);
```

---

## 実績（Achievement）

### `SteamAPI.requestUserStats()`

ユーザーの統計データと実績データを要求します。

**戻り値**: bool - 要求成功時 true

**説明**: 
- Steamworks SDK v1.61 以降では、Steam クライアントが起動時に自動的に同期するため、この呼び出しは実質的に不要です。
- 後方互換性のために残されており、常に true を返します。

---

### `SteamAPI.getUserStatsResult()`

ユーザー統計取得の結果を取得します。

**戻り値**: int - 結果コード（`k_EResultOK` = 1 が成功）

**説明**: `requestUserStats()` の結果を確認します。SDK v1.61 以降では常に `k_EResultOK` が返されます。

---

### `SteamAPI.setAchievement(name)`

実績を解除します。

**引数**:
- `name` (string): 実績の API 名（Steamworks App Admin で設定）

**戻り値**: bool - 成功時 true

**説明**: 実績を解除します。`storeStats()` を呼び出すまでサーバーに送信されません。

**例**:
```javascript
if(playerScore >= 10000) {
	SteamAPI.setAchievement("ACH_SCORE_10K");
	SteamAPI.storeStats();
}
```

---

### `SteamAPI.storeStats()`

統計データと実績データを Steam サーバーに送信します。

**戻り値**: bool - 成功時 true

**説明**: `setStat()` や `setAchievement()` で変更した内容を確定します。

---

## 統計（Stats）

### `SteamAPI.setStat(name, value)`

統計値を設定します。

**引数**:
- `name` (string): 統計の API 名
- `value` (int): 統計値

**戻り値**: bool - 成功時 true

**説明**: ゲーム内統計（スコア、プレイ時間、撃破数など）を記録します。`storeStats()` で送信してください。

**例**:
```javascript
SteamAPI.setStat("TOTAL_PLAYTIME", playtimeSeconds);
SteamAPI.setStat("ENEMIES_DEFEATED", enemyCount);
SteamAPI.storeStats();
```

---

## ゲーム内課金（Micro Transaction）

### `SteamAPI.getMicroTxnResult()`

ゲーム内課金の結果を取得します。

**戻り値**: 
- `null` - コールバック未受信
- `string` - トランザクション成功時のオーダー ID（64bit 整数の文字列）
- `false` - トランザクション失敗

**説明**: 
- Steam の課金コールバックを受信して結果を返します。
- 結果を取得すると内部状態がクリアされます（次回は null を返す）。

**例**:
```javascript
function checkPurchase() {
	local result = SteamAPI.getMicroTxnResult();
	if(result === null) {
		// まだ結果が来ていない
	} else if(result === false) {
		println("購入失敗");
	} else {
		println("購入成功！オーダーID: " + result);
		unlockPurchasedContent();
	}
}
```

---

## Steam Deck / Big Picture モード

### `SteamAPI.IsSteamRunningOnSteamDeck()`

Steam Deck で実行されているか判定します。

**戻り値**: bool - Steam Deck で実行中の場合 true

**説明**: Steam Deck 専用の UI レイアウトやコントロール調整に使用します。

**例**:
```javascript
if(SteamAPI.IsSteamRunningOnSteamDeck()) {
	useHandheldUI();
	enableTouchControls();
} else {
	useDesktopUI();
}
```

---

### `SteamAPI.IsSteamInBigPictureMode()`

Steam が Big Picture モードで実行されているか判定します。

**戻り値**: bool - Big Picture モード実行中の場合 true

**説明**: Big Picture モード時は UI を大きくしたり、コントローラー操作を優先したりします。

**例**:
```javascript
if(SteamAPI.IsSteamInBigPictureMode()) {
	increaseUIScale(1.5);
	showControllerHints();
}
```

---

## ゲームパッドテキスト入力

### `SteamAPI.showGamepadTextInput(params)`

Steam のゲームパッド向けテキスト入力ダイアログを表示します。

**引数**:
- `params` (object): 入力パラメータ
  - `text` (string): 初期テキスト
  - `desc` (string): 説明文
  - `maxlen` (int, オプション): 最大文字数（1～256、デフォルト: 32）
  - `type` (int, オプション): 入力タイプ
	- `1` = パスワード（`TEXTEDIT_PASSWORD`）
	- `6` = 複数行（`TEXTEDIT_MULTILINE`）
	- その他 = 通常の1行入力

**戻り値**: bool - ダイアログ表示成功時 true

**説明**: 
- フルスクリーン入力のみ対応（インライン入力は不可）。
- 入力中は他の操作を受け付けません。
- 結果は `getGamepadTextInputResult()` で取得します。

**例**:
```javascript
local inputParams = {
	text: "Player1",
	desc: "プレイヤー名を入力してください",
	maxlen: 16,
	type: 0
};

if(SteamAPI.showGamepadTextInput(inputParams)) {
	inputState = "waiting";
}
```

---

### `SteamAPI.getGamepadTextInputResult()`

ゲームパッドテキスト入力の結果を取得します。

**戻り値**:
- `null` - 入力中（未完了）
- `string` - 入力成功時のテキスト
- `0` (int) - 入力キャンセル

**説明**: 
- 入力完了またはキャンセルされると状態がクリアされます。
- `showGamepadTextInput()` を呼び出していない場合はエラーになります。

**例**:
```javascript
function checkTextInput() {
	local result = SteamAPI.getGamepadTextInputResult();
	if(result === null) {
		// 入力中
	} else if(result === 0) {
		println("入力キャンセル");
	} else {
		println("入力完了: " + result);
		playerName = result;
	}
}
```

---

## その他のユーティリティ

### `SteamAPI.GetAppID()`

現在のアプリケーションの Steam App ID を取得します。

**戻り値**: int - App ID

**説明**: `steam_appid.txt` に記載された App ID を返します。

**例**:
```javascript
local appid = SteamAPI.GetAppID();
println("App ID: " + appid);
```

---

## 使用例

### 基本的な初期化とメインループ

```javascript
// 初期化
if(SteamAPI.restartAppIfNecessary(YOUR_APP_ID)) {
	exit(0);
}

if(!SteamAPI.init()) {
	println("Steam初期化失敗");
	exit(1);
}

local userName = SteamAPI.getPersonaName();
println("ようこそ、" + userName + "さん！");

// メインループ
function update() {
	SteamAPI.runSteamCallbacks();

	// ゲームロジック
	// ...
}
```

---

### 実績解除の完全な例

```javascript
// 初期化時
SteamAPI.requestUserStats();

// ゲーム中
function onPlayerScore(score) {
	if(score >= 1000 && !achievement_1000_unlocked) {
		SteamAPI.setAchievement("ACH_SCORE_1000");
		SteamAPI.setStat("HIGH_SCORE", score);
		SteamAPI.storeStats();
		achievement_1000_unlocked = true;
	}
}

// 統計を確認
function update() {
	SteamAPI.runSteamCallbacks();

	local result = SteamAPI.getUserStatsResult();
	if(result == 1) {
		// 統計データが利用可能
	}
}
```

---

### Web API 認証チケットの取得と使用

```javascript
// チケット要求
local ticket = SteamAPI.getAuthTicketForWebApi("MyGameBackend");
local ticketHandle = ticket[0];
local hexToken = ticket[1];

// 結果を待つ
local authChecked = false;
function update() {
	SteamAPI.runSteamCallbacks();

	if(!authChecked) {
		local result = SteamAPI.getAuthTicketResult();
		if(result !== null) {
			authChecked = true;
			if(result == 1) { // k_EResultOK
				// サーバーに送信
				sendAuthTokenToServer(hexToken);
			} else {
				println("認証失敗: " + result);
			}
		}
	}
}

// セッション終了時
function cleanup() {
	SteamAPI.cancelSteamAuthSessionTicket(ticketHandle);
}
```

---

### ゲーム内課金のハンドリング

```javascript
// 課金開始（Steam側で処理）
// ユーザーがSteamオーバーレイで購入を完了すると
// コールバックが発火する

function update() {
	SteamAPI.runSteamCallbacks();

	local result = SteamAPI.getMicroTxnResult();
	if(result !== null) {
		if(result === false) {
			showMessage("購入に失敗しました");
		} else {
			local orderID = result;
			println("購入成功！オーダーID: " + orderID);
			unlockDLC();
		}
	}
}
```

---

### 多言語対応

```javascript
function loadLocalization() {
	local lang = SteamAPI.getCurrentGameLanguage();

	local locFile = "loc_english.json";
	if(lang == "japanese") {
		locFile = "loc_japanese.json";
	} else if(lang == "schinese") {
		locFile = "loc_schinese.json";
	} else if(lang == "german") {
		locFile = "loc_german.json";
	}

	local data = FileRef(locFile).open().read();
	locStrings = JSON.parse(data.toString());
}
```

---

### Steam Deck 対応

```javascript
function setupPlatform() {
	local isSteamDeck = SteamAPI.IsSteamRunningOnSteamDeck();
	local isBigPicture = SteamAPI.IsSteamInBigPictureMode();

	if(isSteamDeck) {
		// Steam Deck用設定
		setResolution(1280, 800);
		setUIScale(1.2);
		enableTouchControls(true);
		setGraphicsPreset("medium");
	} else if(isBigPicture) {
		// Big Pictureモード設定
		setUIScale(1.5);
		showControllerUI(true);
	} else {
		// デスクトップ設定
		setUIScale(1.0);
		showKeyboardMouseUI(true);
	}
}
```

---

### 統計の定期保存

```javascript
local statsTimer = 0;
local totalPlaytime = 0;
local enemiesDefeated = 0;

function update(dt) {
	SteamAPI.runSteamCallbacks();

	totalPlaytime += dt;
	statsTimer += dt;

	// 5分ごとに統計を保存
	if(statsTimer >= 300) {
		SteamAPI.setStat("TOTAL_PLAYTIME", Math.floor(totalPlaytime));
		SteamAPI.setStat("ENEMIES_DEFEATED", enemiesDefeated);
		SteamAPI.storeStats();
		statsTimer = 0;
	}
}

function onEnemyDefeated() {
	enemiesDefeated++;
}
```
