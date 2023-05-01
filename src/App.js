import React, { useEffect, useState } from 'react'
import Nav from 'components/Nav'
import "styles/App.css"
import Footer from 'components/Footer'
import { Outlet, Route, Routes } from 'react-router-dom'
import MainPage from 'routes/MainPage'
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

library.add(fas, faFontAwesome )


// 중첩라우팅 부모 Layout 에  <Outlet /> 을 사용하면 자식경로 요소를 렌더링할수있다 <Outlet />  =           <Route path='' element={<MainPage />} />
// path 대신 index를 쓰면 localhost:3000/ 이다 = 홈
// search => localhost:3000/search index를 넣으면 기본값이 localhost:3000/ 바뀌어서 / 안해도됨
// :movieId => localhost:3000/863 state값을 붙이고싶을땐 :을 붙이면 가능하다

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
    <div className='app'>
      {init ? (
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<MyProfile userObj={userObj} />} />
              <Route path="/Main" element={<Main userObj={userObj} />} />
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
  )
}

export default App;