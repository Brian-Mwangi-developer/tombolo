'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface TickData {
  time: string;
  askPrice: number;
}

interface BarChartComponentProps {
  tickData: Record<string, TickData[]>;
  symbolsToTrack: string[];
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ tickData, symbolsToTrack }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [upTicksData, setUpTicksData] = useState<number[]>([]);
  const [downTicksData, setDownTicksData] = useState<number[]>([]);
  const [padding, setPadding] = useState(20); 

  useEffect(() => {
    // Dynamically import Chart.js and the necessary plugins and scales only in the client side
    const loadChartJs = async () => {
      const { Chart, registerables, CategoryScale, LinearScale, BarElement } = await import('chart.js');
      const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
      
      // Register necessary components
      Chart.register(...registerables, CategoryScale, LinearScale, BarElement, zoomPlugin);

      if (!chartRef.current) return;
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const datasets = [
        {
          label: 'Upward Percentage',
          data: upTicksData,
          backgroundColor: 'rgba(34, 197, 94, 0.7)', // green
        },
        {
          label: 'Downward Percentage',
          data: downTicksData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)', // red
        },
      ];



      if (!chartInstanceRef.current) {
        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: symbolsToTrack,
            datasets: datasets,
          },
          options: {
            responsive: true,
            animation: {
              duration: 600,
              easing: 'easeOutQuart',
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Symbols',
                  color: '#333',
                  font: { size: 14, family: 'Arial, sans-serif' },
                },
                ticks: {
                  color: '#333',
                  font: { size: 12 },
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Percentage',
                  color: '#333',
                  font: { size: 14, family: 'Arial, sans-serif' },
                },
                ticks: {
                  color: '#333',
                  font: { size: 12 },
                  beginAtZero: true,
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
            },
            plugins: {
              tooltip: {
                backgroundColor: '#222',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderWidth: 1,
                borderColor: '#fff',
              },
              legend: {
                display: true,
                labels: {
                  color: '#333',
                },
              },
            },
            maintainAspectRatio: false,
          },
        });
      } else {
        // Update existing chart instance data
        chartInstanceRef.current.data = {
          labels: symbolsToTrack,
          datasets: datasets,
        };
        chartInstanceRef.current.update();
      }
    };

    loadChartJs();
  }, [upTicksData, downTicksData, symbolsToTrack]);

  useEffect(() => {
    if (!symbolsToTrack.length || !tickData) return;

    const upTicks: number[] = [];
    const downTicks: number[] = [];

    symbolsToTrack.forEach((symbol) => {
      const data = tickData[symbol] || [];
      let upCount = 0;
      let downCount = 0;

      // Calculate ticks going up and down
      for (let i = 1; i < data.length; i++) {
        if (data[i].askPrice > data[i - 1].askPrice) {
          upCount++;
        } else if (data[i].askPrice < data[i - 1].askPrice) {
          downCount++;
        }
      }

      const totalTicks = data.length - 1; // exclude first tick as it has no previous one
      const upPercentage = totalTicks ? (upCount / totalTicks) * 100 : 0;
      const downPercentage = totalTicks ? (downCount / totalTicks) * 100 : 0;

      upTicks.push(upPercentage);
      downTicks.push(downPercentage);
    });

    setUpTicksData(upTicks);
    setDownTicksData(downTicks);
  }, [tickData, symbolsToTrack]);

  useEffect(() => {
    // Check the screen width on mount and resize
    const handleResize = () => {
      if (window.innerWidth <= 768) { // Change 768 to whatever breakpoint you need
        setPadding(15); // Smaller padding for small screens
      } else {
        setPadding(20); // Default padding for larger screens
      }
    };

    // Add event listener for resizing the window
    window.addEventListener('resize', handleResize);
    // Initial check when component mounts
    handleResize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '450px',
        background: 'linear-gradient(145deg, #e6e9f0, #ffffff)',
        borderRadius: '12px',
        padding: `${padding}px`,
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        textAlign: 'center',
      }}
    >
      <h3
        style={{
          color: '#333',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '15px',
        }}
      >
        Market Ticks Analysis
      </h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChartComponent;



