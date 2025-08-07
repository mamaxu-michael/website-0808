import React from 'react';
import Image from 'next/image';

const ClimateSealLogo = () => {
  return (
    <div className="flex items-center">
      <Image 
        src="/logo.svg" 
        alt="Climate Seal Logo" 
        width={240}
        height={80}
        className="h-10 w-auto max-w-[240px]"
        priority
      />
    </div>
  );
};

export default ClimateSealLogo;