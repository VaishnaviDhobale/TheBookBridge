import { useContext, useState } from "react";
import styles from "./ReaderNavbar.module.css";
import { MyContext } from "../../../context/MyContext";
import { NavLink, useNavigate } from "react-router-dom";
import { RiLogoutCircleRLine } from "react-icons/ri";
export const ReaderNavbar = () => {
  const { readerLogin } = useContext(MyContext);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate()

  // handle Logout
  const handleLogout = () => {
    try{
      const confirm = window.confirm("Are you sure for logout?")
      if(confirm){
        localStorage.setItem(
          "reader",
          JSON.stringify({
            readerId: null,
            readerToken: null,
            readerEmail: null,
            profileImg: null,
          })
        );
        navigate("/");
        window.location.reload();
      }
      

    }catch(error){
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      <div
        className={styles.profileContainer}
      >
        <div className={styles.marketPlace}><NavLink to={"/"}>MarketPlace</NavLink></div>
        <div className={styles.profileImgContainer} onClick={() => {
          setShowLogout(!showLogout);
        }}>
          <img
            src={readerLogin?.profileImg}
            className={styles.profileImg}
            alt="Profile"
          />
        </div>
      </div>
      {showLogout && (
        <div className={styles.logout}>
          <p>{readerLogin?.readerEmail}</p>
          <p className={styles.logoutContainer} onClick={handleLogout}>
            <RiLogoutCircleRLine className={styles.logoutIcon} />
          </p>
        </div>
      )}
    </div>
  );
};
