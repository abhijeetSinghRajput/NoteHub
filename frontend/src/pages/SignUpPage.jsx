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
import { Eye, EyeClosed, Hash, Loader2, Lock, Mail, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const SignupPage = () => {
  const { isSigningUp, signup, sendSignupOtp, isSendingOtp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSendotp = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: !formData.email
          ? "Email is required before sending otp."
          : "Invalid email format.",
      }));
      return;
    }

    try {
      const result = await sendSignupOtp(formData.email);
      if (result?.status >= 200) {
        setCooldown(60);
      }
    } catch (error) {
      // handle error if needed
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValid = (data) => {
    let valid = true;
    let newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    };

    if (!data.fullName || data.fullName.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
      valid = false;
    }

    if (!data.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!isValidEmail(data.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!data.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
      valid = false;
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    if (!data.otp) {
      newErrors.otp = "OTP is required.";
      valid = false;
    } else if (!/^\d{6}$/.test(data.otp)) {
      newErrors.otp = "OTP must be 6 digits.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    if (!isValid(formData)) return;
    signup(formData);
  };

  return (
    <div className="flex pt-8 items-center justify-center h-screen bg-background">
      <div className={cn("flex flex-col gap-2 max-w-[440px] w-full m-auto")}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Signup</CardTitle>
            <CardDescription>
              Fill this form to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-4">
                {/* Name Field */}
                <div className="flex flex-col gap-1 relative">
                  <div className="flex gap-2 relative">
                    <User2 className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                    <Input
                      className={cn(
                        "pl-8",
                        errors.name && "ring-2 ring-red-500"
                      )}
                      id="fullName"
                      type="text"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isSigningUp}
                    />
                    {errors.name && (
                      <p className="text-xs absolute left-0 -bottom-4 text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-1 relative">
                  <div className="flex gap-2 relative">
                    <Mail className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                    <Input
                      className={cn(
                        "pl-8",
                        errors.email && "ring-2 ring-red-500"
                      )}
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSigningUp}
                    />
                    {errors.email && (
                      <p className="text-xs absolute left-0 -bottom-4 text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1 relative">
                  <div className="flex gap-2 relative">
                    <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                    <Input
                      className={cn(
                        "pl-8",
                        errors.password && "ring-2 ring-red-500"
                      )}
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSigningUp}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-1 h-min absolute top-[50%] translate-y-[-50%] right-2"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Eye className="text-muted-foreground size-4" />
                      ) : (
                        <EyeClosed className="text-muted-foreground size-4" />
                      )}
                    </Button>
                    {errors.password && (
                      <p className="text-xs absolute left-0 -bottom-4 text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1 relative">
                  <div className="flex gap-2 relative">
                    <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                    <Input
                      className={cn(
                        "pl-8",
                        errors.confirmPassword && "ring-2 ring-red-500"
                      )}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isSigningUp}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-1 h-min absolute top-[50%] translate-y-[-50%] right-2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <Eye className="text-muted-foreground size-4" />
                      ) : (
                        <EyeClosed className="text-muted-foreground size-4" />
                      )}
                    </Button>
                    {errors.confirmPassword && (
                      <p className="text-xs absolute left-0 -bottom-4 text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* OTP Input with Hash Icon */}
                <div className="flex flex-col gap-1">
                  <div
                    className="grid relative gap-2"
                    style={{ gridTemplateColumns: "2fr 1fr" }}
                  >
                    <InputOTP
                      maxLength={6}
                      id="otp"
                      value={formData.otp}
                      onChange={(value) => setFormData((prev) => ({ ...prev, otp: value }))}
                      pattern={REGEXP_ONLY_DIGITS}
                      disabled={false}
                    >

                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <Button
                      className="w-full"
                      variant="outline"
                      type="button"
                      onClick={handleSendotp}
                      disabled={cooldown > 0 || isSendingOtp}
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="animate-spin ml-2" />
                        </>
                      ) : cooldown > 0 ? (
                        `${cooldown}s`
                      ) : (
                        "Send otp"
                      )}
                    </Button>
                    {errors.otp && (
                      <p className="text-xs absolute left-0 -bottom-4 text-red-500">
                        {errors.otp}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSigningUp}>
                  {isSigningUp ? "Creating..." : "Create Account"}
                  {isSigningUp && <Loader2 className="animate-spin ml-2" />}
                </Button>
              </div>
            </form>
            <GoogleLoginButton className={"mt-4"} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link to={"/login"} className="underline font-semibold text-foreground">Login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
