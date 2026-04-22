import type { ReactNode } from 'react';
import { Badge } from './ui/badge';


const StatusTag = ({ text }: { text: string }) => {
    const getBgColor = () => {
        switch (text) {
            case "inactive":
            case "pending": return "#c2bf2d";
            case "LOADING":
            case "ASSIGNED": return "#8dc9ecff";
            case "EN ROUTE": return "#d978e6ff";
            case "IN TRANSIT":
            case "DELIVERED": 
            case "DISPATCHED":
            case "approved":
            case "active": return "#28894a";
            case "WAITING":
            case "rejected":
            case "CANCELLED": return "#e98780ff";   
            default: return "#84b8ef";
        }
    }
    


    return (
        <Badge variant="secondary" style={{ backgroundColor: getBgColor()}} className="text-white uppercase rounded-sm shadow-sm">
            {text}
        </Badge>

    )
}

export default StatusTag