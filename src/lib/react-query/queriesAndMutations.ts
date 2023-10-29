import {useMutation} from "@tanstack/react-query"
import { SignInAccount, createUserAccount } from "../appwrite/api"
import { INewUser } from "@/types"

export const useCreateAccount = () => {
    return useMutation({
        mutationFn: (user:INewUser) => createUserAccount(user)
    })
}
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {email: string, password: string}) => SignInAccount(user)
    })
}