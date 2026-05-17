"use strict";

import { useEffect } from "react";

/**
 * Focus the element behind `ref` once after mount. No-ops if the ref is null
 * or its `.current` is not yet attached.
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {void}
 */
export function useAutoFocus(ref) {
  useEffect(() => {
    ref?.current?.focus();
  }, [ref]);
}
