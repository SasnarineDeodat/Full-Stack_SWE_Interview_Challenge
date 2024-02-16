import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Data() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <h1 className="text-4xl font-semibold text-center mt-4">
        We have extracted Data from your Driver's License
      </h1>
      {location.state && (
        <img src={location.state?.image} alt="Your Drivers License" />
      )}
    </div>
  );
}
