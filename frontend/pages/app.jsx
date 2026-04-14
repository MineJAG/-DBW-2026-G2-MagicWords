import { Routes, Route, Navigate } from "react-router-dom";

import ContextProvider from "../context/contextProvider.jsx";

import Index from "./index.jsx";
import Signup from "./signup.jsx";
import Signin from "./signin.jsx";
import Profile from "./profile.jsx";

export default function App() {
  return (
    <ContextProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </ContextProvider>
  );
}
