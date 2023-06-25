import React from "react";
import logo from "../../public/logo.png";
import Image from "next/image";

export const Landing: React.FC = () => {
  return (
    <div>
      <h1>Worldcoin Email verifier</h1>
      <Image src={logo} alt="Worldcoinemail Logo" />
    </div>
  );
};

export default Landing;
