'use client';

import Header from '../header'; 
import Footer from '../footer'; 


export default function DerivChart() {
    const proxyUrl = '/api/proxy?url=https://app.deriv.com/dtrader?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=accumulator';

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div>
      <iframe src={proxyUrl} width="600" height="400" title="Embedded Page"></iframe>
    </div>
      
      <Footer />
    </div>
  );
}


