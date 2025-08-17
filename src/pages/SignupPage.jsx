import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/apiBlog";
import SmallSpinner from "@/ui_components/SmallSpinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "../services/ApiBlog";
import { googleSignUp } from "../services/ApiBlog";
import { useEffect, useState } from "react";


const SignupPage = ({userInfo, updateForm, toggleModal, setIsAuthenticated, setUsername}) => {

  const queryClient = useQueryClient()
  const { register, handleSubmit, formState, reset, watch } = useForm({defaultValues: userInfo ? userInfo : {}});
  const { errors } = formState;
  const navigate = useNavigate()
  const location = useLocation();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

  const password = watch("password");

  const updateprofileMutation = useMutation({
    mutationFn: ({data, id}) => updateUserProfile(data, id),
    onSuccess: () => {
      toast.success("Profile updated successfully")
      toggleModal()
      queryClient.invalidateQueries({queryKey: ["users", userInfo?.username]})
      reset();
    },
    onError: (err) => {
      toast.error(err.message || "Unable to update profile")
    }
  })

  const mutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (responseData, variables) => {
      toast.success(`We have sent an OTP to ${variables.email}`)
      navigate("/verify_email", { state: { email: variables.email } })
      reset();
    },
    onError: (error) => {
      if (error?.response?.status === 429) {
          toast.error("You have reached the OTP resend limit for today. Please try again tomorrow.");
          return;
        } else if (error?.response?.status === 400) {
          toast.error("Email already registered and verified");
          navigate("/login");
      } else {
          toast.error(error.message || "Something went wrong. Please try again.");
      }
    },
  });

  function onSubmit(data) {
    if(updateForm){
      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("first_name", data.first_name)
      formData.append("last_name", data.last_name)
      formData.append("bio", data.bio)
      formData.append("job_title", data.job_title)
      if (data.profile_picture?.[0] instanceof File) {
        formData.append("profile_picture", data.profile_picture[0]);
      }
      
      updateprofileMutation.mutate({data: formData, id: userInfo?.id})
    }

    else{
      mutation.mutate(data);
    }
   
  }

  const handleSignInWithGoogle = async (response) => {
    setIsLoadingGoogle(true);
    try {
      const id_token = response.credential;
      const server_res = await googleSignUp(id_token);

      localStorage.setItem("access_token", server_res.access_token);
      localStorage.setItem("refresh_token", server_res.refresh_token);

      setIsAuthenticated(true);
      setUsername(server_res.username);

      toast.success("Signed in with Google successfully");

      const from = location?.state?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (err) {
      console.error("Google Sign-In Error:", err.message);
      toast.error(err.message);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  useEffect(() => {
    // global google
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID,
      callback: handleSignInWithGoogle
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: 'outline', size: 'large', text: 'continue with', shape: 'circle', width: '200'}
    )
  }, [])

  return (
    <form
      className={`${updateForm && "h-[90%] overflow-auto"} md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-4 w-fit 
    rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">
          {
            updateForm ? "Update Profile"
            : "SignUp Form"

          }
        </h3>
        <p>
          {
            updateForm ? "Tell us more about yourself."
            : "Create your account to get started!"

          }
          
        </p>
      </div>

      {
        updateForm &&
        <div>
          <Label htmlFor="username">Username</Label>
          <Input 
            type="text"
            id="username"
            placeholder="Enter Username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.username?.message && (
            <small className="text-red-700">{errors.username.message}</small>
          )}
        </div>
      }
      
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          type="text"
          id="first_name"
          placeholder="Enter first name"
          {...register("first_name", {
            required: "Firstname is required",
            minLength: {
              value: 3,
              message: "Firstname must be at least 3 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.first_name?.message && (
          <small className="text-red-700">{errors.first_name.message}</small>
        )}
      </div>

      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          type="text"
          id="last_name"
          placeholder="Enter last name"
          {...register("last_name", {
            required: "Lastname is required",
            minLength: {
              value: 3,
              message: "Lastname must be at least 3 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.last_name?.message && (
          <small className="text-red-700">{errors.last_name.message}</small>
        )}
      </div>

      {
        updateForm ||
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter a valid Email"
            {...register("email", {
              required: "Email is required",
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.email?.message && (
            <small className="text-red-700">{errors.email.message}</small>
          )}
        </div>
      }

      {
        updateForm &&
        <div>
          <Label htmlFor="job_title">Job Title</Label>
          <Input
            type="text"
            id="job_title"
            placeholder="Enter Job Title"
            {...register("job_title", {
              required: "Job title is required",
              minLength: {
                value: 3,
                message: "Job title must be at least 3 characters",
              },
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.job_title?.message && (
            <small className="text-red-700">{errors.job_title.message}</small>
          )}
        </div>
      }

      {
        updateForm &&
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            type="text"
            id="bio"
            placeholder="Enter Bio"
            {...register("bio", {
              required: "Bio is required",
              minLength: {
                value: 10,
                message: "Bio must be at least 10 characters",
              },
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.bio?.message && (
            <small className="text-red-700">{errors.bio.message}</small>
          )}
        </div>
      }

      {
        updateForm &&
        <div>
          <Label htmlFor="profile_picture">Profile Picture</Label>
          <Input 
            type="file"
            id="profile_picture"
            {...register("profile_picture", {
              required: false,
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.profile_picture?.message && (
            <small className="text-red-700">{errors.profile_picture.message}</small>
          )}
        </div>
      }

      {
        updateForm ||
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.password?.message && (
            <small className="text-red-700">{errors.password.message}</small>
          )}
        </div>
      }

      {
        updateForm ||
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              validate: (value) => value === password || "Passwords do not match",
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.confirmPassword?.message && (
            <small className="text-red-700">
              {errors.confirmPassword.message}
            </small>
          )}
        </div>
      }

      <div className="w-full flex items-center justify-center flex-col my-4">

        {
          updateForm ?

          <button type="submit" className="cursor-pointer bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
              {updateprofileMutation.isPending ? (
                <>
                  {" "}
                  <SmallSpinner />{" "}
                  <small className="text-[16px]">Updating profile...</small>{" "}
                </>
              ) 
              : (
                <small className="text-[16px]">Update profile</small>
              )}
            </button>

          :

          <button className="cursor-pointer bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
            {mutation.isPending ? (
              <>
                {" "}
                <SmallSpinner />{" "}
                <small className="text-[16px]">Creating user...</small>{" "}
              </>
            ) 
            : (
              <small className="text-[16px]">Signup</small>
            )}
          </button>

        }

        {
          updateForm ||
          <div className="googleContainer my-4" style={{ position: "relative" }}>
            <div
              id="signInDiv"
              style={{
                pointerEvents: isLoadingGoogle ? "none" : "auto",
                opacity: isLoadingGoogle ? 0.5 : 1,
              }}
            ></div>

            {isLoadingGoogle && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              >
                <SmallSpinner />
              </div>
            )}
          </div>


        }

        {
          updateForm ||
          <p className="text-[14px]">
            Already have an account? <Link to="/login"> Login</Link>
          </p>
        }
      </div>
    </form>
  );
};

export default SignupPage;