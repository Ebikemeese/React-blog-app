import BlogContainer from "@/ui_components/BlogContainer";
import Header from "@/ui_components/Header";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBlogs } from "@/services/ApiBlog";
import { useState } from "react";
import PagePagination from "../ui_components/PagePagination";


const HomePage = () => {
  const [page, setPage] = useState(1);
  const numofBlogsPerPage = 3

  const {isPending, isError, error, data = {} } = useQuery({
    queryKey: ['blogs', page],
    queryFn:() => getBlogs(page),
    placeholderData: keepPreviousData,
  })

  const blogs = data?.results || []
  const numOfPages = Math.ceil(data?.count/numofBlogsPerPage)

  function handleSetPage(val){
    setPage(val)
  }

  function increasePageValue(){
    setPage(curr => curr + 1 )
  }
  
  function decreasePageValue(){
    setPage(curr => curr - 1 )
  }

  return (
    <>
      <Header />
      <BlogContainer isPending={isPending}  blogs={ blogs } />
      <PagePagination numOfPages={ numOfPages } handleSetPage={ handleSetPage } page={ page } increasePageValue={ increasePageValue } decreasePageValue={ decreasePageValue } />
    
    </>
  );
};

export default HomePage;