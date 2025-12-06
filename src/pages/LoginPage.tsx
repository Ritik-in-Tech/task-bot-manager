import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const AuthSchema = z.object({
  username: z.string().min(2, "Required"),
  password: z.string().min(4, "Min 4 chars"),
});

type AuthSchemaType = z.infer<typeof AuthSchema>;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthSchemaType>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = (data: AuthSchemaType) => {
    dispatch(loginStart());
    // Fake async logic for demo purposes
    setTimeout(() => {
      if (data.username && data.password) {
        dispatch(loginSuccess({ username: data.username }));
      } else {
        dispatch(loginFailure("Invalid credentials"));
      }
    }, 500);
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <div className="w-full max-w-sm bg-card p-8 rounded shadow-lg flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-center mb-2">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span>Username</span>
            <Input {...register("username")} />
            {errors.username && (
              <span className="text-red-500 text-xs">
                {errors.username.message}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-2">
            <span>Password</span>
            <Input {...register("password")} type="password" />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </label>
          {auth.error && (
            <span className="text-red-600 text-center">{auth.error}</span>
          )}
          <Button type="submit" disabled={auth.loading}>
            {auth.loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
