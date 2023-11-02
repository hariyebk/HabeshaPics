import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { createPostValifation } from '@/lib/validation'
import { Textarea } from '../ui/textarea'
import FileUploader from '../shared/FileUploader'
import { Input } from '../ui/input'
import { Models } from 'appwrite'
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import {useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useNavigate } from "react-router-dom"


type PostFormProps = {
    post?: Models.Document;
}

export default function PostForm({post}: PostFormProps) {
    const {user} = useUserContext()
    const {toast} = useToast()
    const navigate = useNavigate()
    const{mutateAsync: createPost, isPending: isPosting} = useCreatePost()
    const {mutateAsync: updatePost, isPending: isUpdatingPost} = useUpdatePost()

    const form = useForm<z.infer<typeof  createPostValifation>>({
        resolver: zodResolver( createPostValifation),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags : ''
        },
    })
    async function onSubmit(values: z.infer<typeof createPostValifation>){
        // If post is being updated
        if(post){
            // if the user is updating we don't have to change the imageId, imageUrl and postId of the original post. these values will only be changed if  the users updates the post image.
            const updatedPost = updatePost({
                ...values,
                postId: post.$id,
                imageId: post.imageId,
                imageUrl: post.imageUrl
            })
            if(!updatedPost){
                toast({
                    title: "Failed to update post !! Please try again"
                })
                throw Error
            }
            // If update is succesfull, navigate the user to the post details page.
            return navigate(`/posts/${post.$id}`)
        }
        const newpost = createPost({
            ...values,
            userId: user.id,
        })
        if(!newpost){
            toast({
                title: "failed to upload photo. please try again",
                variant: "destructive"
            })
            throw Error
        }
        // If post was created successfully 
        navigate('/')
    }
    return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
            {/* CAPTION */}
            <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
                <FormItem>
                <FormLabel className='shad-form_label'> Caption</FormLabel>
                <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" {...field} />
                </FormControl>
                <FormMessage className='shad-form_message' />
                </FormItem>
            )}
            />
            {/* UPLOAD PHOTOS */}
            <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
                <FormItem>
                <FormLabel className='shad-form_label'> Add Photos</FormLabel>
                <FormControl>
                    <FileUploader
                    fieldchange = {field.onChange}
                    mediaUrl = {post?.imageUrl}
                    />
                </FormControl>
                <FormMessage className='shad-form_message' />
                </FormItem>
            )}
            />
            {/* LOCATION */}
            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel className='shad-form_label'> Add Location</FormLabel>
                <FormControl>
                    <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage className='shad-form_message' />
                </FormItem>
            )}
            />
            {/* TAGS */}
            <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel className='shad-form_label'> Add Tags (separated by comma " , ")</FormLabel>
                <FormControl>
                    <Input type='text' className='shad-input' placeholder='Art, Fashion, Learn' {...field}/>
                </FormControl>
                <FormMessage className='shad-form_message' />
                </FormItem>
            )}
            />
            <div className='flex gap-4 items-center justify-end'>
                <Button type='button' className='shad-button_dark_4'>
                    cancel
                </Button>
                <Button type='submit' className='shad-button_primary whitespace-nowrap' disabled = {isPosting || isUpdatingPost}>
                    {post ? 'Update Post' : 'Create Post'}
                </Button>
            </div>
        </form>
    </Form>
    )
}
