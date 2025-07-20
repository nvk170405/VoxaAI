"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignUpForm } from "@/components/signupform";
import Dashboard from "@/app/(dashboard)/dashboard/page";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-background font-montserrat">
        <Routes>
          {/* Define your routes */}
          <Route
            path="/signup"
            element={
              <div className="flex items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                  <SignUpForm />
                </div>
              </div>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
