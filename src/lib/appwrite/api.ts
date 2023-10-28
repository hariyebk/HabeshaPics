import { INewUser } from "@/types";
import { account } from "./config";
import { ID } from "appwrite";


export async function createUserAccount(user: INewUser) {
    try{
        // create a new account in the appwrite database.
        const newAccount = await account.create(
            ID.unique(),
            user.name,
            user.email,
            user.password,
            )

        return newAccount
    }
    catch(error){
        console.log(error)
        return error
    }
    
}

