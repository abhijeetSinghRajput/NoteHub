import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, User2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);
      login(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="flex pt-8 items-center justify-center h-screen bg-background">
      <div className={cn("flex flex-col gap-2 max-w-[440px] w-full m-auto")}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-5">
                {/* Username/Email Field */}
                <div className="flex flex-col gap-1 relative">
                  <div className="flex gap-2 relative">
                    <User2 className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                    <Input
                      className={cn(
                        "pl-8",
                        errors.identifier && "ring-2 ring-red-500"
                      )}
                      id="identifier"
                      type="text"
                      placeholder="Username or Email"
                      value={formData.identifier}
                      onChange={handleChange}
                      disabled={isLoggingIn}
                    />
                    {errors.identifier && (
                      <p className="text-xs absolute left-2 px-1 bg-card -translate-y-1/2 -bottom-4 text-red-500">
                        {errors.identifier}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex gap-2 relative">
                    <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                    <Input
                      className={cn(
                        "px-8",
                        errors.password && "ring-2 ring-red-500"
                      )}
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoggingIn}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-1 text-muted-foreground hover:text-foreground h-full hover:bg-transparent aspect-square absolute top-[50%] translate-y-[-50%] right-0"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </Button>
                    {errors.password && (
                      <p className="text-xs absolute left-2 px-1 bg-card -translate-y-1/2 -bottom-4 text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <Link
                    to="/forget-password"
                    className="text-sm underline-offset-2 hover:underline w-min whitespace-nowrap"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </form>
            <GoogleLoginButton className={"mt-4"} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="underline font-semibold text-foreground"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
