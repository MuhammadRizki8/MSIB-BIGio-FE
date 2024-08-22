import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail'; // Tambahkan komponen StoryDetail
import AddStory from './components/AddStory';
import EditStory from './components/EditStory';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoryList />} /> {/* Halaman daftar cerita */}
        <Route path="/stories/:id" element={<StoryDetail />} /> {/* Halaman detail cerita */}
        <Route path="/add-story" element={<AddStory />} /> {/* Halaman tambah cerita */}
        <Route path="/stories/edit/:id" element={<EditStory />} />
      </Routes>
    </Router>
  );
};

export default App;
