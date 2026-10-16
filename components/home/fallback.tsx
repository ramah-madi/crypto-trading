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

const categoryDummyRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const categoryColumns: DataTableColumn<number>[] = [
    {
        header: "Category",
        cellClassName: "category-cell",
        cell: () => (
            <div className="category-skeleton skeleton animate-pulse" />
        )
    },
    {
        header: "Top Gainers",
        cellClassName: "top-gainers-cell",
        cell: () => (
            <div className="flex gap-1">
                <div className="coin-skeleton skeleton animate-pulse" />
                <div className="coin-skeleton skeleton animate-pulse" />
                <div className="coin-skeleton skeleton animate-pulse" />
            </div>
        )
    },
    {
        header: "24h Change",
        cellClassName: "change-cell",
        cell: () => (
            <div className="flex items-center gap-1">
                <div className="value-skeleton-sm skeleton animate-pulse" />
                <div className="change-icon skeleton animate-pulse" />
            </div>
        )
    },
    {
        header: "Market Cap",
        cellClassName: "market-cap-cell",
        cell: () => (
            <div className="value-skeleton-lg skeleton animate-pulse" />
        )
    },
    {
        header: "24h Volume",
        cellClassName: "volume-cell",
        cell: () => (
            <div className="value-skeleton-md skeleton animate-pulse" />
        )
    }
];

export const CategoriesFallback = () => {
    return (
        <div id="categories-fallback" className="custom-scrollbar">
            <h4>Top Categories</h4>
            <DataTable
                data={categoryDummyRows}
                columns={categoryColumns}
                rowKey={(_, index) => index}
                tableClassName="mt-3"
            />
        </div>
    );
};

export const CategoryFallback = CategoriesFallback;
