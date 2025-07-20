import { GalleryVerticalEnd } from "lucide-react"
import  Image  from 'next/image';
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white dark:bg-background font-montserrat p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-none text-primary-foreground font-semibold">
            <Image src="/logo.svg" alt="logo" width={75} height={45} className="bg-none size-12"
               />
          </div>
          Voxa 
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
