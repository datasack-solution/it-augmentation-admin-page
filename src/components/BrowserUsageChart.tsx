import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { motion } from 'framer-motion';

interface BrowserInfo {
  userAgent: string;
  platform: string;
  language: string;
}

interface TrackingData {
  _id: string;
  country?: string;
  city?: string;
  visitDate: string;
  browserInfo: BrowserInfo;
  scrollPercent: number;
  sessionDuration: number;
  clickEvents: string[];
}

interface BrowserUsageChartProps {
  data: TrackingData[];
  isDarkMode:boolean
}

const BrowserUsageChart: React.FC<BrowserUsageChartProps> = ({ data,isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // Process browser usage data
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], counts: [] };

    // Extract browser from userAgent
    const browserCounts: Record<string, number> = {};
    data.forEach((item) => {
      const userAgent = item.browserInfo.userAgent.toLowerCase();
      let browser = 'Unknown';

      if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        browser = 'Chrome';
      } else if (userAgent.includes('firefox')) {
        browser = 'Firefox';
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        browser = 'Safari';
      } else if (userAgent.includes('edg')) {
        browser = 'Edge';
      } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
        browser = 'Opera';
      }

      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
    });

    const labels = Object.keys(browserCounts);
    const counts = Object.values(browserCounts);

    return { labels, counts };
  }, [data]);

  // Update chart
  useEffect(() => {
    if (!canvasRef.current || processedData.labels.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: processedData.labels,
        datasets: [{
          label: 'Browser Usage',
          data: processedData.counts,
          backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 30
        }]
      },
      options: {
        responsive: true,
        // animation: {
        //   duration: 1500,
        //   easing: 'easeOutElastic'
        // },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: isDarkMode ? '#ffffff' : '#1f2937',
              font: { size: 14 }
            }
          },
          title: {
            display: true,
            text: 'Browser Usage Distribution',
            color: isDarkMode ? '#ffffff' : '#1f2937',
            font: { size: 18, weight: 'bold' }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
            titleColor: isDarkMode ? '#ffffff' : '#1f2937',
            bodyColor: isDarkMode ? '#ffffff' : '#1f2937',
            callbacks: {
              label: (context) => {
                const total = processedData.counts.reduce((sum, count) => sum + count, 0);
                const value = context.raw as number;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} visits (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [processedData, isDarkMode]);

  // Download data as CSV
  const downloadCSV = () => {
    const csvRows = ['Browser,Visit Count'];
    processedData.labels.forEach((label, index) => {
      csvRows.push(`${label},${processedData.counts[index]}`);
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `browser_usage_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} transition-colors duration-500`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      whileHover={{ rotate: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Browser Usage Insights
        </h2>
        <div className="flex gap-4 ml-5">
          <button
            onClick={downloadCSV}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>
      {processedData.labels.length === 0 ? (
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No browser usage data available.
        </p>
      ) : (
        <canvas ref={canvasRef} className="max-w-full" />
      )}
    </motion.div>
  );
};

export default BrowserUsageChart;