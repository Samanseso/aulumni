import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, ModalType, Branch } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Plus, ListFilter } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import { Modal } from "@/components/modal";
import BranchTable from "@/components/branch-table";
import { Filter } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { index } from "@/routes/branch";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branch',
        href: '',
    },

];


export const columns: string[] = [
    "Branch_id",
    "Name",
    "Address",
    "Contact"
]



export default function Branches() {
    const { props } = usePage<{ branches: Branch[], modal: ModalType, addresses: string[] }>();

    const [branches, setBranches] = useState<Branch[]>(props.branches);
    const [searchInput, setSearchInput] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

    const [tableVersion, setTableVersion] = useState(0);

    const [filter, setFilter] = useState<Filter[]>([]);


    const [open, setOpen] = useState(false);

    const doDelete = (id: string) => {
        setIsOpenDeleteModal(true);
        setSelectedStudent(id)
    }

    useEffect(() => {
        setOpen(false);
        setBranches(props.branches);
    }, [props.branches]);

    const updateTable = (newReservation: Pagination<Branch[]>) => {
        setBranches(newReservation.data);
    }

    useEffect(() => {
        setTableVersion(v => v + 1);
    }, [branches])

    const handleAddressChange = (e: string) => {
        console.log(e)
        if (e === "none") {
            setBranches(props.branches)
        } else {
            setBranches(props.branches.filter(branch => branch.address === e));
        }
    }



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="m-4 bg-white shadow rounded-lg h-[100%] overflow-hidden">
                <div className="flex p-5 pb-2 justify-between mb-6">
                    <p className="font-bold text-xl text-gray-600">List of Branches</p>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <ListFilter size={15} className="" />
                            <Select defaultValue={filter.find(f => f.property === "address")?.value || ""} onValueChange={handleAddressChange}>
                                <SelectTrigger className="text-black gap-2 !text-black">
                                    <SelectValue placeholder="Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        filter.find(f => f.property === "course")?.value ?
                                            <SelectItem value="none" className="text-red">Reset</SelectItem> :
                                            <SelectItem value="none" className="hidden">Address</SelectItem>
                                    }
                                    {props.addresses.map(address => (
                                        <SelectItem key={address} value={address}>{address}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <SearchBar />
                        <Link href={''} as="div">
                            <Button variant="outline" size="default" className="text-xs text-white bg-blue hover:bg-red hover:text-white"><Plus />Add Branch</Button>
                        </Link>
                    </div>
                </div>

                {/* <div className="m-4 mt-0 grid grid-cols-3 gap-4">
                    {branches.map((branch) => {
                        return (
                            <BranchCard branch={branch} key={branch.name} />
                        )
                    })}

                </div> */}

                <BranchTable columns={columns} branch={branches} />




                {props.modal && props.modal.status && <Modal key={tableVersion + 1} content={props.modal} />}

            </div>
        </AppLayout>
    );
}