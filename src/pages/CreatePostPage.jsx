import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import InputError from "../ui_components/InputError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createBlog, updateBlog } from "../services/ApiBlog";
import SmallSpinner from "../ui_components/SmallSpinner"
import SmallSpinnerText from "../ui_components/SmallSpinnerText";
import LoginPage from "./LoginPage";

const CreatePostPage = ({blog, IsAuthenticated}) => {
  const [category, setCategory] = useState("");
  const {register, handleSubmit, formState, setValue} = useForm({defaultValues: blog ? blog: {}})
  const {errors} = formState
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const blogId = blog?.id

  const updateMutation = useMutation({
    mutationFn: ({data, id}) => updateBlog(data, id),
    onSuccess: () => {
      toast.success("Your post has been updated successfully")
      navigate("/")
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const mutation = useMutation({
    mutationFn: (data) => createBlog(data),
    onSuccess: () => {
      toast.success("Post created successfully")
      queryClient.invalidateQueries({queryKey: ["blogs"]})
      navigate("/")
    }
  })
 
  function onSubmit(data){
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("content", data.content)
    formData.append("category", data.category)
    if (data.featured_image?.[0] instanceof File) {
      formData.append("featured_image", data.featured_image[0]);
    }

    if(blog && blogId){
      updateMutation.mutate({data: formData, id:blogId})
    } else {
      mutation.mutate(formData)
    }
    
  }
  
  if(IsAuthenticated === false){
    return <LoginPage />
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"

      className={`${blog && "h-[90%] overflow-auto"} 
      md:px-16 px-8 py-6 flex flex-col mx-auto my-9 
      items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl 
      dark:text-white dark:bg-[#141624]`}
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">{blog ? "Update Post" : "Create Post"}</h3>
        <p>{blog ? "Update your post and share your ideas." : "Create a new post and share your ideas."}</p>
      </div>

      <div>
        <Label htmlFor="title" className="dark:text-[#97989F]">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          {...register("title", {required: "Blog title is required", minLength: {value:3, message: "The title must be at least 3 characters"} })}
          placeholder="Give your post a title"
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[400px]"
        />
        {errors?.title?.message && <InputError error={errors.title.message} />}
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your blog post"
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px] w-[400px] text-justify"
          {...register("content", {required: "Blog content is required", minLength: {value:10, message: "The content must be at least 10 characters"}})}
        />
        {errors?.content?.message && <InputError error={errors.content.message} />}
      </div>

      <div className="w-full">
        <Label htmlFor="category">Category</Label>
        <Select defaultValue={blog ? blog.category : ""} onValueChange={(value) => setValue("category", value) } {...register("category", {required: "Blog category is required"})}>
          <SelectTrigger
            className="border-2 border-[#141624] dark:border-[#3B3C4A] 
                       bg-black text-white dark:bg-white dark:text-black 
                       focus:outline-0 h-[40px] w-full"
            id="category"
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>

          <SelectContent
            className="bg-black text-white dark:bg-white dark:text-black 
                       border border-[#141624] dark:border-[#3B3C4A] 
                       rounded-md shadow-md"
          >
            <SelectGroup>
              <SelectLabel className="px-3 py-2 text-sm font-semibold">
                Categories
              </SelectLabel>
              {["Technology", "Economy", "Business", "Sports", "Lifestyle"].map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="px-3 py-2 hover:bg-[#1F1F2B] dark:hover:bg-gray-200 cursor-pointer"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.category?.message && <InputError error={errors.category.message} />}
      </div>

      <div className="w-full">
        <Label htmlFor="featured_image">Featured Image</Label>
        <Input
          type="file"
          id="featured_image"
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full"
          {...register("featured_image", {required: blog ? false : "Blog image is required"})}
        />
        {errors?.featured_image?.message && <InputError error={errors.featured_image.message} />}
      </div>

      <div className="w-full flex items-center justify-center flex-col my-4">
        {
          blog ?

          <button 
            type="submit"
            className="bg-[#4B6BFB] cursor-pointer text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
            {updateMutation.isPending ? 
            <>
              <SmallSpinner /> <SmallSpinnerText text="Updating Post..." />
            </>
            :
            <SmallSpinnerText text="Update Post"/>
            }
          </button>

          :
        
          <button 
            type="submit"
            className="bg-[#4B6BFB] cursor-pointer text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
            {mutation.isPending ? 
            <>
              <SmallSpinner /> <SmallSpinnerText text="Creating Post..." />
            </>
            :
            <SmallSpinnerText text="Create Post"/>
            }
          </button>
        }
        
      </div>
    </form>
  );
};


export default CreatePostPage;
