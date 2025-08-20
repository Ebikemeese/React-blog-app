import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { requestPasswordReset } from "@/services/apiBlog";
import SmallSpinner from "@/ui_components/SmallSpinner";

const ForgotPasswordPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const mutation = useMutation({
        mutationFn: async ({ email }) => await requestPasswordReset(email),
        onSuccess: (data) => {
        toast.success(data.message || "Reset email sent successfully");
        },
        onError: (error) => {
        toast.error(error.message || "Failed to send reset email");
        console.log(error.message)
        },
    });

    const onSubmit = (data) => {
        mutation.mutate({ email: data.email });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Enter your email address
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
                autoFocus
                type="email"
                placeholder="Enter Email"
                {...register("email", {
                required: "Email is required",
                minLength: {
                    value: 10,
                    message: "Email must be at least 10 characters",
                },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <button
                type="submit"
                disabled={mutation.isPending}
                className="cursor-pointer bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
            >
                {mutation.isPending ? (
                <>
                    <SmallSpinner />
                    <small className="text-[16px]">Sending email...</small>
                </>
                ) : (
                <small className="cursor-pointer text-[16px]">Submit</small>
                )}
            </button>
            </form>
        </div>
        </div>
    );
};

export default ForgotPasswordPage;