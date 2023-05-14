import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateProfile from "./CreateProfile";
import {collection,onSnapshot,orderBy,query,where,deleteDoc,doc,} from "firebase/firestore";
import { db } from "fbase";
import { useProfile } from "./ProfileContext";

function My({userObj}) {
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState("");
  const [profiles, setProfiles] = useState([]);
  const { setSelectedProfile } = useProfile();

  const onClick = (e, profile) => {
    e.preventDefault();
    setSelectedProfile(profile);
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
    navigate("/Main", { state: { selectedProfile: profile } });
  };

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

            <span className="Profile__img"onClick={(e) => onClick(e, profile)}>
                <img src={profile.photoURL ? profile.photoURL : "https://i.pinimg.com/564x/5e/b3/d4/5eb3d4110d3634caf6526151ee71d18c.jpg"} alt="Profile Image" />
            </span>

            <span className="Profile_name">{profile.displayName}</span>
        </li>
      ))}

      {profiles.length < 5  && (
        <li
          className="Profile__box plus"
          onClick={() => navigate(`/CreateProfile`)}
        >
          <span className="Profile__img">
            <img
              src={process.env.PUBLIC_URL + '/images/plusBtn.png'} 
              alt="My Image"
            />
          </span>

          <span className="Profile_Plus">프로필 추가</span>
        </li>
      )}
      </ul>
    </>
  );
}

export default My;