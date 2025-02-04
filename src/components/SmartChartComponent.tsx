'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SmartChart, ChartTitle, ChartMode, ToolbarWidget } from '@deriv/deriv-charts';
import { DerivAPI } from '../utils/derivApi';
import { useTickCounterContext } from '@/context/use-tickcounter';

const SmartChartComponent: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('R_100');
  const [granularity, setGranularity] = useState<number>(0);
  const [chartType, setChartType] = useState<string>('line');
  const { setTickCounter, setTickHistory } = useTickCounterContext();
  const subscriptionRef = useRef<string | null>(null); // Track the current subscription ID
  
  
  // API call function
  const requestAPI = (request: any) => {
  if (subscriptionRef.current) {
    console.log("Active subscription exists:", subscriptionRef.current);
  } else {
    console.log("No active subscription found. You need to subscribe first.");
  }

  console.log("The Request API is called FALA", request);

  const responsePromise = DerivAPI.sendRequest(request);

  responsePromise
    .then(response => {
      console.log('API response received FALA:', response);
    })
    .catch(error => {
      console.error('API request error:', error);
    });

  return responsePromise;
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
        console.log("API response received to Kiongozi:", request);

        if (response.subscription?.id) {
          subscriptionRef.current = response.subscription.id;
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
        }

        if (response.tick?.quote) {
          const formattedQuote = response.tick.quote.toString();

          setTickHistory((prev: string[]) => {
            const allTicks = [...prev, formattedQuote];
            const maxDecimals = Math.max(...allTicks.map(getDecimalPlaces));
            const updatedHistory = allTicks.map((tick) =>
              formatTick(tick, maxDecimals)
            );

            if (updatedHistory.length > 1000) updatedHistory.shift();

            setTickCounter(formattedQuote);
            return updatedHistory;
          });
        }

        callback(response);
      });

      return subscription;
    },
    [setTickHistory, setTickCounter]
  );



  const requestForget = useCallback((request: any, callback: (response: any) => void): void => {
    if (!subscriptionRef.current) {
      console.warn('No subscription ID found to forget.');
      callback({ error: 'No subscription ID' });
      return;
    }

    const unsubscribeRequest = { forget: subscriptionRef.current, ...request };
    const oldSubscription = subscriptionRef.current;

    DerivAPI.requestForget(unsubscribeRequest, (response: any) => {
      if (response.error) {
        console.error('Error forgetting subscription:', response.error);
      } else {
        subscriptionRef.current = null;

        if (DerivAPI.connection && DerivAPI.connection.readyState === WebSocket.OPEN) {
          DerivAPI.connection.close();
        }
      }
      callback(response);
    });
  }, []);



  const handleSymbolChange = (newSymbol: string) => {
    if (subscriptionRef.current) {
      const oldSubscription = subscriptionRef.current;

      requestForget({ forget: oldSubscription }, (response) => {
        if (!response.error) {
          subscriptionRef.current = null;
          setSymbol(newSymbol);
          requestSubscribe({ symbol: newSymbol }, (response) => {
            if (response?.subscription?.id) {
              subscriptionRef.current = response.subscription.id;
            }
          });
        }
      });
    } else {
      setSymbol(newSymbol);
      requestSubscribe({ symbol: newSymbol }, (response) => {
        if (response?.subscription?.id) {
          subscriptionRef.current = response.subscription.id;
        }
      });
    }
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'row', zIndex: 50 }}>
      <SmartChart
        symbol={symbol}
        isMobile={true}
        requestAPI={requestAPI}
        requestSubscribe={requestSubscribe}
        requestForget={requestForget}
        isLive
        topWidgets={() => (
          <div style={{ display: 'flex', alignItems: 'left', width: '1000px', height: '30px', marginTop: '100px' }}>
            <div style={{ padding: '7px', display: 'flex', zIndex: 50, width: window.innerWidth <= 600 ? '350px' : '400px', fontSize: window.innerWidth <= 600 ? '8px' : '10px' }}>
              <ChartTitle onChange={handleSymbolChange} isNestedList={false} open_market={{ category: 'derived', subcategory: 'synthetics' }} />
            </div>
          </div>
        )}
        toolbarWidget={() => (
          <div style={{ top: '110px', display: 'flex', position: 'absolute' }}>
            <ToolbarWidget>
              <ChartMode />
            </ToolbarWidget>
          </div>
        )}
      />
    </div>
  );
};

export default SmartChartComponent;




