import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { useContext } from "react";
import { MyContext } from "../../../context/MyContext";

export const ReaderPrivateRouter = ({ children }) => {
  const {readerLogin} = useContext(MyContext);
  console.log(readerLogin)
  if (readerLogin.readerToken) {
    return children;
  } else {
    toast.error("Please login before start reading.");
    return <Navigate to="/readerLogin" />;
  }
};
