'use client';
import Header from '../header';

import React from 'react';
import SmartChartComponent from '../../components/SmartChartComponent';

const DerivChartPage: React.FC = () => {
  return (
    <div className="chart-page-container">
      <Header />
      <h1 className="text-center my-4">Deriv Smart Chart</h1>
      <SmartChartComponent />
    </div>
  );
};

export default DerivChartPage;









