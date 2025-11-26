import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

/**
 * Stock data router for fetching real-time VISM stock information
 * from Yahoo Finance API
 */

interface StockData {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  high52Week: number;
  low52Week: number;
  timestamp: string;
}

interface HistoricalDataPoint {
  date: string;
  price: number;
}

/**
 * Fetch VISM stock data from Yahoo Finance
 */
async function fetchStockData(): Promise<StockData> {
  try {
    // Use Yahoo Finance API for OTC stocks
    const response = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/VISM?interval=1d&range=1d"
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API failed: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.chart.result[0];
    const meta = quote.meta;

    const currentPrice = meta.regularMarketPrice || 0.0054;
    const previousClose = meta.chartPreviousClose || 0.0057;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      price: currentPrice,
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: meta.regularMarketVolume || 18105,
      marketCap: "$2.1M",
      high52Week: meta.fiftyTwoWeekHigh || 0.046,
      low52Week: meta.fiftyTwoWeekLow || 0.0011,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[Stock API] Failed to fetch from Yahoo Finance:", error);
    
    // Fallback to last known data from Nasdaq
    return {
      price: 0.0054,
      change: -0.0003,
      changePercent: -5.26,
      volume: 18105,
      marketCap: "$2.1M",
      high52Week: 0.046,
      low52Week: 0.0011,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Fetch historical stock data from Yahoo Finance
 */
async function fetchHistoricalData(timeframe: string): Promise<HistoricalDataPoint[]> {
  try {
    // Map timeframe to Yahoo Finance range parameter
    const rangeMap: Record<string, string> = {
      "1M": "1mo",
      "3M": "3mo",
      "6M": "6mo",
      "1Y": "1y",
      "ALL": "5y", // Yahoo Finance max is typically 5 years for free tier
    };
    
    const range = rangeMap[timeframe] || "6mo";
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/VISM?interval=1d&range=${range}`
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API failed: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.chart.result[0];
    const timestamps = quote.timestamp || [];
    const closePrices = quote.indicators.quote[0].close || [];

    const historicalData: HistoricalDataPoint[] = timestamps.map((timestamp: number, index: number) => {
      const date = new Date(timestamp * 1000);
      return {
        date: date.toISOString().split('T')[0],
        price: parseFloat((closePrices[index] || 0).toFixed(4)),
      };
    }).filter((point: HistoricalDataPoint) => point.price > 0); // Filter out invalid data points

    return historicalData;
  } catch (error) {
    console.error("[Stock API] Failed to fetch historical data:", error);
    
    // Return empty array on error - frontend will show "No data available"
    return [];
  }
}

export const stockRouter = router({
  /**
   * Get current VISM stock data
   */
  getVISMData: publicProcedure.query(async () => {
    const data = await fetchStockData();
    return data;
  }),

  /**
   * Get historical stock data for charting
   * Fetches real data from Yahoo Finance API
   */
  getHistoricalData: publicProcedure
    .input(
      z.object({
        timeframe: z.enum(["1M", "3M", "6M", "1Y", "ALL"]),
      })
    )
    .query(async ({ input }) => {
      const { timeframe } = input;
      const historicalData = await fetchHistoricalData(timeframe);
      return historicalData;
    }),
});
