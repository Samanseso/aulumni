import type { ReactNode } from 'react';
import { Badge } from './ui/badge';


const StatusTag = ({ text }: { text: string }) => {
    const getBgColor = () => {
        switch (text) {
            case "inactive":
            case "pending": return "rgb(194, 191, 45)";
            case "LOADING":
            case "ASSIGNED": return "#8dc9ecff";
            case "EN ROUTE": return "#d978e6ff";
            case "IN TRANSIT":
            case "DELIVERED": 
            case "DISPATCHED":
            case "active": return "rgb(40, 137, 74)";
            case "WAITING":
            case "CANCELLED": return "#e98780ff";   
            default: return "#e6e6e6";
        }
    }
    


    return (
        <Badge variant="secondary" style={{ backgroundColor: getBgColor()}} className="text-white uppercase rounded-sm">
            {text}
        </Badge>

    )
}

export default StatusTag