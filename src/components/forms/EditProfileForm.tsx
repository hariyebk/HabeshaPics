import { Models } from 'appwrite';
import {EditProfiletValifation} from "../../lib/validation/index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import ProfilePhotoUploader from '../shared/ProfilePhotoUploader';
import { useUpdateUser } from '@/lib/react-query/queriesAndMutations';
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';

type EditProfileFormProps = {
    user: Models.Document;
}

export default function EditProfileForm({user}: EditProfileFormProps) {
    const {mutateAsync: updateUser, isPending: isUpdatingUser} = useUpdateUser()
    const navigate = useNavigate()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof  EditProfiletValifation>>({
        resolver: zodResolver( EditProfiletValifation),
        defaultValues: {
            file: [],
            name: user.name,
            username: user.username,
            email: user.email ,
            bio: user.bio
        },
    })

    async function handleUpdate(values: z.infer<typeof EditProfiletValifation>) {
        const updatedUser = updateUser({
            ...values,
            userId: user.$id,
            imageId: user.imageId,
            imageUrl: user.imageUrl,
        })
        if(!updatedUser){
            toast({title: 'failed to update user. please try again', variant: "destructive"})
            throw Error
        }
        console.log(updateUser)
        navigate(`/profile/${user.$id}`)        
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col gap-9 w-full max-w-5xl">
                {/* CHANGE PROFILE PHOTO */}
                <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <ProfilePhotoUploader
                        fieldchange = {field.onChange}
                        mediaUrl = {user?.imageUrl}
                        />
                    </FormControl>
                    <FormMessage className='shad-form_message' />
                    </FormItem>
                )}
                />
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
                    <Button type='button' className='shad-button_dark_4' onClick={() => navigate(-1)}>
                        cancel
                    </Button>
                    <Button type='submit' className='shad-button_primary whitespace-nowrap' disabled = {isUpdatingUser}>
                        Update Profile
                    </Button>
                </div>
            </form>
        </Form>
        )
}
