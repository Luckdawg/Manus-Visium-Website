import { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
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
import { trpc } from "@/lib/trpc";

type Timeframe = "1M" | "3M" | "6M" | "1Y" | "ALL";

interface StockDataPoint {
  date: string;
  price: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900">{data.date}</p>
        <p className="text-sm text-gray-700">
          Price: <span className="font-bold text-primary">${data.price.toFixed(4)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function StockChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("6M");
  
  // Fetch historical data from backend API
  const { data: chartData, isLoading } = trpc.stock.getHistoricalData.useQuery(
    { timeframe },
    {
      refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    }
  );
  
  const timeframes: Timeframe[] = ["1M", "3M", "6M", "1Y", "ALL"];
  
  // Calculate price change for the selected timeframe
  const priceChange = useMemo(() => {
    if (!chartData || chartData.length < 2) return { value: 0, percent: 0 };
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
            {!isLoading && chartData && chartData.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Period Change:</span>
                <span className={`text-sm font-semibold ${priceChange.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(4)} 
                  ({priceChange.percent >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
                </span>
              </div>
            )}
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
        {isLoading ? (
          <div className="animate-pulse h-[400px] bg-gray-200 rounded"></div>
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
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
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No historical data available
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Historical data sourced from Nasdaq via Yahoo Finance API. Data updates every 15 minutes during market hours.
        </p>
      </CardContent>
    </Card>
  );
}
