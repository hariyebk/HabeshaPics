import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { SignInAccount, SignOutAccount, createPost, createUserAccount, getRecentPosts, likePosts, savePost, deleteSavedPost, getCurrentUser, getPostById, updatePost, deletePost, getInfinitePosts, searchPosts, getAllUsers, getAllPosts, getUserById, updateUser, follow, unfollow } from "../appwrite/api"
import {IFollowUser, INewPost, INewUser, IUnfollowUser, IUpdatePost, IUpdateUser } from "@/types"
import { QUERY_KEYS} from "./queryKeys"


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
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: SignOutAccount,
    })
}
export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            // keep posts up to data
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_POSTS]
            })
        }
    })
}
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POSTS],
        queryFn: getRecentPosts
    })
}
export const useLikePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({postId, likesArray}: {postId: string, likesArray: string[]}) => likePosts(postId, likesArray),
        onSuccess: (data) => {
            // re-fetch posts when navigating to post details
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            // re-fetch posts when navigating to Home
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            // 
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            // re-fetch posts when navigating to users profile
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })    
}
export const useSavePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({postId, userId}: {postId: string, userId: string}) => savePost(postId, userId),
        onSuccess: () => {
            // re-fetch posts when navigating to Home
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            // 
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            // re-fetch posts when navigating to users profile
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })    
}
export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (savedRecoredId: string) => deleteSavedPost(savedRecoredId),
        onSuccess: () => {
            // re-fetch posts when navigating to Home
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            // 
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            // re-fetch posts when navigating to users profile
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })    
}
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}
export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        // diable automatic re-fetching if the post Id is not changed
        enabled: Boolean(postId)
    })
}
export const useUpdatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}
export const useDeletePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string}) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_POSTS]
            })
        }
    })
}
export const useGetPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts
    })
}
export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        // enable re-fetching when the searchTerm is changed
        enabled: Boolean(searchTerm)
    })
}
export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: getAllUsers
    })
}
export const useGetAllPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS],
        queryFn: getAllPosts
    })
}
export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: Boolean(userId)
    })
}
export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
            // re-fetch the updated user's data again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
            })
            // re-fetch the current user's data again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            // re-fetch all users again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            })
        }
    })
}
export const useFollow = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({followedId, followerId}: IFollowUser) => follow(followedId, followerId),
        onSuccess: () => {
            // re-fetch the updated user's data again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID]
            })
            // re-fetch the current user's data again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            // re-fetch all users again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            })
        }
    })
}
export const useUnFollow = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({followedId, newFollowersList, followerId, newFollowingList}: IUnfollowUser) => unfollow(followedId, newFollowersList, followerId, newFollowingList),
        onSuccess: (data) => {
            console.log(data)
            // re-fetch the updated user's data again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID]
            })
            // re-fetch the current user's data again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            // re-fetch all users again
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            })
        }
    })
}