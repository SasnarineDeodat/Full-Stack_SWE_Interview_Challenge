import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Data({ image }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!image) {
      navigate("/");
    }
  }, [image]);
  return (
    <div>
      <img src={image} alt="Your Drivers License" />
    </div>
  );
}
