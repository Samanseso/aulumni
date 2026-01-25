import { cn } from '@/lib/utils';
import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
	classname?: String;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}	

const SearchBar = ({ classname, onChange } : SearchBarProps) => {
	return (
		<Input 
			endIcon={<Search size={20} color='gray' />}
			onChange={onChange}
			type="text"
			placeholder="Search here"
			className={cn("shadow-none focus-within:ring-0", classname)} />
	)
}

export default SearchBar