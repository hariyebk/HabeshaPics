import { Link, useNavigate } from 'react-router-dom'
import {useEffect} from "react"
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

export default function Topbar() {
    const {mutate: signOut, isSuccess} = useSignOutAccount()
    const navigate = useNavigate()
    const {user} = useUserContext()
    
    // when the user log's out they will be redirected to the sign-in/sign-up form.
    useEffect(() => {
        if(isSuccess){
            navigate(0)
        }
    }, [isSuccess])
    
    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-5'>
                {/* SNAPGRAM LOGO */}
                <Link to= '/' className='flex gap-3 items-center'>
                    <img 
                    src='/assets/images/logo.svg' 
                    alt='logo'
                    width={130}
                    height={325}/>
                </Link>
                <div className='flex gap-4'>
                    {/* LOGOUT BUTTON */}
                    <Button variant='ghost' className='shad-button_ghost'
                    onClick={() => signOut()}>
                        <img src='/assets/icons/logout.svg' alt='logout' />
                    </Button>
                    {/* USER PROFILE */}
                    <Link to={`/profile/${user.id} `} className='flex gap-3' >
                        {/* PROFILE IMAGE */}
                        <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='profile' 
                        className='h-8 w-8 rounded-full'/>
                    </Link>
                </div>
            </div>
        </section>
    )
}
