import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import Footer from '../components/Footer'
import MainPage from 'routes/MainPage'
import DetailPage from 'routes/DetailPage'
import SearchPage from 'routes/SearchPage'
import Auth from 'routes/Auth'
import Nav from '../components/Nav'



function Main({userObj}) {

    const Layout = () =>{
    return (
      <div>
      <Nav userObj={userObj}/>
      <Outlet />
      <Footer />
      </div>
    )
  }

  return (
    <div className='app'>
    <Routes>
        <Route path='/' element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path=':movieId' element={<DetailPage />} />
        <Route path='search' element={<SearchPage  />} />
        </Route>
    </Routes>
    </div>
  )
}

export default Main;