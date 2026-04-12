import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { DashboardChart } from "@/types";

function slugify(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function downloadElementAsPdf(element: HTMLElement, fileName: string) {
    const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;
    const ratio = Math.min(availableWidth / canvas.width, availableHeight / canvas.height);
    const width = canvas.width * ratio;
    const height = canvas.height * ratio;
    const x = (pageWidth - width) / 2;
    const y = margin;

    pdf.addImage(imageData, "PNG", x, y, width, height, undefined, "FAST");
    pdf.save(`${slugify(fileName)}.pdf`);
}

export function downloadChartDataAsCsv(chart: DashboardChart) {
    if (! chart.data.length) {
        return;
    }

    const headers = Object.keys(chart.data[0]);
    const rows = chart.data.map((row) =>
        headers
            .map((header) => JSON.stringify(row[header] ?? ""))
            .join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${slugify(chart.title)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}
