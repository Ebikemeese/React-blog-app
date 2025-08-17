import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import SmallSpinner from "@/ui_components/SmallSpinner";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/apiBlog"; // Make sure this function is defined

const ResetPasswordPage = () => {
  const { register, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const password = watch("password");
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await resetPassword({
        uidb64,
        token,
        password: data.password,
        confirm_password: data.confirmPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset password");
    },
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
        <h3 className="font-semibold text-2xl">Reset Password Form</h3>
      </div>

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

      <div> import serializers
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
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
              <small className="text-[16px]">Resetting password...</small>
            </>
          ) : (
            <small className=" text-[16px]">Submit</small>
          )}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordPage;