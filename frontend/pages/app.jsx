import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./index.jsx";
import Signup from "./signup.jsx";
import Signin from "./signin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Index />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}
