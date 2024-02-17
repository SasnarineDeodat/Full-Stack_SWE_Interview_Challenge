import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import DialogBox from "./DialogBox";

export default function Data() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

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
            className="w-full max-w-xl rounded-md px-5"
            src={location.state?.image}
            alt="Your Drivers License"
          />
        )}
      </div>
      <h1 className="text-4xl font-semibold text-center mt-4">Your Data</h1>
      <div className="md:mx-14 mt-5 mx-5">
        <p>{location.state?.data}</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <p>Data Not Correct? </p>
        <Button
          className="my-6 py-1 px-6 border-blue-500 border-2 w-fit text-blue-500 font-semibold text-xl bg-transparent rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white capitalize"
          data-ripple-light="true"
          data-dialog-target="animated-dialog"
          onClick={handleOpen}
        >
          Try Again
        </Button>
      </div>
      <DialogBox open={open} handleOpen={handleOpen} />
    </div>
  );
}
