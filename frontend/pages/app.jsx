import { Routes, Route, Navigate } from "react-router-dom";

import ContextProvider from "../context/contextProvider.jsx";

import Index from "./index.jsx";
import Signup from "./signup.jsx";
import Signin from "./signin.jsx";
import WaitingRoom from "./waitingroom.jsx";
import Multiplayer from "./multiplayer.jsx";
import Singleplayer from "./singpleplayer.jsx";
import Profile from "./profile.jsx";
import LeaderboardMultiplayer from "./leaderboardMultiplayer.jsx";
import LeaderboardSingleplayer from "./leaderboardSingleplayer.jsx";

export default function App() {
  return (

    <ContextProvider>
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Index />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/waitingroom" element={<WaitingRoom />} />
      <Route path="/multiplayer" element={<Multiplayer />} />
      <Route path="/singleplayer" element={<Singleplayer />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/leaderboard-multiplayer" element={<LeaderboardMultiplayer />} />
      <Route path="/leaderboard-singleplayer" element={<LeaderboardSingleplayer />} />
    </Routes>
    </ContextProvider>
  );
}
