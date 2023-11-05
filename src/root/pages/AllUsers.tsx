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
        <div className="flex flex-1 flex-col gap-2 ml-10 sm:ml-24">
            <div className="flex justify-start sm:justify-center items-center pt-10">
                <p className="h3-bold md:h2-bold text-left w-full "> All Users </p>
            </div>
            <div className="grid-container">
                {
                    users?.documents.map((user) => {
                        return <UserCard user={user} key={user.$id}/>
                    })
                }
            </div>
        </div>
    )
}
