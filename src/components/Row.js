import axios from 'api/axios';
import React, { useEffect, useState } from 'react'
import "styles/Row.css"
import MovieModal from './MovieModal';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Row({isLargeRow, title, id , fetchUrl}) {
  const [movies, setMovies] = useState([]);
  const [modalOpen , setModalOpen] = useState(false);
  const [moviesSelected , setMoviesSelected] = useState((""));

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

      {/* <div className='slider'>
          <div className='slider__arrow left'
          onClick={() => {document.getElementById(id).scrollLeft -= (window.innerWidth - 80);}}
          >
            <span className='arrow' >
              {"<"}
            </span>
          </div> */}


          <div id={id} className='row__posters'>
            {movies.map((movie) => (
              <SwiperSlide>
              <img  onClick={() => handleClick(movie)}
              key={movie.id}
              className={`row__poster ${isLargeRow && "row__posterLarge"}` }
              src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              loading='lazy'
              alt={movie.title || movie.name || movie.original_name}
              />
              </SwiperSlide>
            ))}
          </div>

          </Swiper>

          {/* <div className='slider__arrow right'
          onClick={() => {document.getElementById(id).scrollLeft += (window.innerWidth - 80);}}>
            <span className='arrow'>
              {">"}
            </span>
          </div> */}


      {modalOpen && (
        <MovieModal {...moviesSelected} setModalOpen={setModalOpen} />
      )}
      
    </section>
  )
}



export default Row