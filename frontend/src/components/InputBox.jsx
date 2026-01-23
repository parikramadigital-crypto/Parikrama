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
          </label>
        )}

        <input
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
      </div>
    </div>
  );
};

export default InputBox;
