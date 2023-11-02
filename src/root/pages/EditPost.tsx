import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";

import { useParams } from "react-router-dom";

export default function EditPost() {
    const {id: postId} = useParams()
    const {data: post, isLoading: isGettingPost} = useGetPostById(postId || '')
    if(isGettingPost){
        return (
        <div className="flex flex-1 justify-center items-center">
            <Loader />
        </div>
        )
    } 
    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 w-full ">
                    <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add-post"/>
                    <h2 className="h3-bold md:h2-bold text-left w-full "> Edit post</h2>
                </div>
                {/* CREATE POST FORM */}
            <PostForm post={post} />
            </div>
        </div>
    )
}
