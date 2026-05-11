import { Routes, Route, Navigate } from "react-router-dom";

import ContextProvider from "../context/contextProvider.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import PublicOnlyRoute from "./publicOnlyRoutes.jsx";

import Index from "./index.jsx";
import Signup from "./signup.jsx";
import Signin from "./signin.jsx";
import WaitingRoom from "./waitingroom.jsx";
import Multiplayer from "./multiplayer.jsx";
import Singleplayer from "./singpleplayer.jsx";
import Profile from "./profile.jsx";
import LeaderboardMultiplayer from "./leaderboardMultiplayer.jsx";
import LeaderboardSingleplayer from "./leaderboardSingleplayer.jsx";
import NotFound from "./notFound.jsx";

export default function App() {
  return (
    <ContextProvider>
      <Routes>
        {/* public */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Index />} />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicOnlyRoute>
              <Signin />
            </PublicOnlyRoute>
          }
        />

        {/* protected — need to be logged in */}
        <Route
          path="/waitingroom"
          element={
            <ProtectedRoute>
              <WaitingRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/multiplayer"
          element={
            <ProtectedRoute>
              <Multiplayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/singleplayer"
          element={
            <ProtectedRoute>
              <Singleplayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard-multiplayer"
          element={
            <ProtectedRoute>
              <LeaderboardMultiplayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard-singleplayer"
          element={
            <ProtectedRoute>
              <LeaderboardSingleplayer />
            </ProtectedRoute>
          }
        />

        {/* catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ContextProvider>
  );
}
