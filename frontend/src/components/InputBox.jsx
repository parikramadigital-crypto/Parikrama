import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const InputBox = ({
  LabelName = "",
  Placeholder = "",
  className = "",
  Type = "text",
  Name = "",
  Value,
  onChange,
  Required = true,
  keyPress,
  Disabled = false,
  LabelClassname = "",
  PasswordIndication = false,
  onClick,
  Min,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const isPasswordField = Type === "password";

  return (
    <div className="flex justify-center items-center w-full">
      <div className="py-4 w-full">
        {LabelName && (
          <label
            htmlFor={Name}
            className={`block text-sm font-medium text-gray-700 mb-2 ${LabelClassname}`}
          >
            {LabelName}
            {Required === true ? "*" : ""}
          </label>
        )}
        <div className="relative w-full">
          <input
            min={Min}
            onFocus={() => {
              setShowWarning(true);
              setTimeout(() => {
                setShowWarning(false);
              }, 5000);
            }}
            onClick={onClick}
            disabled={Disabled}
            id={Name}
            name={Name}
            type={isPasswordField ? (showPassword ? "text" : "password") : Type}
            placeholder={Placeholder}
            required={Required}
            className={`w-full px-4 ${
              isPasswordField ? "pr-12" : ""
            } py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md ${className}`}
            {...(onChange
              ? { value: Value ?? "", onChange }
              : { defaultValue: Value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && typeof keyPress === "function") {
                keyPress(e);
              }
            }}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-500
                hover:text-[#FFC20E]
                transition
              "
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )}
        </div>
        <AnimatePresence>
          {showWarning && (
            <div>
              {PasswordIndication === true ? (
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -100 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{
                    type: "spring",
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="fixed bottom-10 left-10 bg-red-200 p-4 rounded-xl z-50"
                >
                  <button
                    className="text-red-600 font-bold "
                    onClick={() => setShowWarning(false)}
                  >
                    X
                  </button>
                  {PasswordIndication === true ? (
                    <span className="text-red-600 line-clamp-5 w-96">
                      Password should be min 8 & max 20 characters, should
                      contain 1 uppercase, 1 lowercase, 1 digit, and 1 special
                      character
                    </span>
                  ) : (
                    ""
                  )}
                </motion.div>
              ) : (
                ""
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InputBox;
