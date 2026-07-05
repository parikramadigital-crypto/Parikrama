import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import UserRegisterLogin from "../user/RegisterLogin";
import FacilitatorAuth from "../facilitator/FacilitatorAuth";
import CommunityRegForm from "../community/communityRegForm";

const LoginRegister = () => {
  const [activeState, setActiveState] = useState(
    () => localStorage.getItem("activeState") || "User",
  );
  const sections = ["User", "Facilitator", "Community"];
  return (
    <div className="flex flex-col justify-center items-center gap- py-10">
      <div className="flex justify-center items-center w-fit">
        <nav>
          <ul className="flex md:gap-20 gap-5 items-center justify-center">
            {sections.map((section, idx) => (
              <li
                key={idx}
                className={`cursor-pointer transition-all duration-300 rounded-xl w-full px-4 py-2 ${
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
                <p className="flex justify-between items-center">{section}</p>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="px-5 overflow-scroll rounded-md pb-5">
        {activeState === "User" && <UserRegisterLogin />}
        {activeState === "Facilitator" && <FacilitatorAuth />}
        {activeState === "Community" && <CommunityRegForm />}
      </div>
    </div>
  );
};

export default LoginRegister;

// facilitator
// user
//community
