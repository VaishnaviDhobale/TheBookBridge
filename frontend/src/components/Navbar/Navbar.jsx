import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useContext, useState } from "react";
import { MyContext } from "../../context/MyContext";
import { IoMdLogOut } from "react-icons/io";
import bookImg from "../../booksPdfs/book.png"
export const Navbar = () => {
  const [showResponsiveNavbar, setShowResponsiveNavbar] = useState(false);
  const [showReaderLogout, setShowReaderLogout] = useState(false);
  const { authorLogin, readerLogin } = useContext(MyContext);
  const navigate = useNavigate()

  // handle Reader Logout
  const handleReaderLogout = async()=>{
    try{
      const confirm = window.confirm(`Are you sure to logout?`)
      if(confirm){
        localStorage.setItem(
          "reader",
          JSON.stringify({
            authorId: null,
            authorToken: null,
            authorEmail: null,
            profileImg: null,
          })
        );
        setShowResponsiveNavbar(false)
        navigate("/");
        window.location.reload();
      }
    }catch(error){
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      {/* Responsive navbar  */}
      <div className={styles.responsiveNavContainer}>
        <div
          className={styles.threeLinesConatiner}
          onClick={() => setShowResponsiveNavbar(!showResponsiveNavbar)}
        >
          <IoReorderThreeOutline className={styles.threeLines} />
        </div>
        {showResponsiveNavbar && (
          <div className={styles.responsiveNav}>
            <div className={styles.responsivelinks} onClick={()=>{setShowResponsiveNavbar(false)}}>
              <NavLink to="/">Home</NavLink>
            </div>
            <div className={styles.responsiveButtons}>
              {authorLogin.authorToken ? (
               <NavLink to={"/authorLandingPage"}>
                 <button className={styles.authorLoginBtn} onClick={(()=>setShowResponsiveNavbar(false))}>Author</button>
               </NavLink>
              ) : (
                <NavLink to={"/authorLogin"}>
                  <button className={styles.authorLoginBtn}> Author Login</button>
                </NavLink>
              )}
              {readerLogin.readerToken ? (
                <button className={styles.readerLoginBtn} onClick={handleReaderLogout}>Logout Reader </button>
              ) : (
                <NavLink to={"/readerLogin"}>
                  <button className={styles.readerLoginBtn}>Reader Login</button>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Normal navbar  */}
      <div className={styles.navContainer}>
        <div className={styles.links}>
          {/* <NavLink to="/">Home</NavLink> */}
         <NavLink to={"/"}> <img className={styles.bookImg} src={bookImg} alt="" /></NavLink>
        </div>
        <div className={styles.buttons}>
          {authorLogin.authorToken ? (
            <NavLink to={"/authorLogin"}>
              <button className={styles.authorLoginBtn}>Author</button>
            </NavLink>
          ) : (
            <NavLink to={"/authorLogin"}>
              <button className={styles.authorLoginBtn}>Author Login</button>
            </NavLink>
          )}
          {readerLogin.readerToken ? (
            <div className={styles.readerEmail}>
              <button
                onClick={() => setShowReaderLogout(!showReaderLogout)}
                className={styles.readerLoginBtn}
              >
                Reader
              </button>
              {
                showReaderLogout && <div className={styles.readerLogoutDiv}>
                <p>{readerLogin.readerEmail}</p>
                <IoMdLogOut className={styles.logout}  onClick={handleReaderLogout}/>
              </div>
              }
            </div>
          ) : (
            <NavLink to={"/readerLogin"}>
              {" "}
              <button className={styles.readerLoginBtn}>Reader Login</button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};
