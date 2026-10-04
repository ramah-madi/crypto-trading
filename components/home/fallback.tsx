import DataTable from '@/components/DataTable';

export const CoinOverviewFallback = () => {
    return (
        <div id="coin-overview-fallback">
            <div className="header pt-2">
                <div className="header-image skeleton animate-pulse" />
                <div className="info">
                    <div className="header-line-sm skeleton animate-pulse" />
                    <div className="header-line-lg skeleton animate-pulse" />
                </div>
            </div>
        </div>
    );
};

const dummyRows = [1, 2, 3, 4, 5, 6];

const columns: DataTableColumn<number>[] = [
    {
        header: "Name",
        cellClassName: "name-cell",
        cell: () => (
            <div className="name-link">
                <div className="name-image skeleton animate-pulse" />
                <div className="name-line skeleton animate-pulse" />
            </div>
        )
    },
    {
        header: "24 Change",
        cellClassName: "change-cell",
        cell: () => (
            <div className="price-change">
                <div className="change-icon skeleton animate-pulse" />
                <div className="change-line skeleton animate-pulse" />
            </div>
        )
    },
    {
        header: "Price",
        cellClassName: "price-cell",
        cell: () => (
            <div className="price-line skeleton animate-pulse" />
        )
    }
];

export const TrendingCoinFallback = () => {
    return (
        <div id="trending-coins-fallback">
            <h4>Trending Coins</h4>
            <DataTable
                data={dummyRows}
                columns={columns}
                rowKey={(_, index) => index}
                tableClassName="trending-coins-table"
                headerCellClassName="py-3!"
                bodyCellClassName="py-2!"
            />
        </div>
    );
};

export const TrendingCoinsFallback = TrendingCoinFallback;
