import hero_image from "../assets/hero_image.png";
import { Button } from "@material-tailwind/react";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-semibold text-center mt-4">
        Scan your Driver's License and extract all details
      </h1>
      <img src={hero_image} alt="DL Extractor" className="w-2/3 mt-6" />
      <Button
        className="my-6 py-2 px-10 border-blue-500 border-2 w-fit text-blue-500 font-semibold text-xl bg-transparent rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white capitalize"
        data-ripple-light="true"
        data-dialog-target="animated-dialog"
      >
        Extract Data
      </Button>
    </div>
  );
}
