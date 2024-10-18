import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Chat from './pages/chat';

function App() {
  return (
    <div className="bg-stone-900 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
