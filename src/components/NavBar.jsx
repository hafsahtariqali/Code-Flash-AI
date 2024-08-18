"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Import Link from next/link
import MenuIcon from '../assets/icons/menu.svg';
import CloseIcon from '../assets/icons/x.svg';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='bg-transparent'>
      <div className='px-4'>
        <div className='py-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/' className='text-white font-bold text-lg'>
            {user ?   "Welcome," + user.username : "CodeFlash"}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div
            className='border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden cursor-pointer'
            onClick={toggleMenu}
          >
            {isMenuOpen ? <CloseIcon className='text-white' /> : <MenuIcon className='text-white' />}
          </div>

          {/* Desktop menu */}
          <nav className='text-white flex gap-6 items-center hidden sm:flex'>
            <SignedOut>
              <Link href='/#hero' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Home
              </Link>
              <Link href='/#features' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Features
              </Link>
              <Link href='/#pricings' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Pricing
              </Link>
              <Link href='/#contact' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Contact
              </Link>
              <Link href='/sign-in' className='bg-white py-2 px-4 text-black rounded-lg'>
                Get Started
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href='/' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Home
              </Link>
              <Link href='/dashboard' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Dashboard
              </Link>
              <Link href='/savedCards' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Saved
              </Link>
              <Link href='/plan' className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Plan
              </Link>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-center transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} sm:hidden z-50`}
      >
        {/* Close button */}
        <div
          className='absolute top-4 right-4 cursor-pointer'
          onClick={toggleMenu}
        >
          <CloseIcon className='text-white h-8 w-8' />
        </div>

        <SignedOut>
          <Link href='/#hero' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
            Home
          </Link>
          <Link href='/#features' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
            Features
          </Link>
          <Link href='/#pricings' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
            Pricing
          </Link>
          <Link href='/#contact' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
                Contact
              </Link>
          <Link href='/sign-in' className='bg-white py-2 px-4 text-black rounded-lg' onClick={toggleMenu}>
            Get Started
          </Link>
        </SignedOut>

        <SignedIn>
          <Link href='/' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
            Home
          </Link>
          <Link href='/dashboard' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
            Dashboard
          </Link>
          <Link href='/savedCards' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
            Saved
          </Link>
          <Link href='/plan' className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={toggleMenu}>
            Plan
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default NavBar;
