'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

interface TickData {
  time: string;
  askPrice: number;
}

interface ChartComponentProps {
  tickData: Record<string, TickData[]>;
  symbolsToTrack: string[];
}

const MAX_DATA_POINTS = 20;

const yAxisRanges: Record<
  string,
  { min: number; max: number; bufferMin: number; bufferMax: number }
> = {
  '1HZ10V': { min: 0, max: 10000, bufferMin: 8750, bufferMax: 8770 },
  'R_10': { min: 6420, max: 6430, bufferMin: 6410, bufferMax: 6440 },
  '1HZ25V': { min: 611000, max: 616000, bufferMin: 610000, bufferMax: 617000 },
  'R_25': { min: 2407, max: 2422, bufferMin: 2400, bufferMax: 2430 },
  '1HZ50V': { min: 226000, max: 229500, bufferMin: 225000, bufferMax: 230000 },
  'R_50': { min: 289, max: 291, bufferMin: 255, bufferMax: 355 },
  '1HZ75V': { min: 5900, max: 5970, bufferMin: 5850, bufferMax: 6000 },
  'R_75': { min: 101250, max: 102500, bufferMin: 101000, bufferMax: 107000 },
  '1HZ100V': { min: 1300, max: 1385, bufferMin: 1250, bufferMax: 1420 },
  'R_100': { min: 1452, max: 1465, bufferMin: 1450, bufferMax: 1470 },
};

const ChartComponent: React.FC<ChartComponentProps> = ({ tickData, symbolsToTrack }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [zoomPluginLoaded, setZoomPluginLoaded] = useState(false);

  useEffect(() => {
    import('chartjs-plugin-zoom').then((zoomPlugin) => {
      Chart.register(...registerables, zoomPlugin.default);
      setZoomPluginLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!chartRef.current || !zoomPluginLoaded || symbolsToTrack.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const datasets = symbolsToTrack.map((symbol) => {
      const data = tickData[symbol] || [];
      return {
        label: `Price - ${symbol}`,
        data: data.map((tick) => tick.askPrice),
        borderColor: '#4A5568',
        backgroundColor: 'rgba(74, 85, 104, 0.1)',
        borderWidth: 1,
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: '#4F46E5',
      };
    });

    const labels = tickData[symbolsToTrack[0]]
      ?.map((tick, index) => {
        if (index % 2 === 0) return tick.time; // Show every 5th time point
        return '';
      })
      .filter((time) => time !== '');

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets,
        },
        options: {
          responsive: true,
          animation: {
            duration: 500,
            easing: 'easeOutQuart',
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
                color: '#000000',
                font: { size: 12 },
              },
              ticks: {
                color: '#000000',
                font: { size: 8 }, // Adjust font size for thinner labels
                maxRotation: 50, // Allow rotation
                minRotation: 0,
                autoSkip: false,
    
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price',
                color: '#000000',
                font: { size: 12 },
              },
              ticks: {
                color: '#000000',
                font: { size: 10 },
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              min: yAxisRanges[symbolsToTrack[0]]?.min,
              max: yAxisRanges[symbolsToTrack[0]]?.max,
              suggestedMin: yAxisRanges[symbolsToTrack[0]]?.bufferMin,
              suggestedMax: yAxisRanges[symbolsToTrack[0]]?.bufferMax,
            },
          },
          plugins: {
            zoom: {
              pan: {
                enabled: true,
                mode: 'y',
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'y',
              },
            },
            tooltip: {
              mode: 'nearest',
              intersect: false,
              backgroundColor: '#FF0000',
              titleColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              borderColor: '#FF0000',
              borderWidth: 1,
            },
            legend: {
              display: true,
              labels: {
                color: '#FFFFFF',
              },
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  }, [tickData, symbolsToTrack, zoomPluginLoaded]);

  useEffect(() => {
    if (!chartInstanceRef.current || symbolsToTrack.length === 0) return;

    const chart = chartInstanceRef.current;

    symbolsToTrack.forEach((symbol, index) => {
      const data = tickData[symbol] || [];
      const lastTick = data[data.length - 1];

      if (chart.data.labels && chart.data.datasets[index]?.data) {
        if (data.length % 5 === 0) {
          chart.data.labels.push(lastTick.time);
        } else {
          chart.data.labels.push('');
        }
        chart.data.datasets[index].data.push(lastTick.askPrice);

        if (chart.data.labels.length > MAX_DATA_POINTS) {
          chart.data.labels.shift();
          chart.data.datasets[index].data.shift();
        }
      }
    });

    chart.update('none');
  }, [tickData]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        background: 'linear-gradient(to bottom, #F0F4F8, #FFFFFF)',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #CCCCCC',
      }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;


