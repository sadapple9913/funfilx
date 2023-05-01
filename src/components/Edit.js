import React, { useEffect, useState } from 'react'
import "../styles/MyProfile.css"
import { Link, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import My from '../components/My';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from 'fbase';
import { ref } from 'firebase/database';
import { getDownloadURL, uploadString } from 'firebase/storage';


function MyProfile({userObj}) {
  const [newDisplayName , setNewDisplayName] = useState(userObj.displayName);
  const[attachment ,setAttachment ] = useState("");
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);

  console.log(userObj);


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



const onChange = (e) =>{
e.preventDefault();
const { target: { value } } = e;
setNewDisplayName(value);
console.log(value)
}

  
const onSubmit = async (e) => {
  e.preventDefault();
  try {
    let attachmentUrl = "";
    if (attachment !== "") {
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, attachment ,"data_url");
      attachmentUrl = await getDownloadURL(ref(storage, response.ref));
    }
    await updateProfile(userObj, {
      displayName: newDisplayName,
       photoURL:attachmentUrl !== "" ? attachmentUrl : userObj.photoURL,
    });

  } catch (e) {
    console.error("Error updating profile: ", e);
  }
  setAttachment("");
};

    

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

const handleButtonClick = () => {
  navigate('');
};

  
 

  return (
    <>
    <div className="logo"></div>
      <section className="profile">
      <h2>프로필을 수정하세요.</h2>
          <h3 className="blind">My profile info</h3>
          <ul className="Profile__wrap">
          {profiles.map((profile) => (
          <li key={profile.id} className="Profile__box" onSubmit={onSubmit}>
            <span className="Profile__img">
              <img src={profile.photoURL} alt="Profile Image"/>
            </span>
            {newDisplayName ? (
                <input className="profileName" type="text" onChange={onChange}  placeholder={newDisplayName}/>
              ) : (
                <input className="profileName" type="text" onChange={onChange}  placeholder={"name"}/>
              )}
          </li>
        ))}
          </ul>
            <ul className="profile_menu">
              <Link to="/Edit">
              <li>
                {/* <span className="icon">
                </span> */}
              완료
              </li>
              </Link>
            </ul>
        </section>

        {attachment && ( //값이 있으면 true 다, 0 null 공백문자 undefind = false
              <div className="preview">
                <img src={attachment} alt='' />
                <button className="remove" onClick={onClearAttachment}>
                x
                </button>
                <form onSubmit={onSubmit}>
                <input className="submit_image" type="submit" value="done" />
                </form>

              </div>
            )}
    </>
  )
}

export default MyProfile;