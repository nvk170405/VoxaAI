// app/layout.tsx
import Navbar from "../../components/Navbar";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
          <Navbar />
          
          <div>
          
            {children}
            
          </div>
      </SubscriptionProvider> 
    </AuthProvider>
  );
}
