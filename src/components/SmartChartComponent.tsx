'use client'; // Use this to enable client-side rendering for components in Next.js 13 App Router
import { useEffect } from 'react';
// import "../../node_modules/@deriv/deriv-charts/dist/smartcharts.css"
// Import CSS from the public folder (without the public prefix)

import { SmartChart } from '@deriv/deriv-charts';

export default function SmartChartComponent() {
  // useEffect(() => {
  //   // Ensure SmartCharts are initialized only on the client side
  //   if (typeof window !== 'undefined') {
  //     // Set the public path for SmartCharts assets
  //     setSmartChartsPublicPath('/');
  //   }
  // }, []); // Empty dependency array ensures this runs once after mount

  const requestAPI = async (request: any) => {
    // Simulate or connect to your real API
    return Promise.resolve({ echo_req: request, msg_type: 'tick', tick: { id: 'tick_id', quote: 1.1234 } });
  };

  const requestSubscribe = (request: any, callback: (arg0: { tick: { quote: number; }; }) => void) => {
    // Example: call callback with dummy data to simulate subscription
    const data = { tick: { quote: Math.random() * 1000 } };
    callback(data);
    // Return an unsubscribe function
    return () => console.log('Unsubscribed from:', request);
  };

  const requestForget = (request: any) => {
    console.log('Forgetting subscription:', request);
  };

  return (
    <SmartChart
      requestAPI={requestAPI}
      requestSubscribe={requestSubscribe}
      requestForget={requestForget}
      symbol="R_100"
      granularity={60}
      isMobile={false}
    />
  );
}



