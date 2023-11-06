import { INewPost, INewUser, IUpdatePost, IUpdateUser} from "@/types";
import { account, appwriteConfig, avatars, databases, storage} from "./config";
import { ID, Models } from "appwrite";
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
    console.log(session)
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
        // If it fails to create an updated post in the database, delete the post from the storage.
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
export async function getInfinitePosts({pageParam}: {pageParam: string}) {
    // A query to get the most recent 20 posts
    const query = [Query.orderDesc('$updatedAt'), Query.limit(20)]
    if(pageParam){
        query.push(Query.cursorAfter(pageParam))
    }
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            query
        )
        if(!posts) throw Error
        return posts
    }
    catch(error){
        console.log(error)
    }
}
export async function searchPosts(searchTerm: string) {
    try{
        // search posts by their caption
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )
        if(!posts){
            const allPosts = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId,
                []
            )
            if(!allPosts) throw Error
            const targetPost = allPosts.documents.find((post: Models.Document) => post.caption.split(' ').includes(searchTerm))
            if(targetPost) return targetPost
            else throw Error
        }
        return posts
    }
    catch(error){
        console.log(error)
    }
    
}
export async function getAllUsers() {
    try{
        const allUsers = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.orderDesc('$updatedAt')]
        )
        if(!allUsers) throw Error
        return allUsers
    }
    catch(error){
        console.log(error)
    }
    
}
export async function getAllPosts() {
    try{
        const allposts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc('$updatedAt')]
        )
        if(!allposts) throw Error
        return allposts
    }
    catch(error){
        console.log(error)
    }
    
}
export async function getUserById(userId: string) {
    if(!userId) throw Error
    try{
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )
        if(!user) throw Error
        return user
    }
    catch(error){
        console.log(error)
    }
    
}
export async function updateUser(user: IUpdateUser) {
    // check if the user wants to update his profile image
    const hasPhotoToUpdate = user.file.length > 0
    try {
        //  If the user updates his profile photo, imageUrl and imageId will be replaced with new image url and id that comes from the storage. else it stays the same from the old.
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId
        }
        if(hasPhotoToUpdate){
            // Upload photo to appwrite storage
            const uploadedPhoto = await uploadFile(user.file[0]);
            if (!uploadedPhoto) throw Error;
            // Get photo url
            const fileUrl = getFilePreview(uploadedPhoto.$id);
            if (!fileUrl) {
            // If it failed to get the photo url , delete the file.
            await deleteFile(uploadedPhoto.$id);
            throw Error;
            }
            image = { ...image, imageUrl: fileUrl, imageId: uploadedPhoto.$id }
        }
        // update the user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId
            }
        )
        // If updating the user failed for some reason , delete the profile photo from the storage.
        if (!updatedUser) {
            await deleteFile(image.imageId);
            throw Error;
        }
            return updatedUser;
    }
    catch(error){
        console.log(error)
    }
}
export async function follow(followedId: string, followerId: string) {
    try{
        // First update the followers count of the person being followed
        const updateFollowed = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            followedId,
            {
                followers: [followerId]
            }
        )
        if(!updateFollowed) throw Error
        // Second update the following count of the person who followed the other person
        const updateFollower = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            followerId,
            {
                following: [followedId]
            }
        )
        if(!updateFollower) throw Error
        return {status: 'ok'}
    }
    catch(error){
        console.log(error)
    }
    
}
export async function unfollow(followedId: string, newFollowersList: string[], followerId: string, newFollowingList: string[]) {
    try{
        // remove the current follower from the followers list of the the person being followed
        const updatedFollowed = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            followedId,
            {
                followers: newFollowersList
            }
        )
        if(!updatedFollowed) throw Error
        // remove the Id of the followed from the following list of the follower
        const updatedFollower = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            followerId,
            {
                following: newFollowingList
            }
        )
        if(!updatedFollower) throw Error
        return {status: 'ok'}
    }
    catch(error){
        console.log(error)
    }
    
}