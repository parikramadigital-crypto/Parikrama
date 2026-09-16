import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import UserRegisterLogin from "../user/RegisterLogin";
import FacilitatorAuth from "../facilitator/FacilitatorAuth";
import CommunityRegForm from "../community/communityRegForm";
import RegisterExecutive from "../sales-marketing/RegisterExecutive";

const LoginRegister = () => {
  const [activeState, setActiveState] = useState(
    () => localStorage.getItem("activeState") || "User",
  );
  const sections = ["User", "Facilitator", "Community", "Executive"];
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-5 lg:py-10 lg:px-10">
      <div className="flex justify-center items-center w-full lg:w-1/4 bg-neutral-200 p-5 rounded-lg shadow">
        <nav>
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-5">
            <p className="col-span-2 lg:col-span-1">
              Please specify which role you want to sign in
            </p>
            {sections.map((section, idx) => (
              <li
                key={idx}
                className={`cursor-pointer transition-all duration-300 rounded-xl w-full px-4 py-2 flex justify-center items-center ${
                  activeState === section
                    ? "bg-[#FFC20E] shadow-xl"
                    : "bg-neutral-100 "
                }`}
                onClick={() => {
                  localStorage.setItem("activeState", section);
                  setActiveState(section);
                  // setMenuOpen(false); // close menu on click (mobile)
                }}
              >
                <p className="flex justify-between items-center w-full">
                  {section}
                  <span className="hidden lg:block">
                    {activeState === section ? <FaChevronRight /> : ""}
                  </span>
                  <span className="lg:hidden block">
                    {activeState === section ? <FaChevronDown /> : ""}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="px-5 overflow-scroll rounded-md pb-5 w-full">
        {activeState === "User" && <UserRegisterLogin />}
        {activeState === "Facilitator" && <FacilitatorAuth />}
        {activeState === "Community" && <CommunityRegForm />}
        {activeState === "Executive" && <RegisterExecutive />}
      </div>
    </div>
  );
};

export default LoginRegister;

// facilitator
// user
//community
