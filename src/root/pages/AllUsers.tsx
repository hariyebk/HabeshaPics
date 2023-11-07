import Loader from "@/components/shared/Loader"
import UserCard from "@/components/shared/UserCard"
import { useGetAllUsers } from "@/lib/react-query/queriesAndMutations"

export default function AllUsers() {
    const {data: users, isFetching: isFetchingUsers} = useGetAllUsers()
    if(isFetchingUsers){
        return (
            <div className="flex items-center w-full h-full">
                <Loader />
            </div>
        )
    }
    return (
        <div className="flex flex-col flex-1 items-center gap-5 overflow-scroll custom-scrollbar">
            <div className="flex justify-center md:justify-start md:items-start pt-10">
                <p className="h3-bold md:h2-bold text-left w-full "> All Users </p>
            </div>
            <div className="grid-container px-24">
                {
                    users?.documents.map((user) => {
                        return <UserCard user={user} key={user.$id}/>
                    })
                }
            </div>
        </div>
    )
}
