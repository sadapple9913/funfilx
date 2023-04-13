import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios'
import styled from 'styled-components'
import "../styles/DetailPage.css"


function DetailPage() {
  const [movie, setMovie] = useState({});
  const { movieId } = useParams(); //Param 값을가져오는 hook함수
  console.log("movieId->",movieId)
  const [isClicked , setIsClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await axios.get(`movie/${movieId}`,{params : {append_to_response:"videos"}
      });
        setMovie(request.data);
        console.log(request);

      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [movieId]);

  if(!movie) return <div>...loading</div>;
  if(!isClicked){
  return (

    <section className='Detail__movie__wrap'>
      <img className='movie__posterr-img'
       src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title || movie.name || movie.original_name} />
      <h1 className='movie__title'>{movie.title}</h1>
      <p className='movie__overview'>{movie.overview}</p>
      <div className='banner__buttons'>
           <button className='banner__button play' onClick={() => setIsClicked(true)} >
             play
           </button>
          </div>
    </section>
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