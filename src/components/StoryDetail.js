import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Container, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';

const StoryDetail = () => {
  const { id } = useParams(); // Untuk mendapatkan parameter id dari URL
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/stories/${id}`);
        setStory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story details:', error);
        setLoading(false);
      }
    };

    fetchStoryDetail();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!story) {
    return <p>No story found.</p>;
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={story.cover_image} alt={story.title} />
            <Card.Body>
              <Card.Title>{story.title}</Card.Title>
              <Card.Text>
                <strong>Author:</strong> {story.author}
              </Card.Text>
              <Card.Text>
                <strong>Category:</strong> {story.category}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong> <Badge variant={story.status === 'Publish' ? 'success' : 'warning'}>{story.status}</Badge>
              </Card.Text>
              <Card.Text>
                <strong>Synopsis:</strong> {story.synopsis}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>
                <strong>Tags:</strong>{' '}
                {story.tags.map((tag) => (
                  <Badge key={tag.id} variant="primary" className="mr-1">
                    {tag.tag_name}
                  </Badge>
                ))}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          <h3>Chapters</h3>
          {story.chapters.length > 0 ? (
            <ListGroup>
              {story.chapters.map((chapter) => (
                <ListGroupItem key={chapter.id}>
                  <h5>{chapter.title}</h5>
                  <p>{chapter.content}</p>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p>No chapters available.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StoryDetail;
