import useOnClickOutside from 'api/Hooks/useOnClickOutside';
import React, { useRef, useState, useEffect } from 'react'
import "styles/MovieMiniModal.css"
import axios from 'api/axios';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MovieModal from './MovieModal';
import { useNavigate } from 'react-router-dom';

function MovieMiniModal({setMiniModalOpen, backdrop_path, release_date, overview, title, name, vote_average, first_air_date, id,disableClick}) {
  const ref = useRef();
  const [videoId, setVideoId] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const [genres, setGenres] = useState([]);
  const [modalOpen , setModalOpen] = useState(false);
  const [popularity, setPopularity] = useState(null);
  const navigate = useNavigate("");

  useOnClickOutside(ref , () =>{
    setMiniModalOpen(false)
  });

  const handleClick = () => {
    if (!disableClick && id) {
      navigate(`/${id}`);
    } else {
      console.log("Navigation disabled or no movie data available.");
    }
  };

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

      try {
        const response = await axios.get(`/movie/${id}`);
        console.log(response.data); // Check response
        if (response.data) {
          if (response.data.genres) {
            setGenres(response.data.genres);
          } else {
            setGenres([]);
          }
          if (response.data.popularity) {
            setPopularity(response.data.popularity);
          } else {
            setPopularity(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchVideo();
  }, [id]);


  return (
   <div className='presentation' >
      <div className='wrapper-modal Mini'>
        <div className='modal Mini'>
            <div>
            <img className='modal__poster-img' alt={title ? title : name} src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}/>
            <div className='play_icon Mini' onClick={handleClick} >
            <FontAwesomeIcon icon="fa-solid fa-plus" />
            </div>
            </div>
          <div className='modal__content Mini'>
            <p className='MiniModal__details'>
              <span className='modal__user_perc Mini'>100% for you</span>
              <span>{release_date ? release_date : first_air_date}</span>
            </p>
            <p className="modal__genres Mini">
              {genres.map((genre, index) => (
                <span key={genre.id}>
                  {genre.name}
                  {index < genres.length - 1 ? " | " : ""}
                </span>
              ))}
            </p>
            <h2 className='modal__title Mini'>{title ? title : name}</h2>
            <p className='modal__detail Mini'> 평점 : {vote_average}</p>
            <p  className='tooltip__popularity'>
            <span>
              <FontAwesomeIcon icon="fa-solid fa-heart" />
            </span> 
              {popularity}
              </p>
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

export default MovieMiniModal;