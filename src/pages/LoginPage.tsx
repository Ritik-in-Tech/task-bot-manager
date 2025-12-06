import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

const AuthSchema = z.object({
  username: z.string().min(2, "Required"),
  password: z.string().min(4, "Min 4 chars"),
});

type AuthSchemaType = z.infer<typeof AuthSchema>;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<AuthSchemaType>({
    resolver: zodResolver(AuthSchema),
  });



  const onSubmit = (data: AuthSchemaType) => {
    dispatch(loginStart());
    setTimeout(() => {
      if (data.username && data.password) {
        dispatch(loginSuccess({ username: data.username }));
      } else {
        dispatch(loginFailure("Invalid credentials"));
      }
    }, 500);
    reset();
  };

  const onError = () => {
    toast.error("Please fill in all required fields");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your fleet</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">Username</label>
            <Input
              id="username"
              placeholder="Enter your username"
              {...register("username")}
              className="bg-white/50 dark:bg-black/20 border-white/10 focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="bg-white/50 dark:bg-black/20 border-white/10 focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {auth.error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              {auth.error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" 
            disabled={auth.loading}
          >
            {auth.loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
