import { router, usePage } from '@inertiajs/react';
import { Briefcase, MapPin, PhilippinePeso, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import PostItem from '@/components/post-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import NewsFeedLayout from '@/layouts/news-feed-layout';
import { CompletePost } from '@/types';
import { show_find_job } from '@/routes/news-feed';

type Filter = { property: string; value: string };

const FindJob = () => {
    const { props } = usePage<{ posts: CompletePost[] }>();

    const params = new URLSearchParams(window.location.search);

    const initialFilters: Filter[] = Array.from(params.entries()).map(
        ([property, value]) => ({
            property,
            value,
        }),
    );

    const [posts, setPosts] = useState<CompletePost[]>(props.posts ?? []);

    useEffect(() => {
        setPosts(props.posts ?? []);
    }, [props.posts]);

    const [filter, setFilter] = useState<Filter[]>(initialFilters);

    const [searchInput, setSearchInput] = useState(
        initialFilters.find((f) => f.property === 'search')?.value ?? '',
    );

    const [locationInput, setLocationInput] = useState(
        initialFilters.find((f) => f.property === 'location')?.value ?? '',
    );

    const [salaryMin, setSalaryMin] = useState(
        initialFilters.find((f) => f.property === 'salary_min')?.value ?? '',
    );

    const [salaryMax, setSalaryMax] = useState(
        initialFilters.find((f) => f.property === 'salary_max')?.value ?? '',
    );

    const [salaryOpen, setSalaryOpen] = useState(false);

    const applyFilters = useCallback((nextFilters: Filter[]) => {
        const paramObj = nextFilters.reduce(
            (acc, cur) => {
                acc[cur.property] = cur.value;
                return acc;
            },
            {} as Record<string, string>,
        );

        router.get(show_find_job().url, paramObj, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, []);

    const setOrRemove = (property: string, value?: string) => {
        const next =
            !value || value === 'none'
                ? filter.filter((f) => f.property !== property)
                : [
                      ...filter.filter((f) => f.property !== property),
                      { property, value },
                  ];

        setFilter(next);
        applyFilters(next);
    };

    const applySalary = () => {
        let next = filter.filter(
            (f) =>
                f.property !== 'salary_min' &&
                f.property !== 'salary_max',
        );

        if (salaryMin)
            next.push({ property: 'salary_min', value: salaryMin });

        if (salaryMax)
            next.push({ property: 'salary_max', value: salaryMax });

        setFilter(next);
        applyFilters(next);
    };

    const clearAllFilters = () => {
        setFilter([]);
        setSearchInput('');
        setLocationInput('');
        setSalaryMin('');
        setSalaryMax('');
        setSalaryOpen(false);

        router.get(show_find_job().url, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <NewsFeedLayout>
            <div className="grid gap-4">
                {/* FILTER BAR */}
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                            startIcon={<Search size={16} />}
                            placeholder="Job title..."
                            value={searchInput}
                            onChange={(e) =>
                                setSearchInput(e.target.value)
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' &&
                                setOrRemove(
                                    'search',
                                    searchInput,
                                )
                            }
                            className="flex-1 rounded-full"
                        />

                        <Input
                            startIcon={<MapPin size={16} />}
                            placeholder="Location..."
                            value={locationInput}
                            onChange={(e) =>
                                setLocationInput(e.target.value)
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' &&
                                setOrRemove(
                                    'location',
                                    locationInput,
                                )
                            }
                            className="flex-1 rounded-full"
                        />

                        <Button
                            className="rounded-full"
                            onClick={() => {
                                setOrRemove(
                                    'search',
                                    searchInput,
                                );
                                setOrRemove(
                                    'location',
                                    locationInput,
                                );
                            }}
                        >
                            Search
                        </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Select
                            value={
                                filter.find(
                                    (f) =>
                                        f.property ===
                                        'job_type',
                                )?.value ?? ''
                            }
                            onValueChange={(value) =>
                                setOrRemove(
                                    'job_type',
                                    value,
                                )
                            }
                        >
                            <SelectTrigger className="w-36 rounded-full">
                                <SelectValue placeholder="Job Type" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="none">
                                    Reset
                                </SelectItem>
                                <SelectItem value="full_time">
                                    Full Time
                                </SelectItem>
                                <SelectItem value="part_time">
                                    Part Time
                                </SelectItem>
                                <SelectItem value="contract">
                                    Contract
                                </SelectItem>
                                <SelectItem value="internship">
                                    Internship
                                </SelectItem>
                                <SelectItem value="freelance">
                                    Freelance
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {!salaryOpen ? (
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() =>
                                    setSalaryOpen(true)
                                }
                            >
                                <PhilippinePeso size={14} />
                                Salary
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 rounded-full border px-3 py-1">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={salaryMin}
                                    onChange={(e) =>
                                        setSalaryMin(
                                            e.target.value,
                                        )
                                    }
                                    onBlur={applySalary}
                                    className="w-16 text-sm outline-none"
                                />

                                <span>-</span>

                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={salaryMax}
                                    onChange={(e) =>
                                        setSalaryMax(
                                            e.target.value,
                                        )
                                    }
                                    onBlur={applySalary}
                                    className="w-16 text-sm outline-none"
                                />

                                <button
                                    onClick={() => {
                                        setSalaryMin('');
                                        setSalaryMax('');
                                        setSalaryOpen(false);
                                        setOrRemove(
                                            'salary_min',
                                        );
                                        setOrRemove(
                                            'salary_max',
                                        );
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                        >
                            Clear All
                        </Button>
                    </div>
                </div>

                {/* RESULTS */}
                {posts.length === 0 ? (
                    <div className="rounded-xl border bg-white py-16 text-center">
                        No jobs found
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.post_uuid}
                            className="rounded-xl border bg-white shadow-sm"
                        >
                            <PostItem post={post} />
                        </div>
                    ))
                )}
            </div>
        </NewsFeedLayout>
    );
};

export default FindJob;