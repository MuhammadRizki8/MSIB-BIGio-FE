import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Tambahkan Link untuk routing

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = (url = 'http://localhost:8000/stories/') => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStories(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    if (searchQuery) {
      fetchStories(`http://localhost:8000/search/stories?query=${searchQuery}`);
    } else {
      fetchStories();
    }
  };

  const handleFilter = () => {
    let url = 'http://localhost:8000/search/stories?';
    if (category) url += `category=${category}&`;
    if (status) url += `status=${status}`;
    fetchStories(url);
    setShowFilterModal(false); // Close modal after applying filter
  };

  if (loading) {
    return <div className="text-center">Loading stories...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error fetching stories: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Story List</h1>

      {/* Search Bar */}
      <div className="mb-4 d-flex justify-content-between">
        <input type="text" className="form-control w-50" placeholder="Search stories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button className="btn btn-primary ml-2" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary ml-2" onClick={() => setShowFilterModal(true)}>
          Filter
        </button>
      </div>

      {/* Tabel */}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Synopsis</th>
            <th>Category</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Cover Image</th>
            <th>Actions</th> {/* Kolom untuk aksi */}
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr key={story.id}>
              <td>{story.title}</td>
              <td>{story.author}</td>
              <td>{story.synopsis}</td>
              <td>{story.category}</td>
              <td>{story.status}</td>
              <td>{story.tags.map((tag) => tag.tag_name).join(', ')}</td>
              <td>
                <img src={story.cover_image} alt={story.title} className="img-thumbnail" style={{ width: '100px' }} />
              </td>
              <td>
                {/* Tombol untuk melihat detail story */}
                <Link to={`/stories/${story.id}`} className="btn btn-info">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Filter */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Stories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Sport">Sport</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFilter}>
            Apply Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoryList;
