import { BriefcaseBusiness } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <div className="bg-white text-[#090909] rounded-md py-2 px-4 gap-2 flex justify-center items-center">
      <div className=" font-bold  text-xl">Hiring.com
      </div>
        <BriefcaseBusiness size={20} />
    </div>
  );
}

export default Logo;