import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'

type GridPostListProps = {
    posts: Models.Document[] | undefined,
    showUser?: boolean,
    showStats?: boolean
}
// A list of all posts are passed to this component for infinite scrolling.
export default function GridPostList({posts, showUser = true, showStats = true}: GridPostListProps) {
    const {user} = useUserContext()
    return (
        <ul className='grid-container'>
            {posts?.map((post: Models.Document): React.ReactNode => {
                return (
                    <li key={post.$id} className='relative min-w-80'> 
                    <Link to={`/posts/${post.$id}`} className='grid-post_link'>
                        <img src={post.imageUrl} alt='post' className='h-full w-full object-cover'/>
                    </Link>
                    <div className='grid-post_user'>
                        {showUser && (
                            <div className='flex items-center justify-start flex-1 gap-2 -mb-9'>
                                <img src={post.creator.imageUrl} alt='creator' className='h-8 w-8 rounded-full' />
                                <p className='line-clamp-1'>{ post.creator.name}</p>
                            </div>
                        )
                        }
                        {
                            showStats && <PostStats post={post} userId= {user.id}/>
                        }

                    </div>
                    </li>
                )
            })}
        </ul>
    )
}
