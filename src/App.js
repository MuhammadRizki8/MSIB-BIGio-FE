import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail'; // Tambahkan komponen StoryDetail

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoryList />} /> {/* Halaman daftar cerita */}
        <Route path="/stories/:id" element={<StoryDetail />} /> {/* Halaman detail cerita */}
      </Routes>
    </Router>
  );
};

export default App;
