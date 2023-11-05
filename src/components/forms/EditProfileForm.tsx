import { Models } from 'appwrite';
import {EditProfiletValifation} from "../../lib/validation/index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'
import FileUploader from '@/components/shared/FileUploader'
import { Input } from '@/components/ui/input'
import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';



type EditProfileFormProps = {
    user?: Models.Document;
}

export default function EditProfileForm({user}: EditProfileFormProps) {
    const [file, setFile] = useState<File[]>([])
    const form = useForm<z.infer<typeof  EditProfiletValifation>>({
        resolver: zodResolver( EditProfiletValifation),
        defaultValues: {
            file: [],
            name: user?.name,
            username: user?.username,
            email: user?.email ,
            bio: user?.bio
        },
    })
    // when the user drags and drops, onDrop will be excuted
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        // set the file state to dropped file
        setFile(acceptedFiles)
        fieldchange(acceptedFiles)
        // 
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file])
    const {getRootProps, getInputProps} = useDropzone({onDrop, accept: {
        'image/*': ['.png', '.jpeg', '.jpg', '.svg', '.webp']
    }})
    async function onSubmit(values: z.infer<typeof EditProfiletValifation>) {
        console.log(values)
        
    }
    return (
        <Form {...form}>
            <div className='flex flex-1 justify-start items-center gap-3 w-full h-full py-5'>
                <img src={user?.imageUrl} width={60} height={60} alt='profile-image' className='rounded-full' />
                <p className='text-light-4 small-medium cursor-pointer'> Change profile photo </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                {/* NAME */}
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className='shad-form_label'> Name </FormLabel>
                    <FormControl>
                        <Input type='text' className='shad-input' {...field} />
                    </FormControl>
                    <FormMessage className='shad-form_message' />
                    </FormItem>
                )}
                />
                 {/* USERNAME */}
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className='shad-form_label'> Username </FormLabel>
                    <FormControl>
                        <Input type='text' className='shad-input' {...field} />
                    </FormControl>
                    <FormMessage className='shad-form_message' />
                    </FormItem>
                )}
                />
                {/* EMAIL */}
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className='shad-form_label'> Email </FormLabel>
                    <FormControl>
                        <Input type='text' className='shad-input' {...field}/>
                    </FormControl>
                    <FormMessage className='shad-form_message' />
                    </FormItem>
                )}
                />
                {/* BIO */}
                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className='shad-form_label'> Bio </FormLabel>
                    <FormControl>
                        <Textarea className="shad-textarea custom-scrollbar" {...field} />
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
                        Update Profile
                    </Button>
                </div>
            </form>
        </Form>
        )
}
