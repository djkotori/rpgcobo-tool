"""Random Dungeon Generator pre-startup regression checks.

This script is intentionally dependency-free so it can be run before opening
RPG-Cobo after plugin edits:

    python project/plugin/randomdungeon/check/test.py
"""

from __future__ import annotations

import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = PLUGIN_ROOT.parents[2]


@dataclass
class CheckResult:
    """A single check result."""

    name: str
    ok: bool
    detail: str = ""


def read_text(path: Path) -> str:
    """Read a UTF-8 text file with path context on failure.

    Args:
        path: File path to read.

    Returns:
        File contents.

    Raises:
        RuntimeError: If the file cannot be read.
    """
    try:
        return path.read_text(encoding="utf-8")
    except OSError as exc:
        raise RuntimeError(f"failed to read {path}: {exc}") from exc


def read_json(path: Path) -> object:
    """Read and parse a JSON file.

    Args:
        path: JSON path.

    Returns:
        Parsed JSON value.

    Raises:
        RuntimeError: If the file cannot be read or parsed.
    """
    try:
        return json.loads(read_text(path))
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"invalid JSON {path}: {exc}") from exc


def check(condition: bool, name: str, detail: str = "") -> CheckResult:
    """Build a check result."""
    return CheckResult(name=name, ok=condition, detail=detail)


