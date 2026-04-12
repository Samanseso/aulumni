import { Head, usePage } from "@inertiajs/react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    XAxis,
    YAxis,
} from "recharts";
import {
    ArrowUpRight,
    CalendarClock,
    Download,
    FileDown,
    FileSpreadsheet,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { downloadChartDataAsCsv, downloadElementAsPdf } from "@/lib/dashboard-export";
import AppLayout from "@/layouts/app-layout";
import { home } from "@/routes";
import { BreadcrumbItem, DashboardChart, DashboardInsight, DashboardOverviewCard } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Admin Dashboard",
        href: home().url,
    },
];

const featuredChartIds = new Set(["monthly-activity", "content-pipeline"]);

export default function Dashboard() {
    const { props } = usePage<{
        generated_at: string;
        workbook_download_url: string;
        overview: DashboardOverviewCard[];
        charts: DashboardChart[];
        insights: DashboardInsight[];
    }>();

    const featuredCharts = props.charts.filter((chart) => featuredChartIds.has(chart.id));
    const remainingCharts = props.charts.filter((chart) => ! featuredChartIds.has(chart.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-1 flex-col gap-4 overflow-x-auto p-4">
                <section className="grid gap-4 xl:grid-cols-4">
                    {props.overview.map((card, index) => (
                        <OverviewCard key={card.id} card={card} tone={index % 2 === 0 ? "blue" : "red"} />
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <div className="space-y-4 xl:col-span-2">
                        {featuredCharts.map((chart) => (
                            <ChartCard key={chart.id} chart={chart} featured />
                        ))}
                    </div>

                    <Card className="border-0 bg-white shadow-[0_24px_70px_-42px_rgba(2,38,89,0.35)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-slate-950">What needs attention next</CardTitle>
                            <CardDescription>
                                A narrative layer for the charts so the dashboard reads more like a ready-made report deck.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {props.insights.map((insight) => (
                                <div
                                    key={insight.title}
                                    className={cn(
                                        "rounded-2xl border p-4",
                                        insight.tone === "blue"
                                            ? "border-blue/10 bg-blue/5"
                                            : "border-red/10 bg-red/5",
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-950">{insight.title}</p>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">{insight.description}</p>
                                        </div>
                                        <span
                                            className={cn(
                                                "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                                                insight.tone === "blue"
                                                    ? "bg-blue text-white"
                                                    : "bg-red text-white",
                                            )}
                                        >
                                            {insight.value}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <TrendingUp className="size-4" />
                                    <p className="text-sm font-semibold">Recommended use</p>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Export the charts you need for meetings, then use the workbook for the raw supporting data behind each visual.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    {remainingCharts.map((chart) => (
                        <div key={chart.id} className={cn(chart.id === "branch-performance" && "xl:col-span-2")}>
                            <ChartCard chart={chart} />
                        </div>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}

function OverviewCard({
    card,
    tone,
}: {
    card: DashboardOverviewCard;
    tone: "blue" | "red";
}) {
    const chartConfig: ChartConfig = {
        value: {
            label: card.label,
            color: tone === "blue" ? "#014EA8" : "#DA281C",
        },
    };

    return (
        <Card className="border-0 bg-white shadow-[0_18px_55px_-36px_rgba(2,38,89,0.35)]">
            <CardHeader className="gap-3 pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {card.label}
                        </CardDescription>
                        <CardTitle className="mt-2 text-3xl text-slate-950">{card.value}</CardTitle>
                    </div>
                </div>

                {/* <p className="text-sm leading-6 text-slate-600">{card.helper}</p> */}
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="h-16">
                    <ChartContainer config={chartConfig}>
                        <LineChart data={card.sparkline} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                            <Line
                                dataKey="value"
                                dot={false}
                                stroke="var(--color-value)"
                                strokeWidth={2.5}
                                type="monotone"
                            />
                        </LineChart>
                    </ChartContainer>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">{card.trend_label}</span>
                    {/* <span className={cn("font-semibold", isDown ? "text-red" : "text-blue")}>
                        {isDown ? "Needs watching" : "Healthy movement"}
                    </span> */}
                </div>
            </CardContent>
        </Card>
    );
}

function ChartCard({ chart, featured = false }: { chart: DashboardChart; featured?: boolean }) {
    const captureRef = useRef<HTMLDivElement>(null);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const handleExportPdf = async () => {
        if (! captureRef.current) {
            return;
        }

        try {
            setIsExportingPdf(true);
            await downloadElementAsPdf(captureRef.current, chart.title);
        } finally {
            setIsExportingPdf(false);
        }
    };

    return (
        <Card className="border-0 bg-white shadow-[0_24px_70px_-42px_rgba(2,38,89,0.35)]">
            <div ref={captureRef} className="rounded-[inherit] bg-white">
                <CardHeader className="gap-4 pb-2">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                            <div>
                                <CardTitle className="text-xl text-slate-950">{chart.title}</CardTitle>
                                <CardDescription className="mt-2 max-w-3xl leading-6 text-slate-600 max-w-130">
                                    {chart.description}
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-200 bg-white text-slate-700"
                                onClick={() => downloadChartDataAsCsv(chart)}
                            >
                                <FileSpreadsheet className="size-4" />
                                CSV
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-200 bg-white text-slate-700"
                                disabled={isExportingPdf}
                                onClick={handleExportPdf}
                            >
                                <FileDown className="size-4" />
                                {isExportingPdf ? "Preparing..." : "PDF"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className={cn("rounded-[26px] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3", featured ? "min-h-[360px]" : "min-h-[320px]")}>
                        <ChartRenderer chart={chart} />
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <ArrowUpRight className="mt-0.5 size-4 text-blue" />
                        <p className="text-sm leading-6 text-slate-600">{chart.insight}</p>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}

function ChartRenderer({ chart }: { chart: DashboardChart }) {
    const chartConfig = chart.series.reduce<ChartConfig>((config, series) => {
        config[series.key] = {
            label: series.label,
            color: series.color,
        };

        return config;
    }, {});

    if (! chart.data.length) {
        return (
            <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                No data available for this chart yet.
            </div>
        );
    }

    if (chart.type === "area") {
        return (
            <ChartContainer className="h-[320px]" config={chartConfig}>
                <AreaChart data={chart.data} margin={{ left: 12, right: 12, top: 18, bottom: 6 }}>
                    <defs>
                        {chart.series.map((series) => (
                            <linearGradient key={series.key} id={`fill-${chart.id}-${series.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={series.color} stopOpacity={0.35} />
                                <stop offset="95%" stopColor={series.color} stopOpacity={0.03} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis axisLine={false} dataKey={chart.x_key} tickLine={false} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {chart.series.map((series) => (
                        <Area
                            key={series.key}
                            dataKey={series.key}
                            fill={`url(#fill-${chart.id}-${series.key})`}
                            fillOpacity={1}
                            stroke={series.color}
                            strokeWidth={2.4}
                            type="monotone"
                        />
                    ))}
                </AreaChart>
            </ChartContainer>
        );
    }

    if (chart.type === "line") {
        return (
            <ChartContainer className="h-[320px]" config={chartConfig}>
                <LineChart data={chart.data} margin={{ left: 12, right: 12, top: 18, bottom: 6 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis axisLine={false} dataKey={chart.x_key} tickLine={false} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {chart.series.map((series) => (
                        <Line
                            key={series.key}
                            dataKey={series.key}
                            dot={{ r: 3, fill: series.color }}
                            stroke={series.color}
                            strokeWidth={2.4}
                            type="monotone"
                        />
                    ))}
                </LineChart>
            </ChartContainer>
        );
    }

    if (chart.type === "bar") {
        if (chart.layout === "horizontal") {
            return (
                <ChartContainer className="h-[320px]" config={chartConfig}>
                    <BarChart data={chart.data} layout="vertical" margin={{ left: 16, right: 12, top: 18, bottom: 6 }}>
                        <CartesianGrid horizontal={false} />
                        <XAxis allowDecimals={false} axisLine={false} tickLine={false} type="number" />
                        <YAxis axisLine={false} dataKey={chart.x_key} tickLine={false} type="category" width={140} />
                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {chart.series.map((series) => (
                            <Bar key={series.key} dataKey={series.key} fill={series.color} radius={[0, 12, 12, 0]} />
                        ))}
                    </BarChart>
                </ChartContainer>
            );
        }

        return (
            <ChartContainer className="h-[320px]" config={chartConfig}>
                <BarChart data={chart.data} margin={{ left: 12, right: 12, top: 18, bottom: 6 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis axisLine={false} dataKey={chart.x_key} tickLine={false} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {chart.series.map((series) => (
                        <Bar key={series.key} dataKey={series.key} fill={series.color} radius={[10, 10, 0, 0]} />
                    ))}
                </BarChart>
            </ChartContainer>
        );
    }

    if (chart.type === "radar") {
        return (
            <ChartContainer className="h-[360px]" config={chartConfig}>
                <RadarChart data={chart.data} margin={{ left: 24, right: 24, top: 12, bottom: 12 }}>
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <PolarGrid />
                    <PolarAngleAxis dataKey={chart.x_key} />
                    <PolarRadiusAxis allowDecimals={false} />
                    {chart.series.map((series) => (
                        <Radar
                            key={series.key}
                            dataKey={series.key}
                            fill={series.color}
                            fillOpacity={0.16}
                            stroke={series.color}
                            strokeWidth={2}
                        />
                    ))}
                </RadarChart>
            </ChartContainer>
        );
    }

    return (
        <ChartContainer className="h-[320px]" config={chartConfig}>
            <PieChart margin={{ top: 18, bottom: 18 }}>
                <ChartTooltip content={<PieTooltip />} />
                <Legend content={<PieLegend />} verticalAlign="bottom" />
                <Pie
                    data={chart.data}
                    dataKey={chart.value_key ?? "value"}
                    innerRadius={70}
                    nameKey={chart.name_key ?? "label"}
                    outerRadius={105}
                    paddingAngle={2}
                >
                    {chart.data.map((entry, index) => (
                        <Cell
                            key={`${chart.id}-${index}`}
                            fill={String(entry.fill ?? chart.series[index]?.color ?? "#014EA8")}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    );
}

function PieTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{
        name?: string;
        value?: number | string;
        payload?: { fill?: string };
    }>;
}) {
    if (! active || ! payload?.length) {
        return null;
    }

    const item = payload[0];

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: item.payload?.fill ?? "#014EA8" }} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-950">{item.value}</span>
            </div>
        </div>
    );
}

function PieLegend({
    payload,
}: {
    payload?: Array<{
        color?: string;
        value?: string;
    }>;
}) {
    if (! payload?.length) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center gap-4 pt-2">
            {payload.map((item) => (
                <div key={item.value} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color ?? "#014EA8" }} />
                    <span>{item.value}</span>
                </div>
            ))}
        </div>
    );
}
