import { PaginationLink, Pagination } from "@/types";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
    const visiblePages = getVisiblePages(data.links, data.current_page, data.last_page, 1);

    return (
        <div className="flex justify-between gap-2 translate-y-2">
            {/* I don't know why but pr-8 works ------------------------^ */}
            <div>
                <Link href={data.prev_page_url ?? ""}>
                    <Button variant="outline" size="sm" disabled={data.prev_page_url == null}>
                        <ChevronsLeft />
                    </Button>
                </Link>
            </div>
            <div className="flex space-x-2">
                {
                    visiblePages.map((page) => (
                        <Button
                            key={parseInt(page.label)}
                            variant="outline"
                            disabled={!page.url}
                            size="sm"
                            className={`${parseInt(page.label) === data.current_page ? 'bg-blue text-white' : ''}`}
                            asChild
                        >
                            <Link href={page.url ?? '#'}>{page.label}</Link>
                        </Button>
                    ))
                }
            </div>
            <div>
                <Link href={data.next_page_url ?? ""}>
                    <Button variant="outline" size="sm" disabled={data.next_page_url == null} className="cursor-pointer">
                        <ChevronsRight />
                    </Button>
                </Link>

            </div>
        </div>

    )
}

