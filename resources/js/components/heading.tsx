import { cn } from "@/lib/utils";

export default function Heading({
    title,
    description,
    classname,
}: {
    title: string;
    description?: string;
    classname?: string;
}) {
    return (
        <div className={cn(
            "mb-8 space-y-0.5",
            classname
        )}>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
