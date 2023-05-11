import React, { useEffect, useState } from 'react'
import Nav from 'components/Nav'
import "styles/App.css"
import Footer from 'components/Footer'
import { Outlet, Route, Routes } from 'react-router-dom'
import DetailPage from 'routes/DetailPage'
import SearchPage from 'routes/SearchPage'
import Auth from 'routes/Auth'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import MyProfile from 'routes/MyProfile'
import Edit from 'components/Edit'
import Main from 'routes/Main'
import CreateProfile from 'components/CreateProfile'
import My from 'components/My'
import { ProfileProvider } from "./components/ProfileContext";

library.add(fas, faFontAwesome )

function App() {
  const auth = getAuth();
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState('');
  const addProfile = (profile) => {
    setProfiles((prevProfiles) => [...prevProfiles, profile]);
  };
  const [profiles, setProfiles] = useState([]);

  const Layout = () =>{
    return (
      <div>
      <Nav userObj={userObj}/>
      <Outlet />
      <Footer />
      </div>
    )
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);

      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  });

  return (
    <ProfileProvider>
    <div className='app'>
      {init ? (
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<MyProfile userObj={userObj} />} />
              <Route path="/Main/*" element={<Main userObj={userObj} />} />
              <Route path='/Edit' element={<Edit userObj={userObj} />} />
              <Route path='/My' element={<My userObj={userObj}  />} />
              <Route path='/CreateProfile' element={<CreateProfile userObj={userObj} addProfile={addProfile} />} />
              <Route path='/Nav' element={<Nav userObj={userObj} />} />
              <Route path=':movieId' element={<DetailPage />} />
              <Route path='search' element={<SearchPage userObj={userObj}/>} />
            </>
          ) : (
            <Route exact path="/" element={<Auth />} />
          )}

        </Routes>
      ) : (
        'Initializing...'
      )}
    </div>
    </ProfileProvider>
  )
}

export default App;