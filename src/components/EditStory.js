import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Modal, Table, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import Quill from 'react-quill'; // For rich text editor (chapter content)
import 'react-quill/dist/quill.snow.css';

const EditStory = () => {
  const { id } = useParams(); // Get the story ID from the URL
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [coverImagePath, setCoverImagePath] = useState('');
  const [tags, setTags] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing story data by ID and populate the form
    fetch(`http://127.0.0.1:8000/stories/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTitle(data.title);
        setAuthor(data.author);
        setSynopsis(data.synopsis);
        setCategory(data.category);
        setStatus(data.status);
        setCoverImagePath(data.cover_image);
        setTags(data.tags.map((tag) => tag.tag_name));
        setChapters(data.chapters);
      })
      .catch((error) => {
        console.error('Error fetching story:', error);
      });
  }, [id]);

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

  // Handle submitting the edited story form
  const handleSubmit = (e) => {
    e.preventDefault();

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

    fetch(`http://127.0.0.1:8000/stories/${id}`, {
      method: 'PUT',
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
        console.log('Story updated:', data);
        navigate('/'); // Redirect to story list
      })
      .catch((error) => {
        console.error('Error updating story:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Edit Story</h1>

      <Form onSubmit={handleSubmit}>
        {/* General Story Fields */}
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter story title" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author name" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Synopsis</Form.Label>
          <Form.Control as="textarea" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="Enter synopsis" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Sport">Sport</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Publish">Publish</option>
            <option value="Draft">Draft</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Story Cover</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
          {coverImagePath && (
            <div className="mt-2">
              <img src={coverImagePath} alt="Cover" style={{ width: '100px' }} />
            </div>
          )}
        </Form.Group>

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

        <div className="mt-4">
          <Button variant="primary" type="submit">
            Update Story
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditStory;
