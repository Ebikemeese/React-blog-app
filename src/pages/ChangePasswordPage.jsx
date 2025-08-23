import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import SmallSpinner from "@/ui_components/SmallSpinner";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { changePassword } from "@/services/apiBlog";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const ChangePasswordPage = ({ setUsername, setIsAuthenticated }) => {
  const { register, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const password = watch("password");
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const togglePassword2Visibility = () => {
    setShowPassword2((prev) => !prev);
  };

  const togglePassword3Visibility = () => {
    setShowPassword3((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await changePassword({
        old_password: data.old_password,
        password: data.password,
        confirm_password: data.confirmPassword,
      });
    },
    onSuccess: () => {
        toast.success("Password changed successfully");
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("github_code_used")
        setIsAuthenticated(false)
        setUsername(null)
        navigate("/login")
    },
    onError: (error) => {
        const errorData = error.response?.data;

        if (errorData) {
            Object.entries(errorData).forEach(([field, messages]) => {
            messages.forEach((msg) => toast.error(msg));
            });
        } else {
            toast.error("Something went wrong. Please try again.");
        }
    }


  });

  function onSubmit(data) {
    mutation.mutate(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:px-16 px-8 py-6 flex flex-col mx-auto my-9 
      items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl 
      dark:text-white dark:bg-[#141624]"
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">Change Password Form</h3>
      </div>

      <div className="relative w-[300px]">
        <Label htmlFor="old_password">Old Password</Label>
        <Input
          type={showPassword3 ? "text" : "password"}
          id="old_password"
          placeholder="Enter old password"
          {...register("old_password", {
            required: "Old Password is required",
            minLength: {
              value: 8,
              message: "Old Password must be at least 8 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        <button
          type="button"
          onClick={togglePassword3Visibility}
          className="absolute right-2 top-[27px] text-[#141624] dark:text-[#e2e8f0]"
        >
          {showPassword3 ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors?.old_password?.message && (
          <small className="text-red-700">{errors.old_password.message}</small>
        )}
      </div>

      <div className="relative w-[298px]">
        <Label htmlFor="password">Current Password</Label>
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
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[29800px]"
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

      <div className="relative w-[300px]">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type={showPassword2 ? "text" : "password"}
          id="confirmPassword"
          placeholder="Confirm password"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            validate: (value) =>
              value === password || "Passwords do not match",
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

      <div className="w-full flex items-center justify-center flex-col my-4">
        <button
          disabled={mutation.isPending}
          type="submit"
          className="cursor-pointer bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <SmallSpinner />
              <small className="text-[16px]">Changing password...</small>
            </>
          ) : (
            <small className=" text-[16px]">Submit</small>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordPage;