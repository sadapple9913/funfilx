import useOnClickOutside from 'api/Hooks/useOnClickOutside';
import React, { useRef, useState, useEffect } from 'react'
import "styles/MovieModal.css"
import axios from 'api/axios';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function MovieModal({setModalOpen, backdrop_path, release_date, overview, title, name, vote_average, first_air_date, id }) {
  const ref = useRef();
  const [videoId, setVideoId] = useState("");
  const [showIframe, setShowIframe] = useState(false);

  useOnClickOutside(ref , () =>{
    setModalOpen(false)
  });

  const handleImageClick = () => {
    setShowIframe(true);
  }

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/movie/${id}/videos`);
        const videoResults = response.data.results;
        if (videoResults.length > 0) {
          setVideoId(videoResults[0].key);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchVideo();
  }, [id]);


  return (
   <div className='presentation'>
      <div className='wrapper-modal'>
        <div className='modal' ref={ref}>
          <span className='modal-close' onClick={() => {
            setModalOpen(false);
            setShowIframe(false);
          }}>X
          </span>
          {showIframe ? (
            <Iframe
              src={`https://www.youtube.com/embed/${videoId}?controls=0&autoplay=1&loop=1&mute=1&playlist=${videoId}`}
              width='640'
              height='360'
              frameborder='0'
              allow='autoplay; FullScreen'
            />
          ) : (
            <div onClick={handleImageClick}>
            <img className='modal__poster-img' alt={title ? title : name} src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}/>
            <div className='play_icon'><FontAwesomeIcon icon="fa-solid fa-play"/></div>
            </div>
          )}
          <div className='modal__content'>
            <p className='modal__details'>
              <span className='modal__user_perc'>100% for you</span> {" "}
              {release_date ? release_date : first_air_date}
            </p>
            <h2 className='modal__title'>{title ? title : name}</h2>
            <p className='modal__details'> 평점 : {vote_average}</p>
            <p className='modal__overview'>{overview}</p>
            
            {/* 스틸컷 나오게  */}
          </div>
        </div>
      </div>
    </div>
  )
}

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

export default MovieModal;