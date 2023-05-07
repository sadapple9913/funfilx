import React, { useEffect, useState } from 'react'
import "../styles/Edit.css"
import { Link, useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import My from '../components/My';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from 'fbase';
import { ref } from 'firebase/database';
import { getDownloadURL, uploadString } from 'firebase/storage';


function Edit({userObj}) {
  const [newDisplayName , setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState(null);
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'profiles'), where("userID", "==", userObj.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profileList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProfiles(profileList);
    });

    // cleanup 함수
    return () => {
      unsubscribe();
    };
  }, [userObj]);

  const onChange = (e, profile) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedProfiles((prevSelected) => [...prevSelected, profile]);
    } else {
      setSelectedProfiles((prevSelected) =>
        prevSelected.filter((p) => p.id !== profile.id)
      );
    }
  };

  const deleteProfiles = async (profileIds) => {
    try {
      for (const profileId of profileIds) {
        await deleteDoc(doc(db, "profiles", profileId));
      }
      console.log("Profiles successfully deleted!");
    } catch (error) {
      console.error("Error removing profiles: ", error);
    }
  };

  const onDelete = (selectedProfiles) => {
    const profileIds = selectedProfiles.map((profile) => profile.id);
    deleteProfiles(profileIds);
    setProfiles([]);
  };

  const onFileChange = async (e, profile) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const fileRef = ref(storage, `profileImages/${uuidv4()}`);
      const snapshot = await uploadString(fileRef, file, "data_url");
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, "profiles", profile.id), {
        photoURL: downloadURL,
      });

      setProfiles((prevProfiles) => {
        const index = prevProfiles.findIndex((p) => p.id === profile.id);
        if (index === -1) return prevProfiles;
        const updatedProfile = { ...prevProfiles[index], photoURL: downloadURL };
        return [
          ...prevProfiles.slice(0, index),
          updatedProfile,
          ...prevProfiles.slice(index + 1),
        ];
      });
    }}
   
  
  console.log("attachment",attachment);
  console.log("newDisplayName ", newDisplayName )
  
  return (
    <>
      <div className="logo"></div>
      <section className="profile">
        <h2>프로필을 수정하세요.</h2>
        <h3 className="blind">My profile info</h3>
        <form className="Profile__wrap">
        
          {profiles.map((profile) => (
            <div key={profile.id} className="Profile__box">
              <input
                id='check_btn'
                type="checkbox"
                value={profile.id}
                onChange={(e) => onChange(e, profile)}
              />
               {/* <label for="check_btn"><span>선택!</span></label> */}
              <span className="Profile__img">
                <img src={profile.photoURL} alt="Profile Image" />
              </span>
              {newDisplayName ? (
                <input className="profileName" type="text" onChange={onChange} placeholder={newDisplayName} />
              ) : (
                <input className="profileName" type="text" onChange={onChange} placeholder={"name"} />
              )}
            </div>
          ))}

          <div className="Edit__profile_menu">
            <Link to="/">
              <div>
                완료
              </div>
              <button className="delete" onClick={() => onDelete(selectedProfiles)}>
              프로필 삭제
              </button>
            </Link>
          </div>    
        </form>
      </section>


</>
);
}

export default Edit;