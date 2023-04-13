import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../api/axios';
import '../styles/SearchPage.css'
import useDebounce from 'api/Hooks/useDebounce';
function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate("");

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }

  console.log("useLocation->",useLocation());
  let query = useQuery();
  const searchTerm = query.get('q');
  const debounceSearchTrem = useDebounce(searchTerm, 500);
  console.log('searchTerm->',searchTerm);

  useEffect(() => {
    if(searchTerm){
      fetchSearchMovie(searchTerm);
    }
  },[searchTerm]);

  const fetchSearchMovie = async (searchTerm) =>{
    try{
      const request = await axios.get(`/search/movie?include_adult=false&query=${debounceSearchTrem}`);
      console.log("request->",request);
      setSearchResults(request.data.results);

    }catch(error){
      console.log("error", error)
    }
  }

  const renderSearchResults = () =>{
    return searchResults.length > 0 ? (
      <section className='search-container'>
        
        {searchResults.map(movie =>{
          if(movie.backdrop_path !== null && movie.media_type !== "person"){
            const movieImageUrl = "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;

            return (
              <div className='movie'>
                <div className='movie__column-poster' onClick={() => navigate(`/${movie.id}`)}>
                  <img src={movieImageUrl} alt={movie.title} className='movie__poster' />
                  {/*  영화정보가 나오게  */}
                </div>
              </div>
              )
          }
        })}
      </section>
    ) : (
        <section className='no-results'>
          <div className='no-results__text'>
            <p>
              찾고자하는 검색어 "{searchTerm}"에 맞는 영화가 없습니다.
            </p>
          </div>
        </section>
    );

  }
  return renderSearchResults();
}

export default SearchPage