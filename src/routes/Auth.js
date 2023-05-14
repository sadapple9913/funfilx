import React, { useState } from "react";
import {
signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";
import '../fbase'
import '../styles/Auth.css'



function Auth() {
  const auth = getAuth()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccout, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccout) {
        data = signInWithEmailAndPassword(auth, email, password);
      } else {
        data = createUserWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "Google") {
      provider = new GoogleAuthProvider();
    }
    const data = await signInWithPopup(auth, provider);
    console.log(data);
  };
  
  return (
    <div className="background">
      <div className="logo"></div>
      <div className="login_wrap">
      <form onSubmit={onSubmit} className="login">
        <span className="login__title">로그인</span>
        <input className="email"
          name="email"
          type="text"
          placeholder="이메일 주소 또는 전화번호"
          required
          value={email}
          onChange={onChange}
        />
        <input className="password"
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          value={password}
          onChange={onChange}
        />
        <input className="toggle"  type="submit" value={newAccout ? "로그인" : "회원가입"} />
        {error}
      </form>
      <span onClick={toggleAccount} className="sign">
        {newAccout ? "회원가입을 하시려면  여기를 여기를 클릭해주세요." : "이미 회원이시라면 여기를 클릭해주세요."}
      </span>
      <div className="googleLogin">
        <span className="ather">또는</span>
        <button onClick={onSocialClick} name="Google">
          Google 로그인
        </button>
      </div>
      </div>
      <div className='row__posters'>
      {
                        movies.map((movie) => (
      <img
                                        key={movie.id}
                                        className={`row__poster `}
                                        src={movie.backdrop_path
                                            ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                                            : `https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                        loading='lazy'
                                        alt={movie.title || movie.name || movie.original_name}/>
                                        ))
                                      }
                                      </div>
    </div>
  );
}

export default Auth;
