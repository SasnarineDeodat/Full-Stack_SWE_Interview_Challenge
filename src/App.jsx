import "./App.css";
import Data from "./components/Data";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        index: true,
        element: <HeroSection />,
      },
      {
        path: 'data',
        element: <Data />,
      }
    ]
  },
]);

const App = () => {
  return (
    <div className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white w-full h-full min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
};
export default App;
