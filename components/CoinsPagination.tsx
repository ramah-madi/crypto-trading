'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { buildPageNumbers, cn, ELLIPSIS } from "@/lib/utils";
import { spawn } from "child_process";
import { Span } from "next/dist/trace";
import { useRouter } from "next/navigation"


const CoinsPagination = ({ currentPage, totalPages, hasMorePages }: Pagination) => {
    const router = useRouter();

    const handlePageChange = (page: number) => {
        router.push(`/coins?page=${page}`);
    };

    const pageNumbers = buildPageNumbers(currentPage, totalPages);
    const isLastPage = !hasMorePages || currentPage === totalPages;

    return (
        <Pagination id="coins-pagination">
            <PaginationContent className="pagination-content">
                <PaginationItem className="pagination-control prev">
                    <PaginationPrevious className={currentPage === 1 ? 'control-disabled' : 'control-button'} onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
                </PaginationItem>
                <div className="pagination-pages">
                    {pageNumbers.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === ELLIPSIS ? (
                                <span className="ellipsis">...</span>
                            ) : (
                                <PaginationLink
                                    className={cn('page-link', {
                                        'page-link-active': currentPage === page
                                    })}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                </div>
                <PaginationItem className="pagination-control next">
                    <PaginationNext className={isLastPage ? 'control-disabled' : 'control-button'} onClick={() => !isLastPage && handlePageChange(currentPage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default CoinsPagination