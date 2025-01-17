'use client';

import Header from '../header'; // Adjust the path if needed
import Footer from '../footer';

export default function DerivChart() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="p-1 md:p-8 mt-20">
        
        
            <div
              className="iframe-container"
              style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                overflow: 'hidden',
              }}
            >
              <iframe
                src="https://api.binarytool.site/"
                title="Deriv Chart"
                className="w-full h-[600px] border-none"
                style={{
                  position: 'absolute',
                  top: '-20px', // Adjust this value to crop the top part
                  left: 0,
                  width: '100%',
                  height: '100%', // Ensure this matches the height you want for the iframe
                }}
                allowFullScreen
              ></iframe>
            </div>
          </div>
    
      <Footer />
    </div>
  );
}

