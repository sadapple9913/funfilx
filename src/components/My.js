import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateProfile from "./CreateProfile";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "fbase";

function My({ images, userObj}) {
  const navigate = useNavigate("");
  const [attachment, setAttachment] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "profiles"),
      where("userID", "==", userObj.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profileList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfiles(profileList);
    });
    return () => {
      unsubscribe();
    };
  }, [userObj]);

  const deleteProfile = async (profileId) => {
    try {
      await deleteDoc(doc(db, "profiles", profileId));
      console.log("Profile successfully deleted!");
    } catch (error) {
      console.error("Error removing profile: ", error);
    }
  };

  return (
    <>
      <ul className="Profile__wrap">
        {profiles.map((profile) => (
          <li
            key={profile.id}
            className="Profile__box"
          >
            <span className="Profile__img"             onClick={() => navigate(`/Main`)}>
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Profile Image" />
              ) : (
                <img
                  src="../images/4d2d37bcc6a75ebd6f3dc60f6587206a.jpg"
                  alt="Profile Image"
                />
              )}
            </span>
            <span className="Profile_name">{profile.name}</span>
            {/* <button onClick={() => deleteProfile(profile.id)}>Delete</button>
            <button className="My__edit-btn" onClick={handleEditClick}>프로필 수정</button>
          <button className="My__delete-btn" onClick={handleDeleteClick}>프로필 삭제</button> */}
          </li>
          
        ))}

        <li
          className="Profile__box plus"
          onClick={() => navigate(`/CreateProfile`)}
        >
          <span className="Profile__img">
            <img
              src="https://i.pinimg.com/564x/e0/26/d4/e026d4f6351d925a132b182cf7d585e1.jpg"
              alt="My Image"
            />
            <FontAwesomeIcon
              icon="fa-solid fa-circle-plus"
              className="plus__icon"
            />
          </span>

          <span className="Profile_Plus">프로필 추가</span>
        </li>
      </ul>
    </>
  );
}

export default My;