import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { verifyOtp } from "@/services/apiBlog";
import { useNavigate } from "react-router-dom";
import SmallSpinner from "@/ui_components/SmallSpinner";
import { resendOtp } from "@/services/apiBlog";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";



const VerifyEmailPage = () => {
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const navigate = useNavigate();
    const [cooldown, setCooldown] = useState(0);
    const location = useLocation();
    const userEmail = location.state?.email;
    const [otpExpiry, setOtpExpiry] = useState(60);

    const mutation = useMutation({
        mutationFn: (data) => verifyOtp(data),
        onSuccess: () => {
          toast.success("Email verified successfully!");
          navigate("/login");
        },
        onError: (error) => {
            if (error?.response?.status === 410) {
                toast.error("OTP is expired");
            } else if (error?.response?.status === 404) {
                toast.error("OTP code does not exist or incorrect");
            } else {
                toast.error(error.message || "OTP verification failed");
            }
        },
    });

    const resendMutation = useMutation({
        mutationFn: () => resendOtp(userEmail),
        onSuccess: () => {
            toast.success("OTP resent successfully!");
            
            const expiry = Date.now() + 60000; // 60 seconds
            localStorage.setItem("otpCooldownExpiry", expiry);
            setCooldown(60);

            const otpExpiryTime = Date.now() + 60000;
            localStorage.setItem("otpExpiryTime", otpExpiryTime);
            setOtpExpiry(60);

        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        },
    });

    useEffect(() => {
        if (cooldown === 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    useEffect(() => {
        const expiry = localStorage.getItem("otpCooldownExpiry");
        if (expiry) {
            const remaining = Math.floor((expiry - Date.now()) / 1000);
            if (remaining > 0) setCooldown(remaining);
        }
    }, []);

    useEffect(() => {
        if (cooldown === 1) {
            setTimeout(() => toast.info("You can now resend the OTP."), 1000);
        }
    }, [cooldown]);

    useEffect(() => {
        if (cooldown === 0) {
            localStorage.removeItem("otpCooldownExpiry");
        }
    }, [cooldown]);

    useEffect(() => {
        const expiry = localStorage.getItem("otpExpiryTime");
        if (expiry) {
            const remaining = Math.floor((expiry - Date.now()) / 1000);
            if (remaining > 0) setOtpExpiry(remaining);
        } else {
            const newExpiry = Date.now() + 60000;
            localStorage.setItem("otpExpiryTime", newExpiry);
            setOtpExpiry(60);
        }
    }, []);

    useEffect(() => {
        if (otpExpiry <= 0) return;

        const timer = setInterval(() => {
            setOtpExpiry((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [otpExpiry]);


    useEffect(() => {
        if (otpExpiry === 0) {
            localStorage.removeItem("otpExpiryTime");
        }
    }, [otpExpiry]);




    const onSubmit = (data) => {
      mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Verify Your Email
            </h2>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            Enter the verification code sent to your email address
            </p>

            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 text-center">
                {otpExpiry > 0 ? (
                    <span>OTP expires in {String(Math.floor(otpExpiry / 60)).padStart(2, '0')}:{String(otpExpiry % 60).padStart(2, '0')}</span>
                ) : (
                    <span className="text-red-500">OTP expired</span>
                )}
            </div>


            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
                disabled={otpExpiry === 0}
                autoFocus
                {...register("otp", { required: "OTP is required" })}
                type="text"
                maxLength={6}
                placeholder="Enter 6 digit OTP code"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp.message}</p>
            )}


            <button
                type="submit"
                className="cursor-pointer bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
            >
                {mutation.isPending ? (
                    <>
                        {" "}
                        <SmallSpinner />{" "}
                        <small className="text-[16px]">Verifying email...</small>{" "}
                    </>
                    ) 
                    : (
                    <small className="text-[16px]">Verify</small>
                    )}
            </button>
            </form>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Didn’t receive the code?{" "}
            <button className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                type="button"
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending || cooldown > 0}

            >
                {resendMutation.isPending
                ? "Resending..."
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend"}

            </button>
            </div>
        </div>
        </div>
    );
};

export default VerifyEmailPage;
