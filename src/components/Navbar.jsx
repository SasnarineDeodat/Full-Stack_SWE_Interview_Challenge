import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <div className="flex px-3 md:px-8 py-2">
      <div className="flex-1">
        <img src={logo} alt="DL Extractor" />
      </div>
    </div>
  );
}
