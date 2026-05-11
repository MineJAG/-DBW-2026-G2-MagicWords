"use strict";

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/gameContext.jsx";
import { useRoomActions } from "./useRoomActions.js";

const SINGLEPLAYER_DURATION = 600;

export function useHome() {
  const navigate = useNavigate();
  const { resetTimer, setTimeMax, startTimer } = useGame();
  const { joinRoom } = useRoomActions();
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

  const handleSingleplayerStart = useCallback(() => {
    setTimeMax(SINGLEPLAYER_DURATION);
    resetTimer();
    startTimer(SINGLEPLAYER_DURATION);
    navigate("/singleplayer");
  }, [setTimeMax, resetTimer, startTimer, navigate]);

  return {
    showCodeModal,
    openCodeModal,
    closeCodeModal,
    handleCodeSuccess,
    handleSingleplayerStart,
  };
}
