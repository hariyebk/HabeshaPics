import { useUserContext } from '@/context/AuthContext'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {sidebarLinks} from "./../.././constants/index"
import { INavLink } from '@/types'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react'
import { Button } from '../ui/button'

export default function LeftSidebar() {
    const {user} = useUserContext()
    const {mutate: signOut, isSuccess} = useSignOutAccount()
    const {pathname} = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if(isSuccess){
            navigate(0)
        }
    }, [isSuccess])
    
    return (
        <nav className='leftsidebar'>
            <div className='flex flex-col gap-11'>
                {/* SNAPGRAM LOGO */}
                <Link to= '/' className='flex gap-3 items-center'>
                    <img 
                    src='/assets/images/logo.svg' 
                    alt='logo'
                    width={170}
                    height={36}/>
                </Link>
                {/* PROFILE */}
                <Link to= {`/profile/${user.id}`} className='flex gap-3 items-center' >
                    {/* PROFILE IMAGE */}
                    <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt='profile'
                    className='h-10 w-10 rounded-full'/>
                    {/* USER NAME */}
                    <div className='flex flex-col'>
                        <p className='body-bold'>
                            {user.name}
                        </p>
                        <p className='small-regular text-light-3'>
                            @{user.username}
                        </p>
                    </div>
                </Link>
                {/* Links */}
                <ul className='flex flex-col gap-6'>
                {sidebarLinks.map((link:INavLink) => {
                    const isActive = pathname === link.route
                    return(
                        <li 
                        key={link.label}
                        className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                            <NavLink to={link.route} className= 'flex items-center gap-4'>
                                <img src= {link.imgURL} alt={link.label} className= {`group-hover:invert-white ${isActive && 'invert-white'}`}/>
                                {link.label}
                            </NavLink>
                        </li>
                    )
                })}
                </ul>
            </div>
            {/* LOGOUT BUTTON */}
            <Button variant='ghost' className='shad-button_ghost flex items-center gap-3'
            onClick={() => signOut()}>
                <img src='/assets/icons/logout.svg' alt='logout' />
                <p className='small-medium lg:base-medium'> Log out</p>
            </Button>
        </nav>
    )
}
