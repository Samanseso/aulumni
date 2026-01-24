import { Input } from './ui/input'
import { Search } from 'lucide-react'

const SearchBar = () => {
  return (
    <Input endIcon={<Search size={20} color='gray' />} type="text" placeholder="Search here" className="shadow-none focus-within:ring-0" />
  )
}

export default SearchBar