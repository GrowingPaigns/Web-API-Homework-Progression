import actionTypes from '../constants/actionTypes';
//import runtimeEnv from '@mars/heroku-js-runtime-env'
const env = process.env;
/* ------ TO DO ---------
 * create a new action to submit a review on the movie details page
 */
function moviesFetched(movies) {
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movies
    }
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    }
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    }
}

export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    }
}

export function fetchMovie(title) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies/:${title}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(movieFetched(res));
        }).catch((e) => console.log(e));
    }
}

export function fetchMovies() {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(moviesFetched(res));
        }).catch((e) => console.log(e));
    }
}

export function reviewSet(title, username, review, rating) {

    return dispatch => {
        const payload = {
            movieId: null,
            username: username,
            review: review,
            rating: rating
        };

        return fetch(`${env.REACT_APP_API_URL}/movies/${title}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                return Promise.reject(new Error(response.statusText));
            }
            return response.json()
        }).then((movies) => {
            if (movies.length > 0) {
                payload.movieId = movies[0]._id;
            }

            return fetch(`${env.REACT_APP_API_URL}/reviews/${title}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(payload),
                mode: 'cors'
            })
        }).then((response) => {
            if (!response.ok) {
                return Promise.reject(new Error(response.statusText));
            }
            return response.json()
        }).then((res) => {
            dispatch(fetchMovie(title));
            dispatch(movieSet(res));
        }).catch((e) => {
            console.log("ERROR CAUGHT");
            console.log(e);
            throw e;
        });
    }
}