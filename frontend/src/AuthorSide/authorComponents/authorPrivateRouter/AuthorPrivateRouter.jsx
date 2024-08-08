import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { useContext } from "react";
import { MyContext } from "../../../context/MyContext";

export const AuthorPrivateRouter = ({ children }) => {
  const { authorLogin } = useContext(MyContext);
  console.log(authorLogin);
  if (authorLogin.authorToken) {
    return children;
  } else {
    toast.error("Please login before start.");
    return <Navigate to="/authorLogin" />;
  }
};
