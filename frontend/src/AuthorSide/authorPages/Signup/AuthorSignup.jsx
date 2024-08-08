import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../comman";
import { toast } from "react-toastify";
import { Navbar } from "../../../components/Navbar/Navbar";
import ReactLoading from "react-loading";


export const AuthorSignup = () => {
  const [author, setauthor] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate()

  // Check author alredy exist
  const isAuthorAlredyExist = async () => {
    try {
      const authorExists = await axios.get(
        `${baseUrl}/authors/authorByEmail/${author?.email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(authorExists)
      return authorExists;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return error;
    }
  };

  // Handle Change
  const handleChange = (event) => {
    try {
      let { name, value, files } = event.target;
      if (name === "genres" || name==="awards") {
        const array = value.split(",").map((arr) => arr.trim());
        setauthor({ ...author, [name]: array });
      } else if (name === "profileImg") {
        setauthor({ ...author, [name]: files[0] });
      } else {
        setauthor({ ...author, [name]: value });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Submit
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // author details validation start
      if (!author.email.includes("@gmail.com")) {
        toast.error("Please enter a valid email address.");
      } else if (author.password !== author.confirmPassword) {
        toast.error("Password ans confirm password should be match");
      } else if (author.contact.length < 10 || author.contact.length > 10) {
        toast.error("Please enter a valid contact number");
      } else if (author.password.length <= 8) {
        toast.error("Password length should be greater than 8 characters.");
        // author details validation ends
      } else {
        const authorExists = await isAuthorAlredyExist();

        if (authorExists.data) {
          toast.error("An author with the provided email already exists, Please go for login");
        } else {
          const formData = new FormData();
          for (const key in author) {
            if (Array.isArray(author[key])) {
              author[key].forEach((item) => formData.append(`${key}[]`, item));
            } else {
              formData.append(key, author[key]);
            }
          }

          setIsLoading(true)
          const response = await axios.post(
            `${baseUrl}/authors/addauthor`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            toast.success(response.data.success);
            setIsLoading(false);
            navigate("/authorLogin")
          }
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
      toast.error(error.response.data.error || "Unable to add author.");
    }
  };
  return <>
    <Navbar />
    <div className={styles.container}>
      <h1>Author SignUp</h1>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
          required
        />
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
          type="text"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Contact"
          name="contact"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Bio"
          name="bio"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Nationality"
          name="nationality"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Awards, Seperate your awards by comma."
          name="awards"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Genres, Seperate your genres by comma."
          name="genres"
          onChange={handleChange}
          required
        />
        <label htmlFor="profileImg">Profile Img</label>
        <input
          type="file"
          id="profileImg"
          name="profileImg"
          onChange={handleChange}
          required
        />
        <input type="submit" className={`${styles.submitBtn} ${
              isLoading ? "hidden" : ""
            }`}/>
        {isLoading && (
            <div className={styles.spinner}>
              <ReactLoading type="spin" color="white" height={20} width={20} />
            </div>
          )}
        <p className={styles.dontHaveAccount}>
          Already have account?{" "}
          <NavLink to="/authorLogin">
            <span>Click Here</span>
          </NavLink>
        </p>
      </form>
    </div>
  </>
};
