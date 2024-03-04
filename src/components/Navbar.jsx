import React, { useState } from 'react'
import logo from '../assets/logo.png';
import DarkMode from './DarkMode';
import { Button } from '@material-tailwind/react';
import DialogBox from './DialogBox';
import { Outlet } from 'react-router';

export default function Navbar() {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <div>
        <div className='flex px-3 md:px-8 py-2 items-center'>
            <div className='flex-1'>
                <img src={logo} alt="DL Extractor" />
            </div>
            <div>
                <Button className="py-1 px-6 w-fit text-white font-semibold text-lg bg-blue-500 rounded-md transition-all duration-300 hover:bg-blue-400 capitalize" data-ripple-light="true" data-dialog-target="animated-dialog" onClick={handleOpen}>Extract Data</Button>
                <DialogBox open={open} handleOpen={handleOpen} />
            </div>
            <DarkMode />
        </div>
        <Outlet />
    </div>
  )
}
