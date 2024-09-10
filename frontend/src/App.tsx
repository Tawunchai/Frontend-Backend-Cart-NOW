// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Shop from './page/shop/Shop'; // นำเข้าค่าเริ่มต้น
import Cart from './page/cart/Cart'; // ตรวจสอบว่า Cart ใช้การส่งออกแบบเดียวกัน
import { ShopContextProvider } from './context/shop_context';

const App: React.FC = () => {
  return (
    <div className="App">
      <ShopContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </ShopContextProvider>
    </div>
  );
};

export default App;
