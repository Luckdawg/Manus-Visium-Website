import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Timeframe = "1M" | "3M" | "6M" | "1Y" | "ALL";

interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
}

// Generate mock historical data for VISM stock
const generateHistoricalData = (): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2); // 2 years of data

  let currentPrice = 0.0011; // Start from 52-week low
  const targetPrice = 0.0062; // Current price
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Simulate price movement with trend towards current price
    const daysFromStart = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const progress = daysFromStart / totalDays;
    
    // Add some randomness while trending upward
    const randomFactor = 0.9 + Math.random() * 0.2; // ±10% daily variation
    const trendFactor = 0.0011 + (targetPrice - 0.0011) * progress;
    currentPrice = trendFactor * randomFactor;
    
    // Clamp price within reasonable bounds
    currentPrice = Math.max(0.0008, Math.min(0.046, currentPrice));
    
    // Generate volume with some randomness
    const baseVolume = 478610;
    const volume = Math.floor(baseVolume * (0.5 + Math.random()));
    
    data.push({
      date: d.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(6)),
      volume: volume
    });
  }
  
  return data;
};

const allData = generateHistoricalData();

const getDataForTimeframe = (timeframe: Timeframe): StockDataPoint[] => {
  const endDate = new Date();
  let startDate = new Date();
  
  switch (timeframe) {
    case "1M":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "3M":
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case "6M":
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case "1Y":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    case "ALL":
      return allData;
  }
  
  return allData.filter(d => new Date(d.date) >= startDate);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900">{data.date}</p>
        <p className="text-sm text-gray-700">
          Price: <span className="font-bold text-primary">${data.price.toFixed(4)}</span>
        </p>
        <p className="text-sm text-gray-700">
          Volume: <span className="font-bold">{data.volume.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function StockChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("6M");
  
  const chartData = useMemo(() => getDataForTimeframe(timeframe), [timeframe]);
  
  const timeframes: Timeframe[] = ["1M", "3M", "6M", "1Y", "ALL"];
  
  // Calculate price change for the selected timeframe
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return { value: 0, percent: 0 };
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = lastPrice - firstPrice;
    const percent = (change / firstPrice) * 100;
    return { value: change, percent };
  }, [chartData]);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Historical Price Chart</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Period Change:</span>
              <span className={`text-sm font-semibold ${priceChange.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(4)} 
                ({priceChange.percent >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="min-w-[50px]"
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Price Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#6366f1" 
                strokeWidth={2}
                fill="url(#colorPrice)" 
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Volume Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Trading Volume</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" fill="#6366f1" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Historical data is for demonstration purposes. Actual trading data may vary.
        </p>
      </CardContent>
    </Card>
  );
}
