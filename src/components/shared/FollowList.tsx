import { useGetAllUsers, useGetUserById } from "@/lib/react-query/queriesAndMutations"
import { Link, useParams } from "react-router-dom"
import Loader from "./Loader"
import { Models } from "appwrite"

interface FollowistProps {
    showFollowers?: boolean,
    showFollowing?: boolean
}
export default function FollowList({showFollowers, showFollowing}: FollowistProps) {
    const {id} = useParams()
    const {data: currentUser, isFetching: isFecthingUser} = useGetUserById(id!)
    const {data: AllUsers, isFetching: isFetchingAllUsers} = useGetAllUsers()
    const followers = AllUsers?.documents.filter((user: Models.Document) => currentUser?.followers.includes(user.$id))
    const following = AllUsers?.documents.filter((user: Models.Document) => currentUser?.following.includes(user.$id))
    if(isFecthingUser || isFetchingAllUsers){
        return (
            <div className="flex flex-1 items-center w-full h-full">
                <Loader />
            </div>
        )
    }
    if(showFollowers && currentUser?.followers.length === 0){
        return (
            <div className="flex flex-1 items-center justify-center w-full h-full">
                <p className="text-light-4 base-medium"> You have no followers </p>
            </div>
        )
    }
    if(showFollowing && currentUser?.following.length === 0){
        return (
            <div className="flex flex-1 items-center justify-center w-full h-full">
                <p className="text-light-4 base-medium"> You are not following anyone</p>
            </div>
        )
    }
    return (
        <ul className="flex flex-1 flex-col gap-5 mt-20 mx-20 w-full h-full">
            {showFollowers && followers?.map((user: Models.Document): React.ReactNode => {
                return (
                    <li key={user.$id} className="flex justify-center items-center" >
                        <Link to={`/profile/${user.$id}`} className="flex items-center justify-between h-16 w-80  py-5 rounded-[45px] px-8 bg-dark-4" >
                            <img src= {user.imageUrl} alt="follower-photo" width={40} height={40} className="rounded-full md:ml-5" />
                            <p className="base-medium"> {user.name} </p>   
                            <p className="small-medium text-light-3"> @{user.username} </p>
                        </Link>
                    </li>
                )
            })}
            {showFollowing && following?.map((user: Models.Document): React.ReactNode => {
                return (
                    <li key={user.$id} className="flex justify-center items-center" >
                        <Link to={`/profile/${user.$id}`} className="flex items-center justify-between h-16 w-80  py-5 rounded-[45px] px-8 bg-dark-4" >
                            <img src= {user.imageUrl} alt="follower-photo" width={40} height={40} className="rounded-full md:ml-5" />
                            <p className="base-medium"> {user.name} </p>   
                            <p className="small-medium text-light-3"> @{user.username} </p>
                        </Link>
                    </li>
                )})}
        </ul>
    )
}
