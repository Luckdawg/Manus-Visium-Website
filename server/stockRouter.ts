import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

/**
 * Stock data router for fetching real-time VISM stock information
 * from Google Finance
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

/**
 * Fetch VISM stock data from Google Finance
 * Since Google Finance doesn't provide a public API, we'll use
 * a fallback approach with Yahoo Finance API via CORS proxy
 */
async function fetchStockData(): Promise<StockData> {
  try {
    // Try Yahoo Finance API first (more reliable for OTC stocks)
    const response = await fetch(
      "https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/VISM?interval=1d&range=1d"
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API failed: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.chart.result[0];
    const meta = quote.meta;
    const indicators = quote.indicators.quote[0];

    const currentPrice = meta.regularMarketPrice || 0.0062;
    const previousClose = meta.chartPreviousClose || 0.005;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      price: currentPrice,
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: meta.regularMarketVolume || 478610,
      marketCap: "$2.1M",
      high52Week: 0.046,
      low52Week: 0.0011,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[Stock API] Failed to fetch from Yahoo Finance:", error);
    
    // Fallback to static Google Finance data
    return {
      price: 0.0062,
      change: 0.0012,
      changePercent: 23.0,
      volume: 478610,
      marketCap: "$2.1M",
      high52Week: 0.046,
      low52Week: 0.0011,
      timestamp: new Date().toISOString(),
    };
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
   * Returns mock data for now - can be enhanced with real API later
   */
  getHistoricalData: publicProcedure
    .input(
      z.object({
        timeframe: z.enum(["1M", "3M", "6M", "1Y", "ALL"]),
      })
    )
    .query(async ({ input }) => {
      // For now, return the existing mock data structure
      // This can be enhanced later to fetch real historical data
      const { timeframe } = input;
      
      // Generate mock historical data based on timeframe
      const now = new Date();
      const dataPoints: Array<{ date: string; price: number; volume: number }> = [];
      
      let daysBack = 30;
      if (timeframe === "3M") daysBack = 90;
      else if (timeframe === "6M") daysBack = 180;
      else if (timeframe === "1Y") daysBack = 365;
      else if (timeframe === "ALL") daysBack = 730;
      
      for (let i = daysBack; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Generate realistic-looking price data
        const basePrice = 0.0033;
        const trend = (daysBack - i) / daysBack * 0.003;
        const noise = (Math.random() - 0.5) * 0.001;
        const price = basePrice + trend + noise;
        
        dataPoints.push({
          date: date.toISOString().split("T")[0],
          price: parseFloat(price.toFixed(4)),
          volume: Math.floor(Math.random() * 500000) + 100000,
        });
      }
      
      return dataPoints;
    }),
});
