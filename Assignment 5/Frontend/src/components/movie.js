import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie } from "../actions/movieActions";
import MovieDetail from "../components/moviedetail"

function Movie() {
    // retrieves title parameter
    const { title } = useParams();
    const dispatch = useDispatch();
    // gather selected movie object from the 'stores' state
    const selectedMovie = useSelector(state => state.movie.selectedMovie);

    // if selected movie is null, dispatch to recollect movie details

    if (!selectedMovie) {
        dispatch(fetchMovie(title));
    }

    return <MovieDetail selectedMovie={selectedMovie} />;
}

export default Movie;