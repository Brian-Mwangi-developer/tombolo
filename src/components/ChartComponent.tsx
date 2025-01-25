
import React from "react";

const ChartComponent: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        src="https://smarttrader.deriv.com/en/trading?currency=USD&market=synthetics&underlying=R_10&amount_type=stake&formname=overunder&expiry_type=duration&duration_amount=1&duration_units=t&amount=16&prediction=2"
        title="SmartTrader Chart"
        className="w-full h-full border-none"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default ChartComponent;

