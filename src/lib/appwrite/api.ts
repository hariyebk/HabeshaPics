import { INewUser} from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID } from "appwrite";
import {Query} from "appwrite"


export async function createUserAccount(user: INewUser) {
    try{
        // create a new user in the appwrite Auth.
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
            )
        if(!newAccount)throw Error

        const avatarUrl = avatars.getInitials(user.name)
        // creates a new user in the users collection of our database
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        return newUser
    }
    catch(error){
        console.log(error)
        return error
    }
    
}
export async function saveUserToDB(user: {
    accountId: string,
    name: string,
    email: string,
    username?: string,
    imageUrl: URL,
}){
    try{
        // specifing in which collection we want to create a new document.
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )

        return newUser

    }
    catch(error){
        console.log(error)
    }

}
export async function SignInAccount(user: {email: string, password: string}){
    try{
        // creating a session and logging in a user. this will create a cookie in the user's browsser local storage
        const session = await account.createEmailSession(user.email, user.password)
        return session
    }
    catch(error){
        console.log(error)
    }
}
export async function getCurrentUser(){
    try{
        // Get the currently logged in user from the session.
        const currentAccount = await account.get()
        if(!currentAccount) throw Error
        // getting the users data from the database collection
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            // qurying the user by id
            [Query.equal('accountId', currentAccount.$id)]
        )
        
        if(!currentUser) throw Error

        return currentUser.documents[0]

    }
    catch(error){
        console.log(error)
    }
    
}

