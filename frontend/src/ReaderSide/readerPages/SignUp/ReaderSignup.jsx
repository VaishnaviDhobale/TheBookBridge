import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../comman";
import { toast } from "react-toastify";
import { Navbar } from "../../../components/Navbar/Navbar";
import ReactLoading from "react-loading";


export const ReaderSignup = () => {
  const [reader, setreader] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate()

  // Check reader alredy exist
  const isreaderAlredyExist = async () => {
    try {
      const readerExists = await axios.get(
        `${baseUrl}/readers/readerByEmail/${reader?.email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return readerExists;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return error;
    }
  };

  // Handle Change
  const handleChange = (event) => {
    try {
      let { name, value, files } = event.target;
      if (name === "profileImg") {
        setreader({ ...reader, [name]: files[0] });
      } else {
        setreader({ ...reader, [name]: value });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Submit
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // reader details validation start
      if (!reader.email.includes("@gmail.com")) {
        toast.error("Please enter a valid email address.");
      } else if (reader.password !== reader.confirmPassword) {
        toast.error("Password ans confirm password should be match");
      } else if (reader.contact.length < 10 || reader.contact.length > 10) {
        toast.error("Please enter a valid contact number");
      } else if (reader.password.length <= 8) {
        toast.error("Password length should be greater than 8 characters.");
        // reader details validation ends
      } else {
        const readerExists = await isreaderAlredyExist();

        if (readerExists.data) {
          toast.error(
            "An reader with the provided email already exists, Please go for login"
          );
        } else {
          const formData = new FormData();
          for (const key in reader) {
            formData.append(key, reader[key]);
          }

          setIsLoading(true)
          const response = await axios.post(
            `${baseUrl}/readers/addreader`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            setIsLoading(false);
            toast.success(response.data.success);
            navigate("/readerLogin")
            
          }
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
      toast.error(error.response.data.error || "Unable to add reader.");
    }
  };
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1> Reader SignUp</h1>
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
            }`} />
             {isLoading && (
            <div className={styles.spinner}>
              <ReactLoading type="spin" color="white" height={20} width={20} />
            </div>
          )}
          <p className={styles.dontHaveAccount}>
            Already have account?{" "}
            <NavLink to="/readerLogin">
              <span>Click Here</span>
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
};
