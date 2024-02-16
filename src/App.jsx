import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import WebcamCapture from "./components/WebcamCapture";

const App = () => {
  return (
    <div className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white w-full h-full min-h-screen">
      <Navbar />
      <HeroSection />
      <WebcamCapture />
    </div>
  );
};
export default App;
