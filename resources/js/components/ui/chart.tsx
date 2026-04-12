import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const THEMES = {
    light: "",
    dark: ".dark",
} as const;

export type ChartConfig = Record<
    string,
    {
        label?: React.ReactNode;
        color?: string;
        icon?: React.ComponentType<{ className?: string }>;
    }
>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
    const context = React.useContext(ChartContext);

    if (! context) {
        throw new Error("Chart components must be used within a <ChartContainer />");
    }

    return context;
}

function ChartContainer({
    id,
    className,
    children,
    config,
    ...props
}: React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
    const uniqueId = React.useId().replace(/:/g, "");
    const chartId = `chart-${id ?? uniqueId}`;

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={chartId}
                className={cn(
                    "flex h-full w-full items-center justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-slate-500 [&_.recharts-polar-angle-axis-tick_text]:fill-slate-500 [&_.recharts-polar-radius-axis-tick_text]:fill-slate-400 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-slate-200 [&_.recharts-cartesian-grid_line]:stroke-slate-200 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-300 [&_.recharts-sector:focus]:outline-none",
                    className,
                )}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
    const colorEntries = Object.entries(config).filter(([, value]) => value.color);

    if (! colorEntries.length) {
        return null;
    }

    const styles = Object.entries(THEMES)
        .map(([theme, prefix]) => {
            const vars = colorEntries
                .map(([key, value]) => value.color ? `  --color-${key}: ${value.color};` : null)
                .filter(Boolean)
                .join("\n");

            return `${prefix} [data-chart='${id}'] {\n${vars}\n}`;
        })
        .join("\n");

    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}

const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartLegend = RechartsPrimitive.Legend;

function ChartTooltipContent({
    active,
    payload,
    label,
    className,
    hideLabel = false,
    indicator = "dot",
}: {
    active?: boolean;
    payload?: Array<{
        color?: string;
        dataKey?: string;
        name?: string;
        value?: number | string;
        payload?: Record<string, unknown>;
    }>;
    label?: string;
    className?: string;
    hideLabel?: boolean;
    indicator?: "dot" | "line";
}) {
    const { config } = useChart();

    if (! active || ! payload?.length) {
        return null;
    }

    return (
        <div className={cn("min-w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl", className)}>
            {! hideLabel && label ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {label}
                </p>
            ) : null}

            <div className="space-y-2">
                {payload.map((item) => {
                    const key = item.dataKey ?? item.name ?? "";
                    const definition = config[key];
                    const tone = item.color ?? definition?.color ?? "#014EA8";

                    return (
                        <div key={key} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn("inline-block rounded-full", indicator === "line" ? "h-1.5 w-4" : "size-2.5")}
                                    style={{ backgroundColor: tone }}
                                />
                                <span className="text-sm text-slate-600">
                                    {definition?.label ?? item.name ?? key}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-950">{item.value ?? 0}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ChartLegendContent({
    payload,
    className,
}: {
    payload?: Array<{
        color?: string;
        dataKey?: string;
        value?: string;
    }>;
    className?: string;
}) {
    const { config } = useChart();

    if (! payload?.length) {
        return null;
    }

    return (
        <div className={cn("flex flex-wrap items-center gap-4 pt-2", className)}>
            {payload.map((item) => {
                const key = item.dataKey ?? item.value ?? "";
                const definition = config[key];
                const tone = item.color ?? definition?.color ?? "#014EA8";

                return (
                    <div key={key} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: tone }} />
                        <span>{definition?.label ?? item.value ?? key}</span>
                    </div>
                );
            })}
        </div>
    );
}

export {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
};
