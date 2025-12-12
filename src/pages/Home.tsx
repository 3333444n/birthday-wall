import React from 'react';
import BouncingSlide from '../components/Slides/BouncingSlide';

const Home: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <BouncingSlide
        isActive={true}
        duration={0} // Infinite
      />
    </div>
  );
};

export default Home;