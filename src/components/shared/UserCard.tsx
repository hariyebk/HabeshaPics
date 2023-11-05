import { Models } from 'appwrite'
import React, { useState } from 'react'
import { Button } from '../ui/button'

interface UserCardProps {
    user:  Models.Document
}

export default function UserCard({user}: UserCardProps) {
    const [following, setIsFollowing] = useState(false)
    function handleFollow(){
        setIsFollowing(true)


    }
    return (
        <div className='flex flex-col flex-1 gap-5 h-60 w-56 ml-8 items-center border-dark-4 mt-10 py-8'>
            <div className='flex-center flex-col gap-2'>
                <img src={user.imageUrl} className='rounded-full' width={40} height={40} alt='user-profile' />
                <p> {user.name} </p>
                <p className='text-light-4 small-medium'> @{user.username} </p>
            </div>
            <div className='flex-center'>
                <Button className='shad-button_primary' onClick={handleFollow}> Follow </Button>
            </div>
            
        </div>
    )
}
