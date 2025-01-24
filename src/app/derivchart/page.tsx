// src/app/derivchart/page.tsx
import React from "react";
import SmartChartComponent from "../../components/SmartChartComponent";

const DerivChartPage = () => {
  return (
    <div>
      <h1>Live Chart</h1>
      <SmartChartComponent symbol="R_100" />
    </div>
  );
};

export default DerivChartPage;







