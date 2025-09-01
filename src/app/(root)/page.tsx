'use client'
import FooterWithLogo from "./components/Footer";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import { useState, useEffect } from "react"
import React from "react"
import { Progress } from "@/components/ui/progress";

const Homepage = () => {
  const [carregar, setCarregar] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setCarregar(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {carregar ? (
        <div className="fixed inset-0 z-50 bg-gradient-to-r from-[#5B0EFB] to-[#C56FFF] flex items-center justify-center">
          <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-purple-600" />
        </div>
      ) : (
        <div className="flex-grow ">
          <Section1 />
          <Section2 />
          {/* <FooterWithLogo /> */}
        </div>
      )}
    </div>
  );
};

export default Homepage;