import React, { useState, useEffect } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import { Image, Form, Button } from 'react-bootstrap';
import {reviewSet} from "../actions/movieActions";
import { useDispatch } from 'react-redux'; // used with history
import { useHistory } from 'react-router-dom'; // used to redirect user on certain actions

function MovieDetail(props) {
    const { selectedMovie } = props;
    const user = localStorage.getItem('username');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!selectedMovie) {
            // If selectedMovie is null or undefined, redirect to movie list page
            // couldn't figure out why refreshing a movie page caused all objects to become null
            history.push('/movielist');
        }
    }, [selectedMovie, history]); // Run when selectedMovie or history changes

    const handleSubmit = () => {
        let reviewExists = false;
        selectedMovie.reviews.forEach((review) => {
            if (review.username === user) {
                reviewExists = true;
            }
        });

        if (reviewExists) {
            setErrorMsg('You have already submitted a review for this movie.');
            console.log(errorMsg)
            return;
        }

        dispatch(reviewSet(selectedMovie.title, user, review, rating));
        // clear input and error messages
        setReview('');
        setRating('');
        setErrorMsg('');
    };

    if (!selectedMovie) {
        // If selectedMovie is null or undefined, render a loading message
        return <div>Loading....</div>
    }

    // added text box, rating, and submission button for reviews as well as an error message
    // if the user has already reviewed a movie
    return (
        <Card>
            <Card.Header>Movie Detail</Card.Header>
            <Card.Body>
                <Image className="image" src={selectedMovie.imageUrl} thumbnail style={{ height: "400px" }} />
            </Card.Body>
            <ListGroup>
                <ListGroupItem>{selectedMovie.title}</ListGroupItem>
                <ListGroupItem>
                    {selectedMovie.actors && selectedMovie.actors.map((actor, i) =>
                        <p key={i}>
                            <b>{actor.actorName}</b> {actor.characterName}
                        </p>
                    )}
                </ListGroupItem>
                <ListGroupItem><h4><BsStarFill /> {selectedMovie.average_rating}</h4></ListGroupItem>
            </ListGroup>
            <Card.Body>
                <h5>Add a Review:</h5>
                {errorMsg && <p className="error">{errorMsg}</p>}
                <Form>
                    <Form.Group controlId="reviewTextArea">
                        <Form.Control as="textarea" rows={3} value={review} onChange={(e) => setReview(e.target.value)} placeholder="Enter review" />
                    </Form.Group>
                    <Form.Group controlId="ratingSelect">
                        <Form.Control as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="">Select Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={handleSubmit}>Submit Review</Button>
                </Form>
                <hr />
                {selectedMovie.reviews && selectedMovie.reviews.map((review, i) =>
                    <p key={i}>
                        <b>{review.username}</b>&nbsp; {review.review}
                        &nbsp; <BsStarFill /> {review.rating}
                    </p>
                )}
            </Card.Body>
        </Card>
    );
}

export default MovieDetail;
