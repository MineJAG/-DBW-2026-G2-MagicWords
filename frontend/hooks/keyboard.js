import { useState, useEffect } from "react";

const Mapping = { //TODO: i think i can make this better in the future
  1: ["Digit1"],
  2: ["Digit2"],
  3: ["Digit3"],
  4: ["Digit4"],
  5: ["Digit5"],
  6: ["Digit6"],
  7: ["Digit7"],
  8: ["Digit8"],
  9: ["Digit9"],
  0: ["Digit0"],
  Backspace: ["Backspace"],
  Tab: ["Tab"],
  Q: ["KeyQ"],
  W: ["KeyW"],
  E: ["KeyE"],
  R: ["KeyR"],
  T: ["KeyT"],
  Y: ["KeyY"],
  U: ["KeyU"],
  I: ["KeyI"],
  O: ["KeyO"],
  P: ["KeyP"],
  CapsLock: ["CapsLock"],
  A: ["KeyA"],
  S: ["KeyS"],
  D: ["KeyD"],
  F: ["KeyF"],
  G: ["KeyG"],
  H: ["KeyH"],
  J: ["KeyJ"],
  K: ["KeyK"],
  L: ["KeyL"],
  Shift: ["ShiftLeft", "ShiftRight"],
  Z: ["KeyZ"],
  X: ["KeyX"],
  C: ["KeyC"],
  V: ["KeyV"],
  B: ["KeyB"],
  N: ["KeyN"],
  M: ["KeyM"],
  Control: ["ControlLeft", "ControlRight"],
  Alt: ["AltLeft", "AltRight"],
  Spacebar: ["Space"],
};

export function useKeyboard() {
  const [active, setActive] = useState(() => new Set());

  useEffect(() => {
    function KeyDown(e) {
      setActive((prev) => {
        if (prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    }

    function KeyUp(e) {
      setActive((prev) => {
        if (!prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    }

    window.addEventListener("keydown", KeyDown);
    window.addEventListener("keyup", KeyUp);

    return () => {
      window.removeEventListener("keydown", KeyDown);
      window.removeEventListener("keyup", KeyUp);
    };
  }, []);

  function isActive(label) {
    return (Mapping[label] ?? []).some((code) => active.has(code));
  }

  return { isActive };
}
