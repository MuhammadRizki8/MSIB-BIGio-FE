import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Table, Badge, Card, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';
import Quill from 'react-quill'; // For rich text editor (chapter content)
import 'react-quill/dist/quill.snow.css';

const AddStory = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [coverImagePath, setCoverImagePath] = useState('');
  const [tags, setTags] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const navigate = useNavigate();

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      setTags([...tags, e.target.value]);
      e.target.value = ''; // Reset the input after adding tag
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Handle file upload (store locally in state)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setCoverImagePath(localImageUrl); // Store local URL of the image
    }
  };

  // Handle adding a new chapter
  const handleAddChapter = () => {
    const newChapter = {
      title: newChapterTitle,
      content: newChapterContent,
      updatedAt: new Date(),
    };
    setChapters([...chapters, newChapter]);
    setNewChapterTitle('');
    setNewChapterContent('');
    setShowChapterForm(false); // Hide form after saving chapter
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!status) {
      alert('Please select a status for the story.');
      return;
    }

    if (!coverImagePath) {
      alert('Please upload a cover image.');
      return;
    }

    const formattedTags = tags.map((tag) => ({
      tag_name: tag,
    }));

    const formattedChapters = chapters.map((chapter) => ({
      title: chapter.title,
      content: chapter.content,
    }));

    const storyData = {
      title,
      author,
      synopsis,
      category,
      status,
      cover_image: coverImagePath, // Send the local URL as a string
      tags: formattedTags,
      chapters: formattedChapters,
    };

    console.log('Request Body:', JSON.stringify(storyData, null, 2));

    fetch('http://127.0.0.1:8000/stories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storyData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Story added:', data);
        navigate('/'); // Redirect to story list
      })
      .catch((error) => {
        console.error('Error adding story:', error);
      });
  };

  return (
    <div className="container mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="text-center mb-4">Add New Story</h1>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter story title" required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Author</Form.Label>
                  <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author name" required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Sport">Sport</option>
                    <option value="Financial">Financial</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Culture">Culture</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Story Cover</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tags/Keywords</Form.Label>
                  <Form.Control type="text" placeholder="Add a tag and press Enter" onKeyDown={handleAddTag} />
                  <div className="mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} pill bg="secondary" className="mr-2" onClick={() => handleRemoveTag(index)}>
                        {tag} x
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Synopsis</Form.Label>
                  <Form.Control as="textarea" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="Enter synopsis" required />
                </Form.Group>
              </Col>
            </Row>

            {/* Chapter Section */}
            <h3 className="mt-5">Chapters</h3>

            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Chapter Title</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter, index) => (
                  <tr key={index}>
                    <td>{chapter.title}</td>
                    <td>{format(new Date(chapter.updatedAt), 'dd MMMM yyyy')}</td>
                    <td>
                      <Button variant="warning" className="mr-2">
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => setChapters(chapters.filter((_, i) => i !== index))}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Add New Chapter Form */}
            {showChapterForm && (
              <div className="mt-4">
                <Form.Group>
                  <Form.Label>Chapter Title</Form.Label>
                  <Form.Control type="text" value={newChapterTitle} onChange={(e) => setNewChapterTitle(e.target.value)} placeholder="Enter chapter title" required />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Chapter Content</Form.Label>
                  <Quill theme="snow" value={newChapterContent} onChange={setNewChapterContent} placeholder="Enter chapter content" />
                </Form.Group>

                <Button variant="success" className="mt-3" onClick={handleAddChapter}>
                  Save Chapter
                </Button>
              </div>
            )}

            {/* Add New Chapter Button */}
            {!showChapterForm && (
              <Button variant="primary" className="mt-3" onClick={() => setShowChapterForm(true)}>
                Add New Chapter
              </Button>
            )}

            {/* Action Buttons */}
            <div className="mt-4 text-right">
              <Button variant="secondary" onClick={() => setShowCancelModal(true)}>
                Cancel
              </Button>
              <Button variant="primary" className="mx-2 bg-success" type="submit">
                Save Story
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancel</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel? Unsaved changes will be lost.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={() => navigate('/')}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddStory;
