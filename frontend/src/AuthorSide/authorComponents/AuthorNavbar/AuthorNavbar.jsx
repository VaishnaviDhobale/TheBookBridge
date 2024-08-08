import { useContext, useState } from "react";
import styles from "./AuthorNavbar.module.css";
import { MyContext } from "../../../context/MyContext";
import { NavLink, useNavigate } from "react-router-dom";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoReorderThree } from "react-icons/io5";
export const AuthorNavbar = () => {
  const { authorLogin } = useContext(MyContext);
  const [showLogout, setShowLogout] = useState(false);
  const [showResponsiveNav, setShowResponsiveNav] = useState(false);
  const navigate = useNavigate();

  // handle Logout
  const handleLogout = () => {
    try {
      const confirm = window.confirm("Are you sure for logout?");
      if (confirm) {
        localStorage.setItem(
          "author",
          JSON.stringify({
            authorId: null,
            authorToken: null,
            authorEmail: null,
            profileImg: null,
          })
        );
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.container}>
      {/* Responsive Navbar only for tabs */}
      <div className={styles.responsiveNavbarConatainer}>
        <div className={styles.threeLinesContainer}>
          <IoReorderThree
            className={styles.threeLines}
            onClick={() => {
              setShowResponsiveNav(!showResponsiveNav);
            }}
          />
        </div>
        {showResponsiveNav && (
          <div className={styles.tabs}>
            <NavLink to={"/authorLandingPage"} onClick={()=>{setShowResponsiveNav(false)}}>Home</NavLink>
            <NavLink to={"/reviews"} onClick={()=>{setShowResponsiveNav(false)}}>Books Reviews</NavLink>
          </div>
        )}
      </div>

      {/* Normal navbar  */}
      <div className={styles.profileContainer}>
        <div className={styles.allTabs}>
          <div className={styles.marketPlace}>
            <NavLink to={"/"}>MarketPlace</NavLink>
          </div>
          <div className={styles.tabs}>
            <NavLink to={"/authorLandingPage"}>Home</NavLink>
            <NavLink to={"/reviews"}>Books Reviews</NavLink>
          </div>
        </div>

        <div
          className={styles.profileImgContainer}
          onClick={() => {
            setShowLogout(!showLogout);
          }}
        >
          <img
            src={authorLogin?.profileImg}
            className={styles.profileImg}
            alt="Profile"
          />
        </div>
      </div>

      {/* Logout */}
      {showLogout && (
        <div className={styles.logout}>
          <p>{authorLogin?.authorEmail}</p>
          <p className={styles.logoutContainer} onClick={handleLogout}>
            <RiLogoutCircleRLine className={styles.logoutIcon} />
          </p>
        </div>
      )}
    </div>
  );
};
