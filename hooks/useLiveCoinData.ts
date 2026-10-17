'use client';

import { useState, useEffect } from "react";
import { fetcher } from "@/lib/coingecko.actions";

export const useLiveCoinData = ({
    coinId,
    liveInterval = '1m',
}: UseLiveCoinDataProps): UseLiveCoinDataReturn => {
    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        const execute = async () => {
            if (!coinId) return;

            try {
                const [coinDetailsResult, ohlcResult] = await Promise.allSettled([
                    fetcher<CoinDetailsData>(
                        `/coins/${coinId}`,
                        {
                            localization: 'false',
                            tickers: 'true',
                            market_data: 'true',
                            community_data: 'false',
                            developer_data: 'false',
                            sparkline: 'false',
                        },
                        10
                    ),
                    fetcher<OHLCData[]>(
                        `/coins/${coinId}/ohlc`,
                        {
                            vs_currency: 'usd',
                            days: 1,
                        },
                        10
                    ),
                ]);

                if (!isMounted) return;

                if (coinDetailsResult.status === 'fulfilled') {
                    const data = coinDetailsResult.value;

                    if (data?.market_data) {
                        const md = data.market_data;
                        const currentPrice = md.current_price?.usd ?? 0;
                        const change24h = md.price_change_percentage_24h_in_currency?.usd ?? 0;

                        setPrice({
                            usd: currentPrice,
                            price: currentPrice,
                            coin: coinId,
                            change24h,
                            marketCap: md.market_cap?.usd ?? 0,
                            volume24h: md.total_volume?.usd ?? 0,
                            timestamp: Date.now(),
                        });
                    }

                    if (data?.tickers && Array.isArray(data.tickers)) {
                        const mappedTrades: Trade[] = data.tickers.slice(0, 30).map((t) => ({
                            price: t.converted_last?.usd,
                            timestamp: t.timestamp ? new Date(t.timestamp).getTime() : Date.now(),
                            type: t.target?.toLowerCase() === 'usd' || t.target?.toLowerCase() === 'usdt' ? 'buy' : 'sell',
                            amount: (t as unknown as { volume?: number }).volume,
                            value: (t as unknown as { converted_volume?: { usd?: number } }).converted_volume?.usd,
                        }));
                        setTrades(mappedTrades);
                    }

                    setIsConnected(true);
                }

                if (ohlcResult.status === 'fulfilled') {
                    const ohlcList = ohlcResult.value;
                    if (Array.isArray(ohlcList) && ohlcList.length > 0) {
                        setOhlcv(ohlcList[ohlcList.length - 1]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch CoinGecko data:", error);
                if (isMounted) {
                    setIsConnected(false);
                }
            }
        };

        void execute();

        const intervalMs = liveInterval === '1s' ? 10000 : 60000;
        const intervalId = setInterval(execute, intervalMs);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [coinId, liveInterval]);

    return {
        price,
        trades,
        ohlcv,
        isConnected,
    };
};

export const useCoinGeckoData = useLiveCoinData;