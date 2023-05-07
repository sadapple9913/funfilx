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
  console.log(userObj);
  const[attachment ,setAttachment ] = useState("");
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);


  const onChange = (e) =>{
    e.preventDefault();
    const { target: { value } } = e;
    setNewDisplayName(value);
    console.log(value)
    }

    const onSubmit = async(e) => {
      e.preventDefault();
      if(userObj.displayName !== newDisplayName){
        await updateProfile(userObj, {
          displayName: newDisplayName ,
          photoUrl: attachment });
      }}

    
 

const onFileChange = (e) =>{
  console.log('e->',e);
  const {target:{files}} = e;

  const theFile = files[0];
  console.log('theFile->',theFile);

  const reader = new FileReader(); //브라우저에 사진미리보기를 하고싶으면 FileReader를 사용해야된다
  reader.onloadend = (finishedEvent) => {
    console.log("finishedEvent ->" ,finishedEvent);
    const {currentTarget:{result}} = finishedEvent
    setAttachment(result);
  }
  reader.readAsDataURL(theFile); //theFile이라는 값을 U RL로 읽어서 보이게 한다
}

const onClearAttachment = () =>{
  setAttachment("");
}

console.log("attachment",attachment);
console.log("newDisplayName ", newDisplayName )

  return (
    <>
    <div className="logo"></div>
      <section className="profile">
      <h2>Netfilx를 시청할 프로필을 선택하세요 . </h2>
          <h3 className="blind">My profile info</h3>
            <My 
            images={userObj.photoURL} userObj={userObj} 
            />
            <ul className="profile_menu">
              <Link to="/Edit">
              <li>
                프로필 관리
              </li>
              </Link>
            </ul>
        </section>

    </>
  )
}

export default MyProfile;