import { Routes, Route } from "react-router-dom";
import "../assets/App.css";
import Products from "./Products";
import Login from "./Login";
import Layout from "./Layout";
import NewProduct from "./NewProduct";
import Stock from "./Stock";
import Home from "./Home";
import Entry from "./Entry";
import StockMov from "./StockMov";

export default function App() {
  return (
    <Routes>
      {/* Rutas que usan el layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/newproduct" element={<NewProduct />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/stockmovements" element={<StockMov />} />
      </Route> 

      {/* Rutas sin layout */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
