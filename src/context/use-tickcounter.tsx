"use client";

import { useContext, createContext, useState, useEffect } from "react";

interface TickCounterContext {
  tickCounter: number;
  setTickCounter: (tickCounter: number) => void;
  tickHistory: string[]; // Change to string array to preserve decimal precision
  setTickHistory: (tickHistory: string[]) => void; // Array to track tick history
  addToTickHistory: (tick: string) => void; // Function to add to tick history
  digitPercentages: Record<number, number>; // Percentage of occurrences for digits 0-9
}

const initialValues: TickCounterContext = {
  tickCounter: 0,
  setTickCounter: () => {},
  tickHistory: [],
  setTickHistory: () => {},
  addToTickHistory: () => {},
  digitPercentages: {},
};

const tickCounterContext = createContext<TickCounterContext>(initialValues);
const { Provider } = tickCounterContext;

export const TickCounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickCounter, setTickCounter] = useState<number>(initialValues.tickCounter);
  const [tickHistory, setTickHistory] = useState<string[]>(() => {
    // Retrieve tick history from localStorage
    const storedHistory = localStorage.getItem("tickHistory");
    return storedHistory ? JSON.parse(storedHistory) : initialValues.tickHistory;
  });
  const [digitPercentages, setDigitPercentages] = useState<Record<number, number>>(() => {
    // Retrieve digit percentages from localStorage
    const storedPercentages = localStorage.getItem("digitPercentages");
    return storedPercentages ? JSON.parse(storedPercentages) : initialValues.digitPercentages;
  });

  const addToTickHistory = (tick: string) => {
    setTickHistory((prev) => {
      const updatedHistory = [...prev, tick];
      if (updatedHistory.length > 1000) {
        updatedHistory.shift(); // Remove the oldest tick
      }
      // Save the updated history to localStorage
      localStorage.setItem("tickHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  useEffect(() => {
    const calculatePercentages = () => {
      const digitCounts: Record<number, number> = {};

      // Initialize digit counts
      for (let digit = 0; digit <= 9; digit++) {
        digitCounts[digit] = 0;
      }

      // Log tick history for debugging
      // console.log("Tick History:", tickHistory);

      tickHistory.forEach((tick) => {
        // Get the last digit of the string
        const lastDigit = parseInt(tick.slice(-1), 10);
        if (!isNaN(lastDigit)) {
          digitCounts[lastDigit] += 1;
        }
      });

      const totalTicks = tickHistory.length;
      const percentages: Record<number, number> = {};

      // Calculate percentages
      for (let digit = 0; digit <= 9; digit++) {
        const count = digitCounts[digit];
        percentages[digit] = totalTicks > 0 ? parseFloat(((count / totalTicks) * 100).toFixed(2)) : 0;
      }

      // console.log("Digit Percentages:", percentages); // Debugging log
      setDigitPercentages(percentages);
      // Save the updated percentages to localStorage
      localStorage.setItem("digitPercentages", JSON.stringify(percentages));
    };

    calculatePercentages();
  }, [tickHistory]);

  return (
    <Provider
      value={{
        tickCounter,
        setTickCounter,
        tickHistory,
        setTickHistory,
        addToTickHistory,
        digitPercentages,
      }}
    >
      {children}
    </Provider>
  );
};

export const useTickCounterContext = () => useContext(tickCounterContext);

