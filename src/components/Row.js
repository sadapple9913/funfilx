import axios from 'api/axios';
import React, { useEffect, useState } from 'react'
import MovieModal from './MovieModal';
import MiniMovieModal from '../components/MiniMovieModal';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "../styles/Row.css"
import { useParams } from 'react-router-dom';

function Row({isLargeRow, title, id , fetchUrl}) {
  const [movie, setMovie] = useState({});
  const [movies, setMovies] = useState([]);
  const [modalOpen , setModalOpen] = useState(false);
  const [miniModalOpen , setMiniModalOpen] = useState(false);
  const [moviesSelected , setMoviesSelected] = useState("");
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const { movieId } = useParams(); 


  const fetchMovieData = async() =>{
   const request = await axios.get(fetchUrl);
   setMovies(request.data.results);
   console.log(request);
   setMovies(request.data.results);
   
  }
  
  useEffect(() => {
    fetchMovieData();
  },[fetchUrl]);


  const handleClick = (movie) =>{
    console.log("movie->",movie)
    setModalOpen(true);
    setMoviesSelected(movie);
  }
  
  const handleMouseOver = (event, movie) => {
    setHoveredMovie(movie);
    
  };

  const handleMouseLeave = (event, movie) => {
    setHoveredMovie(null);
  };  
  


  return (
    
    <section className='row' key={id}>
      <h2>{title}</h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation  
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          1378:{
          slidesPerView : 6, //한번에 몇개보일지
          slidesPerGroup: 6, //몇개씩 슬라이드할지
        },998:{
          slidesPerView : 5,
          slidesPerGroup: 5,
        },625:{
          slidesPerView : 4, 
          slidesPerGroup: 4,
        }
        ,0:{
          slidesPerView : 3, 
          slidesPerGroup: 3,
        }
        
        }}
      >

          <div id={id} className='row__posters'>
            
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div
                className="row__poster-container"
                onMouseOver={(event) => handleMouseOver(event, movie)}
                onMouseLeave={(event) => handleMouseLeave(event, movie)}
              >
                <img
                  onClick={() => handleClick(movie)}
                  className={`row__poster ${isLargeRow && "row__posterLarge"}` }
                  src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                  loading='lazy'
                  alt={movie.title || movie.name || movie.original_name }
                />
                {hoveredMovie && hoveredMovie.id === movie.id && (
                  
                <div className="row__poster-info">
                  <img className={`row__poster ${isLargeRow && "row__posterLarge"}` }
                  src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                  loading='lazy'></img>
                <div className='row__tooltip'>
                  <h2>{hoveredMovie.title || hoveredMovie.name || hoveredMovie.original_name}</h2>
                  <p className='tooltip__genres'></p>
                  <p><span>평점</span>: {hoveredMovie.vote_average}</p>
                </div>
                </div>
              )}
              </div>
              </SwiperSlide>
            ))}
          </div>

          </Swiper>


      {modalOpen && (
        <MovieModal {...moviesSelected} setModalOpen={setModalOpen} />
      )}
      
    </section>
  )
}



export default Row