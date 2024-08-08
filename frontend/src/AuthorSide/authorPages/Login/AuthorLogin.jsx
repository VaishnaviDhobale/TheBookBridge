import { useContext, useEffect, useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { baseUrl } from "../../../comman";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../../context/MyContext";
import { Navbar } from "../../../components/Navbar/Navbar";
import ReactLoading from "react-loading";

export const AuthorLogin = () => {
  const [login, setLogin] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { authorLogin } = useContext(MyContext);
  console.log(authorLogin);

  // if(authorLogin?.authorToken){
  //   navigate("/authorLandingPage");
  // }

  const handleChange = (event) => {
    try {
      const { name, value } = event.target;
      setLogin({ ...login, [name]: value });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle submit
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const response = await axios.post(
        `${baseUrl}/authors/loginauthor`,
        login
      );
      console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        // Corrected localStorage.setItem usage
        localStorage.setItem(
          "author",
          JSON.stringify({
            profileImg: response.data.profileImg,
            authorId: response.data.authorId,
            authorToken: response.data.authorToken,
            authorEmail: response.data.authorEmail,
          })
        );

        // Set login data in context
        // setAuthorLogin({
        //   profileImg: response.data.profileImg,
        //   authorId: response.data.authorId,
        //   authorToken: response.data.authorToken,
        // })

        navigate("/authorLandingPage");
        window.location.reload();
        toast.success(response.data.success);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error.response.data.error);
      toast.error(
        error.response.data.error || `Unable to login with ${login.email}.`
      );
    }
  };

  useEffect(() => {
    if (authorLogin?.authorToken) {
      navigate("/authorLandingPage");
    }
  }, [authorLogin, navigate]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Author Login</h1>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <input
            type="submit"
            className={`${styles.submitBtn} ${isLoading ? "hidden" : ""}`}
          />
          {isLoading && (
            <div className={styles.spinner}>
              <ReactLoading type="spin" color="white" height={20} width={20} />
            </div>
          )}
          <p className={styles.dontHaveAccount}>
            Dont have account?{" "}
            <NavLink to="/authorSignup">
              <span>Click Here</span>
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
};
