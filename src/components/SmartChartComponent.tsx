'use client'
import React, { useState, useCallback, useRef } from 'react';
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
import { useTickCounterContext } from '@/context/use-tickcounter';

const SmartChartComponent: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('R_10');
  const [granularity, setGranularity] = useState<number>(0);
  const [chartType, setChartType] = useState<string>('line');
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [highPrice, setHighPrice] = useState<number>(100);
  const [lowPrice, setLowPrice] = useState<number>(50);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const isMobile = window.navigator.userAgent.toLowerCase().includes('mobi');
  const { tickCounter, setTickCounter, tickHistory, setTickHistory, digitPercentages } = useTickCounterContext();
  const subscriptionRef = useRef<string | null>(null); // To track the current subscription ID

  // Single API call function
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

  // Streaming subscription
  const requestSubscribe = useCallback(
  (request: Record<string, unknown>, callback: (response: any) => void) => {
    const subscription = DerivAPI.requestSubscribe(request, (response: any) => {
      if (response.subscription?.id) {
        const newSubscriptionId = response.subscription.id;
        subscriptionRef.current = newSubscriptionId; // Save the subscription ID
        console.log('New subscription ID:', newSubscriptionId);
      }

      // Handle tick data
      if (response.tick?.quote) {
        setTickHistory((prev: [any]) => {
          const updatedHistory = [...prev, response.tick.quote];
          if (updatedHistory.length > 1000) {
            updatedHistory.splice(0, updatedHistory.length - 1000); // Limit history size
          }
          setTickCounter(response.tick.quote);
          return updatedHistory;
        });
      }

      callback(response);
    });

    return subscription;
  },
  [setTickHistory, setTickCounter]
);

  // Forgetting subscription
const requestForget = useCallback((callback: (response: any) => void) => {
  const currentSubscriptionId = subscriptionRef.current;
  if (currentSubscriptionId) {
    const request = { forget: currentSubscriptionId }; // Format request to match DerivAPI
    console.log('Forgetting subscription:', currentSubscriptionId);

    DerivAPI.requestForget(request, callback);
  } else {
    console.error('No subscription ID found to forget.');
  }
}, []);




  const handleSymbolChange = useCallback(
  async (newSymbol: string) => {
    console.log('Symbol changed to:', newSymbol);

    // Forget the previous subscription
    await requestForget((response) => {
      console.log('Forget response:', response);
    });

    // Reset chart data
    setSymbol(newSymbol);
    setTickHistory([]);

    // Subscribe to the new symbol
    requestSubscribe({ ticks: newSymbol }, (response) => {
      console.log('Subscription response for new symbol:', response);
    });
  },
  [requestForget, requestSubscribe, setSymbol, setTickHistory]
);





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

  console.log("History:", tickHistory);
  console.log("Digit Percentages:", digitPercentages);

  return (
    <div>
      <div
        className="chart-controls"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 50,
        }}
      >
      </div>

      <div>
        <SmartChart
          key={symbol}
          id="deriv_chart"
          style={{ width: '80%', height: '400px' }}
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
                <ChartTitle
                  enabled={true}
                  onChange={handleSymbolChange}
                  open_market={null}
                />
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















