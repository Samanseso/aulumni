import { Branch } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

const BranchCard = ({ branch }: { branch: Branch }) => {
	return (
		<div className="relative rounded-lg overflow-hidden border">
			<div className="half-vetical-mask">	

			</div>
			<div className="absolute inset-y-0 right-0 w-[50%] flex flex-col justify-around px-3 text-white z-[11]">
				<p>{branch.name}</p>

				<p>{branch.address}</p>

				<p>{branch.contact}</p>
			</div>
			<img src="assets/images/au-bonifacio.jpg" alt="My Image" />



		</div>
	)
}

export default BranchCard