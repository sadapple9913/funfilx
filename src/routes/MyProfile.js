import React, { useEffect, useState } from 'react'
import "../styles/MyProfile.css"
import { Link, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import My from '../components/My';
import { db } from 'fbase';


function MyProfile({userObj}) {
  console.log(userObj);

  const [newDisplayName , setNewDisplayName] = useState(userObj.displayName);
  console.log("myprofiles->",userObj);
  const[attachment ,setAttachment ] = useState("");
  const navigate = useNavigate();



console.log("attachment",attachment);
console.log("newDisplayName ", newDisplayName )

  return (
    <div className='myProfile_wrap'>
    <div className="logo"></div>
      <section className="profile">
      <h2>NETFILX를 시청할 프로필을 선택하세요.</h2>
          <h3 className="blind">My profile info</h3>
            <My userObj={userObj} />
            <ul className="profile_menu">
              <Link to="/Edit">
              <li>
                프로필 관리
              </li>
              </Link>
            </ul>
        </section>

    </div>
  )
}

export default MyProfile;