import EditProfileForm from "@/components/forms/EditProfileForm"
import Loader from "@/components/shared/Loader"
import { useGetUserById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"


export default function UpdateProfile() {
    const {id} = useParams()
    const {data: user, isFetching: isFetchingUser} = useGetUserById(id!)
    if(isFetchingUser){
        return(
            <div className="flex flex-1 items-center w-full h-full">
                <Loader />
            </div>
        )
    }
    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 w-full ">
                    <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add-post"/>
                    <h2 className="h3-bold md:h2-bold text-left w-full "> Edit post</h2>
                </div>
                <EditProfileForm user={user} />
            </div>
        </div>
    )
}
