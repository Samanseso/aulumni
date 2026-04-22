import { Badge } from './ui/badge';


const CountTag = ({ count, label }: { count: number; label: string }) => {

    return (
        <Badge variant="secondary" className="text-black rounded-sm shadow-sm">
            {count}&nbsp; {label}
        </Badge>

    )
}

export default CountTag