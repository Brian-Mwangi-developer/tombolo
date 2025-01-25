'use client'
import React, { useState, useCallback } from 'react';
import {
  SmartChart,
  ChartTitle,
  ChartMode,
  Views,
  StudyLegend,
  BottomWidget,
  DrawTools,
  Share,
  ChartSetting,
  ToolbarWidget,
  fastmarker,
} from '@deriv/deriv-charts';
import { DerivAPI } from '../utils/derivApi';
;

const SmartChartComponent: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('R_10');
  const [granularity, setGranularity] = useState<number>(0);
  const [chartType, setChartType] = useState<string>('line');
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [highPrice, setHighPrice] = useState<number>(100);
  const [lowPrice, setLowPrice] = useState<number>(50);
  const allTicks: keyof AuditDetailsForExpiredContract | [] = [];
  const contractInfo: keyof ProposalOpenContract | {} = {};

  

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
      console.log('API response received to tombolo:', response);
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
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };




  return (

    <div
      className="chart-container"
      style={{
        width: '100vh',
        height: '100vh',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        className="chart-controls"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            marginTop: '100px',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>


      <div>

      <SmartChart
        id="deriv_chart"
        symbol={symbol}
        granularity={granularity}
        chartType={chartType}
        isMobile={true}
        enableRouting={true}
        enabledNavigationWidget={true}
        theme={theme}
        chartStatusListener={handleChartReady}
        requestAPI={requestAPI}
        requestSubscribe={requestSubscribe}
        requestForget={requestForget}
        crosshairTooltipLeftAllow={660}
        shouldFetchTradingTimes
        shouldFetchTickHistory
        isLive
        Online
        enabledChartFooter
        barriers={[
          {
            high: highPrice,
            low: lowPrice,
            color: 'green',
            shade: 'above',
            hidePriceLines: false,
            onChange: (prices: { high: number; low: number }) => {
              console.log('Price changed:', prices);
            },
          },
        ]}
        topWidgets={() => (
          <div
            style={{
              display: 'flex',
              alignItems: 'left',
              width: '300px',
              height: '30px',
              marginTop: '100px',
            }}
          >
            <div style={{ fontSize: '10px' }}>
              <ChartTitle enabled onChange={handleSymbolChange} open_market={null} />
            </div>
          </div>
        )}
        toolbarWidget={() => (
          <div style={{ top: '110px', display: 'flex', position: 'absolute' }}>
            <div>
              <ToolbarWidget>
                <ChartMode onChartType={handleChartTypeChange} onGranularity={handleGranularityChange} />
                <Views onChartType={handleChartTypeChange} onGranularity={handleGranularityChange} />
                <StudyLegend />
                <DrawTools />
                <Share />
              </ToolbarWidget>
            </div>
          </div>
        )}
      />
      </div>
    </div>
    
  );
};

export default SmartChartComponent;














