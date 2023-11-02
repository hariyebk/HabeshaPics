import PostStats from "@/components/shared/PostStats"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/AuthContext"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { formatDistanceFromNow } from "@/lib/utils"
import { Loader } from "lucide-react"
import { Link, useParams } from "react-router-dom"


export default function PostDetails() {
    const {id: postId} = useParams()
    const {user} = useUserContext()
    const {data: post, isLoading: isGettingPost} = useGetPostById(postId || '')
    function handleDelete(){

    }
    if(isGettingPost){
        return(
            <div className="flex flex-1 justify-center items-center">
                <Loader />
            </div>
        )
    }
    return (
        <div className="post_details-card">
            {/* POST IMAGE */}
            <img src={post?.imageUrl} alt="post" className="post_details-img" />
            {/* POST DETAILS */}
            <div className='post_details-info'>
                <div className="flex-between w-full">
                    {/* CREATOR PROFILE */}
                    <Link to = {`/profile/${post?.creator.$id}`} className="flex items-center gap-3"
                    >
                        <img src= {post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
                        className='rounded-full w-8 h-8 lg:w-12 lg:h-12' 
                        alt='post-creator'
                        />
                        <div className='flex flex-col'>
                            {/* POST CREATOR NAME */}
                            <p className='base-medium lg:body:bold text-light-1 mt-2'> {post?.creator.name} </p>
                            {/* POST DATE AND LOCATION */}
                            <div className=' flex-center gap-2 text-light-3 mt-2'>
                                <p className='subtle-semibold lg:small-regular'> {formatDistanceFromNow(post?.$createdAt || '')}</p>
                                <p className='subtle-semibold lg:small-regular'> {post?.location} </p>
                            </div>
                        </div>
                    </Link>
                    {/* BUTTONS */}
                    <div className="flex-center gap-4">
                        {/* If the user didn't create the post, update and delete buttons will be hidden */}
                        <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && "hidden"}`}>
                            <img src="/assets/icons/edit.svg" width={24} height={24} alt="edit" />
                        </Link>
                        {/* DELETE POST */}
                        <Button onClick={handleDelete} variant='ghost' className= {`${user.id !== post?.creator.$id && "ghost_details_delete-btn"}`}>
                            <img src="/assets/icons/delete.svg" width={24} height={24} alt="delete" />
                        </Button>
                    </div>
                </div>
                <hr className="border w-full border-dark-4/80" />
                {/* CAPTIONS AND TAGS */}
                <div className='flex flex-col flex-1 w-full small-medium lg:base-regular py-5'>
                    {/* CAPTION */}
                    <p> {post?.caption} </p>
                    {/* TAGS */}
                    <ul className='flex gap-1 mt-3'>
                        {post?.tags.map((tag: string): React.ReactNode => {
                            return (
                            <li key={tag} className='text-light-3'>
                                #{tag}
                            </li>
                            )
                        })}
                    </ul>
                    {/* POST STATS */}
                    <div>
                        <PostStats post={post!}  userId= {user.id}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
