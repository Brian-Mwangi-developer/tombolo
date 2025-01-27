"use client";

import { useContext, createContext, useState, useEffect } from "react";

interface TickCounterContext {
  tickCounter: number;
  setTickCounter: (tickCounter: number) => void;
  tickHistory: number[];
  setTickHistory: (tickHistory: number[]) => void; // Array to track tick history
  addToTickHistory: (tick: number) => void; // Function to add to tick history
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
  const [tickHistory, setTickHistory] = useState<number[]>(initialValues.tickHistory);
  const [digitPercentages, setDigitPercentages] = useState<Record<number, number>>({});

  const addToTickHistory = (tick: number) => {
    setTickHistory((prev) => {
      const updatedHistory = [...prev, tick];
      if (updatedHistory.length > 1000) {
        updatedHistory.shift(); // Remove the oldest tick
      }
      return updatedHistory;
    });
  };

  useEffect(() => {
  const calculatePercentages = () => {
    const digitCounts: Record<number, number> = {};

    for (let digit = 0; digit <= 9; digit++) {
      digitCounts[digit] = 0;
    }

    tickHistory.forEach((tick) => {
      const lastDigit = Math.abs(parseInt(tick.toString().slice(-1), 10));
      digitCounts[lastDigit] += 1;
    });

    const totalTicks = tickHistory.length;
    const percentages: Record<number, number> = {};

    for (let digit = 0; digit <= 9; digit++) {
      const count = digitCounts[digit];
      percentages[digit] = totalTicks > 0 ? parseFloat(((count / totalTicks) * 100).toFixed(2)) : 0;
    }

    console.log("Digit Percentages:", percentages); // Debugging log
    setDigitPercentages(percentages);
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
