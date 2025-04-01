import React from 'react'
import FetchProfilePicture from '../components/fetchProfilePicture/FetchProfilePicture'
import profile from '../assets/images/profile.jpg'
import { useEffect, useState } from "react";

const Home = ( {user}) => {
  const [profilePic, setProfilePic] = useState(profile); // Default image initially
  useEffect(() => {
    const fetchPic = async () => {
      if (user?._id) {
        const imgSrc = await FetchProfilePicture(user._id);
        setProfilePic(imgSrc);
      }
    };
    fetchPic();
  }, [user]);
  
  return (
    <>
      <div className="relative min-h-[200vh] w-full overflow-hidden ">
{/* 

        <div className="flex font-[font1] justify-center items-center absolute top-0 left-0 backimg w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.pexels.com/photos/10646410/pexels-photo-10646410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')` }}>  
        <div className="text">
          <h1 className="text-6xl font-bold text-white text-center">Welcome, {user.username}!</h1>

        </div>
        </div>
        */}
      </div>
    </>
  )
}

export default Home