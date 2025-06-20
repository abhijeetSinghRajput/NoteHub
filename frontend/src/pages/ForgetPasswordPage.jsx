import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";

const ForgotPasswordPage = () => {
  const {
    requestResetPasswordOtp,
    resetPassword,
    isSendingOtp,
    isResettingPassword,
    getUser,
  } = useAuthStore();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [isValidIdentifier, setIsValidIdentifier] = useState(false);
  const [isCheckingIdentifier, setIsCheckingIdentifier] = useState(false);

  // Identifier validation (both username and email)
  const validateIdentifierFormat = (identifier) => {
    // Username pattern (alphanumeric with possible underscores/dots, 3-20 chars)
    const usernamePattern = /^[a-zA-Z0-9_.]{3,20}$/;
    // Email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return usernamePattern.test(identifier) || emailPattern.test(identifier);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Confirm password validation
  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  // Debounced identifier lookup
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (identifier && validateIdentifierFormat(identifier)) {
        setIsCheckingIdentifier(true);
        try {
          const userData = await getUser(identifier);
          console.log(userData);
          setUser(userData);
          setIdentifierError("");
          setIsValidIdentifier(true);
        } catch (error) {
          setUser(null);
          setIdentifierError("No account found with this username/email");
          setIsValidIdentifier(false);
        } finally {
          setIsCheckingIdentifier(false);
        }
      } else if (identifier) {
        setIdentifierError("Please enter a valid username or email address");
        setIsValidIdentifier(false);
        setUser(null);
      } else {
        setIdentifierError("");
        setIsValidIdentifier(false);
        setUser(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [identifier, getUser]);

  // Cooldown timer
  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSendOtp = async () => {
    if (!isValidIdentifier) {
      setIdentifierError("Please enter a valid registered username or email");
      return;
    }
    const res = await requestResetPasswordOtp(identifier);
    if (res) {
      setCooldown(60);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }
    if (otp.length !== 6) {
      return;
    }
    const res = await resetPassword({
      identifier, // Changed from email to identifier
      newPassword: password.trim(),
      otp,
    });

    if (res) {
      navigate("/login");
    }
  };

  return (
    <div className="flex pt-8 items-center justify-center h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your username or email to receive a password reset OTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* User preview when identifier is valid */}
            {user && (
              <div className="flex gap-2 bg-accent/50 p-2 rounded-xl items-center">
                <Avatar className="size-10">
                  <AvatarImage
                    className="w-full h-full object-cover rounded-full"
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-transparent">
                    <img src="./avatar.png" alt="" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <strong className="font-semibold">{user.fullName}</strong>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                </div>
              </div>
            )}

            {isCheckingIdentifier && (
              <Skeleton className="flex gap-2 p-2">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </Skeleton>
            )}

            {/* Identifier Field */}
            <div className="grid relative items-center gap-1">
              <div className="flex gap-2 relative">
                <UserRound className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                <Input
                  type="text"
                  placeholder="Username or email"
                  className="pl-8"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.trim())}
                  disabled={isSendingOtp || isResettingPassword}
                />
                {isCheckingIdentifier && (
                  <Loader2 className="absolute top-[10px] right-3 size-4 animate-spin" />
                )}
              </div>
              {identifierError && (
                <p className="text-xs text-red-500">{identifierError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="grid relative items-center gap-1">
              <div className="flex gap-2 relative">
                <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="px-8"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(
                      validatePassword(e.target.value)
                        ? ""
                        : "Password must be at least 6 characters."
                    );
                  }}
                  disabled={isResettingPassword}
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
              </div>
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="grid relative items-center gap-1">
              <div className="flex gap-2 relative">
                <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="px-8"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError(
                      validateConfirmPassword(password, e.target.value)
                        ? ""
                        : "Passwords do not match."
                    );
                  }}
                  disabled={isResettingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="p-1 text-muted-foreground hover:text-foreground h-full hover:bg-transparent aspect-square absolute top-[50%] translate-y-[-50%] right-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </Button>
              </div>
              {confirmPasswordError && (
                <p className="text-xs text-red-500">{confirmPasswordError}</p>
              )}
            </div>

            {/* OTP Field */}
            <div className="space-y-2">
              <div className="relative grid grid-cols-[3fr_1fr] items-center gap-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  pattern={REGEXP_ONLY_DIGITS}
                  disabled={isResettingPassword}
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
                {/* Send OTP Button */}
                <Button
                  variant="outline"
                  onClick={handleSendOtp}
                  disabled={
                    !user || cooldown > 0 || isSendingOtp || !isValidIdentifier
                  }
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="animate-spin mr-2 size-4" />
                    </>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    "Get OTP"
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Enter the 6-digit OTP sent to your email
              </p>
            </div>

            {/* Reset Password Button */}
            <Button
              onClick={handleResetPassword}
              disabled={
                isResettingPassword ||
                passwordError ||
                confirmPasswordError ||
                otp.length !== 6
              }
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="animate-spin mr-2 size-4" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
