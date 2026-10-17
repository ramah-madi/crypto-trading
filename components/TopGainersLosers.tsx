'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';

interface TopGainersLosersProps {
    topGainers: TopGainersLosers[];
    topLosers: TopGainersLosers[];
}

const TopGainersLosers = ({ topGainers, topLosers }: TopGainersLosersProps) => {
    const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
    const coins = activeTab === 'gainers' ? topGainers : topLosers;

    return (
        <div id="top-gainers-losers">
            <div className="tabs-list flex gap-6 items-center">
                <button
                    type="button"
                    className={cn(
                        "tabs-trigger cursor-pointer transition-colors text-purple-100/60 hover:text-white",
                        activeTab === 'gainers' && "text-white"
                    )}
                    data-state={activeTab === 'gainers' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('gainers')}
                >
                    Top Gainers
                </button>
                <button
                    type="button"
                    className={cn(
                        "tabs-trigger cursor-pointer transition-colors text-purple-100/60 hover:text-white",
                        activeTab === 'losers' && "text-white"
                    )}
                    data-state={activeTab === 'losers' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('losers')}
                >
                    Top Losers
                </button>
            </div>

            <div className="tabs-content">
                {coins.length === 0 ? (
                    <p className="text-sm text-purple-100/50 py-4 col-span-full">No data available</p>
                ) : (
                    coins.map((coin) => {
                        const isPositive = coin.priceChangePercentage24h >= 0;

                    return (
                        <Link
                            key={coin.id}
                            href={`/coins/${coin.id}`}
                            className="bg-dark-500 hover:bg-dark-400/60 transition-all rounded-xl p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <Image
                                    src={coin.image}
                                    alt={coin.name}
                                    width={44}
                                    height={44}
                                    className="rounded-full size-11 object-cover shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <p className="font-bold text-white text-base truncate max-w-36 sm:max-w-44">
                                        {coin.name}
                                    </p>
                                    <p className="text-xs text-purple-100/70 uppercase">
                                        {coin.symbol}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end shrink-0 pl-3">
                                <p className="font-bold text-white text-base">
                                    {formatCurrency(coin.price)}
                                </p>
                                <div
                                    className={cn(
                                        "flex items-center gap-1 text-sm font-medium",
                                        isPositive ? "text-green-500" : "text-red-500"
                                    )}
                                >
                                    {isPositive ? (
                                        <TrendingUp size={16} />
                                    ) : (
                                        <TrendingDown size={16} />
                                    )}
                                    <span>
                                        {formatPercentage(Math.abs(coin.priceChangePercentage24h))}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                }))}
            </div>
        </div>
    );
};

export default TopGainersLosers;
