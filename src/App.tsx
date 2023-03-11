import "./App.css";
import { Route, Routes } from "react-router";
import { Home, Login, Register } from "./routes";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
