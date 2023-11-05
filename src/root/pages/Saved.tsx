import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"

export default function Saved() {
    const {data: user, isFetching: isFetchingUser} = useGetCurrentUser() 
    // Since GridPostList accepts an array of posts
    const posts = user?.save.map((userSaved: Models.Document) => userSaved.post)
    if(isFetchingUser){
        return (
            <div className="flex items-center h-full w-full">
                <Loader />
            </div>
        )
    }
    if(!posts || posts?.length === 0){
        return (
            <div className='flex items-center h-full w-full'>
                <p className='text-light-4  text-center w-full mt-10'> You have no saved posts </p>
            </div>
        )
    }
    return (
        <div className="common-container">
            <div className="max-w-5xl flex-start gap-3 w-full ">
                <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add-post"/>
                <h2 className="h3-bold md:h2-bold text-left w-full "> Saved posts</h2>
            </div>
            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                <GridPostList posts={posts}  showStats = {false}/>
            </div>
        </div>
    )
}
