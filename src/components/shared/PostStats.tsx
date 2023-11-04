import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

type PostStatsProps = {
    post: Models.Document,
    userId: string,
    showOnlyLikes?: boolean
}
export default function PostStats({post, userId, showOnlyLikes = false}: PostStatsProps) {
    
    // likeList is just the collection of user Id's that liked the post
    const likesList: string[] = post.likes.map((user: Models.Document) => user.$id)
    const [likes, setLikes] = useState(likesList)
    const [isSaved, setIsSaved] = useState(false)
    
    const {mutate: likepost} = useLikePost()
    const {mutate: savepost, isPending: isSaving} = useSavePost()
    const {mutate: deleteSavedPost, isPending: isDeletingSavedPost} = useDeleteSavedPost()
    const {data: currentUser} = useGetCurrentUser()
    // Check if this specific post is in the current user's saved posts collection 
    const savedRecords = currentUser?.save.find((userSavedPost: Models.Document) => userSavedPost.post.$id === post.$id)
    useEffect(() => {
        setIsSaved(Boolean(savedRecords))
    }, [currentUser, savedRecords])
    
    function handleLikePost(e: React.MouseEvent){
        // stop the click event to trigger other elements in the div
        e.stopPropagation()
        let newLikes = [...likes]
        // If the user has already liked the post , unlike the post
        if(newLikes.includes(userId)){
            newLikes = newLikes.filter((LikeduserId: string) =>  LikeduserId !== userId)
        }
        // If the user didn't liked the post before, add the users id to the likes array
        else{
            newLikes.push(userId)
        }
        // UPDATE THE LIKES ARRAY STATE
        setLikes(newLikes)
        // UPDATE IT ON THE DATABASE
        likepost({postId: post.$id, likesArray: newLikes})
    }
    function handleSavePost(e: React.MouseEvent){
        e.stopPropagation()
        // If the post was saved before, delete that post from the saved posts collection
        if(savedRecords){
            setIsSaved(false)
            deleteSavedPost(savedRecords.$id)
        }
        // If the post was new , add it to the saved posts collection
        else{
            savepost({postId: post.$id, userId})
            setIsSaved(true)
        }
    }
    return (
    <div className="flex justify-between items-center z-20 mt-10">
        {showOnlyLikes ? <div className='flex gap-2 mr-5'>
            {/* LIKES, COMMENTS AND SHARES */}
            <div className='flex justify-between items-center'>
                <img src={likes.includes(userId) ? '/assets/icons/liked.svg': '/assets/icons/like.svg'} alt='like' width={20} height={20} className='cursor-pointer' onClick={handleLikePost} />
                <p className='small-medium lg:base-medium ml-2 lg:ml-2'> {likes.length}  </p>
            </div>
        </div>
        :
        <>
            <div className='flex gap-2 mr-5'>
                {/* LIKES, COMMENTS AND SHARES */}
                <div className='flex justify-between items-center'>
                    <img src={likes.includes(userId) ? '/assets/icons/liked.svg': '/assets/icons/like.svg'} alt='like' width={20} height={20} className='cursor-pointer' onClick={handleLikePost} />
                    <p className='small-medium lg:base-medium ml-2 lg:ml-2'> {likes.length}  </p>
                </div>
            </div>
            <div>
                {
                    isSaving || isDeletingSavedPost ? 
                    <Loader /> :
                    <img src={isSaved ? '/assets/icons/saved.svg': '/assets/icons/save.svg'} alt='save' width={20} height={20} className='cursor-pointer' onClick={handleSavePost} />
                }
            </div>
        </>
        }
    </div>
    )
}
