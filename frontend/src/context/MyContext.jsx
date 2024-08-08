import { createContext, useState } from "react";
import PropTypes from "prop-types";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  let storedAuthor, storedReader;

  try {
    storedAuthor = JSON.parse(localStorage.getItem("author")) || {};
    storedReader = JSON.parse(localStorage.getItem("reader")) || {};
  } catch (error) {
    console.error("Error parsing local storage data", error);
    storedAuthor = {};
    storedReader = {};
  }

  const [authorLogin, setAuthorLogin] = useState({
    authorId: storedAuthor.authorId || null,
    authorToken: storedAuthor.authorToken || null,
    authorEmail: storedAuthor.authorEmail || null,
    profileImg: storedAuthor.profileImg || null,
  });

  const [readerLogin, setReaderLogin] = useState({
    readerId: storedReader.readerId || null,
    readerToken: storedReader.readerToken || null,
    readerEmail: storedReader.readerEmail || null,
    profileImg: storedReader.profileImg || null,
  });

  console.log(authorLogin, "Author login from context");
  console.log(readerLogin, "Reader login from context");

  return (
    <MyContext.Provider value={{ authorLogin, setAuthorLogin, readerLogin, setReaderLogin }}>
      {children}
    </MyContext.Provider>
  );
};

MyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MyContext, MyProvider };
