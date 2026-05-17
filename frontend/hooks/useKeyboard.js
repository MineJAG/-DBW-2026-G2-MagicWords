"use strict";

import { useState, useEffect } from "react";

/**
 * Map from the labels rendered on the on-screen keyboard to the `KeyboardEvent.code`
 * values they should highlight on. Some labels (Shift, Control, Alt) map to a
 * pair so either physical side lights up.
 *
 * @type {Record<string, string[]>}
 */
const KEY_CODE_MAP = {
  1: ["Digit1"], 2: ["Digit2"], 3: ["Digit3"], 4: ["Digit4"], 5: ["Digit5"],
  6: ["Digit6"], 7: ["Digit7"], 8: ["Digit8"], 9: ["Digit9"], 0: ["Digit0"],
  Backspace: ["Backspace"],
  Tab: ["Tab"],
  Q: ["KeyQ"], W: ["KeyW"], E: ["KeyE"], R: ["KeyR"], T: ["KeyT"],
  Y: ["KeyY"], U: ["KeyU"], I: ["KeyI"], O: ["KeyO"], P: ["KeyP"],
  CapsLock: ["CapsLock"],
  A: ["KeyA"], S: ["KeyS"], D: ["KeyD"], F: ["KeyF"], G: ["KeyG"],
  H: ["KeyH"], J: ["KeyJ"], K: ["KeyK"], L: ["KeyL"],
  Shift: ["ShiftLeft", "ShiftRight"],
  Z: ["KeyZ"], X: ["KeyX"], C: ["KeyC"], V: ["KeyV"], B: ["KeyB"],
  N: ["KeyN"], M: ["KeyM"],
  Control: ["ControlLeft", "ControlRight"],
  Alt: ["AltLeft", "AltRight"],
  Spacebar: ["Space"],
};

/**
 * Track which physical keys are currently held down, so the on-screen
 * keyboard component can light up matching keys. Active keys are kept in a
 * `Set` of `KeyboardEvent.code` strings.
 *
 * @returns {{ isActive: (label: string) => boolean }} - `isActive(label)`
 *   returns true if any code mapped to `label` is currently held.
 */
export function useKeyboard() {
  const [active, setActive] = useState(() => new Set());

  useEffect(() => {
    function onKeyDown(e) {
      setActive((prev) => {
        if (prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    }

    function onKeyUp(e) {
      setActive((prev) => {
        if (!prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function isActive(label) {
    return (KEY_CODE_MAP[label] ?? []).some((code) => active.has(code));
  }

  return { isActive };
}
