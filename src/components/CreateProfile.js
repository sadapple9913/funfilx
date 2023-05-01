import React, { useEffect, useState } from 'react'
import '../styles/CreateProfile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDownloadURL, ref, uploadString}  from "firebase/storage";
import { db ,storage } from '../fbase';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import {useNavigate } from 'react-router-dom';

function CreateProfile({ userObj, addProfile }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState('');
  const [photoURL, setPhotoURL] = useState(userObj.photoURL); // 생성된 프로필의 이미지 URL을 상태 변수로 관리
  const navigate = useNavigate('');

  
  const onChange = (e) => {
    const { target: { value } } = e;
    setNewDisplayName(value);
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let attachmentUrl = '';
      if (attachment !== '') {
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(storageRef, attachment ,'data_url');
        attachmentUrl = await getDownloadURL(ref(storage, response.ref));
      }

      // Firestore에 새로운 프로필 추가
      const docRef = await addDoc(collection(db, "profiles"), {
        name: newDisplayName,
        photoURL:attachmentUrl !== "" ? attachmentUrl : userObj.photoURL,
        userID: userObj.uid
      });

      // addProfile 함수를 호출하여 새로운 프로필 추가
      addProfile({
        id: docRef.uid,
        name: newDisplayName,
        photoURL: attachmentUrl || userObj.photoURL
      });

      setPhotoURL(attachmentUrl || userObj.photoURL);
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
    setAttachment('');
    navigate("/")
  };

  const onFileChange = (e) => {
    const { target: { files } } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = (e) => {
    e.preventDefault();
    setAttachment('');
  };
  

  return (
    <>
    <div className="createProfile__logo"></div>
    <div className='CreateProfile__wrap'>
      <h1>프로필 추가</h1>
      <p>Netfilx를 시청할 다른 사용자를 등록하시려면 프로필을 추가하세요.</p>
      <div className='creating__box'>
      <img src={attachment} className='profile__image' />
      <form className='create_container' onSubmit={onSubmit}>

          {newDisplayName ? (
            <input className="create_wrap" type="text" onChange={onChange}  placeholder={newDisplayName}/>
          ) : (
            <input className="create_wrap" type="text" onChange={onChange}  placeholder={"name"}/>
          )}
          <label className="select" htmlFor="attach-file">
            <input className="file" type='file' accept='image/*' onChange={onFileChange} style={{opacity:0}}  id="attach-file"/>
        </label>
        <button type="submit" className="save" >
        저장
        </button>
        <button className="back_button" onClick={() => navigate("/")}> 취소 </button>
      </form > 
      </div>    

    </div>
    </>
    
  )
}

export default CreateProfile