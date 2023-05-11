import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'styles/Nav.css'
import { signOut } from "firebase/auth";
import {auth} from '../fbase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser , faPenToSquare , faCircleQuestion} from '@fortawesome/free-regular-svg-icons'
import { useProfile } from "./ProfileContext";

function Nav({userObj}) {
  const [ show , setShow] = useState(false);
  const [searchValue , setSearchValue] = useState("");
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false); 
  const { selectedProfile } = useProfile();

  console.log("navuserObj->>",selectedProfile)

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
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/170px-Netflix_2015_logo.svg.png"
      alt="netfilx logo"
      className="nav__logo"
      onClick={() => {
        navigate("/Main");
      }}
    />

      <input tpye="sreach" placeholder='영화를 검색해주세요' className='nav__input' onChange={onChange} value={searchValue} />
      
      {selectedProfile && (
      <>
          <img
            src={selectedProfile.photoURL ? selectedProfile.photoURL : "https://i.pinimg.com/564x/5e/b3/d4/5eb3d4110d3634caf6526151ee71d18c.jpg"}
            alt="User logged"
            className="nav__avatar"
            onClick={onClick}
          />
      <div className='open_icon'></div>
   

      {profileOpen && ( 
      <div className='profile_wrap'>
        <div className='nav__profile'>   
        <img
              src={selectedProfile.photoURL}
              alt="profile image"
              className="nav__profile__image"
            />
        <p className="nav__profile__name">{selectedProfile.displayName}</p>
        </div>
        
        <span className='profile_icon'>
        <FontAwesomeIcon icon="fa-solid fa-caret-up" />
        </span>
        <div className='profile_edit' onClick={onClick => navigate("/Edit")}>
        <FontAwesomeIcon icon={faPenToSquare} /> 프로필 관리
        </div>
        <div className='customer' onClick={onClick => navigate("/")}>
        <FontAwesomeIcon icon={faUser} /> 계정</div>
        <div className='customer__center'>
        <FontAwesomeIcon icon={faCircleQuestion} /> 고객 센터</div>
        <button className="LogOut" onClick={onLogOutClick}>
          넷플릭스에서 로그아웃
        </button>
        </div>
      )}
         </>
      )}
    </nav>

  )
}

export default Nav;