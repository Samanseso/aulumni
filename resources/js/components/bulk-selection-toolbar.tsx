import { LucideIcon, X } from "lucide-react";

import { Button } from "./ui/button";

type BulkSelectionAction = {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    iconClassName?: string;
    className?: string;
};

interface BulkSelectionToolbarProps {
    count: number;
    onClear: () => void;
    actions: BulkSelectionAction[];
}

export default function BulkSelectionToolbar({ count, onClear, actions }: BulkSelectionToolbarProps) {
    return (
        <div className="flex pe-2 bg-gray-100 rounded-full">
            <div className="flex items-center me-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-300" onClick={onClear}>
                    <X size={18} />
                </Button>

                <p className="text-sm text-muted-foreground">
                    {count} selected
                </p>
            </div>

            {actions.map((action) => {
                const Icon = action.icon;

                return (
                    <Button
                        key={action.label}
                        variant="ghost"
                        className={`rounded-full hover:bg-gray-300 ${action.className ?? ""}`.trim()}
                        onClick={action.onClick}
                    >
                        <Icon className={action.iconClassName} />
                        {action.label}
                    </Button>
                );
            })}
        </div>
    );
}
