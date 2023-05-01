import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import axios from '../api/axios'
import styled from 'styled-components'
import "../styles/DetailPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


function DetailPage() {
  const [movie, setMovie] = useState({});
  const { movieId } = useParams(); //Param 값을가져오는 hook함수
  console.log("movieId->",movieId)
  const [isClicked , setIsClicked] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await axios.get(`movie/${movieId}`,{params : {append_to_response:"videos"}
      });
        setMovie({
          ...request.data,
          genres: request.data.genres.map((genre) => genre.name).join(' | '),
        });
        console.log(request);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [movieId]);


    function goBack() {
      navigate(-1); // 이전 페이지로 돌아가는 기능
    }
  

  if(!movie) return <div>...loading</div>;
  
  if(!isClicked){
  return (
    <>
    <section className='Detail__movie__wrap'>
      <div className='movie__info'>
      <img className='movie__poster__img'
       src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} alt={movie.title || movie.name || movie.original_name} />
      <h1 className='movie__title'>{movie.title}</h1>
      <p className='movie__overview'>{movie.overview}</p>
      <p className='movie__details'><span>평점 : </span>{movie.vote_average} 점</p>
      <span className='movie__user_perc'>{movie.release_date ? movie.release_date : movie.first_air_date}
      <span>100% for you</span>
      </span>
      <p className='movie__genres'>{movie.genres}</p>
      </div>
    </section>

      <section className='movie__preview__wrap'>
      <img className='movie__preview__img'
       src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} alt={movie.title || movie.name || movie.original_name} />
      <div className='banner__buttons'>
      <button className='movie__play__button' onClick={() => setIsClicked(true)} >
      <FontAwesomeIcon icon="fa-solid fa-play" />
      </button>
      </div>
      </section>
      <button className='page_back' onClick={goBack}>
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
      </button>
    </>
    )
  }else{
  return(
    <Container>
    <HomeContainer>
    <Iframe
      src={
         movie.videos.results[0] &&
        `https://www.youtube.com/embed/${movie.videos.results[0].key}?controls=0&autoplay=1&loop=1&mute=1&playlist=${movie.videos.results[0].key}`
      }
      width='640'
      height='360'
      frameborder='0'
      allow='autoplay; FullScreen'
    ></Iframe>
        <button className='banner__back' onClick={() => setIsClicked(false)}>
          X
        </button>
        </HomeContainer>
      </Container>

  );
}
}

const Container = styled.div`
display : flex;
flex-direction : colum;
justify-content: center;
align-items : center;
width: 100%;
height:100vh;
`
const HomeContainer = styled.div`
 width: 100%;
 height: 100%;
`
const Iframe = styled.iframe`
 width: 100%;
 height: 100%;
 z-index: -1;
 opacity: 0.65;
 border: none;
 &::after{
  content: "" ;
  position: absolute;
  top:0;
  left: 0;
  width:100%;
  height: 100%;
 }
`


export default DetailPage;