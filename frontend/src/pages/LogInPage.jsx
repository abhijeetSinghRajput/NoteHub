import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Link } from "react-router-dom";
import { Loader2, Eye, EyeClosed } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useState } from "react"
import { z } from 'zod';

const loginSchema = z.object({
  userName: z.string().min(1, 'userName is required'),
  password: z.string().min(1, 'password is required')
})

const LoginPage = ({ className, ...props }) => {
  const { isLoggingIn, login } = useAuthStore();
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handFormSubmit = (e) => {
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
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handFormSubmit} className="p-6 md:p-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="logo text-lg">NoteHub</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your NoteHub account
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                      id="userName"
                      placeholder="username"
                      value={formData.userName}
                      autoComplete="username"
                      required
                      onChange={handleChange}
                    />
                    {errors.userName && <p className="text-red-500">{errors.userName}</p>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <Link
                      to="/forget-password"
                      className="mb-4 text-sm underline-offset-2 hover:underline w-min whitespace-nowrap"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Button type="submit" disabled={isLoggingIn}>
                    {
                      isLoggingIn ?
                        <>
                          <Loader2 className="animate-spin" />
                          Please wait
                        </>
                        :
                        "Log in"
                    }
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="hover:underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://ui.shadcn.com/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our <Link to="#">Terms of Service</Link>{" "}
            and <Link to="#">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
