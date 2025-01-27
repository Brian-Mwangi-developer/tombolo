"use client";

import React, { useMemo } from "react";
import { useTickCounterContext } from "@/context/use-tickcounter";

type CircleProps = {
  id: number;
  value: string;
  isHighlighted: boolean;
  borderColor: string;
  isPointer?: boolean;
};

type CircleRowProps = {
  circles: CircleProps[];
  pointerPosition: number;
};

const Circle: React.FC<CircleProps> = ({
  id,
  value,
  isHighlighted,
  borderColor,
  isPointer,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-[4px] sm:border-[5px] md:border-[6px] shadow-md text-center ${
        isHighlighted ? "animate-pulse ring-2 sm:ring-4 ring-blue-300" : ""
      }`}
      style={{ borderColor }}
    >
      {/* Smaller text for small screens */}
      <span className="text-[10px] sm:text-xs font-semibold text-black">{id}</span>
      <span className="text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 text-black">{value}</span>
      {isPointer && (
        <div className="absolute -bottom-4 sm:-bottom-6 w-0 h-0 border-l-[4px] sm:border-l-[6px] border-r-[4px] sm:border-r-[6px] border-b-[8px] sm:border-b-[12px] border-l-transparent border-r-transparent border-b-red-500"></div>
      )}
    </div>
  );
};

const CircleRow: React.FC<CircleRowProps> = ({ circles, pointerPosition }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-3 sm:gap-4">
      {/* First row for small screens (0-4) */}
      <div className="grid grid-cols-5 gap-12 sm:hidden">
        {circles.slice(0, 5).map((circle) => (
          <Circle
            key={circle.id}
            {...circle}
            isPointer={circle.id === pointerPosition}
          />
        ))}
      </div>
      {/* Second row for small screens (5-9) */}
      <div className="grid grid-cols-5 gap-12 sm:hidden">
        {circles.slice(5, 10).map((circle) => (
          <Circle
            key={circle.id}
            {...circle}
            isPointer={circle.id === pointerPosition}
          />
        ))}
      </div>
      {/* Single row for larger screens */}
      <div className="hidden sm:flex sm:flex-nowrap sm:gap-4">
        {circles.map((circle) => (
          <Circle
            key={circle.id}
            {...circle}
            isPointer={circle.id === pointerPosition}
          />
        ))}
      </div>
    </div>
  );
};

const CircleDesign: React.FC = () => {
  const { tickCounter, digitPercentages } = useTickCounterContext();
  const lastDigit = parseInt(tickCounter.toString().slice(-1), 10);

  const data = useMemo(() => {
    const percentagesArray = Object.entries(digitPercentages).map(
      ([digit, percentage]) => ({
        id: parseInt(digit, 10),
        percentage,
      })
    );

    // Find the highest and lowest percentages
    const maxPercentage = Math.max(...percentagesArray.map((d) => d.percentage));
    const minPercentage = Math.min(...percentagesArray.map((d) => d.percentage));

    return percentagesArray.map(({ id, percentage }) => {
      const value = `${percentage.toFixed(1)}%`;
      const isHighlighted = id === lastDigit;

      // Determine border color
      let borderColor = "gray";
      if (percentage === maxPercentage) {
        borderColor = "green";
      } else if (percentage === minPercentage) {
        borderColor = "red";
      }

      return {
        id,
        value,
        isHighlighted,
        borderColor,
      };
    });
  }, [digitPercentages, lastDigit]);

  return (
    <div className="bg-transparent p-6 sm:p-8 z-50">
      <CircleRow circles={data} pointerPosition={lastDigit} />
    </div>
  );
};

export default CircleDesign;

