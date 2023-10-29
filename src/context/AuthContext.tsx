import {createContext, useContext, useEffect, useState} from 'react'
import {IContextType, IUser} from "../types"
import { getCurrentUser } from '@/lib/appwrite/api'
import { useNavigate } from 'react-router-dom'

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
}

// Initial state
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async() => false as boolean,
}

// creating our context with an initial value
const AuthContext = createContext<IContextType>(INITIAL_STATE)

function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    const checkAuthUser = async() => {
        try{
            // fetching the current user from the session
            const currentUser = await getCurrentUser()
            
            if(currentUser){
                // set the user state to fetched user
                setUser({
                    id: currentUser.$id,
                    name: currentUser.name,
                    email: currentUser.email,
                    username: currentUser.username,
                    imageUrl: currentUser.imageUrl,
                    bio: currentUser.bio
                })

                setIsAuthenticated(true)

                return true
            }
            // If there is no current user from the session, it means there is no Authenticated user
            return false
        }
        catch(error){
            console.log(error)
            return false
        }
        finally{
            setIsLoading(false)
        }
    }
    // will be exuted on initial render
    useEffect(() => {
        // If there is no cookie stored in the users localstorage, redirect the user to /sign-in
        // localStorage.getItem("cookieFallback") === null
        if(localStorage.getItem("cookieFallback") === '[]'
        ){
            navigate("/sign-in")
        }

        checkAuthUser()

    }, [])
    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isLoading,
            isAuthenticated,
            setIsAuthenticated,
            checkAuthUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useUserContext = () => {
    const context = useContext(AuthContext)
    if(!context) throw Error('context is used outside of its provider')
    return context
}


export default AuthProvider