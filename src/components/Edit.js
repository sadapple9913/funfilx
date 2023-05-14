import React, { useEffect, useState } from 'react';
import "../styles/Edit.css";
import { Link, useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from 'fbase';
import { ref } from 'firebase/storage';
import { getDownloadURL, uploadString } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Edit({userObj}) {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    const q = query(collection(db, 'profiles'), where("userID", "==", userObj.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profileList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("edit",profileList);
      setProfiles(profileList);
    });

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
      const reader = new FileReader();
  
      reader.onloadend = async (finishedEvent) => {
        const dataUrl = finishedEvent.target.result;
        const fileRef = ref(storage, `profileImages/${uuidv4()}`);
        const snapshot = await uploadString(fileRef, dataUrl, "data_url");
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
      };
  
      reader.readAsDataURL(file);
    }
  };
  

    const onNameChange = (profileId, newName) => {
      setInputValues({ ...inputValues, [profileId]: newName });
    };
  
    const updateProfileName = async (profileId, newName) => {
      try {
        await updateDoc(doc(db, "profiles", profileId), {
          displayName: newName,
        });
      } catch (error) {
        console.error("Error updating profile name: ", error);
      }
    };
  
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
                  id="check_btn"
                  type="checkbox"
                  value={profile.id}
                  onChange={(e) => onChange(e, profile)}
                />
                <span className="Profile__img">
                <img src={profile.photoURL ? profile.photoURL : "https://i.pinimg.com/564x/5e/b3/d4/5eb3d4110d3634caf6526151ee71d18c.jpg"} alt="Profile Image" />
                  <label className="selectPhoto" htmlFor="attach-file">
                  <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                  <input
                    className='Select__File'
                    id='attach-file'
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e, profile)}
                  />
                  </label>
                </span>
                <input
                  className="profileName"
                  type="text"
                  placeholder={inputValues[profile.id] || profile.displayName}
                  onChange={(e) => onNameChange(profile.id, e.target.value)}
                  onBlur={() =>
                    updateProfileName(profile.id, inputValues[profile.id])
                  }
                />
              </div>
            ))}
          </form>
          <div className="Edit__profile_menu">
              <Link to="/">
                <div className='done'>완료</div>
                <button
                  className="delete"
                  onClick={() => onDelete(selectedProfiles)}
                >
                  프로필 삭제
                </button>
              </Link>
            </div>
        </section>
      </>
    );
  }
  
  export default Edit;