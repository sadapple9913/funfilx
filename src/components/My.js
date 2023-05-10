import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateProfile from "./CreateProfile";
import {collection,onSnapshot,orderBy,query,where,deleteDoc,doc,} from "firebase/firestore";
import { db } from "fbase";

function My({userObj}) {
  const navigate = useNavigate();
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
      console.log("my",profileList);
      setProfiles(profileList);
    });
    return () => {
      unsubscribe();
    };
  }, [userObj]);

  console.log("my",userObj);
  return (
    <>
      <ul className="Profile__wrap">

      {profiles.map((profile) => (

        <li key={profile.id} className="Profile__box">

          <Link to={{ pathname: "/Main", state: { selectedProfile: profile } }}  />

            <span className="Profile__img" onClick={(e) => {
            e.preventDefault();
            navigate("/Main", { state: { selectedProfile: profile } });
          }}>
                <img src={profile.photoURL ? profile.photoURL : "https://i.pinimg.com/564x/5e/b3/d4/5eb3d4110d3634caf6526151ee71d18c.jpg"} alt="Profile Image" />
            </span>

            <span className="Profile_name">{profile.displayName}</span>
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