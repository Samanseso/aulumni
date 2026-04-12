import { PaginationLink, Pagination } from "@/types";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link } from "@inertiajs/react";

interface TablePaginationProps {
    data: Pagination<any>;
}

function getVisiblePages(
    links: PaginationLink[],
    current: number,
    total: number,
    offset: number = 2
): PaginationLink[] {
    let start = current - offset;
    let end = current + offset;

    if (start < 1) {
        end += 1 - start;
        start = 1;
    }

    if (end > total) {
        start -= end - total;
        end = total;
    }

    start = Math.max(start, 1);

    const pages: PaginationLink[] = [];
    for (let p = start; p <= end; p++) {
        const link = links.find(l => parseInt(l.label) === p);
        if (link) pages.push(link);
    }

    return pages;
}




export function TablePagination({ data }: TablePaginationProps) {
    const visiblePages = getVisiblePages(data.links, data.current_page, data.last_page, 2);

    return (
        <div className="flex justify-between gap-2">

            {
                data.prev_page_url &&
                <Link href={data.prev_page_url}>
                    <Button variant="outline" size="icon" disabled={data.prev_page_url == null}>
                        <ChevronLeft />
                    </Button>
                </Link>
            }
            <div className="flex space-x-2">
                {
                    visiblePages.map((page) => (
                        <Button
                            key={parseInt(page.label)}
                            variant="outline"
                            disabled={!page.url}
                            size="icon"
                            className={`${parseInt(page.label) === data.current_page ? 'bg-blue text-white' : ''}`}
                            asChild
                        >
                            <Link href={page.url ?? '#'}>{page.label}</Link>
                        </Button>
                    ))
                }
            </div>
            <div>
                {
                    data.next_page_url &&
                    <Link href={data.next_page_url}>
                        <Button variant="outline" size="icon" disabled={data.next_page_url == null} className="cursor-pointer">
                            <ChevronRight />
                        </Button>
                    </Link>
                }

            </div>
        </div>

    )
}

