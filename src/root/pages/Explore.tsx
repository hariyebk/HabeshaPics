import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Explore() {
    // Getting all posts 
    const {data: posts, fetchNextPage, hasNextPage} = useGetPosts()
    // search value (controlled element)
    const [searchValue, setSearchValue] = useState('')
    // Looking for when the user reached the bootom of the viewPort scrooling, to implement infinite scrolling
    const {ref, inView} = useInView()
    // debouncing
    const debouncedValue = useDebounce(searchValue, 500) 
    // search results
    const {data: searchedPosts, isFetching: isSearchFetching} = useSearchPosts(debouncedValue)

    useEffect(() => {
        // If our reference is in the view port an there is no search value . we wiil fetch the Next page.
        if(inView && !searchValue) fetchNextPage()
    }, [searchValue, inView])

    
    // if the All posts are not fetched yet , display the loader.
    if(!posts){
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        )
    }
    // If there is a search value , display search results.
    const shouldShowSearchResults = searchValue !== ''
    // display the posts if there is no search value and there are posts
    const shouldShowPosts =  !shouldShowSearchResults && posts.pages.every((item => item?.documents.length === 0))
    return (
        <div className="explore-container">
            {/* SEARCH */}
            <div className="explore-inner_container">
                <h2 className="h3-bold md:h2-bold w-full"> Search Posts </h2>
                <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
                    <img src="/assets/icons/search.svg" width={24} height={24} alt="search" />
                    {/* The Input Field is inside the div but they have the same color */}
                    <Input type="text" placeholder="search"
                    className="explore-search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-between w-full max-w-5xl mt-16 mb-7">
                <h2 className="body-bold md:h3-bold"> Popular Today </h2>
                {/* FILTER */}
                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium text-light-2"> All </p>
                    <img src = '/assets/icons/filter.svg'  width={20} height={20} alt="filter"/>
                </div>
            </div>
            {/* SEARCH RESULTS OR ALL POSTS TO EXPLORE */}
            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {shouldShowSearchResults ? (
                <SearchResults searchedPosts={searchedPosts} isSearchFetching = {isSearchFetching}
                />
                ) : shouldShowPosts ? (
                <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
                ) : (
                posts.pages.map((item, index) => (
                    <GridPostList key={`page-${index}`} posts= {item?.documents}/>
                ))
                )}
            </div>
            {
                hasNextPage && !searchValue && (
                    <div ref = {ref} className="mt-10">
                        <Loader />
                    </div>
                )
            }
            
        </div>
    )
}
