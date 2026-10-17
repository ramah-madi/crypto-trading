'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

export async function fetcher<T>(endpoint: string, params?: QueryParams, revalidate = 60): Promise<T> {
    if (!BASE_URL) {
        throw new Error("COINGECKO_BASE_URL not found");
    }

    if (!API_KEY) {
        throw new Error("COINGECKO_API_KEY not found");
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

    const isPro = cleanBaseUrl.includes('pro-api.coingecko.com');
    const apiKeyHeader = isPro ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';

    // Demo API does not support the 'interval' parameter for /ohlc endpoints
    // and limits 'days' to 365 max (does not accept 'max' string)
    const queryParams = { ...params };
    if (!isPro && cleanEndpoint.includes('ohlc')) {
        delete queryParams.interval;
        if (queryParams.days === 'max') {
            queryParams.days = 365;
        }
    }

    const url = qs.stringifyUrl({
        url: `${cleanBaseUrl}/${cleanEndpoint}`,
        query: queryParams
    }, { skipEmptyString: true, skipNull: true });

    const response = await fetch(url, {
        headers: {
            [apiKeyHeader]: API_KEY,
            "Content-Type": "application/json",
        } as Record<string, string>,
        next: { revalidate },
    });

    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

        throw new Error(`CoinGecko API Error: ${response.status}: ${errorBody.error || response.statusText}`);
    }
    return response.json();
};

export async function getPools(
    id: string,
    network?: string | null,
    contractAddress?: string | null
): Promise<PoolData> {
    const fallback: PoolData = {
        id: "",
        address: "",
        name: "",
        network: "",
    };

    if (network && contractAddress) {
        try {
            const poolData = await fetcher<{ data: PoolData[] }>(
                `/onchain/networks/${network}/tokens/${contractAddress}/pools`
            );

            return poolData.data?.[0] ?? fallback;
        } catch (error) {
            console.error("Failed to fetch pool data:", error);
            return fallback;
        }
    }

    try {
        const poolData = await fetcher<{ data: PoolData[] }>(
            "/onchain/search/pools",
            { query: id }
        );

        return poolData.data?.[0] ?? fallback;
    } catch {
        return fallback;
    }
};

export async function getTopGainersLosers(): Promise<{
    top_gainers: TopGainersLosers[];
    top_losers: TopGainersLosers[];
}> {
    const isPro = process.env.COINGECKO_BASE_URL?.includes('pro-api.coingecko.com') ?? false;

    // /coins/top_gainers_losers is a CoinGecko Pro-only endpoint.
    // Calling it on the Demo API returns 401 Unauthorized.
    if (isPro) {
        try {
            const response = await fetcher<{
                top_gainers: TopGainersLosersResponse[];
                top_losers: TopGainersLosersResponse[];
            }>('/coins/top_gainers_losers', {
                vs_currency: 'usd',
            });

            return {
                top_gainers: (response.top_gainers || []).slice(0, 5).map((coin) => ({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    image: coin.image,
                    price: coin.usd,
                    priceChangePercentage24h: coin.usd_24h_change,
                })),
                top_losers: (response.top_losers || []).slice(0, 5).map((coin) => ({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    image: coin.image,
                    price: coin.usd,
                    priceChangePercentage24h: coin.usd_24h_change,
                })),
            };
        } catch {
            // Fall through to markets calculation
        }
    }

    try {
        const markets = await fetcher<CoinMarketData[]>('/coins/markets', {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
        });

        const valid = (markets || []).filter(
            (c) => typeof c.price_change_percentage_24h === 'number'
        );

        const gainers = [...valid]
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
            .slice(0, 5)
            .map((coin) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                image: coin.image,
                price: coin.current_price,
                priceChangePercentage24h: coin.price_change_percentage_24h,
            }));

        const losers = [...valid]
            .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
            .slice(0, 5)
            .map((coin) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                image: coin.image,
                price: coin.current_price,
                priceChangePercentage24h: coin.price_change_percentage_24h,
            }));

        return { top_gainers: gainers, top_losers: losers };
    } catch {
        return { top_gainers: [], top_losers: [] };
    }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
    if (!query || !query.trim()) {
        return [];
    }

    try {
        const response = await fetcher<{ coins: any[] }>('/search', {
            query: query.trim(),
        });

        if (!response?.coins || !Array.isArray(response.coins)) {
            return [];
        }

        return response.coins.map((coin: any): SearchCoin => {
            const rawChange = coin.data?.price_change_percentage_24h;
            const change =
                typeof rawChange === 'number'
                    ? rawChange
                    : typeof rawChange?.usd === 'number'
                    ? rawChange.usd
                    : 0;

            const rawPrice = coin.data?.price;
            const price =
                typeof rawPrice === 'number'
                    ? rawPrice
                    : typeof rawPrice === 'string'
                    ? parseFloat(rawPrice.replace(/[^0-9.-]+/g, ''))
                    : undefined;

            return {
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                market_cap_rank: coin.market_cap_rank ?? null,
                thumb: coin.thumb,
                large: coin.large,
                data: {
                    price,
                    price_change_percentage_24h: change,
                },
            };
        });
    } catch (error) {
        console.error("Failed to search coins:", error);
        return [];
    }
}

export async function getTrendingCoins(): Promise<TrendingCoin[]> {
    try {
        const response = await fetcher<{ coins: TrendingCoin[] }>('/search/trending', undefined, 300);
        return response?.coins || [];
    } catch (error) {
        console.error("Failed to fetch trending coins:", error);
        return [];
    }
}


