import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';

const StoryDetail = () => {
  const { id } = useParams();
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
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!story) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <p>No story found.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Img variant="top" src={story.cover_image} alt={story.title} />
            <Card.Body>
              <Card.Title className="text-primary">{story.title}</Card.Title>
              <Card.Text>
                <strong>Author:</strong> {story.author}
              </Card.Text>
              <Card.Text>
                <strong>Category:</strong> {story.category}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong>{' '}
                <Badge
                  style={{
                    backgroundColor: story.status === 'Publish' ? '#28a745' : '#ffc107',
                    color: '#fff',
                    padding: '5px 10px',
                    fontSize: '0.9em',
                  }}
                >
                  {story.status}
                </Badge>
              </Card.Text>
              <Card.Text>
                <strong>Synopsis:</strong> {story.synopsis}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>
                <strong>Tags:</strong>{' '}
                {story.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{
                      backgroundColor: '#17a2b8',
                      color: '#fff',
                      marginRight: '5px',
                      padding: '5px 10px',
                      fontSize: '0.85em',
                    }}
                  >
                    {tag.tag_name}
                  </Badge>
                ))}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          <h3 className="mb-4 text-primary">Chapters</h3>
          {story.chapters.length > 0 ? (
            <ListGroup>
              {story.chapters.map((chapter) => (
                <ListGroupItem key={chapter.id} className="mb-3">
                  <h5 className="text-dark">{chapter.title}</h5>
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
