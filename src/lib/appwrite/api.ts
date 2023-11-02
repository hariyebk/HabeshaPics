import { INewPost, INewUser, IUpdatePost} from "@/types";
import { account, appwriteConfig, avatars, databases, storage} from "./config";
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
        password: user.password,
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
password: string,
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
export async function SignOutAccount() {
try{
    const session = await account.deleteSession("current")
    return session
}
catch(error){
    console.log(error)
}

}
export async function createPost(post: INewPost) {
    try {
        // Upload file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
        // If it failed to get the file url , delete the file.
        await deleteFile(uploadedFile.$id);
        throw Error;
        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // Create post
        const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
        }
        );

        if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}
export async function deleteFile(fileId: string) {
    try{
        await storage.deleteFile(appwriteConfig.storageId, fileId)
        return {status: 'ok'}
    }
    catch(error){
        console.log(error)
    }
    
}
export async function getRecentPosts() {
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            // Ordering and Limiting posts
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        )
        if(!posts) throw Error
        return posts
    }
    catch(error){
        console.log(error)
    }
    
}
export async function likePosts(postId: string , likesArray: string[]) {
    try{
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if(!updatedPost) throw Error
        return updatedPost
    }
    catch(error){
        console.log(error)
    }
}
export async function savePost(postId: string, userId: string) {
    try{
        const savedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            })
        if(!savedPost) throw Error
        return savePost
    }
    catch(error){
        console.log(error)
    }
}
export async function deleteSavedPost(savedRecoredId: string) {
    try{
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecoredId
        )
        if(!statusCode) throw Error
        return {status: "ok"}
    }
    catch(error){
        console.log(error)
    }
    
}
export async function getPostById(postId: string) {
    try{
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return post
    }
    catch(error){
        console.log(error)
    }
}
export async function updatePost(post: IUpdatePost) {
    // check if the user wants to update the post
    const hasFileToUpdate = post.file.length > 0
    try {
        //  If the user updates the post, imageUrl and imageId will be replaced with new image url and id that comes from the storage. else it stays the same from the old.
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }
        if(hasFileToUpdate){
            // Upload file to appwrite storage
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
            // If it failed to get the file url , delete the file.
            await deleteFile(uploadedFile.$id);
            throw Error;
            }
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];
        // Create post
        const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        post.postId,
        {
            caption: post.caption,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
            tags: tags,
        }
        );
        // If it fails to create a new post in the database, delete the post from the storage.
        if (!updatePost) {
        await deleteFile(image.imageId);
        throw Error;
        }
        return updatedPost;
    } 
    catch (error) {
        console.log(error);
    }
    
}
export async function deletePost(postId: string, imageId: string) {
    if(!postId || !imageId) throw Error
    try{
        // delete the post from the database collection
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        if(!statusCode) throw Error
        // delete the post from storage
        await deleteFile(imageId)
        return {status: 'ok'}
    }
    catch(error){
        console.log(error)
    }   
}