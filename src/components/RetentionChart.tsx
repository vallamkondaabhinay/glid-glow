import React, { useState } from 'react';
import { DashboardMetrics } from '../types';

interface RetentionChartProps {
  metrics: DashboardMetrics;
}

export const RetentionChart: React.FC<RetentionChartProps> = ({ metrics }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'90D' | '12M'>('90D');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const data = metrics.revisitTrends;

  // Chart coordinate calculations
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 40 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => Math.max(d.targetCadence, d.actualRevisits))) + 10;
  const minVal = 0;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * usableWidth;
  const getY = (val: number) => padding.top + usableHeight - ((val - minVal) / (maxVal - minVal)) * usableHeight;

  // Line paths
  const actualPoints = data.map((d, i) => `${getX(i)},${getY(d.actualRevisits)}`).join(' ');
  const targetPoints = data.map((d, i) => `${getX(i)},${getY(d.targetCadence)}`).join(' ');

  // Gradient area path for actual revisits
  const areaPath = `
    M ${getX(0)},${padding.top + usableHeight}
    ${data.map((d, i) => `L ${getX(i)},${getY(d.actualRevisits)}`).join(' ')}
    L ${getX(data.length - 1)},${padding.top + usableHeight}
    Z
  `;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Revisit Trends & Cadence Performance (2 cols) */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs flex flex-col justify-between">
        {/* Header with Title & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#281522]">
              Guest Revisit Cadence & Retention
            </h3>
            <p className="text-xs text-[#8A7D84] mt-0.5">
              Targeted cadence cycles vs actual returned salon visits
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A2038]" />
              <span className="text-[#29252A] font-medium">Actual Revisits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#C7A56A]" />
              <span className="text-[#8A7D84]">Target Cohort</span>
            </div>

            {/* Segmented Period Filter */}
            <div className="flex items-center bg-[#FBF7F1] p-0.5 rounded-lg border border-[#C7A56A]/20">
              <button
                onClick={() => setSelectedPeriod('90D')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  selectedPeriod === '90D'
                    ? 'bg-white text-[#281522] shadow-xs'
                    : 'text-[#8A7D84] hover:text-[#281522]'
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setSelectedPeriod('12M')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  selectedPeriod === '12M'
                    ? 'bg-white text-[#281522] shadow-xs'
                    : 'text-[#8A7D84] hover:text-[#281522]'
                }`}
              >
                Annual
              </button>
            </div>
          </div>
        </div>

        {/* SVG Responsive Container */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A2038" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4A2038" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 20, 40, 60].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#E9D5D8"
                    strokeWidth="0.75"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="#8A7D84"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area */}
            <path d={areaPath} fill="url(#actualGradient)" />

            {/* Target line */}
            <polyline
              fill="none"
              stroke="#C7A56A"
              strokeWidth="2"
              strokeDasharray="4 4"
              points={targetPoints}
            />

            {/* Actual Line */}
            <polyline
              fill="none"
              stroke="#4A2038"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={actualPoints}
            />

            {/* Data points & X Labels */}
            {data.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.actualRevisits);
              const isHovered = hoveredPoint === i;

              return (
                <g
                  key={d.month}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Invisible hit area */}
                  <circle cx={cx} cy={cy} r="18" fill="transparent" />

                  {/* Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? '6' : '4'}
                    fill="#FBF7F1"
                    stroke="#4A2038"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />

                  {/* X axis month label */}
                  <text
                    x={cx}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#8A7D84"
                    fontWeight="500"
                  >
                    {d.month}
                  </text>

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={cx - 55}
                        y={cy - 48}
                        width="110"
                        height="40"
                        rx="6"
                        fill="#281522"
                        stroke="#C7A56A"
                        strokeWidth="1"
                      />
                      <text
                        x={cx}
                        y={cy - 32}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#DFC394"
                        fontWeight="600"
                      >
                        {d.month}: {d.actualRevisits} Revisits
                      </text>
                      <text
                        x={cx}
                        y={cy - 18}
                        textAnchor="middle"
                        fontSize="9.5"
                        fill="#FBF7F1"
                        fontFamily="monospace"
                      >
                        Retention: {d.retentionRate}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Footer Metric summary */}
        <div className="pt-3 border-t border-[#FBF7F1] flex items-center justify-between text-xs text-[#8A7D84]">
          <span>Optimal Revisit Benchmark: 88.0%</span>
          <span className="font-semibold text-[#4A2038] tabular-nums">
            October Attainment: 92.4% (+4.4% above benchmark)
          </span>
        </div>
      </div>

      {/* Chart 2: Reminder Performance & Conversion Funnel */}
      <div className="bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#281522]">
            WhatsApp Revisit Funnel
          </h3>
          <p className="text-xs text-[#8A7D84] mt-0.5">
            Cadence dispatch to appointment confirmation
          </p>
        </div>

        {/* Visual Conversion Funnel Bars */}
        <div className="my-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#29252A]">1. Dispatched Messages</span>
              <span className="font-mono text-[#4A2038] font-semibold tabular-nums">
                100% (148 sent)
              </span>
            </div>
            <div className="w-full h-2 bg-[#F6F0E7] rounded-full overflow-hidden">
              <div className="h-full bg-[#4A2038] rounded-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#29252A]">2. Delivered to Handset</span>
              <span className="font-mono text-[#4A2038] font-semibold tabular-nums">
                {metrics.deliverySuccessRate}% (145 delivered)
              </span>
            </div>
            <div className="w-full h-2 bg-[#F6F0E7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C7A56A] rounded-full transition-all duration-500"
                style={{ width: `${metrics.deliverySuccessRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#29252A]">3. Read by Guest</span>
              <span className="font-mono text-[#4A2038] font-semibold tabular-nums">
                88.6% (131 read)
              </span>
            </div>
            <div className="w-full h-2 bg-[#F6F0E7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#DFC394] rounded-full transition-all duration-500"
                style={{ width: '88.6%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#29252A]">4. Rebooked & Confirmed</span>
              <span className="font-mono text-emerald-800 font-semibold tabular-nums">
                74.2% (110 rebooked)
              </span>
            </div>
            <div className="w-full h-2 bg-[#F6F0E7] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                style={{ width: '74.2%' }}
              />
            </div>
          </div>
        </div>

        {/* Highlights box */}
        <div className="p-3 bg-[#FBF7F1] rounded-lg border border-[#C7A56A]/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A7D84]">Avg Guest Response Time</span>
            <span className="font-mono font-semibold text-[#281522]">28 minutes</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1.5">
            <span className="text-[#8A7D84]">Retained Revenue This Month</span>
            <span className="font-mono font-semibold text-[#4A2038]">$31,350</span>
          </div>
        </div>
      </div>
    </div>
  );
};
