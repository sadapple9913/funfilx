import React from 'react'
import Nav from 'components/Nav'
import "styles/App.css"
import Footer from 'components/Footer'
import { Outlet, Route, Routes } from 'react-router-dom'
import MainPage from 'routes/MainPage'
import DetailPage from 'routes/DetailPage'
import SearchPage from 'routes/SearchPage'

const Layout = () =>{
  return (
    <div>
    <Nav />
    <Outlet />
    <Footer />
    </div>
  )
}
// 중첩라우팅 부모 Layout 에  <Outlet /> 을 사용하면 자식경로 요소를 렌더링할수있다 <Outlet />  =           <Route path='' element={<MainPage />} />
// path 대신 index를 쓰면 localhost:3000/ 이다 = 홈
// search => localhost:3000/search index를 넣으면 기본값이 localhost:3000/ 바뀌어서 / 안해도됨
// :movieId => localhost:3000/863 state값을 붙이고싶을땐 :을 붙이면 가능하다

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path=':movieId' element={<DetailPage />} />
          <Route path='search' element={<SearchPage />} />
          {/* profile 페이지 만들기 */}
        </Route>
      </Routes>



      {/* <Nav />
      <Banner />
      <Row title="NETFILX_ORIGINALS" id="NO" fetchUrl={requests.fetchNetflixOriginals} isLargeRow/>
      <Row title="Trending" id="TN" fetchUrl={requests.fetchTrending}  />
      <Row title="Top Rated" id="TR" fetchUrl={requests.fetchTopRated} />
      <Row title="Animation Movie" id="AM" fetchUrl={requests.fetchAnimationMovies} />
      <Row title="Adventure Movie" id="DM" fetchUrl={requests.fetchAdventureMovies} />
      <Row title="Science Fiction Movie" id="SM" fetchUrl={requests.fetchScienceFictionMovies} />
      <Row title="Action Movie" id="CM" fetchUrl={requests.fetchAction} />
      <Footer /> */}
    </div>
  )
}

export default App;