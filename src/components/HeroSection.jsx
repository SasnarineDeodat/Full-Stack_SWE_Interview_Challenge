import React, { useState } from 'react'
import hero_image_dark from '../assets/hero_image_dark.png';
import hero_image_light from '../assets/hero_image_light.png';
import { Button } from '@material-tailwind/react';
import DialogBox from './DialogBox';

export default function HeroSection() {
    
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <div className='flex flex-col items-center'>
        <h1 className='text-4xl font-semibold text-center mt-4'>Scan your Driver's License and extract all details</h1>
        <img src={hero_image_dark} alt="DL Extractor" className='w-3/4 min-w-64 md:w-3/5 lg:w-1/2 mt-6 dark:block hidden' />
        <img src={hero_image_light} alt="DL Extractor" className='w-3/4 min-w-64 md:w-3/5 lg:w-1/2 mt-6 dark:hidden block' />
        <Button className="my-6 py-2 px-10 border-blue-500 border-2 w-fit text-blue-500 font-semibold text-xl bg-transparent rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white capitalize" data-ripple-light="true" data-dialog-target="animated-dialog" onClick={handleOpen}>Extract Data</Button>
        <DialogBox open={open} handleOpen={handleOpen} />
    </div>
  )
}
