"use strict";

import { useCallback, useState } from "react";
import { useRoomActions } from "./useRoomActions.js";

/**
 * State for the Home page: the join-by-code modal toggle, and pre-wired
 * callbacks for opening/closing it, joining once a code is submitted, and
 * starting a singleplayer game. Composes {@link useRoomActions} so the page
 * itself never touches the socket.
 *
 * @returns {{
 *   showCodeModal: boolean,
 *   openCodeModal: () => void,
 *   closeCodeModal: () => void,
 *   handleCodeSuccess: (code: string) => void,
 *   handleSingleplayerStart: () => void,
 * }}
 */
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
