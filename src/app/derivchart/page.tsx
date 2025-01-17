'use client';

import Header from '../header';
import Footer from '../footer';
import SmartChartComponent from '../../components/SmartChartComponent'; // Import SmartChartComponent
import {  setSmartChartsPublicPath } from '@deriv/deriv-charts';
import { useEffect } from 'react';

export default function DerivChart() {
  // Define your API proxy URL or use a hardcoded example
  // const proxyUrl = '/api/proxy?url=https://app.deriv.com/dtrader?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=accumulator';
  useEffect(()=>{
    setSmartChartsPublicPath('/dist/')
  })

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="flex justify-center items-center py-10">
        {/* Use SmartChartComponent instead of iframe */}
        <SmartChartComponent />
      </div>
      <Footer />
    </div>
  );
}


