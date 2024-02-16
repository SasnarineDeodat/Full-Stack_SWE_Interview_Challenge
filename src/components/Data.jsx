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
      <div className="flex justify-center mt-8">
        {location.state && (
          <img
            className="max-w-xl rounded-md"
            src={location.state?.image}
            alt="Your Drivers License"
          />
        )}
      </div>
      <h1 className="text-4xl font-semibold text-center mt-4">Your Data</h1>
      <div className="md:mx-14 mt-5">
        <ul>
          <li className="text-xl font-semibold pb-4">
            Name: {location.state?.name}
          </li>
          <li className="text-xl font-semibold pb-4">
            DOB: {location.state?.dob}
          </li>
          <li className="text-xl font-semibold pb-4">
            Address: {location.state?.address}
          </li>
          <li className="text-xl font-semibold pb-4">
            License Number: {location.state?.licenseNumber}
          </li>
          <li className="text-xl font-semibold pb-4">
            Expiry Date: {location.state?.expiryDate}
          </li>
        </ul>
      </div>
    </div>
  );
}
