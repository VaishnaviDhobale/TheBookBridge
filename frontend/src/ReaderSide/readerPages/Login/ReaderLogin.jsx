import { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { baseUrl } from "../../../comman";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar } from "../../../components/Navbar/Navbar";
import ReactLoading from "react-loading";


export const ReaderLogin = () => {
  const [login, setLogin] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      setIsLoading(true)
      const response = await axios.post(
        `${baseUrl}/readers/loginReader`,
        login
      );
      console.log(response);
      if (response.status === 200) {
      setIsLoading(false)
        // Corrected localStorage.setItem usage
        localStorage.setItem(
          "reader",
          JSON.stringify({
            profileImg: response.data.profileImg,
            readerId: response.data.readerId,
            readerToken: response.data.readerToken,
            readerEmail: response.data.readerEmail,
          })
        );
        navigate("/");
        toast.success(response?.data?.success);
        window.location.reload();
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error?.response?.data?.error);
      toast.error(
        error.response.data.error || `Unable to login with ${login.email}.`
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Reader Login</h1>
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
          <input type="submit" className={`${styles.submitBtn} ${
              isLoading ? "hidden" : ""
            }`}  />
          {isLoading && (
            <div className={styles.spinner}>
              <ReactLoading type="spin" color="white" height={20} width={20} />
            </div>
          )}
          <p className={styles.dontHaveAccount}>
            Don't have account?{" "}
            <NavLink to="/readerSignup">
              <span>Click Here</span>
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
};
