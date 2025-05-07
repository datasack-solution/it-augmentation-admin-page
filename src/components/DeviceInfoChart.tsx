import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { motion } from 'framer-motion';
import moment from 'moment';

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

interface DeviceTypeChartProps {
  data: TrackingData[];
  isDarkMode:boolean
}

const DeviceTypeChart: React.FC<DeviceTypeChartProps> = ({ data,isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // Process device type data
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], counts: [] };

    // Determine date range
    const endDate = moment();
    const startDate = timeRange === '7d' ? moment().subtract(7, 'days') : moment().subtract(30, 'days');

    // Filter data by date range
    const filteredData = data.filter((item) => {
      const visitDate = moment(item.visitDate);
      return visitDate.isValid() && visitDate.isSameOrAfter(startDate) && visitDate.isSameOrBefore(endDate);
    });

    // Categorize devices
    const deviceCounts: Record<string, number> = { Mobile: 0, Desktop: 0 };
    filteredData.forEach((item) => {
      const userAgent = item.browserInfo.userAgent.toLowerCase();
      const isMobile = /mobile|android|iphone|ipad|tablet|ipod/.test(userAgent);
      deviceCounts[isMobile ? 'Mobile' : 'Desktop']++;
    });

    const labels = ['Mobile', 'Desktop'];
    const counts = [deviceCounts['Mobile'], deviceCounts['Desktop']];

    return { labels, counts };
  }, [data, timeRange]);

  // Update chart
  useEffect(() => {
    if (!canvasRef.current || processedData.labels.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: chartType === 'bar' ? 'bar' : 'pie',
      data: {
        labels: processedData.labels,
        datasets: [{
          label: 'Device Type Usage',
          data: processedData.counts,
          backgroundColor: chartType === 'bar'
            ? ['rgba(79, 70, 229, 0.6)', 'rgba(16, 185, 129, 0.6)']
            : ['#4F46E5', '#10B981'],
          borderColor: chartType === 'bar'
            ? ['rgba(79, 70, 229, 1)', 'rgba(16, 185, 129, 1)']
            : '#ffffff',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: chartType === 'pie',
            position: 'bottom',
            labels: { color: isDarkMode ? '#ffffff' : '#1f2937', font: { size: 14 } }
          },
          title: {
            display: true,
            text: 'Device Type Distribution',
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
        },
        scales: chartType === 'bar' ? {
          x: {
            ticks: { color: isDarkMode ? '#ffffff' : '#1f2937' },
            grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: isDarkMode ? '#ffffff' : '#1f2937' },
            grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
          }
        } : undefined
      }
    };

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [processedData, chartType, isDarkMode]);

  // Download data as CSV
  const downloadCSV = () => {
    const csvRows = ['Device Type,Visit Count'];
    processedData.labels.forEach((label, index) => {
      csvRows.push(`${label},${processedData.counts[index]}`);
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `device_type_usage_${moment().format('YYYY-MM-DD')}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Toggle dark mode
  // const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <motion.div
      className={`p-6 rounded-2xl overflow-auto shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{rotate:1}}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Device Type Insights
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d')}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'bar' | 'pie')}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
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
          No device type data available for the selected range.
        </p>
      ) : (
        <div className="h-80">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      )}
    </motion.div>
  );
};

export default DeviceTypeChart;