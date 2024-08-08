import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { ReaderLogin } from "./ReaderSide/readerPages/Login/ReaderLogin";
import { ReaderSignup } from "./ReaderSide/readerPages/SignUp/ReaderSignup";
import { AuthorLogin } from "./AuthorSide/authorPages/Login/AuthorLogin";
import { AuthorSignup } from "./AuthorSide/authorPages/Signup/AuthorSignup";
import { AuthorLandingPage } from "./AuthorSide/authorPages/AuthorLandingPage/AuthorLandingPage";
import { ReaderPrivateRouter } from "./ReaderSide/readerComponents/ReaderPrivateRouter/ReaderPrivateRoter";
import { BookDetails } from "./ReaderSide/readerPages/BookDetails/BookDetails";
import { AuthorPrivateRouter } from "./AuthorSide/authorComponents/authorPrivateRouter/AuthorPrivateRouter";
import { BooksReviews } from "./AuthorSide/authorPages/BookReviews/BookReviews";

export const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/readerLogin" element={<ReaderLogin />} />
        <Route path="/readerSignup" element={<ReaderSignup />} />
        <Route
          path="/bookDetails/:bookId"
          element={
            <ReaderPrivateRouter>
              <BookDetails />
            </ReaderPrivateRouter>
          }
        ></Route>

        {/* Author  */}
        <Route path="/authorLogin" element={<AuthorLogin />} />
        <Route path="/authorSignup" element={<AuthorSignup />} />
        <Route
          path="/authorLandingPage"
          element={
            <AuthorPrivateRouter>
              <AuthorLandingPage />
            </AuthorPrivateRouter>
          }
        />
        <Route
          path="/reviews"
          element={
            <AuthorPrivateRouter>
              <BooksReviews />
            </AuthorPrivateRouter>
          }
        />
      </Routes>
    </>
  );
};
