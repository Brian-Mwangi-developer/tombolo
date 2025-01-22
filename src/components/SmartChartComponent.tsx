'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  const [chartType, setChartType] = useState<string>('candles');
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

  useEffect(() => {
    DerivAPI.initConnection();

    const setupChart = async () => {
        try {
            const activeSymbolsResponse = await DerivAPI.sendRequest({
                active_symbols: 'brief',
                product_type: 'basic'
            });

            console.log('Active Symbols:', activeSymbolsResponse);

            // Verify if the symbol exists
            const symbolExists = (activeSymbolsResponse as { active_symbols: { symbol: string }[] }).active_symbols.some(sym => sym.symbol === symbol);
            if (!symbolExists) {
                console.error('Symbol does not exist:', symbol);
                return;
            }

            // Subscribe to ticks for the current symbol
            const unsubscribeTicks = DerivAPI.subscribe({ ticks: symbol }, (data) => {
                if (data.tick) {
                    console.log('New tick data:', data.tick);
                    // Update your chart with the new tick data
                }
            });

            // Request historical ticks
            const historicalTicksResponse = await DerivAPI.sendRequest({
                ticks_history: symbol,
                adjust_start_time: 1,
                count: 1000,
                end: 'latest',
                start: 1,
                style: 'candles',
                subscribe: 1
            });

            console.log('Historical Ticks Response:', historicalTicksResponse);

            // Return unsubscribe function for cleanup
            return () => {
                unsubscribeTicks(); // Clean up ticks subscription
            };
        } catch (error) {
            console.error('Error setting up chart:', error);
        }
    };

    const unsubscribePromise = setupChart();

    return () => {
        unsubscribePromise.then(unsubscribe => {
            if (unsubscribe) {
                unsubscribe(); // Clean up subscription
            }
        });
    };
}, [symbol, granularity]);

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
        isMobile={false}
        enableRouting={false}
        enabledNavigationWidget={true}
        theme={theme}
        chartStatusListener={handleChartReady}
        requestAPI={requestAPI}
        enabledChartFooter={true}
        refreshActiveSymbols={true}
        topWidgets={() => (
          <div style={{
            padding: '10px',
            borderBottom: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`
          }}>
            <ChartTitle 
              enabled 
              onChange={handleSymbolChange} 
              open_market={null}
            />
          </div>
        )}
        toolbarWidget={() => (
          <ToolbarWidget>
            <ChartMode
              onChartType={handleChartTypeChange}
              onGranularity={handleGranularityChange}
            />
            <Views 
              onChartType={handleChartTypeChange} 
              onGranularity={handleGranularityChange}
            />
            <StudyLegend />
            <DrawTools />
            <Share />
            <ChartSetting />
          </ToolbarWidget>
        )}
      />
      
      {!isChartReady && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: theme === 'dark' ? '#404040' : '#f0f0f0',
          color: theme === 'dark' ? '#ffffff' : '#000000',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div className="loading-spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          Loading chart...
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SmartChartComponent;