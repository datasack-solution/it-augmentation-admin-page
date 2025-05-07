import { EuiIcon, EuiProgress, EuiSpacer } from '@elastic/eui';
import Chart from 'chart.js/auto';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AnalyticsChart from './Analytics';
import BrowserInfo from './BrowserInfo';
import BrowserUsageChart from './BrowserUsageChart';
import { TrackingData } from './clientApi';
import DeviceTypeChart from './DeviceInfoChart';
import { useGetTrackingDetails } from './hook';

function randomColor() {
  return "#" + Math.random().toString(16).slice(2, 8);
}

function colorGenerator(length: number) {
  let colors = []
  for (let i = 0; i < length; i++) {
    colors.push(randomColor())
  }
  return colors
}

const MetricsCard: React.FC<{ title: string; value: string | number; icon: string; index: number, isDarkMode: boolean }> = ({ title, value, icon, index, isDarkMode }) => (
  <motion.div
    className={`relative bg-gradient-to-br
      ${!isDarkMode ? "from-white to-gray-50" : "from-gray-800 to-gray-900"}
        p-6 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    whileHover={{ scale: 1.03 }}
  >
    <div className="absolute inset-0 bg-indigo-300 opacity-10 transform -skew-y-5"></div>
    <div className="flex items-center space-x-4 relative z-10">
      <div className="text-4xl animate-pulse">{icon}</div>
      <div className='ml-5'>
        <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-500"}   uppercase tracking-wide`}>{title}</h3>
        <p className={`text-2xl font-bold ${isDarkMode ? "text-gray-300" : "text-gray-800"}  `}>{value}</p>
      </div>
    </div>
  </motion.div>
);

