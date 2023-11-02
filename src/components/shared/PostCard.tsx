import { formatDistanceFromNow } from '../../lib/utils'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import { useUserContext } from '@/context/AuthContext'

type PostCardProps = {
    post: Models.Document
}

export default function PostCard({post}: PostCardProps) {
    const {user} = useUserContext()
    
    // CREATOR IS THE USER WHO CREATED THE POST
    if(!post?.creator) return
    const tags: string[] = post.tags
    return (
        <div className='post-card'>
            <div className='flex-between'>
                <div className='flex items-center gap-3'>
                    {/* CREATOR PROFILE */}
                    <Link to = {`/profile/${post.creator.$id}`}
                    >
                        <img src= {post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
                        className='rounded-full w-12 lg:h-12' 
                        alt='post-creator'
                        />
                    </Link>
                    <div className='flex flex-col'>
                        {/* POST CREATOR NAME */}
                        <p className='base-medium lg:body:bold text-light-1'> {post.creator.name} </p>
                        {/* POST DATE AND LOCATION */}
                        <div className=' flex-center gap-2 text-light-3 mt-2'>
                            <p className='subtle-semibold lg:small-regular'> {formatDistanceFromNow(post.$createdAt)}</p>
                            <p className='subtle-semibold lg:small-regular'> {post.location} </p>
                        </div>
                    </div>
                </div>
                {/* EDIT POST  */}
                <Link to={`/update-post/${post.$id}` }>
                    {user.id === post.creator.$id && <img src= '/assets/icons/edit.svg' alt='edit'
                    width={20} height={20}/>}
                </Link>
            </div>
            <Link to={`/posts/${post.$id}`}>
                <div className='small-medium lg:base-medium py-5'>
                    {/* CAPTION */}
                    <p> {post.caption} </p>
                    {/* TAGS */}
                    <ul className='flex gap-1 mt-3'>
                        {tags.map((tag: string): React.ReactNode => {
                            return (
                            <li key={tag} className='text-light-3'>
                                #{tag}
                            </li>
                            )
                        })}
                    </ul>
                </div>
                <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='post-image' className='post-card_img'
                />
            </Link>
            <PostStats post={post} userId= {user.id}/>
        </div>
    )
}
