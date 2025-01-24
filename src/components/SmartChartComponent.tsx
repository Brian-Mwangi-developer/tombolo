'use client'
import React, { useState, useEffect, useCallback } from 'react';
import {
  SmartChart,
  ChartTitle,
  ChartMode,
  Views,
  StudyLegend,
  DrawTools,
  Share,
  ChartSetting,
  ToolbarWidget,
} from '@deriv/deriv-charts';
import { DerivAPI } from '../utils/derivApi';

const SmartChartComponent: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('R_100');
  const [granularity, setGranularity] = useState<number>(60);
  const [chartType, setChartType] = useState<string>('line');
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleSymbolChange = useCallback((newSymbol: string) => {
    console.log('Symbol changed:', newSymbol);
    setSymbol(newSymbol);
  }, []);

  const handleGranularityChange = useCallback((newGranularity: number) => {
    console.log('Granularity changed:', newGranularity);
    setGranularity(newGranularity);
  }, []);

  const handleChartTypeChange = useCallback((newChartType: string) => {
    console.log('Chart type changed:', newChartType);
    setChartType(newChartType);
  }, []);

  const handleChartReady = useCallback((ready: boolean) => {
    console.log('Chart ready state:', ready);
    setIsChartReady(ready);
  }, []);

  

  const requestAPI = useCallback(async (request: Record<string, unknown>) => {
    try {
      const response = await DerivAPI.sendRequest(request);
      console.log('API response:', response);
      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }, []);

   const requestSubscribe = useCallback(
    (request: Record<string, unknown>, callback: (response: any) => void) => {
      const subscription = DerivAPI.requestSubscribe(request, callback);
      return subscription;
    },
    []
  );

  const requestForget = useCallback((subscriptionId: string) => {
  if (!subscriptionId) {
    console.error('Subscription ID is required to unsubscribe.');
    return;
  }

  try {
    DerivAPI.requestForget({ forget: subscriptionId }, (response) => {
      if (response.error) {
        console.error('Error in forget response:', response.error);
      } else {
        console.log('Unsubscribed successfully:', response);
      }
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
  }
}, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="chart-container" style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      transition: 'background-color 0.3s ease'
    }}>
      <div className="chart-controls" style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <SmartChart
  id="deriv_chart"
  symbol={symbol}
  granularity={granularity}
  chartType={chartType}
  isMobile={true}
  enableRouting={false}
  enabledNavigationWidget={true}
  theme={theme}
  chartStatusListener={handleChartReady}
  requestAPI={requestAPI}
  requestSubscribe={requestSubscribe}
  requestForget={requestForget}
  topWidgets={() => (
    <div
      style={{
        padding: '10px',
        borderBottom: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
      }}
    >
      <ChartTitle enabled onChange={handleSymbolChange} open_market={null} />
    </div>
  )}
  toolbarWidget={() => (
    <ToolbarWidget>
      <ChartMode onChartType={handleChartTypeChange} onGranularity={handleGranularityChange} />
      <Views onChartType={handleChartTypeChange} onGranularity={handleGranularityChange} />
      <StudyLegend />
      <DrawTools />
      <Share />
      <ChartSetting />
    </ToolbarWidget>
  )}
/>

    </div>
  );
};

export default SmartChartComponent;










