import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    setShowFilterModal(false);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading stories...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error fetching stories: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Story List</h1>

      {/* Search & Filter Bar */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div className="input-group w-50">
          <input type="text" className="form-control shadow-sm" placeholder="Search stories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <div className="input-group-append">
            <button className="btn btn-primary mx-3" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        <div className="ml-3">
          <button className="btn btn-secondary shadow-sm mx-2" onClick={() => setShowFilterModal(true)}>
            Filter
          </button>
          <Link to="/add-story" className="btn btn-success shadow-sm">
            Add Story
          </Link>
        </div>
      </div>

      {/* Stories Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-hover">
          <thead className="bg-dark text-white">
            <tr>
              <th>Cover Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="align-middle">
                <td>
                  <img src={story.cover_image} alt={story.title} className="img-thumbnail" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                </td>
                <td>{story.title}</td>
                <td>{story.author}</td>
                <td>{story.category}</td>
                <td>
                  <span
                    className={`badge ${story.status === 'Publish' ? 'badge-success' : 'badge-warning'}`}
                    style={{
                      backgroundColor: story.status === 'Publish' ? '#28a745' : '#ffc107',
                      color: '#fff',
                    }}
                  >
                    {story.status}
                  </span>
                </td>
                <td>
                  {story.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="badge"
                      style={{
                        backgroundColor: '#17a2b8',
                        color: '#fff',
                        marginRight: '5px',
                      }}
                    >
                      {tag.tag_name}
                    </span>
                  ))}
                </td>
                <td>
                  <div className="d-flex justify-content-start">
                    <Link to={`/stories/${story.id}`} className="btn btn-info btn-sm mr-2">
                      View
                    </Link>
                    <Link to={`/stories/edit/${story.id}`} className="btn btn-warning btn-sm ms-2">
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Filter */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Stories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} className="shadow-sm">
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Sport">Sport</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)} className="shadow-sm">
                <option value="">Select Status</option>
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilterModal(false)} className="shadow-sm">
            Close
          </Button>
          <Button variant="primary" onClick={handleFilter} className="shadow-sm">
            Apply Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoryList;
