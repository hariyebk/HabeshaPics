import { Models } from 'appwrite'
import Loader from './Loader'
import GridPostList from './GridPostList'

type searchResultsProps = {
    searchedPosts: Models.Document[] | undefined,
    isSearchFetching: boolean
}

export default function SearchResults({searchedPosts, isSearchFetching}: searchResultsProps) {
    if(isSearchFetching){
        return(
            <div className='flex items-center h-full w-full'>
                <Loader />
            </div>
        )
    }
    if(searchedPosts && searchedPosts.documents?.length > 0){
        return (
            <GridPostList posts={searchedPosts.documents} />
        )
    }
    return (
        <div className='flex items-center h-full w-full'>
            <p className='text-light-4  text-center w-full mt-10'> No post found </p>
        </div>
    )
}
