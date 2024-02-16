import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <div className="flex px-3 md:px-8 py-2 items-center">
      <div className="flex-1">
        <img src={logo} alt="DL Extractor" />
      </div>
      <div>
        <button className="py-1 px-6 w-fit text-white font-semibold text-lg bg-blue-500 rounded-md transition-all duration-300 hover:bg-blue-400">
          Extract Data
        </button>
      </div>
    </div>
  );
}
