import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'

interface ProfilePhotoUploaderProps{
    fieldchange: (FILES: File[]) => void;
    mediaUrl: string,
    editProfile?: boolean
}

export default function ProfilePhotoUploader({fieldchange, mediaUrl}: ProfilePhotoUploaderProps) {
    const [file, setFile] = useState<File[]>([])
    const [fileUrl , setFileUrl] = useState(mediaUrl)
    // when the user drags and drops, onDrop will be excuted
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        // set the file state to dropped file
        setFile(acceptedFiles)
        fieldchange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file])

    const {getRootProps, getInputProps} = useDropzone({onDrop, accept: {
        'image/*': ['.png', '.jpeg', '.jpg', '.svg', '.webp']
    }})
    return (
        <div>
            <input {...getInputProps()} className='cursor-pointer' />
            <div className='flex flex-1 justify-start items-center gap-3 w-full h-full py-5'>
                <img src={fileUrl} width={60} height={60} alt='profile-image' className='rounded-full' />
                <p {...getRootProps()} className='text-light-4 small-medium cursor-pointer'> Change profile photo </p>
            </div>
        </div>
    )
}
