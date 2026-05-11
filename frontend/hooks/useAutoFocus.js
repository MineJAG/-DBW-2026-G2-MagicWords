"use strict";

import { useEffect } from "react";

export function useAutoFocus(ref) {
  useEffect(() => {
    ref?.current?.focus();
  }, [ref]);
}
