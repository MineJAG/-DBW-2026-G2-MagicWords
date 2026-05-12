"use strict";

import { useCallback, useState } from "react";
import { useRoomActions } from "./useRoomActions.js";

export function useHome() {
  const { joinRoom, startSingleplayer } = useRoomActions();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const openCodeModal = useCallback(() => setShowCodeModal(true), []);
  const closeCodeModal = useCallback(() => setShowCodeModal(false), []);

  const handleCodeSuccess = useCallback(
    (code) => {
      setShowCodeModal(false);
      joinRoom(code);
    },
    [joinRoom]
  );

  return {
    showCodeModal,
    openCodeModal,
    closeCodeModal,
    handleCodeSuccess,
    handleSingleplayerStart: startSingleplayer,
  };
}
