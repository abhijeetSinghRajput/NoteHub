import React from 'react'
import { ModeToggle } from "./mode-toggle.jsx";
import { Button } from './ui/button.jsx';
import { Link } from "react-router-dom";
import { Github, User } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"



const Navbar = () => {
  const { authUser } = useAuthStore();
  return (
    <header className='bg-background fixed top-0 left-0 w-full border-b'>
      <div className="container h-14 m-auto flex justify-between items-center">
        <div className='flex gap-6'>
          <div className='flex gap-2 font-bold'>
            <Link className='logo' to='/'>N0teHub</Link>
          </div>
          <nav className='flex gap-6'>
            <Link to='/' className='hover:text-foreground/60 transition-colors'>Settings</Link>
            <Link to='/' className='hover:text-foreground/60 transition-colors'>Settings</Link>
            <Link to='/' className='hover:text-foreground/60 transition-colors'>Settings</Link>
            <Link to='/' className='hover:text-foreground/60 transition-colors'>Settings</Link>
            <Link to='/Settings' className='hover:text-foreground/60 transition-colors'>Settings</Link>
          </nav>
        </div>
        <div className='flex gap-2 items-center'>
          <Button variant="outline" size="icon">
            <a href="https://github.com/abhijeetSinghRajput/">
              <Github />
            </a>
          </Button>
          <ModeToggle />
          {(authUser &&
            <Link to='/profile'>
              <Avatar>
                <AvatarImage src={authUser?.avatar} alt={authUser?.userName} />
                <AvatarFallback>
                  {authUser?.fullName.split(/\s+/).map(w => w[0].toUpperCase()).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar