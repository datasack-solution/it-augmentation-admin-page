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

interface AnalyticsChartProps {
  data: TrackingData[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'custom'>('7d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Process data for day-wise counts
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], counts: [] };

    // Determine date range
    let startDate: moment.Moment;
    let endDate = moment();
    if (timeRange === '7d') {
      startDate = moment().subtract(7, 'days');
    } else if (timeRange === '30d') {
      startDate = moment().subtract(30, 'days');
    } else {
      startDate = customStartDate ? moment(customStartDate) : moment().subtract(7, 'days');
      endDate = customEndDate ? moment(customEndDate) : moment();
      if (!startDate.isValid() || !endDate.isValid()) {
        startDate = moment().subtract(7, 'days');
        endDate = moment();
      }
    }

    // Filter data by date range and group by day
    const dayCounts: Record<string, number> = {};
    data.forEach((item) => {
      const visitDate = moment(item.visitDate);
      if (visitDate.isValid() && visitDate.isSameOrAfter(startDate) && visitDate.isSameOrBefore(endDate) || visitDate.isSame(endDate) || visitDate.isSame(startDate)) {
        const dayKey = visitDate.format('YYYY-MM-DD');
        dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;
      }
    });

    // Generate labels and counts for all days in range
    const labels: string[] = [];
    const counts: number[] = [];
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      const dayKey = currentDate.format('YYYY-MM-DD');
      labels.push(currentDate.format('MMM DD'));
      counts.push(dayCounts[dayKey] || 0);
      currentDate = currentDate.add(1, 'day');
    }

    return { labels, counts };
  }, [data, timeRange, customStartDate, customEndDate]);

  // Update chart
  useEffect(() => {
    if (!canvasRef.current || processedData.labels.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: chartType,
      data: {
        labels: processedData.labels,
        datasets: [{
          label: 'Daily Visits',
          data: processedData.counts,
          backgroundColor: chartType === 'bar' ? 'rgba(79, 70, 229, 0.6)' : undefined,
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: chartType === 'line' ? 2 : 1,
          fill: chartType === 'line' ? false : true,
          tension: chartType === 'line' ? 0.4 : 0,
          pointRadius: chartType === 'line' ? 4 : 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            labels: { color: isDarkMode ? '#ffffff' : '#1f2937', font: { size: 14 } }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
            titleColor: isDarkMode ? '#ffffff' : '#1f2937',
            bodyColor: isDarkMode ? '#ffffff' : '#1f2937',
            titleFont: { size: 14 },
            bodyFont: { size: 12 }
          }
        },
        scales: {
          x: {
            ticks: { color: isDarkMode ? '#ffffff' : '#1f2937' },
            grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: isDarkMode ? '#ffffff' : '#1f2937' },
            grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
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
  }, [processedData, chartType, isDarkMode]);

  // Download data as CSV
  const downloadCSV = () => {
    const csvRows = ['Date,Visit Count'];
    processedData.labels.forEach((label, index) => {
      csvRows.push(`${label},${processedData.counts[index]}`);
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `daily_visits_${moment().format('YYYY-MM-DD')}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Daily Visit Trends
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | 'custom')}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          {timeRange === 'custom' && (
            <div className="flex gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
            </div>
          )}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'bar' | 'line')}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
          <button
            onClick={downloadCSV}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Download CSV
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} hover:bg-indigo-500 hover:text-white transition-colors`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      {processedData.labels.length === 0 ? (
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No data available for the selected range.
        </p>
      ) : (
        <div className="h-96">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsChart;