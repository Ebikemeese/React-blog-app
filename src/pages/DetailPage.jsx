import Badge from "@/ui_components/Badge";
import BlogWriter from "@/ui_components/BlogWriter";
import banner from "../images/detailBanner.jpg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getBlog } from "@/services/apiBlog";
import Spinner from "@/ui_components/Spinner";
import Modal from "@/ui_components/Modal";
import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import CreatePostPage from "./CreatePostPage";
import { useState } from "react";
import { deleteBlog } from "../services/ApiBlog";
import { toast } from "react-toastify";


const DetailPage = ({username, IsAuthenticated}) => {
  const { slug } = useParams();
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  function toggleModal(){
    setShowModal(curr => !curr)
  }

  const {
    isPending,
    isError,
    error,
    data: blog,
  } = useQuery({
    queryKey: ["blogs", slug],
    queryFn: () => getBlog(slug),
  });

  const blogId = blog?.id

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBlog(id),
    onSuccess: () => {
      toast.success("Your post has been deleted successfully")
      navigate("/")
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  function handleDeleteBlog(){
    const popUp = window.confirm("Delete blog?")
    if(!popUp){
      return;
    }
    deleteMutation.mutate(blogId)
  }
  

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
    <div className="padding-dx max-container py-9">
      <Badge blog={blog} />

      <div className="flex justify-between items-center">
        <h2 className="py-6 leading-normal text-2xl md:text-3xl text-[#181A2A] tracking-wide font-semibold dark:text-[#FFFFFF]">
          {blog.title}
        </h2>
        {
          IsAuthenticated && username === blog?.author?.username && (
          <span className="flex justify-between items-center gap-2">
            <HiPencilAlt className="dark:text-white text-3xl cursor-pointer" onClick={toggleModal} />

            <MdDelete className="dark:text-white text-3xl cursor-pointer" onClick={handleDeleteBlog} />
          </span>
        )}
        


      </div>

      <BlogWriter blog={blog} />

      <div className="w-full h-[350px] my-9 overflow-hidden rounded-sm">
        <img
          className="w-full h-full object-cover rounded-sm"
          src={`${blog.featured_image}`}
        />
      </div>
      <p className="text-[16px] leading-[2rem] text-justify text-[#3B3C4A] dark:text-[#BABABF]">
        {blog.content}
      </p>
    </div>
    
    {showModal &&
      <Modal toggleModal={toggleModal}>
        <CreatePostPage blog={blog} />
      </Modal>
    }
    

    </>
  );
};

export default DetailPage;