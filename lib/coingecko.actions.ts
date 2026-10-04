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

    const url = qs.stringifyUrl({
        url: `${cleanBaseUrl}/${cleanEndpoint}`,
        query: params
    }, { skipEmptyString: true, skipNull: true });

    const isPro = cleanBaseUrl.includes('pro-api.coingecko.com');
    const apiKeyHeader = isPro ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';

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
}