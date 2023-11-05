import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import { Button } from "@/components/ui/button"
import { useGetAllPosts, useGetCurrentUser} from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import { useState } from "react"
import { Link } from "react-router-dom"


export default function Profile() {
    const [showLiked, setShowLiked] = useState(false)
    const {data: currentUser, isFetching: isFetchingUser} = useGetCurrentUser()
    const {data: Allposts, isFetching: isFetchingAllPosts} = useGetAllPosts()
    // What I am doing here is not totally good when the application get's more users. it's not ideal to get all posts and filter out what the curret user liked.
    // since the liked posted inside the current user do not have the likes property we can not use the post card for this scenario.
    const posts = Allposts?.documents.filter((post: Models.Document) => post.creator.accountId === currentUser?.accountId)
    const likedPosts: Models.Document[]  = []
    Allposts?.documents.map((post: Models.Document) => {
        if(post.likes.length > 0){
            post.likes.map((user: Models.Document) => {
                if(user.accountId === currentUser?.accountId){
                    likedPosts.push(post)
                }
            })
        }
    })

    if(showLiked && likedPosts.length === 0){
        return(
            <div className="flex flex-1 items-center w-full h-full">
                <p className="text-light-4 small-medium"> You have not liked any posts </p>
            </div>
        )
    }
    if(isFetchingUser || isFetchingAllPosts){
        return(
            <div className="flex items-center w-full h-full">
                <Loader />
            </div>
        )
    }
    return (
        <div className="flex flex-1">
            <div className="flex flex-1 flex-col mt-5 py-10 gap-14 w-full h-full">
                {/* user profile */}
                <div className="flex-center">
                    <div className="flex justify-between items-center gap-5">
                        <img src = {currentUser?.imageUrl} alt="profile-image" className="rounded-full h-14 w-14 md:h-28 md:w-28" />
                        <div className="flex flex-col gap-3">
                            <p className="h3-bold sm:h2-bold"> {currentUser?.name.toUpperCase()} </p>
                            <p className="text-light-4 body-medum mb-4"> @{currentUser?.username} </p>
                            <div className="flex items-center justify-between gap-3 small-regular">
                                <p> {currentUser?.posts.length} posts </p>
                                <p> 20 Followers </p>
                                <p> 50 Following </p>
                            </div>
                        </div>
                        {/* Edit Profile */}
                        <Link to={`/update-profile/${currentUser?.$id}`} className="flex items-center justify-between gap-3 md:ml-10 bg-dark-4 px-5 py-3 rounded-lg">
                            <img src = '/assets/icons/edit.svg' width={30} height={30} alt="edit-profile" />
                            <p className="small-medium"> Edit Profile</p>
                        </Link>
                    </div>
                </div>
                {/* Posts and Liked posts */}
                <div className="flex justify-start items-start gap-4 ml-10 pl-56">
                    <Button className="bg-dark-4 px-5 py-3" onClick={() => setShowLiked(false)}>
                        <img src="/assets/icons/posts.svg" width={20} height={20} alt="posts" />
                        <p className="small-medium ml-3"> posts </p>
                    </Button>
                    <Button className="bg-dark-4 px-5 py-3" onClick={() => setShowLiked(true)}>
                        <img src="/assets/icons/like.svg" width={20} height={20} alt="posts" />
                        <p className="small-medium ml-3"> Liked </p>
                    </Button>
                </div>
                {/* posts */}
                <div className="mx-10 px-20 overflow-x-hidden overflow-scroll custom-scrollbar">
                    <GridPostList posts={showLiked ? likedPosts : posts} showUser = {false} showStats = {false} /> 
                </div>
                <div>
            </div>
            </div>
        </div>
    )
}
