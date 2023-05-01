import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateProfile from "./CreateProfile";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "fbase";


function My({userObj}) {
const navigate = useNavigate("");
console.log("userObj->",userObj)
const [attachment ,setAttachment ] = useState("");

const handleButtonClick = () => {
  navigate('');
};
const [profiles, setProfiles] = useState([]);
  
    useEffect(() => {
      const q = query(collection(db, 'profiles'),
      where("userID", "==", userObj.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const profileList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfiles(profileList);
      });
      return () => {
        unsubscribe();
      };
    }, [userObj]);

  
  return (
    <>
      <ul className="Profile__wrap">
        {profiles.map((profile) => (
          <li key={profile.id} className="Profile__box" onClick={() => navigate(`/Main`)}>
            <span className="Profile__img">
              <img src={profile.photoURL} alt="Profile Image"/>
            </span>
            <span className="Profile_name">{profile.name}</span>
          </li>
        ))}
        

        <li className="Profile__box plus" onClick={() => navigate(`/CreateProfile`)}>
          <span className="Profile__img">
            <img src="https://i.pinimg.com/564x/e0/26/d4/e026d4f6351d925a132b182cf7d585e1.jpg" alt="My Image"/>
            <FontAwesomeIcon icon="fa-solid fa-circle-plus" className="plus__icon"/>
          </span>

          <span className="Profile_Plus">프로필 추가</span>
        </li>
      </ul>
          {/* <div className="My__wrap">

          <ul className="Profile__list">
            {profiles.map((profile) => (
              <li key={profile.id} className="Profile__box">
                <span class="Profile__img">
                  <img src={profile.photoURL} alt="Profile Image"/>
                </span>
                <span class="Profile_name">{profile.name}</span>
              </li>
            ))}
            <li className="Profile__box" onClick={() => navigate('/Main')}>
              <span class="Profile__img">
                <FontAwesomeIcon icon="fa-solid fa-plus-circle" />
              </span>
              <span class="Profile_name">Add Profile</span>
            </li>
          </ul>
          <CreateProfile userObj={userObj} addProfile={addProfile} />
        </div> */}
        </>
  );
}


export default My;
