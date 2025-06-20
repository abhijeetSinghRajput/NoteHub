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
import { Check, Eye, EyeOff, Loader2, Lock, Mail, User2 } from "lucide-react";
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
import validator from "validator";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SignupPage = () => {
  const { isSigningUp, signup, sendSignupOtp, isSendingOtp, isEmailAvailable } =
    useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const debouncedEmail = useDebounce(formData.email, 500);

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      console.count("callback");
      const trimmedEmail = formData.email.trim();
      if (!trimmedEmail || !validator.isEmail(trimmedEmail)) {
        setEmailStatus(null);
        return;
      }

      setIsCheckingEmail(true);
      try {
        const isAvailable = await isEmailAvailable(trimmedEmail);
        setEmailStatus(isAvailable ? "available" : "taken");
        setErrors((prev) => ({
          ...prev,
          email: isAvailable ? "" : "Email is already registered",
        }));
      } catch (error) {
        console.error("Email check failed:", error);
        setEmailStatus(null);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    checkEmailAvailability();
  }, [debouncedEmail, isEmailAvailable]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
      setEmailStatus(null);
    } else {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSendotp = async () => {
    const trimmedEmail = formData.email.trim();

    if (!trimmedEmail) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    if (!validator.isEmail(trimmedEmail)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    if (emailStatus === "taken") {
      return;
    }

    try {
      const result = await sendSignupOtp(trimmedEmail);
      if (result?.status >= 200) {
        setCooldown(60);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const validateForm = () => {
    // Create trimmed form data
    const trimmedData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      otp: formData.otp.trim(),
    };

    let valid = true;
    let newErrors = {
      name: "",
      email: "",
      password: "",
      otp: "",
    };

    // Name validation
    if (!trimmedData.fullName) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (!validator.isLength(trimmedData.fullName, { min: 3 })) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    }

    // Email validation
    if (!trimmedData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validator.isEmail(trimmedData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    } else if (emailStatus === "taken") {
      newErrors.email = "Email is already registered";
      valid = false;
    }

    // Password validation
    if (!trimmedData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (validator.isEmpty(trimmedData.password)) {
      newErrors.password = "Password cannot be empty";
      valid = false;
    } else if (!validator.isLength(trimmedData.password, { min: 6 })) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // OTP validation
    if (!trimmedData.otp) {
      newErrors.otp = "OTP is required";
      valid = false;
    } else if (
      !validator.isNumeric(trimmedData.otp) ||
      !validator.isLength(trimmedData.otp, { min: 6, max: 6 })
    ) {
      newErrors.otp = "OTP must be 6 digits";
      valid = false;
    }

    setErrors(newErrors);
    return { valid, trimmedData };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { valid, trimmedData } = validateForm();
    if (!valid) return;

    try {
      await signup(trimmedData);
    } catch (error) {
      console.error("Signup failed:", error);
    }
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
              <div className="flex flex-col gap-5">
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
                      <p className="text-xs absolute left-2 px-1 bg-background -translate-y-1/2 -bottom-4 text-red-500">
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
                        "pl-8 pr-10",
                        errors.email && "ring-2 ring-red-500",
                        emailStatus === "available" && ""
                      )}
                      id="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSigningUp}
                    />
                    <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                      {isCheckingEmail ? (
                        <Loader2 className="animate-spin size-4" />
                      ) : emailStatus === "available" ? (
                        <Check className="size-4" />
                      ) : null}
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-xs absolute left-2 px-1 bg-background -translate-y-1/2 -bottom-4 text-red-500">
                      {errors.email}
                    </p>
                  )}
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
                      <p className="text-xs absolute left-2 px-1 bg-background -translate-y-1/2 -bottom-4 text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* OTP Input */}
                <div className="flex flex-col gap-1">
                  <div
                    className="grid relative gap-2"
                    style={{ gridTemplateColumns: "2fr 1fr" }}
                  >
                    <InputOTP
                      maxLength={6}
                      id="otp"
                      value={formData.otp}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, otp: value }))
                      }
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
                      disabled={
                        cooldown > 0 || isSendingOtp || emailStatus === "taken"
                      }
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="animate-spin mr-2 size-4" />
                        </>
                      ) : cooldown > 0 ? (
                        `${cooldown}s`
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                    {errors.otp && (
                      <p className="text-xs absolute left-0 -bottom-4 text-red-500">
                        {errors.otp}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSigningUp || emailStatus === "taken"}
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="animate-spin mr-2 size-4" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
            <GoogleLoginButton className={"mt-4"} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="underline font-semibold text-foreground"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
