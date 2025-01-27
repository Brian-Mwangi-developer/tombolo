// src/app/derivchart/page.tsx
import React from "react";
import Circles from "@/components/Circles";
import SmartChartComponent from "@/components/SmartChartComponent";
import Header from "../header";
import Footer from "../footer";

const DerivChartPage = () => {
  return (
    <div className="">
      <Header />
      <div className="" >
       <div className="absolute z-20 bottom-10 -ml-5 mb-9 left-1/2 transform -translate-x-1/2 bg-transparent">

       <Circles />
       </div>
    
      <SmartChartComponent />

      </div>
     
      
      <Footer />
    </div>
  );
};

export default DerivChartPage;







