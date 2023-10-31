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
import {useCreatePost } from "@/lib/react-query/queriesAndMutations"
import { Loader } from "lucide-react"
import { useNavigate } from "react-router-dom"


type PostFormProps = {
    post?: Models.Document;
}

export default function PostForm({post}: PostFormProps) {
    const {user} = useUserContext()
    const {toast} = useToast()
    const navigate = useNavigate()
    const{mutateAsync: createPost, isPending: isPosting} = useCreatePost()

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
        const newpost = createPost({
            ...values,
            userId: user.id,
        })
        if(!newpost){
            toast({
                title: "failed to upload photo. please try again",
                variant: "destructive"
            })
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
                <Button type='submit' className='shad-button_primary whitespace-nowrap'>
                    {
                    isPosting ?
                    <div>
                        <Loader />
                    </div>
                    :
                    'submit'
                    }
                </Button>
            </div>
        </form>
    </Form>
    )
}
