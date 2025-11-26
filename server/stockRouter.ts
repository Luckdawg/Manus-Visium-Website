import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

/**
 * Stock data router for fetching real-time VISM stock information
 * with caching and rate limit handling
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

// Cache for stock data to avoid hitting rate limits
let stockDataCache: { data: StockData; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for historical data
const historicalDataCache: Map<string, { data: HistoricalDataPoint[]; timestamp: number }> = new Map();
const HISTORICAL_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch VISM stock data from Yahoo Finance with caching
 */
async function fetchStockData(): Promise<StockData> {
  // Check cache first
  if (stockDataCache && Date.now() - stockDataCache.timestamp < CACHE_DURATION) {
    console.log("[Stock API] Returning cached data");
    return stockDataCache.data;
  }

  try {
    // Use Yahoo Finance API for OTC stocks
    const response = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/VISM?interval=1d&range=1d",
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check if we got valid data
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error("Invalid response from Yahoo Finance");
    }

    const quote = data.chart.result[0];
    const meta = quote.meta;

    const currentPrice = meta.regularMarketPrice || meta.previousClose || 0.0054;
    const previousClose = meta.chartPreviousClose || meta.previousClose || 0.0057;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    const stockData: StockData = {
      price: parseFloat(currentPrice.toFixed(4)),
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: meta.regularMarketVolume || 0,
      marketCap: "$2.1M",
      high52Week: meta.fiftyTwoWeekHigh || 0.046,
      low52Week: meta.fiftyTwoWeekLow || 0.0011,
      timestamp: new Date().toISOString(),
    };

    // Update cache
    stockDataCache = {
      data: stockData,
      timestamp: Date.now(),
    };

    console.log("[Stock API] Fetched fresh data from Yahoo Finance:", stockData.price);
    return stockData;
  } catch (error) {
    console.error("[Stock API] Failed to fetch from Yahoo Finance:", error);
    
    // If we have cached data (even if expired), return it
    if (stockDataCache) {
      console.log("[Stock API] Returning expired cache due to API error");
      return stockDataCache.data;
    }
    
    // Last resort: return fallback data
    console.log("[Stock API] Using fallback data");
    const fallbackData: StockData = {
      price: 0.0054,
      change: -0.0003,
      changePercent: -5.26,
      volume: 18105,
      marketCap: "$2.1M",
      high52Week: 0.046,
      low52Week: 0.0011,
      timestamp: new Date().toISOString(),
    };
    
    // Cache fallback data to avoid repeated API failures
    stockDataCache = {
      data: fallbackData,
      timestamp: Date.now(),
    };
    
    return fallbackData;
  }
}

/**
 * Fetch historical stock data from Yahoo Finance with caching
 */
async function fetchHistoricalData(timeframe: string): Promise<HistoricalDataPoint[]> {
  // Check cache first
  const cached = historicalDataCache.get(timeframe);
  if (cached && Date.now() - cached.timestamp < HISTORICAL_CACHE_DURATION) {
    console.log(`[Stock API] Returning cached historical data for ${timeframe}`);
    return cached.data;
  }

  try {
    // Map timeframe to Yahoo Finance range parameter
    const rangeMap: Record<string, string> = {
      "1M": "1mo",
      "3M": "3mo",
      "6M": "6mo",
      "1Y": "1y",
      "ALL": "5y",
    };
    
    const range = rangeMap[timeframe] || "6mo";
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/VISM?interval=1d&range=${range}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error("Invalid response from Yahoo Finance");
    }

    const quote = data.chart.result[0];
    const timestamps = quote.timestamp || [];
    const closePrices = quote.indicators.quote[0].close || [];

    const historicalData: HistoricalDataPoint[] = timestamps.map((timestamp: number, index: number) => {
      const date = new Date(timestamp * 1000);
      return {
        date: date.toISOString().split('T')[0],
        price: parseFloat((closePrices[index] || 0).toFixed(4)),
      };
    }).filter((point: HistoricalDataPoint) => point.price > 0);

    // Update cache
    historicalDataCache.set(timeframe, {
      data: historicalData,
      timestamp: Date.now(),
    });

    console.log(`[Stock API] Fetched fresh historical data for ${timeframe}: ${historicalData.length} points`);
    return historicalData;
  } catch (error) {
    console.error("[Stock API] Failed to fetch historical data:", error);
    
    // Check if we have cached data (even if expired)
    const cached = historicalDataCache.get(timeframe);
    if (cached) {
      console.log(`[Stock API] Returning expired cache for ${timeframe} due to API error`);
      return cached.data;
    }
    
    // Return empty array on error
    return [];
  }
}

export const stockRouter = router({
  /**
   * Get current VISM stock data with caching
   */
  getVISMData: publicProcedure.query(async () => {
    const data = await fetchStockData();
    return data;
  }),

  /**
   * Get historical stock data for charting with caching
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
