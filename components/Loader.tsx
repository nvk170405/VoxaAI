// components/Loader.tsx
import React from "react";
import { LoaderCircle } from "lucide-react";
const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoaderCircle className="animate-spin rounded-full h-8 w-8 " /> 
    </div>
  );
};

export default Loader;
