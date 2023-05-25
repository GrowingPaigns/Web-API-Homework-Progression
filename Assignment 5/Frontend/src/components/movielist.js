import React, { Component } from 'react';
import { fetchMovies } from "../actions/movieActions";
import { setMovie } from "../actions/movieActions";
import { connect } from 'react-redux';
import { Image, Nav } from 'react-bootstrap';
import { Carousel } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';

class MovieList extends Component {
    constructor(props) {
        super(props);
        // handle select bound to an object (movielist)
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchMovies());
    }

    // select event for the carousel images
    handleSelect(selectedIndex, e) {
        const { dispatch } = this.props;
        dispatch(setMovie(this.props.movies[selectedIndex]));
    }
    // onClick event for the carousel
    handleClick = (movie) => {
        const { dispatch } = this.props;
        dispatch(setMovie(movie));
    }

    render() {

        const { loggedIn, movies } = this.props;

        const MovieListCarousel = ({ movieList }) => {
            if (!movieList) { // if list is null, display loading
                return <div>Loading....</div>;
            }

            // sort movies in descending order by average rating
            movieList.sort((a, b) => b.average_rating - a.average_rating);

            return (
                <Carousel onSelect={this.handleSelect}>
                    {movieList.map((movie) => (
                        // displays movie image and title (caption)
                        <Carousel.Item key={movie.title}>
                            <div>
                                <LinkContainer to={'/movie/' + movie.title} onClick={() => this.handleClick(movie)}>
                                    <Nav.Link>
                                        <Image className="image" src={movie.imageUrl} thumbnail style={{ height: "400px" }} />
                                    </Nav.Link>
                                </LinkContainer>
                            </div>

                            <Carousel.Caption>
                                <h3>{movie.title}</h3>
                                <BsStarFill glyph={'star'} /> {movie.average_rating} &nbsp;&nbsp; {movie.releaseDate}
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}

                </Carousel>
            );
        };

        return (
            <div>
                {/* Only render MovieListCarousel if user is logged in - prevents bars from being
                 shown on the homescreen with no movies present (because those also require auth) */}
                {loggedIn ? <MovieListCarousel movieList={movies} /> : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        movies: state.movie.movies,
        loggedIn: state.auth.loggedIn,
    };
};

export default connect(mapStateToProps)(MovieList);