const CountryPieChart: React.FC<{ data: TrackingData[], isDarkMode: boolean }> = ({ data, isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const countryCounts = data.reduce((acc, item) => {
      acc[item.country || 'Unknown'] = (acc[item.country || 'Unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = {
      labels: Object.keys(countryCounts),
      datasets: [{
        data: Object.values(countryCounts),
        backgroundColor: colorGenerator(data.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 30
      }]
    };

    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(canvasRef.current, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: isDarkMode ? '#ffffff' : '#1f2937', font: { size: 14 } }//fsm aa
            },
            title: {
              display: true,
              text: 'Country Distribution',
              color: isDarkMode ? '#ffffff' : '#000',
              font: { size: 18, weight: 'bold' }
            },
            tooltip: {
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
              titleColor: isDarkMode ? '#ffffff' : '#1f2937',
              bodyColor: isDarkMode ? '#ffffff' : '#1f2937',
              titleFont: { size: 14 },
              bodyFont: { size: 12 }
            }
          }
        }
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, isDarkMode]);

  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} transition-colors duration-500`}

      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ rotate: 1 }}
    >
      <div className="flex gap-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Country Distribution
        </h2>
        <button
          onClick={() => { }}
          className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
        >
          Download CSV
        </button>
      </div>
      <canvas ref={canvasRef} className="max-w-full" />
    </motion.div>
  );
};

const TrackingTable: React.FC<{ data: TrackingData[], isDarkMode: boolean }> = ({ data, isDarkMode }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof TrackingData; direction: 'asc' | 'desc' }>({ key: 'visitDate', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    sortableData.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? '';
      const bValue = b[sortConfig.key] ?? '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: keyof TrackingData) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <motion.div
      className={`${isDarkMode ? "bg-slate-900" : "bg-white"} overflow-auto  dark:bg-gray-800 p-10 rounded-2xl shadow-lg`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <h2
        className={`text-xl md:text-3xl p-5 font-semibold ${isDarkMode ? "text-white" : "text-gray-800 "} mb-4`}
      >
        Tracking Details
      </h2>
      <table className="min-w-full overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-800">
          <tr>
            {(['country', 'city', 'region', 'postal', 'visitDate', 'location', 'scroll (%)', 'sessionDuration', 'clickEvents'] as (keyof TrackingData)[]).map((key) => (
              <th
                key={key}
                onClick={() => requestSort(key)}
                className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-white"} uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition-colors duration-200 text-nowrap`}
              >
                {key} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            ))}
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y overflow-auto divide-gray-200 dark:divide-gray-700">
          {sortedData.map((item, index) => (
            <React.Fragment key={item._id}>
              <motion.tr
                className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50 "} transition-all duration-300 cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleRow(item._id)}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>{item.country || 'N/A'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>{item.city || 'N/A'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>{item.region || 'N/A'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>{item.postal || 'N/A'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>
                  {/* {new Date(item.visitDate).toLocaleString()} */}
                  {moment(item.visitDate).format('DD-MM-YYYY hh:mm a')}
                </td>
                {/* <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => window.open(`https://www.google.com/maps?q=${item.location}`, '_blank')}
                >
                  {item.location || 'N/A'}
                </td> */}

                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>

                  {item.location ? <button
                    className="ml-1 text-white rounded-full transition-transform duration-300 hover:scale-110 hover:bg-orange-200 focus:ring-4 "
                    onClick={() => window.open(`https://www.google.com/maps?q=${item.location}`, '_blank')}
                    title="View on Map"
                  >
                    <img src='location.svg' className='w-6 h-6 m-auto' />
                  </button> : 'N/A'}
                </td>



                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>
                  {item.scrollPercent.toFixed(2)}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>
                  {(item.sessionDuration / 1000).toFixed(2)}s
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900 "}`}>
                  {item.clickEvents.join(', ').substring(0, 30)}...
                </td>
                <td className="px-6 py-4 text-sm text-indigo-600 dark:text-indigo-400">
                  {expandedRow === item._id ? '▲' : '▼'}
                </td>
              </motion.tr>
              <AnimatePresence>
                {expandedRow === item._id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan={7} className={`px-6 py-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-50 "}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BrowserInfo item={item} isDarkMode={isDarkMode} />
                        <div>
                          <h4 className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700 "}`}>Click Events</h4>
                          <ul
                            className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-600 list-disc pl-4"}`}>
                            {item.clickEvents.map((event, idx) => (
                              <li key={idx}>{event}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};



const Tracking: React.FC = () => {
  const { data, isLoading } = useGetTrackingDetails()
  const trackingData = (data?.tracks || []).filter(r => r.country !== 'Unknown Country')

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const totalVisits = trackingData.length;
  const avgSessionDuration = (trackingData.reduce((sum, item) => sum + item.sessionDuration, 0) / totalVisits / 1000).toFixed(2);
  const uniqueCountries = new Set(trackingData.map(item => item.country)).size;
  const filteredData = countryFilter === 'All' ? trackingData : trackingData.filter(item => item.country === countryFilter);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const countries = ['All', ...Array.from(new Set(trackingData.map(item => item.country).filter(Boolean)))];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-500 p-4 md:p-8 lg:p-12`}>
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.5); }
            50% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
            100% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.5); }
          }
          .glow { animation: glow 2s ease-in-out infinite; }
        `}
      </style>
      <div className='py-5'>
        <Link className={`font-semibold ${isDarkMode ? "text-white" : "text-blue-500"}`} href={'/'}><EuiIcon type={'arrowLeft'} /> Go Back</Link>
      </div>
      <motion.header
        className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-700 text-gray-200" : "bg-white text-gray-800"} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            >
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? "bg-slate-700 text-indigo-200 hover:bg-gray-800" : "bg-white text-indigo-600 hover:bg-gray-100"} transition-colors glow`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricsCard title="Total Visits" value={totalVisits} icon="📊" index={0} isDarkMode={isDarkMode} />
        <MetricsCard title="Avg. Session Duration" value={`${avgSessionDuration}s`} icon="⏱️" index={1} isDarkMode={isDarkMode} />
        <MetricsCard title="Unique Countries" value={uniqueCountries} icon="🌍" index={2} isDarkMode={isDarkMode} />
      </div>

      {isLoading && <EuiProgress size='xs' />}

      <EuiSpacer />
      <AnalyticsChart data={trackingData} isDarkMode={isDarkMode} />
      <EuiSpacer />

      <div className="flex flex-col gap-10">
        <div className='w-full flex flex-wrap justify-evenly'>
          <CountryPieChart data={filteredData} isDarkMode={isDarkMode} />
          <BrowserUsageChart data={trackingData} isDarkMode={isDarkMode} />
          <DeviceTypeChart data={trackingData} isDarkMode={isDarkMode} />
        </div>
        <div className='w-full'>
          <TrackingTable data={filteredData} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default Tracking;