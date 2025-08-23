import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/apiBlog";
import SmallSpinner from "@/ui_components/SmallSpinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "../services/ApiBlog";
import { googleSignUp } from "../services/ApiBlog";
import { useEffect, useState } from "react";
import { githubSignIn } from "../services/ApiBlog";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const SignupPage = ({userInfo, updateForm, toggleModal, setIsAuthenticated, setUsername}) => {

  const queryClient = useQueryClient()
  const { register, handleSubmit, formState, reset, watch } = useForm({defaultValues: userInfo ? userInfo : {}});
  const { errors } = formState;
  const navigate = useNavigate()
  const location = useLocation();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingGitHub, setIsLoadingGithub] = useState(false)
  const [ searchParams ] = useSearchParams()
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const togglePassword2Visibility = () => {
    setShowPassword2((prev) => !prev);
  };

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

      if (!server_res.success) {
        const { message, auth_provider } = server_res.error;

        let fullMessage = message;
        if (auth_provider) {
          fullMessage += ` Please continue with ${auth_provider}.`;
        }

        toast.error(fullMessage); 

        
        return;
      }


      const { access_token, refresh_token, username } = server_res.data;
      localStorage.setItem("access", access_token);
      localStorage.setItem("refresh", refresh_token);

      setIsAuthenticated(true);
      setUsername(username);

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

  const handleSigninWithGithub = () => {
    window.location.assign(`https://github.com/login/oauth/authorize/?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`)
  }

  

  const send_code_to_backend_from_github = async () => {
    const code = searchParams.get("code");
    setIsLoadingGithub(true);
    if (!code) return;

    try {
      const result = await githubSignIn(code);

      if (!result.success) {
        toast.error(result.error.message);

        if (result.error.auth_provider) {
          toast.info(`Please continue with ${result.error.auth_provider}`);
          if (result.error.auth_provider === "google") {
            // Trigger Google login UI
            document.getElementById("signInDiv").click(); // or show modal
          }
        }

        return;
      }

      const { access_token, refresh_token, username } = result.data;
      localStorage.setItem("access", access_token);
      localStorage.setItem("refresh", refresh_token);

      setIsAuthenticated(true);
      setUsername(username);

      toast.success("Signed in with GitHub successfully");

      const from = location?.state?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (error) {
      console.error("GitHub Sign-In Error:", error.message);
      toast.error(error.message);
    } finally {
      setIsLoadingGithub(false);
    }
  };


  let code = searchParams.get('code')
  useEffect(() => {
    if (code) {
      send_code_to_backend_from_github()
    }
  }, [code])

  return (
    <form
      className={`${updateForm && "h-[90%] overflow-auto"} 
      md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center
      gap-4 w-fit rounded-lg
    bg-[#FFFFFF] shadow-xl dark:text-white 
    dark:bg-[#141624]`}
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
        <div className="relative w-[300px]">
          <Label htmlFor="password">Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
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
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-[27px] text-[#141624] dark:text-[#e2e8f0]"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors?.password?.message && (
            <small className="text-red-700">{errors.password.message}</small>
          )}
        </div>
      }

      {
        updateForm ||
        <div className="relative w-[300px]">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type={showPassword2 ? "text" : "password"}
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
          <button
            type="button"
            onClick={togglePassword2Visibility}
            className="absolute right-2 top-[27px] text-[#141624] dark:text-[#e2e8f0]"
          >
            {showPassword2 ? <FaEyeSlash /> : <FaEye />}
          </button>

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
          <div className="githubeContainer" style={{ position: "relative" }}>
            <button
              type="button"
              className="cursor-pointer inline-flex items-center justify-center my-4 gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 active:bg-gray-100 dark:border-white/10 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              onClick={handleSigninWithGithub}
              style={{
                  pointerEvents: isLoadingGitHub ? "none" : "auto",
                  opacity: isLoadingGitHub ? 0.5 : 1,
              }}
            >
              {/* GitHub Icon */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
              >
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.79-.25.79-.56l-.01-2.02c-3.21.7-3.89-1.39-3.89-1.39-.53-1.35-1.28-1.71-1.28-1.71-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.11-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.28 1.2-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.75.8 1.2 1.82 1.2 3.08 0 4.43-2.71 5.41-5.29 5.69.41.35.78 1.05.78 2.13l-.01 3.16c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
              </svg>

              <span>Continue with GitHub</span>
            </button>
            {isLoadingGitHub && (
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
          <div className="googleContainer" style={{ position: "relative" }}>
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