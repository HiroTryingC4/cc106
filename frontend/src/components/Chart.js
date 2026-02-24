import React from 'react';

const Chart = ({ data, type = 'bar', title, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  if (type === 'bar') {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="space-y-3" style={{ height: `${height}px`, overflowY: 'auto' }}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-32 text-sm text-gray-700 truncate" title={item.label}>
                  {item.label}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 15 && (
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    )}
                  </div>
                  {percentage <= 15 && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-sm font-medium">
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-orange-500'
    ];

    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const previousPercentages = data
                  .slice(0, index)
                  .reduce((sum, d) => sum + (d.value / total) * 100, 0);
                
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -previousPercentages;
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="15.915"
                    fill="transparent"
                    stroke={colors[index % colors.length].replace('bg-', '#')}
                    strokeWidth="31.83"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                  <span className="text-sm text-gray-700">
                    {item.label}: {item.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'line') {
    const width = 600;
    const chartHeight = height - 40;
    const padding = 40;
    const chartWidth = width - padding * 2;
    
    const points = data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((item.value / maxValue) * (chartHeight - padding)) + 20;
      return { x, y, ...item };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - (ratio * (chartHeight - padding)) + 20;
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text x={10} y={y + 4} fontSize="12" fill="#6b7280">
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            );
          })}
          
          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={height - 10}
                fontSize="12"
                fill="#6b7280"
                textAnchor="middle"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return null;
};

export default Chart;
