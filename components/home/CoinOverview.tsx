import { formatCurrency } from '@/lib/utils'
import { fetcher } from '@/lib/coingecko.actions'
import Image from 'next/image'
import { CoinOverviewFallback } from './fallback';
import CandlestickChart from '../CandlestickChart';

const CoinOverview = async () => {
    let coin: CoinDetailsData;
    let coinOHLCdata: OHLCData[] = [];

    try {
        const coinPromise = fetcher<CoinDetailsData>('/coins/bitcoin', {
            dex_pair_format: 'symbol',
        });

        const ohlcPromise = fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
            vs_currency: 'usd',
            days: '1',
            precision: 'full'
        }).catch((error) => {
            console.error("Failed to fetch bitcoin OHLC data:", error);
            return [] as OHLCData[];
        });

        [coin, coinOHLCdata] = await Promise.all([coinPromise, ohlcPromise]);
    } catch (error) {
        console.error("Failed to fetch coin overview:", error);
        return <CoinOverviewFallback />;
    }

    return (
        <div id="coin-overview">
            <CandlestickChart data={coinOHLCdata} coinId='bitcoin'>
                <div className="header pt-2">
                    <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
                    <div className="info">
                        <p>{coin.name} / {coin.symbol.toUpperCase()}</p>
                        <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
                    </div>
                </div>
            </CandlestickChart>
        </div>
    );
}

export default CoinOverview