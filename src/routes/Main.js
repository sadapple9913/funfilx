import React, { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import MainPage from 'routes/MainPage';
import DetailPage from 'routes/DetailPage';
import SearchPage from 'routes/SearchPage';
import Nav from '../components/Nav';
import { useProfile } from "../components//ProfileContext";

function Main({ userObj }) {
  const location = useLocation();
  const { selectedProfile, setSelectedProfile } = useProfile();

  useEffect(() => {
    const storedProfile = localStorage.getItem('selectedProfile');
    if (storedProfile) {
      setSelectedProfile(JSON.parse(storedProfile));
    } else {
      setSelectedProfile(location.state?.selectedProfile);
    }
  }, [location.state]);

  const Layout = () => {
    return (
      <div>
        <Nav selectedProfile={selectedProfile} />
        <Outlet selectedProfile={selectedProfile} />
        <Footer />
      </div>
    );
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path=":movieId" element={<DetailPage />} />
          <Route path="search" element={<SearchPage selectedProfile={selectedProfile} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default Main;