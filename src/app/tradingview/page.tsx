'use client';
import Header from '../header'; // Adjust the path if needed
import Footer from '../footer';
// @ts-ignore
import React, { useEffect } from 'react';

// Dynamically import SmartChartComponent with no SSR

const DerivPage = () => {
  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (typeof window.TradingView !== 'undefined') {
        // @ts-ignore
        new window.TradingView.widget({
          container_id: 'tradingview-chart',
          autosize: true,
          symbol: 'NASDAQ:AAPL', // Replace with your preferred symbol
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: false, // Details panel disabled
          hotlist: false, // Hotlist disabled
          calendar: false, // Calendar disabled
        });
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script); // Clean up the script when component unmounts
    };
  }, []);

  return (
    <div>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 mt-20 md:mt-28">
        <h1 className="text-3xl font-bold text-white mb-6 mt-6">TradingView Chart</h1>
        <div
          id="tradingview-chart"
          className="w-full max-w-6xl h-[600px] bg-gray-800 rounded-md shadow-md"
        ></div>

       
      </div>
      
      <Footer />
    </div>
  );
};

export default DerivPage;
