// src/app/derivchart/page.tsx
import React from "react";
import SmartChartComponent from "../../components/SmartChartComponent";
import ChartComponent from "@/components/ChartComponent";
import Header from "../header";
import Footer from "../footer";

const DerivChartPage = () => {
  return (
    <div className="">
      <Header />
  
      <SmartChartComponent />
      
      <Footer />
    </div>
  );
};

export default DerivChartPage;







