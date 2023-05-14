import axios from 'api/axios';
import React, {useEffect, useState} from 'react'
import MovieModal from './MovieModal';
import MovieMiniModal from './MovieMiniModal';
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "../styles/Row.css"

function Row({title, id, fetchUrl, disableClick}) {
    const [movies, setMovies] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMiniOpen, setModalMiniOpen] = useState(false);
    const [moviesSelected, setMoviesSelected] = useState((""));

    const fetchMovieData = async () => {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        console.log(request);
        setMovies(request.data.results);
    }

    useEffect(() => {
        fetchMovieData();
    }, [fetchUrl]);

    const handleClick = (movie) => {
        setModalOpen(true);
        setMoviesSelected(movie);
    }

    const handleMouseOver = (movie) => {
        setModalMiniOpen(true);
        setMoviesSelected(movie);
    }

    return (
        <section className='row' key={id}>
            <h2>{title}</h2>
            <Swiper
                wrapperClassName="swiper-wrapper"
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                navigation
                pagination={{
                    clickable: true
                }}
                loop={true}
                breakpoints={{
                    1378 : {
                        slidesPerView: 6, //한번에 몇개보일지
                        slidesPerGroup: 6, //몇개씩 슬라이드할지
                    },
                    998 : {
                        slidesPerView: 5,
                        slidesPerGroup: 5
                    },
                    625 : {
                        slidesPerView: 4,
                        slidesPerGroup: 4
                    },
                    0 : {
                        slidesPerView: 2,
                        slidesPerGroup: 2
                    }

                }}
                wrapperProps={{
                    style: {
                        overflow: 'visible'
                    }
                }}>

                <div id={id} className='row__posters'>
                    {
                        movies.map((movie) => (
                            <SwiperSlide key={movie.id}>
                                <div
                                    key={movie.id}
                                    className="row__posterWrapper"
                                    onMouseOver={() => handleMouseOver(movie)}
                                    onMouseLeave={() => setMoviesSelected("")}
                                    style={{
                                        position: "relative"
                                    }}>
                                    <img
                                        key={movie.id}
                                        className={`row__poster `}
                                        src={movie.backdrop_path
                                            ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                                            : `https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                        loading='lazy'
                                        alt={movie.title || movie.name || movie.original_name}/> {
                                        moviesSelected === movie && (
                                            <MovieMiniModal
                                                {...movie}
                                                setModalOpen={setModalMiniOpen}
                                                disableClick={disableClick}/>
                                        )
                                    }

                                </div>
                            </SwiperSlide>
                        ))
                    }
                </div>
            </Swiper>

            {modalOpen && (<MovieModal {...moviesSelected} setModalOpen={setModalOpen}/>)}
        </section>
    )
}

export default Row