/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch)
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies).
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import "./assets/styles.css";
import { useEffect, useMemo, useState } from "react";

export default function Exercise02 () {
  const [movies, setMovies] = useState(null);
  const [genres, setGenres] = useState(null);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [sort, setSort] = useState('asc');
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(async () => {
    if(!genres) return;
    if(!movies && !loadingMovies) {
      setLoadingMovies(true);

      await fetch('http://localhost:3001/movies?_limit=50')
        .then(res => res.json())
        .then(json => {
          setMovies(json);
          console.log(json)
          setLoadingMovies(false);
        })
        .catch(() => {
          setLoadingMovies(false);
        })
    }
  }, [genres, movies, loadingMovies])

  useEffect(async ()=> {
    if(!genres && !loadingGenres){
      setLoadingGenres(true);

      await fetch('http://localhost:3001/genres')
        .then(res => res.json())
        .then(json => {
          setGenres(json);
          setLoadingGenres(false);
        })
        .catch(() => {
          setLoadingGenres(false);
        })
    }
  }, [genres]);


  const orderedMovies = useMemo(() => {
    if(!movies) return [];
    return movies.sort((a,b) => sort ==='asc' ? a.year - b.year : b.year - a.year);
  }, [sort, movies]);

  const filteredMovies = useMemo(() => {
    if(!movies) return [];
    if(selectedGenre === 'all') return orderedMovies;
    return orderedMovies.filter(movie => movie.genres.find(genre => genre === selectedGenre));
  }, [selectedGenre, orderedMovies, sort]);

  return (
    <>
      
      <div style={{ position: 'absolute', top: 0, width: '100%', height: '100vh', overflowY: 'hidden'}}>
        <img src={require('./assets/mountains.jpeg').default} alt='' style={{ width: '100%', height: 'auto' }}/>
        <div id='gradient' />
      </div>

      <section className="movie-library">
        <h1 className="movie-library__title">
          Movie Library
        </h1>

        <div className="movie-library__actions">
          { !genres ? (
            <>Loading...</>
          ): (
            <>
              <select name="genre" placeholder="Search by genre..." onChange={e => setSelectedGenre(e.target.value)}>
                <option value="all">All</option>
                { genres && genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
              </select>
              <button onClick={() => setSort(prevSort => prevSort === 'asc' ? 'desc' : 'asc')}>
                Year { sort === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </>
          )}
        </div>

      {loadingMovies ? (
        <div className="movie-library__loading">
          <p>Loading...</p>
        </div>
      ) : (
        <ul className="movie-library__list">
          {movies && filteredMovies.map(movie => (
            <li key={movie.id} className="movie-library__card">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src=require('./assets/mountains.jpeg').default;
                }}
              />
              <ul>
                <li>{movie.title}</li>
                <li>{movie.genres.join(', ')}</li>
                <li>{movie.year}</li>
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
    </>
  )
}