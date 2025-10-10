import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import '../assets/App.css';
import Home from "./Home";
import Login from "./Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/table.html" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

