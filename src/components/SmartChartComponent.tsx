'use client';
import React, { useState, useCallback, useRef, useEffect, use } from 'react';
import {
  SmartChart,
  ChartTitle,
  ChartMode,
  Views,
  StudyLegend,
  DrawTools,
  Share,
  createObjectFromLocalStorage,
  ToolbarWidget,
} from '@deriv/deriv-charts';
import { DerivAPI } from '../utils/derivApi';
import { useTickCounterContext } from '@/context/use-tickcounter';



const SmartChartComponent: React.FC = () => {
  const isMobile = window.navigator.userAgent.toLowerCase().includes('mobi');
  const [symbol, setSymbol] = useState<string>('R_100');
  const [granularity, setGranularity] = useState<number>(0);
  const [chartType, setChartType] = useState<string>('line');
  const { tickCounter, setTickCounter, tickHistory, setTickHistory, digitPercentages } = useTickCounterContext();
  const subscriptionRef = useRef<string | null>(null); // Track the current subscription ID
  const isUnsubscribingRef = useRef(false);



  function getServerUrl() {
    const local = localStorage.getItem('config.server_url');
    return `wss://${local || 'red.derivws.com'}/websockets/v3`;
}
  const chartId = '1'; // Fixed chart ID
  const appId = localStorage.getItem('config.app_id') || '12812'; // Ensure appId is a string
  const serverUrl = getServerUrl()
  


    const ref = React.useRef(null);
    const getIsChartReady = (isChartReady: boolean) => isChartReady;






  // API call function
  const requestAPI = (request: any) => {
    try {
      const response = DerivAPI.sendRequest(request);
      console.log('API response received:', response);
      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };



  
  
// Streaming subscription
const getDecimalPlaces = (value: string) => {
  const parts = value.split(".");
  return parts.length === 2 ? parts[1].length : 0;
};

const formatTick = (tick: string, decimalPlaces: number) => {
  const currentDecimals = getDecimalPlaces(tick);
  if (currentDecimals < decimalPlaces) {
    // Add trailing zeros if necessary
    return `${tick}${"0".repeat(decimalPlaces - currentDecimals)}`;
  } else if (currentDecimals > decimalPlaces) {
    // Truncate extra decimal places if necessary
    const [integerPart, decimalPart] = tick.split(".");
    return `${integerPart}.${decimalPart.slice(0, decimalPlaces)}`;
  }
  return tick; // No change needed
};

const requestSubscribe = useCallback(
  (request: Record<string, unknown>, callback: (response: any) => void) => {
    const subscription = DerivAPI.requestSubscribe(request, (response: any) => {
      console.log("API response received to Kiongozi:", response);

      if (response.subscription?.id) {
        subscriptionRef.current = response.subscription.id;
        console.log("New subscription ID:", response.subscription.id);
      }

      if (response.history?.prices && Array.isArray(response.history.prices)) {
        // Extract last 1000 historical ticks
        const historicalTicks = response.history.prices
          .slice(-1000)
          .map((price: number) => price.toString());

        // Detect the max decimal places in history
        const maxDecimals = Math.max(...historicalTicks.map(getDecimalPlaces));

        // Format all ticks to match the highest decimal places
        const formattedHistory = historicalTicks.map((tick) =>
          formatTick(tick, maxDecimals)
        );

        setTickHistory(formattedHistory);
        console.log("Fetched 1000 historical ticks:", formattedHistory);
      }

      if (response.tick?.quote) {
        const formattedQuote = response.tick.quote.toString();

        setTickHistory((prev: string[]) => {
          // Combine previous history with the new tick
          const allTicks = [...prev, formattedQuote];

          // Detect the max decimal places in updated history
          const maxDecimals = Math.max(...allTicks.map(getDecimalPlaces));

          // Format all values to match the highest decimal places
          const updatedHistory = allTicks.map((tick) =>
            formatTick(tick, maxDecimals)
          );

          // Keep history at 1000 ticks
          if (updatedHistory.length > 1000) updatedHistory.shift();

          console.log("Updated tickHistory:", updatedHistory);
          setTickCounter(formattedQuote);
          return updatedHistory;
        });
      }

      if (response.tick?.symbol) {
        console.log("Tick symbol:", response.tick.symbol);
      }

      callback(response);
    });

    return subscription;
  },
  [setTickHistory, setTickCounter]
);



  const requestForget = useCallback((request: any, callback: (response: any) => void): void => {
  console.log('🔄 requestForget called. Checking subscriptionRef:', subscriptionRef.current);

  // Ensure there is a valid subscription ID before proceeding
  if (!subscriptionRef.current) {
    console.warn('⚠️ No subscription ID found to forget.');
    callback({ error: 'No subscription ID' });
    return;
  }

  const unsubscribeRequest = { forget: subscriptionRef.current, ...request };
  const oldSubscription = subscriptionRef.current;
  
  console.log('📤 Sending forget request for subscription:', oldSubscription);

  DerivAPI.requestForget(unsubscribeRequest, (response: any) => {
    console.log('📩 Received response from DerivAPI.requestForget:', response);

    if (response.error) {
      console.error('❌ Error forgetting subscription:', response.error);
    } else {
      console.log('✅ Subscription forgotten successfully:', oldSubscription);
      subscriptionRef.current = null; // Clear the subscription only after successful unsubscription
    }
    callback(response);
  });
}, [])


  

// Handle symbol change and ensure previous subscription is forgotten before subscribing to a new one

const handleSymbolChange = (newSymbol: string) => {
  console.log('🔄 handleSymbolChange called with newSymbol:', newSymbol);
  console.log('🔍 Current subscriptionRef before forgetting:', subscriptionRef.current);

  if (subscriptionRef.current) {
    console.log('🔄 Attempting to forget subscription:', subscriptionRef.current);

    const oldSubscription = subscriptionRef.current; // Store the old subscription ID

    requestForget({ forget: oldSubscription }, (response) => {
      console.log('📩 Response from requestForget:', response);

      if (!response.error) {
        console.log(`✅ Forgot subscription: ${oldSubscription}. Now subscribing to: ${newSymbol}`);
        subscriptionRef.current = null; // Clear previous subscription
        setSymbol(newSymbol);

        // Now subscribe to the new symbol AFTER the previous one is forgotten
        requestSubscribe({ symbol: newSymbol }, (response) => {
          console.log('📩 Response from requestSubscribe:', response);

          if (response?.subscription?.id) {
            subscriptionRef.current = response.subscription.id;
            console.log('✅ New subscription ID For KiongoziKOKO:', response.subscription.id);
          } else {
            console.warn('⚠️ No subscription ID received from requestSubscribe. Full response:', response);
          }
        });
      } else {
        console.error('❌ Failed to forget subscription:', response.error);
      }
    });
  } else {
    console.log('⚠️ No active subscription found. Subscribing to:', newSymbol);
    setSymbol(newSymbol);

    // Only subscribe if there is no active subscription
    requestSubscribe({ symbol: newSymbol }, (response) => {
      console.log('📩 Response from requestSubscribe:', response);

      if (response?.subscription?.id) {
        subscriptionRef.current = response.subscription.id; // Store new subscription ID
        console.log(`✅ Subscribed to new symbol: ${newSymbol} with ID: ${response.subscription.id}`);
      } else {
        console.warn('⚠️ No subscription ID received from requestSubscribe. Full response:', response);
      }
    });
  }
};




  


  return (
    <div>
      <div
        
        style={{
          display: 'flex',
          top: '100px',
          right: '100px',
          zIndex: 50,
        }}
      >

      <SmartChart
        
        ref={ref}
        id={chartId}
        chartStatusListener={(isChartReady: boolean) => getIsChartReady(isChartReady)}
        symbol={symbol}
        granularity={granularity}
        isMobile={true}
        requestAPI={requestAPI}
        requestSubscribe={requestSubscribe}
        requestForget={requestForget}
        crosshairTooltipLeftAllow={660}
        isLive

        getIndicatorHeightRatio={(chart_height: number, indicator_count: number) => {
                const isSmallScreen = chart_height < 780;
                const denominator = indicator_count >= 5 ? indicator_count : indicator_count + 1;
                const reservedHeight = isMobile ? 100 : 320;
                const indicatorsHeight = Math.round(
                    (chart_height - (reservedHeight + (isSmallScreen ? 20 : 0))) / denominator
                );
                return {
                    height: indicatorsHeight,
                    percent: indicatorsHeight / chart_height,
                };
            }}

        topWidgets={() => (
          <div
            style={{
              display: 'flex',
              alignItems: 'left',
              width: '1000px',
              height: '30px',
              marginTop: '100px',
              position: 'absolute',
            }}
          >
           <div style={{ fontSize: '8px', padding: '12px' }}>
               <ChartTitle onChange={handleSymbolChange}  />
            </div>
          </div>
        )}
        toolbarWidget={() => (
          <div style={{ top: '110px', display: 'flex', position: 'absolute' }}>
            <ToolbarWidget>
              <ChartMode />
              <Views />
              <StudyLegend />
              <DrawTools />
              <Share />
            </ToolbarWidget>
          </div>
        )}
      />
      </div>
    </div>
  );
};

export default SmartChartComponent;