def run_node_check() -> CheckResult:
    """Run the existing Node.js randomdungeon check script.

    Returns:
        Check result with stdout/stderr summary on failure.
    """
    script = PLUGIN_ROOT / "check" / "check-randomdungeon.mjs"
    if not script.exists():
        return check(False, "node check exists", str(script))

    try:
        proc = subprocess.run(
            ["node", str(script)],
            cwd=str(REPO_ROOT),
            text=True,
            encoding="utf-8",
            errors="replace",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return check(False, "node check runs", str(exc))

    if proc.returncode == 0:
        return check(True, "node check passes")
    detail = ((proc.stdout or "") + "\n" + (proc.stderr or "")).strip()[-1200:]
    return check(False, "node check passes", detail)


def plugin_json_checks() -> list[CheckResult]:
    """Check plugin registry invariants."""
    plugin_json = read_json(REPO_ROOT / "project" / "plugin" / "plugin.json")
    if not isinstance(plugin_json, dict):
        return [check(False, "plugin.json is object")]

    randomdungeon = plugin_json.get("randomdungeon")
    return [
        check(isinstance(randomdungeon, dict), "randomdungeon registry exists"),
        check(
            isinstance(randomdungeon, dict) and randomdungeon.get("enable") is True,
            "randomdungeon is enabled",
        ),
        check(
            isinstance(randomdungeon, dict) and randomdungeon.get("lock") is False,
            "randomdungeon remains unlockable",
        ),
    ]


def startup_regression_checks() -> list[CheckResult]:
    """Check guards for the startup failure class observed in Phase 1."""
    plugin_sk = read_text(PLUGIN_ROOT / "plugin.sk")
    loader_sk = read_text(PLUGIN_ROOT / "src" / "dungeon-loader.sk")
    core_sk = read_text(PLUGIN_ROOT / "src" / "randomdungeon.sk")
    dialog_sk = read_text(PLUGIN_ROOT / "src" / "dungeon-dialog.sk")
    apply_sk = read_text(PLUGIN_ROOT / "src" / "dungeon-apply.sk")
    src_text = "\n".join(
        read_text(path)
        for path in sorted((PLUGIN_ROOT / "src").glob("*.sk"))
    )

    return [
        check(
            'module.hookAction( "editor_postload"' in plugin_sk,
            "randomdungeon uses simple editor_postload visibility probe",
            "Phase 1 reconnects functionality after PluginDialog/menu visibility is confirmed.",
        ),
        check(
            "randomdungeon_generate" in plugin_sk
            and "[RD]" in plugin_sk,
            "plugin.sk exposes visible RD menu",
        ),
        check(
            "_rdEnsureLoaded" not in plugin_sk
            and "dungeon-loader.sk" in plugin_sk
            and "RandomDungeonLoader.run" in plugin_sk,
            "plugin.sk delegates lazy loading to dungeon-loader",
            "PluginDialog compiles plugin.sk for listing; complex loading logic stays in src/dungeon-loader.sk.",
        ),
        check(
            "Dialogs.notice" in loader_sk,
            "plugin menu action has visible load-failure notice",
        ),
        check(
            "DungeonDialog.run();" in loader_sk
            and "ensureLoaded" in loader_sk,
            "dungeon-loader runs DungeonDialog after source load",
        ),
        check(
            'where = ["editor_map"]' not in plugin_sk,
            "plugin menu is globally visible during Phase 1 verification",
            "This mirrors aiscenario visibility until map-editor scoped menu timing is verified.",
        ),
        check(
            "import PropertyType" not in core_sk,
            "core namespace file has no UI import",
            "randomdungeon.sk must stay host-API-light; UI imports belong in dungeon-dialog.sk.",
        ),
        check(
            "// #region agent log" not in plugin_sk
            and "debug-477362" not in plugin_sk,
            "debug instrumentation removed from plugin.sk",
        ),
        check("cmd_itemop" not in src_text, "Phase 1 source does not use cmd_itemop"),
        check("G101" not in src_text, "Phase 1 source does not touch G101"),
        check("G102" not in src_text, "Phase 1 source does not touch G102"),
        check("G110" not in src_text, "Phase 1 source does not touch unlock GVARs"),
        check("cmd_showmsg" not in src_text, "Phase 1 generated events do not run message commands"),
        check('role <- "enemy"' not in src_text, "Phase 1 generated enemies are non-reactive markers"),
        check(".find(" not in src_text, "Phase 1 source avoids string.find"),
        check(".insert(" not in src_text, "Phase 1 source avoids array.insert"),
        check("super(" not in src_text, "Phase 1 source avoids super constructor pitfalls"),
        check("getroottable()" not in src_text, "Phase 1 source avoids getroottable namespace checks"),
        check(".tointeger(" not in src_text, "Phase 1 source uses int() instead of tointeger"),
        check(
            "formatConfirmMessage" in dialog_sk
            and "Seed:" not in dialog_sk
            and "マップに反映しますか？" in dialog_sk,
            "confirmation dialog stays compact and avoids button overlap",
        ),
        check(
            "guessThemeTiles" in dialog_sk
            and "topBlockAt" in dialog_sk
            and "floorTileId = tileGuess.floorTileId" in dialog_sk,
            "dialog initializes tile IDs from current map surface",
        ),
        check(
            "preserveTerrain" in dialog_sk
            and "既存地形を保護" in dialog_sk
            and "preserveTerrain = ret.preserveTerrain" in dialog_sk,
            "dialog exposes preserve terrain option",
        ),
        check(
            "shouldPreserveBlock" in apply_sk
            and "preserveTerrain" in apply_sk,
            "apply can preserve existing terrain blocks",
        ),
    ]


def sample_draft_checks() -> list[CheckResult]:
    """Check the Phase 1 sample draft stays structurally useful."""
    draft = read_json(PLUGIN_ROOT / "sample" / "draft-phase1-classic.json")
    if not isinstance(draft, dict):
        return [check(False, "phase1 sample draft is object")]

    rooms = draft.get("rooms", [])
    entities = draft.get("entities", [])
    return [
        check(draft.get("schema") == "rpgcobo.randomdungeon.draft", "phase1 draft schema"),
        check(isinstance(rooms, list) and len(rooms) >= 4, "phase1 draft has rooms"),
        check(
            any(isinstance(room, dict) and room.get("type") == "entrance" for room in rooms),
            "phase1 draft has entrance room",
        ),
        check(
            any(isinstance(room, dict) and room.get("type") in {"exit", "boss"} for room in rooms),
            "phase1 draft has exit or boss room",
        ),
        check(
            any(isinstance(entity, dict) and entity.get("type") == "enemy" for entity in entities),
            "phase1 draft has enemy entity",
        ),
        check(
            any(isinstance(entity, dict) and entity.get("type") == "chest" for entity in entities),
            "phase1 draft has chest entity",
        ),
    ]


def collect_results() -> list[CheckResult]:
    """Collect all pre-startup regression checks."""
    results: list[CheckResult] = []
    results.extend(plugin_json_checks())
    results.extend(startup_regression_checks())
    results.extend(sample_draft_checks())
    results.append(run_node_check())
    return results


def main() -> int:
    """Run checks and print a compact report."""
    try:
        results = collect_results()
    except RuntimeError as exc:
        print(f"FAIL setup: {exc}")
        return 1

    failures = [result for result in results if not result.ok]
    for result in results:
        status = "PASS" if result.ok else "FAIL"
        detail = result.detail.replace("\u2014", "-") if result.detail else ""
        suffix = f" - {detail}" if detail else ""
        print(f"{status} {result.name}{suffix}")

    print(f"\nRandom Dungeon pre-startup check: {len(results) - len(failures)} pass, {len(failures)} fail")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
