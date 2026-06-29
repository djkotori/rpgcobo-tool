#!/usr/bin/env node
/**
 * AI Scenario Importer — offline regression checks.
 *
 * Squirrel / RPG-Cobo を起動せず、ファイル整合性・既知の退行パターン・
 * 履歴メタデータ等の純粋ロジックを検証する。
 *
 * Usage: node check-aiscenario.mjs
 * Exit: 0 = all pass, 1 = one or more failures
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = path.resolve(__dirname, "..");
const MAP_TOOL_EVENT = path.resolve(
  PLUGIN_ROOT,
  "../rpgtools/mapeditor/MapToolEvent.sk"
);

const failures = [];
const passes = [];

function pass(name, detail = "") {
  passes.push({ name, detail });
}

function fail(name, detail) {
  failures.push({ name, detail });
}

function read(relFromPlugin) {
  return fs.readFileSync(path.join(PLUGIN_ROOT, relFromPlugin), "utf8");
}

function readJson(relFromPlugin) {
  return JSON.parse(read(relFromPlugin));
}

function mustInclude(file, needle, label) {
  const text = read(file);
  if (!text.includes(needle)) {
    fail(label || `${file} must include: ${needle}`, file);
    return false;
  }
  pass(label || `${file} includes ${needle}`);
  return true;
}

function mustNotMatch(file, pattern, label) {
  const text = read(file);
  if (pattern.test(text)) {
    fail(label || `${file} must not match ${pattern}`, file);
    return false;
  }
  pass(label || `${file} ok (no ${pattern})`);
  return true;
}

function mustMatch(file, pattern, label) {
  const text = read(file);
  if (!pattern.test(text)) {
    fail(label || `${file} must match ${pattern}`, file);
    return false;
  }
  pass(label || `${file} matches ${pattern}`);
  return true;
}

// --- History metadata mirror (ScenarioImporter.sk と同期) ---

function truncateText(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

function summarizeCommand(c) {
  const typ = c.type || "";
  switch (typ) {
    case "message": {
      const t = c.text || "";
      return t.length ? truncateText(t, 40) : "(message)";
    }
    case "wait":
      return `wait ${c.time ?? 0}ms`;
    case "setvar":
      return `setvar ${c.var ?? "?"}`;
    case "choice": {
      const opts = c.options;
      if (Array.isArray(opts) && opts.length) return `choice: ${opts[0]}`;
      return "choice";
    }
    case "if":
      return "if";
    default:
      return typ.length ? typ : "(command)";
  }
}

function findFirstContentInCommands(commands) {
  if (!Array.isArray(commands) || !commands.length) return null;
  for (const c of commands) {
    if (!c || typeof c !== "object") continue;
    const typ = c.type;
    if (["message", "wait", "setvar", "choice", "if"].includes(typ)) {
      return summarizeCommand(c);
    }
  }
  for (const c of commands) {
    if (!c || typeof c !== "object") continue;
    if (c.type === "choice") {
      for (const br of c.branches || []) {
        const nested = findFirstContentInCommands(br);
        if (nested) return nested;
      }
    } else if (c.type === "if") {
      let nested = findFirstContentInCommands(c.then || []);
      if (nested) return nested;
      nested = findFirstContentInCommands(c.else || []);
      if (nested) return nested;
    }
  }
  return null;
}

function commandTreeHasBranch(commands) {
  if (!Array.isArray(commands) || !commands.length) return false;
  for (const c of commands) {
    if (!c || typeof c !== "object") continue;
    if (c.type === "choice" || c.type === "if") return true;
  }
  return false;
}

function extractDisplayName(scenario) {
  const events = scenario.events;
  if (!Array.isArray(events) || !events.length) return "(無名)";
  const name0 = events[0].name || "(無名)";
  if (events.length === 1) return name0;
  return `${name0} 他${events.length - 1}件`;
}

function extractFirstContent(scenario) {
  const events = scenario.events;
  if (!Array.isArray(events) || !events.length) return "(なし)";
  const ev = events[0];
  const role = ev.role || "villager";
  if (role === "villager") {
    const msg = ev.msg || "";
    if (!msg.length) return "(msg なし)";
    return truncateText(msg, 40);
  }
  const pages = ev.pages;
  if (!Array.isArray(pages) || !pages.length) return "(pages なし)";
  return findFirstContentInCommands(pages[0].commands || []) || "(command なし)";
}

function scenarioHasBranch(scenario) {
  const events = scenario.events;
  if (!Array.isArray(events) || !events.length) return false;
  for (const ev of events) {
    const role = ev.role || "villager";
    if (role === "villager") continue;
    const pages = ev.pages;
    if (!Array.isArray(pages)) continue;
    if (pages.length > 1) return true;
    for (const p of pages) {
      const conds = p.conditions;
      if (Array.isArray(conds) && conds.length) return true;
      if (commandTreeHasBranch(p.commands || [])) return true;
    }
  }
  return false;
}

function normalizeJsonRaw(raw) {
  if (raw == null) return "";
  let s = String(raw);
  if (s.length >= 1 && s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  return s;
}

function buildMessageUiclose(c) {
  return "uiclose" in c ? c.uiclose : 2;
}

function validateScenarioShape(scenario) {
  const errors = [];
  if (!scenario || typeof scenario !== "object" || Array.isArray(scenario)) {
    errors.push("root must be object");
    return errors;
  }
  if (!scenario.map) errors.push("map required");
  if (!Array.isArray(scenario.events)) errors.push("events must be array");
  else {
    scenario.events.forEach((ev, i) => {
      const role = ev?.role || "villager";
      if (role === "villager") {
        if (!Array.isArray(ev.pos) || ev.pos.length < 4) {
          errors.push(`events[${i}].pos invalid`);
        }
        if (typeof ev.msg !== "string") errors.push(`events[${i}].msg should be string`);
      } else if (role === "custom") {
        if (!Array.isArray(ev.pages) || !ev.pages.length) {
          errors.push(`events[${i}].pages required`);
        }
      } else {
        errors.push(`events[${i}] unsupported role`);
      }
    });
  }
  return errors;
}

// --- Check groups ---

function checkRequiredFiles() {
  const required = [
    "plugin.sk",
    "ScenarioImporter.sk",
    "ScenarioCommandBuilder.sk",
    "ImportDialog.sk",
    "ScenarioAI.sk",
    "README.md",
    "sample/villager.json",
    "sample/custom.json",
  ];
  for (const f of required) {
    const full = path.join(PLUGIN_ROOT, f);
    if (!fs.existsSync(full)) {
      fail(`missing file: ${f}`, full);
    } else {
      pass(`file exists: ${f}`);
    }
  }
}

function checkPluginBootstrap() {
  const text = read("plugin.sk");
  const order = [
    "ScenarioCommandBuilder.sk",
    "ScenarioImporter.sk",
    "ImportDialog.sk",
    "ScenarioAI.sk",
  ];
  let last = -1;
  for (const sk of order) {
    const idx = text.indexOf(sk);
    if (idx < 0) {
      fail(`plugin.sk must runsk ${sk}`, "plugin.sk");
      return;
    }
    if (idx <= last) {
      fail(`plugin.sk runsk order: ${sk}`, "plugin.sk");
      return;
    }
    last = idx;
  }
  pass("plugin.sk runsk order");

  mustInclude("plugin.sk", 'uid = "aiscenario_import_json"', "menu uid");
  mustInclude("plugin.sk", "ImportDialog.run()", "menu handler");
}

function checkImportDialogRegression() {
  // 起動不能の原因になった super(..., this)
  mustNotMatch(
    "ImportDialog.sk",
    /super\s*\([^)]*,\s*this\s*\)/,
    "ImportPastePopup: no super(..., this)"
  );

  mustInclude("ImportDialog.sk", "ImportPastePopup.runDialog", "paste popup pattern");
  mustInclude("ImportDialog.sk", "setupTabsAndHistory", "history tabs in paste dialog");
  mustInclude("ImportDialog.sk", "TAB_PASTE", "paste tab id");
  mustInclude("ImportDialog.sk", "TAB_HISTORY", "history tab id");
  mustInclude("ImportDialog.sk", "importCurrentTab", "tab-aware import");
  mustInclude("ImportDialog.sk", "refreshHistoryList", "history list refresh");
  mustInclude("ImportDialog.sk", "importHistoryEntry", "history re-import");

  // 独立メニュー「履歴」は廃止（貼り付けダイアログ内タブへ統合）
  const runBlock = read("ImportDialog.sk").match(/function run\(\)\{[\s\S]*?\n\t\},/);
  if (!runBlock) {
    fail("ImportDialog.run() block not found", "ImportDialog.sk");
  } else if (/id\s*=\s*"history"/.test(runBlock[0])) {
    fail('ImportDialog.run() must not have standalone id="history" menu', "ImportDialog.sk");
  } else {
    pass("ImportDialog.run() has no standalone history menu");
  }

  mustMatch("ImportDialog.sk", /width\s*=\s*1040/, "paste dialog width 1040");
  mustMatch("ImportDialog.sk", /multiline\s*=\s*35/, "paste dialog multiline 35");
  mustMatch("ImportDialog.sk", /POPUP_MIN_HEIGHT\s*=\s*676/, "paste dialog min height 676");

  mustInclude("ImportDialog.sk", "row.findChild( \"edit\")", "tuneJsonEditor uses row not row.ref");
}

function checkScenarioImporterRegression() {
  mustInclude("ScenarioImporter.sk", "syncImportedEventsToEditor", "editor gizmo sync");
  mustInclude("ScenarioImporter.sk", "placeEventGizmo", "gizmo placement");
  mustInclude("ScenarioImporter.sk", "HISTORY_MAX = 30", "history max 30");
  mustInclude("ScenarioImporter.sk", "tmp/aiscenario-history.json", "history path");
  mustInclude("ScenarioImporter.sk", "appendHistory", "append history");
  mustInclude("ScenarioImporter.sk", "formatHistoryLabel", "history label");
  mustInclude("ScenarioImporter.sk", 'raw.slice( 0, 1) == "\\uFEFF"', "UTF-16 BOM strip");
  mustInclude("ImportDialog.sk", "appendHistory", "import saves history");
}

function checkMapEditorDeleteGuard() {
  const file = MAP_TOOL_EVENT;
  if (!fs.existsSync(file)) {
    fail("MapToolEvent.sk not found (delete gizmo guard)", file);
    return;
  }
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("if( _gz){") || !text.includes("_gz.kill()")) {
    fail("MapToolEvent.deleteEvents must guard _gz.kill()", file);
  } else {
    pass("MapToolEvent.deleteEvents gizmo null guard");
  }
  if (!text.includes("placeEventGizmo( id, data0)")) {
    fail("MapToolEvent.deleteEvents undo recreates missing gizmo", file);
  } else {
    pass("MapToolEvent.deleteEvents undo gizmo recreate");
  }
}

function checkCommandBuilderUiclose() {
  const text = read("ScenarioCommandBuilder.sk");
  if (!text.includes('"uiclose" in c')) {
    fail("buildMessage must use 'uiclose' in c (not || fallback)", "ScenarioCommandBuilder.sk");
  } else {
    pass("buildMessage uiclose uses `in` check");
  }
  if (buildMessageUiclose({ uiclose: 0 }) !== 0) {
    fail("uiclose=0 must be preserved", "logic");
  } else {
    pass("uiclose=0 preserved");
  }
  if (buildMessageUiclose({}) !== 2) {
    fail("default uiclose must be 2", "logic");
  } else {
    pass("default uiclose=2");
  }
}

function checkSampleJson() {
  const villager = readJson("sample/villager.json");
  const custom = readJson("sample/custom.json");

  for (const [name, scenario] of [
    ["villager.json", villager],
    ["custom.json", custom],
  ]) {
    const errs = validateScenarioShape(scenario);
    if (errs.length) {
      fail(`${name} shape: ${errs.join("; ")}`, `sample/${name}`);
    } else {
      pass(`${name} shape valid`);
    }
  }

  if (extractDisplayName(villager) !== "村人テスト") {
    fail("villager displayName", "metadata");
  } else {
    pass("villager displayName");
  }

  if (!extractFirstContent(villager).includes("こんにちは")) {
    fail("villager firstContent", "metadata");
  } else {
    pass("villager firstContent");
  }

  if (scenarioHasBranch(villager) !== false) {
    fail("villager should not have branch", "metadata");
  } else {
    pass("villager hasBranch=false");
  }

  if (scenarioHasBranch(custom) !== true) {
    fail("custom should have branch (choice/if)", "metadata");
  } else {
    pass("custom hasBranch=true");
  }

  if (extractFirstContent(custom) !== "こんにちは、旅の人。") {
    fail(`custom firstContent got: ${extractFirstContent(custom)}`, "metadata");
  } else {
    pass("custom firstContent");
  }
}

function checkHistoryAppendLogic() {
  const entries = [];
  const HISTORY_MAX = 30;

  function append(raw, label) {
    const scenario = JSON.parse(normalizeJsonRaw(raw));
    const entry = {
      raw: normalizeJsonRaw(raw),
      sourceLabel: label,
      displayName: extractDisplayName(scenario),
      firstContent: extractFirstContent(scenario),
      hasBranch: scenarioHasBranch(scenario),
    };
    entries.unshift(entry);
    while (entries.length > HISTORY_MAX) entries.pop();
    return entry;
  }

  const v = read("sample/villager.json");
  const e1 = append(v, "paste");
  if (entries.length !== 1 || e1.displayName !== "村人テスト") {
    fail("history append single entry", "logic");
  } else {
    pass("history append single entry");
  }

  append(read("sample/custom.json"), "file");
  if (entries.length !== 2 || entries[0].hasBranch !== true) {
    fail("history prepend newest first", "logic");
  } else {
    pass("history prepend newest first");
  }

  for (let i = 0; i < 35; i++) append(v, `x${i}`);
  if (entries.length !== HISTORY_MAX) {
    fail(`history cap ${HISTORY_MAX}, got ${entries.length}`, "logic");
  } else {
    pass(`history capped at ${HISTORY_MAX}`);
  }
}

function checkBomStrip() {
  const bom = "\uFEFF" + '{"map":"M001","events":[]}';
  const stripped = normalizeJsonRaw(bom);
  if (stripped.startsWith("\uFEFF")) {
    fail("BOM not stripped", "logic");
  } else {
    pass("UTF-16 BOM strip");
  }
}

function checkScenarioMakerHtml() {
  const htmlPath = path.join(PLUGIN_ROOT, "scenario-maker/index.html");
  if (!fs.existsSync(htmlPath)) {
    fail("scenario-maker/index.html missing", htmlPath);
    return;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  if (!html.includes("APP_VERSION") || !html.includes("localStorage")) {
    fail("scenario-maker must have APP_VERSION and localStorage", htmlPath);
  } else {
    pass("scenario-maker basics");
  }
}

function main() {
  console.log("AI Scenario Importer — regression check");
  console.log(`Plugin: ${PLUGIN_ROOT}\n`);

  checkRequiredFiles();
  checkPluginBootstrap();
  checkImportDialogRegression();
  checkScenarioImporterRegression();
  checkMapEditorDeleteGuard();
  checkCommandBuilderUiclose();
  checkSampleJson();
  checkHistoryAppendLogic();
  checkBomStrip();
  checkScenarioMakerHtml();

  console.log(`\nPassed: ${passes.length}`);
  if (failures.length) {
    console.log(`Failed: ${failures.length}\n`);
    for (const f of failures) {
      console.log(`  FAIL  ${f.name}`);
      if (f.detail) console.log(`        ${f.detail}`);
    }
    console.log(
      "\nManual (RPG-Cobo): 編集→シナリオメーカー読み込み → 貼り付けタブ/履歴タブ → import → イベント右クリック/Delete"
    );
    process.exit(1);
  }

  console.log("All automated checks passed.");
  console.log(
    "Manual smoke (optional): paste import, file import, history tab re-import, delete imported event."
  );
  process.exit(0);
}

main();
