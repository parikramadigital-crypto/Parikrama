import React from "react";

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
}) => {
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
        <input
          onClick={onClick}
          disabled={Disabled}
          id={Name}
          name={Name}
          type={Type}
          placeholder={Placeholder}
          required={Required}
          className={`w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md ${className}`}
          /* 👇 ONLY control input if onChange is provided */
          {...(onChange
            ? { value: Value ?? "", onChange }
            : { defaultValue: Value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && typeof keyPress === "function") {
              keyPress(e);
            }
          }}
        />
        {PasswordIndication === true ? (
          <span className="text-[11px] text-red-600 line-clamp-5">
            Password should be min 8 & max 20 characters, should contain 1
            uppercase, 1 lowercase, 1 digit, and 1 special character
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default InputBox;
