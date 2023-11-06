import { Models } from 'appwrite'
import { Button } from '../ui/button'
import { useFollow, useGetCurrentUser, useUnFollow } from '@/lib/react-query/queriesAndMutations'
import Loader from './Loader'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface UserCardProps {
    user:  Models.Document
}

export default function UserCard({user}: UserCardProps) {
    const {data: currentuser} = useGetCurrentUser()
    const [Following, setFollowing] = useState(currentuser?.following.includes(user.$id))
    const {mutate: follow, isPending: isFollowing} = useFollow()
    const {mutate: unfollow, isPending: isUnfollowing} = useUnFollow()
    const navigate = useNavigate()
    function handleFollow(e: React.MouseEvent){
        e.stopPropagation()
        // type guard 
        if(currentuser && !Following){
            follow({followedId: user.$id , followerId: currentuser.$id})
            setFollowing(true)
        }
        else if (currentuser && Following){
            const newFollowersList: string[] = user.followers.filter((followerId: string) => followerId !== currentuser.$id)
            const newFollowingList : string[] = currentuser.following.filter((followingId: string) => followingId !== user.$id)
            unfollow({followedId: user.$id, newFollowersList , followerId: currentuser.$id, newFollowingList})
            setFollowing(false)
        }
    }
    function handleNavigate(){
        navigate(`/profile/${user.$id}`)
    }
    return (
        <div onClick={handleNavigate} className='flex flex-col flex-1 gap-5 h-60 w-56 ml-8 items-center cursor-pointer border-dark-4 mt-10 py-8'>
            <div className='flex-center flex-col gap-2'>
                <img src={user.imageUrl} className='rounded-full' width={40} height={40} alt='user-profile' />
                <p> {user.name} </p>
                <p className='text-light-4 small-medium'> @{user.username} </p>
            </div>
            {user.$id === currentuser?.$id || <div className='flex-center'>
                <Button className={`${!Following && 'shad-button_primary'}`} variant= {Following && "outline"} onClick={handleFollow}>
                    { isFollowing || isUnfollowing ? (
                        <Loader />
                    ) : Following ? 'following' : 'Follow' }
                </Button>
            </div>}
        </div>
    )
}
