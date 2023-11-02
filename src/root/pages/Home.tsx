import Loader from '@/components/shared/Loader'
import PostCard from '@/components/shared/PostCard'
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'

function Home() {
    const {data: posts, isPending: isGettingPosts} = useGetRecentPosts()
    if(isGettingPosts){
        return (
        <div className='flex flex-1 justify-center items-center'>
            <Loader />
        </div> 
        )
    }
    return (
        <div className='flex flex-1'>
            <div className='home-container'>
                <div className='home-posts'>
                    <h2 className='h3-bold md:h2-bold text-left w-full'> Home Feed</h2>
                    <ul className='flex flex-col flex-1 gap-9 w-full'>
                        {posts?.documents.map((post: Models.Document)=> {
                            return (
                                <li key={post.$id}>
                                    <PostCard post = {post} />
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Home