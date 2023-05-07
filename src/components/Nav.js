import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import 'styles/Nav.css'
import { signOut } from "firebase/auth";
import {auth, db} from '../fbase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser , faPenToSquare , faCircleQuestion} from '@fortawesome/free-regular-svg-icons'
import { collection, onSnapshot, query, where } from 'firebase/firestore';


function Nav({userObj}) {
  const [ show , setShow] = useState(false);
  const [searchValue , setSearchValue] = useState("");
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false); 
  const [profileData, setProfileData] = useState({});
  const [profiles, setProfiles] = useState([]);
  
  console.log("userObj->>",userObj)

  useEffect(() =>{
    window.addEventListener("scroll" , () =>{
      if(window.scrollY > 50){
        setShow(true);
      }else{
        setShow(false);
      }
    });
    return() =>{
      window.addEventListener("scroll" ,()=>{
        setShow(false);
      })
    }
  },[])

  useEffect(() => {
    const q = query(collection(db, 'profiles'), where("userID", "==", userObj.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profileList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        photoURL: doc.data().photoURL
      }));
      setProfiles(profileList);
    });
    return () => {
      unsubscribe();
    };
  }, [userObj.uid]);


  const onChange = (e) => {
    setSearchValue(e.target.value);
    navigate(`/search?q=${e.target.value}`)
  }

  const onLogOutClick = () => {
    signOut(auth);
    navigate("/", { replace: true });
  };

  const onClick =() =>{
    setProfileOpen(!profileOpen);
  }

  return (

    <nav className={`nav ${show && "nav__black"}`}>
      <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/170px-Netflix_2015_logo.svg.png' alt='netfilx logo' className='nav__logo' 
      onClick={() => {window.location.href="/funflix/Main"}}/>

      <input tpye="sreach" placeholder='영화를 검색해주세요' className='nav__input' onChange={onChange} value={searchValue} />
      
      <img src={profileData.photoURL} alt='User logged' className='nav__avatar' onClick={onClick}/>
      
      <div className='open_icon'></div>
      
      {profileOpen && ( 
      <div className='profile_wrap'>
        <div className='nav__profile'>   
        <img src={userObj.photoURL} alt='profile image' className='nav__profile__image'/>
        <p className='nav__profile__name'>{userObj.name}</p>
        </div>
        
        <span className='profile_icon'>
        <FontAwesomeIcon icon="fa-solid fa-caret-up" />
        </span>
        <div className='profile_edit'>
        <FontAwesomeIcon icon={faPenToSquare} /> 프로필 관리
        </div>
        <div className='customer'>
        <FontAwesomeIcon icon={faUser} /> 계정</div>
        <div className='customer__center'>
        <FontAwesomeIcon icon={faCircleQuestion} /> 고객 센터</div>
        <button className="LogOut" onClick={onLogOutClick}>
          넷플릭스에서 로그아웃
        </button>
        </div>
      )}
    </nav>

  )
}

export default Nav;