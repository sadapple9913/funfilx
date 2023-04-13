import React, { useEffect, useState } from 'react'
import axios from 'api/axios';
import requests from 'api/requests';
import styled from 'styled-components'
import 'styles/Banner.css'
import DetailPage from 'routes/DetailPage';

function Banner() {
  const [movie , setMoive] =useState([]);
const [isClicked , setIsClicked] = useState(false);
  useEffect(() =>{
    fetchData();
  },[])

  const fetchData = async() => {
    const request = await axios.get(requests.fetchNowPlaying); //axios라는 컴포넌트를 만들고 가져와서 데이터는 입력한걸 쓴다
    console.log(request);

    //200개 영화 중 영화 하나의 ID를 랜덤하게 가져오기
    const movieId = request.data.results[
      Math.floor(Math.random() * request.data.results.length + 0)
    ].id;
    console.log(movieId)

    //특정 영화의 더 상세한 정보를 가져오기(vidoes 비디오 정보도 포함)
    // https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
    const {
      data:
      movieDetail
    } = await axios.get(`/movie/${movieId}`,
    {params : {append_to_response:"videos"}
  });
    console.log("movieDetail",movieDetail);
    setMoive(movieDetail);
  }
  
  const truncate = (str , n) =>{
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  } /* ? 은 있어도 그만없어도 그만 이라는뜻 */
  if(!isClicked){
  return (
    <>
      <header className='banner'
      style={{backgroundImage:`url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")` , 
      backgroundPosition: "top center" ,
       backgroundSize: "cover"}}>
         <div className='banner__contents'>

         <h1 className='banner__title'>
           {movie.title || movie.name || movie.original_name}
             {/* || 연산자는 뱡행
             movie.original_name 으로 되어있음*/}
         </h1>
         <div className='banner__buttons'>
           <button className='banner__button play' onClick={() => setIsClicked(true)} >
             play
           </button>
           <button className='banner__button info' >
             {/* <div className='space'></div> */}More Information
           </button>
          </div>
         <p className='banner__description'>
           {truncate(movie.overview, 100)}
           </p>
         </div>
         <div className='banner__fadeBottom'></div>
         <FooterContainer />
     </header>

        </>

    )
  }else{
    return(
      <Container>
        <HomeContainer>
          <Iframe
          src={`https://www.youtube.com/embed/${movie.videos.results[0]?.key}?controls=0&autoplay=1&loop=1&mute=1&playlist=${movie.videos.results[0]?.key}`}
          width='640'          
          height='360'
          frameborder='0'
          allow='autoplay; FullScreen'
          
          ></Iframe>
{/*                     <iframe width="560" height="315" src="https://www.youtube.com/embed/qoXf5Zr3BhA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}

        </HomeContainer>
      </Container>
    )
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
const FooterContainer = styled.div`
display:flex; 
justify-content : center;
align-items: center;
padding:40px 0;
box-sizing: border-box;
width:100%;
position: relative;
z-index:100;

@media (max-width: 768px){
  padding: 20px 20px 30px;
}
`
export default Banner