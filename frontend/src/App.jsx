import "./index.css";
import { MainRoutes } from "./MainRoutes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function App() {
  return (
    <div>
      <ToastContainer position="top-center" />
      <MainRoutes />
    </div>
  );
}

// export default App;
