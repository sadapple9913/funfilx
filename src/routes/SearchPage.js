import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/SearchPage.css';
import useDebounce from 'api/Hooks/useDebounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from 'components/Nav';
import { useProfile } from "../components/ProfileContext";

function SearchPage({userObj}) {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate("");
  const [genres, setGenres] = useState([]);
  const { selectedProfile } = useProfile();
  
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }

  console.log("useLocation->",useLocation());
  let query = useQuery();
  const searchTerm = query.get('q');
  const debounceSearchTrem = useDebounce(searchTerm, 500);
  console.log('searchTerm->',searchTerm);


  useEffect(() => {
    async function fetchSearchResults() {
      if(searchTerm){
        fetchSearchMovie(searchTerm);
      }
    }
  
    async function fetchGenres() {
      try {
        const response = await axios.get('/genre/movie/list');
        setGenres(response.data.genres);
      } catch (error) {
        console.error(error);
      }
    }
  
    if (searchTerm) {
      fetchSearchResults();
    }
  
    fetchGenres();
  }, [searchTerm]);
  
  const fetchSearchMovie = async (searchTerm) =>{
    try{
      const request = await axios.get(`/search/movie?include_adult=false&query=${debounceSearchTrem}`);
      console.log("request->",request);
      setSearchResults(request.data.results);

    }catch(error){
      console.log("error", error)
    }
  }

  const handleMouseOver = (event, movie) => {
    console.log(movie ,movie.title, movie.vote_average,movie.popularity);
  };

  const renderSearchResults = () => {
    return (
      <div>
        <Nav selectedProfile={selectedProfile} />
        {searchResults.length > 0 ? (
          <section className="search-container">
            {genres && searchResults.map((movie) => {
            if (movie.backdrop_path !== null && movie.media_type !== 'person') {
              const movieImageUrl = 'https://image.tmdb.org/t/p/w500' + movie.backdrop_path;

              const movieWithVoteAndTitle = { ...movie, title: movie.title, vote_average: movie.vote_average , movie:movie.popularity};
              const movieGenres = genres.filter((genre) => movie.genre_ids.includes(genre.id)).map((genre) => genre.name).join(', ');

              return (
                <div className="movie" key={movie.id}>
                  <div className="movie__column-poster" onClick={() => navigate(`/${movie.id}`)}>
                    <div
                      className="movie__poster-wrapper"
                      onMouseOver={(event) => handleMouseOver(event, movieWithVoteAndTitle)}
                    >
                      <img src={movieImageUrl} alt={movie.title} className="movie__poster" />
                      <div className="movie__tooltip">
                        <p className="tooltip__title">{movie.title || movie.name || movie.original_name}</p>
                        <p className="tooltip__genres">{movieGenres}</p>
                        <p className="tooltip__vote"><span>평점 </span>: {movie.vote_average}</p>
                        <p className='tooltip__popularity'>
                          <span><FontAwesomeIcon icon="fa-solid fa-heart" />
                          </span> 
                          {movie.popularity}</p>
                      </div>
                    </div>
                  </div>
                </div>
                );
              }
            })}
            <Link to="/Main">
              <button className="page_back">
                <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
              </button>
            </Link>
          </section>
        ) : (
          <section className="no-results">
            <div className="no-results__text">
              <p>찾고자하는 검색어 "{searchTerm}"에 맞는 영화가 없습니다.</p>
            </div>
          </section>
        )}
      </div>
    );
  };
  
  return renderSearchResults();
}

export default SearchPage;