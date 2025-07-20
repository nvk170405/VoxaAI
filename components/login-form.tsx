"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { login }  = useAuth(); // This should now work correctly
  const router = useRouter();
  const handleLoginWithGoogle = async () => {
    try {
      await login();
      router.push("/dashboard"); // Trigger Google OAuth login
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please reset your password or sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Invalid password. Please try again.");
      } else {
        setError("Login failed. Please check your details and try again.");
      }
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    setError(null); // Clear errors
    setSuccessMessage(null); // Clear success messages

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "Password reset email sent! Check your inbox to reset your password."
      );
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email. Please sign up.");
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
    }
  };
  return (
    <div className={cn("flex flex-col gap-6 dark:bg-background", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-montserrat text-black dark:text-white">Welcome back</CardTitle>
          <CardDescription className="font-montserrat text-black dark:text-white">
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6 font-montserrat text-black  dark:text-white">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="bg-white text-black hover:bg-black hover:text-white border-2 border-black dark:border-white shadow-100 w-full"
                 >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" className="bg-white text-black hover:bg-black hover:text-white border-2 border-black  dark:border-white shadow-100 w-full"
                 onClick={handleLoginWithGoogle}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative  text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-10 after:flex after:items-center after:border-t after:border-border">
                <span className="relative bg-white z-20 dark:bg-background px-2 ">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6  dark:text-white">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                </div>
                
                <div className="grid gap-2  dark:text-white">
                  <Label htmlFor="password" className="block">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    
                      <a
                        type="button"
                        className="ml-auto  dark:text-white absolute pt-2 right-0 text-xs underline-offset-2 hover:underline cursor-pointer"
                        onClick={handlePasswordReset}
                      >
                        Forgot your password?
                      </a>
                    
                  </div>
                </div>
                <Button type="submit" className="bg-black text-white hover:bg-gray-200 hover:text-black mt-5 w-full shadow-lg">
                  Login
                </Button>
                {error && (
              <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}
            {successMessage && (
              <p className="mt-4 text-center text-sm text-green-500">
                {successMessage}
              </p>
            )}
              </div>
              <div className="text-center  dark:text-white text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center  dark:text-white text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
