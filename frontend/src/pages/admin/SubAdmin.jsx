// SubAdmin.jsx

import React, { useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import Button from "../../components/Button";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";

const sections = [
  "Overview",
  "Enquiries",
  "Hotels",
  "Clubs",
  "Active Places",
  "Inactive Places",
  "Food Place",
  "Users",
  "Verified Facilitator",
  "Non-Verified Facilitator",
  "Cities",
  "States",
  "Countries",
  "Packages",
  "Promotions",
];

const subAdminFormInputs = [
  {
    label: "Full Name",
    name: "name",
    placeHolder: "Enter full name",
    type: "text",
  },
  {
    label: "Employee ID",
    name: "employeeId",
    placeHolder: "Enter employee ID",
    type: "text",
  },
  {
    label: "Email Address",
    name: "email",
    placeHolder: "Enter email address",
    type: "email",
  },
  {
    label: "Phone Number",
    name: "phoneNumber",
    placeHolder: "Enter phone number",
    type: "text",
  },
  {
    label: "Password",
    name: "password",
    placeHolder: "Enter password",
    type: "password",
    passwordTrue: true,
  },
];

const SubAdmin = ({ startLoading, stopLoading, onCancel, adminId }) => {
  const formRef = useRef(null);

  const [selectedSections, setSelectedSections] = useState([]);

  const toggleSection = (section) => {
    setSelectedSections((prev) => {
      if (prev.includes(section)) {
        return prev.filter((s) => s !== section);
      }

      return [...prev, section];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      startLoading();

      const formData = new FormData(formRef.current);

      // append restriction
      formData.append("restrictedAccess", true);

      // append sections
      selectedSections.forEach((section) => {
        formData.append("sectionList", section);
      });

      const objectData = Object.fromEntries(formData.entries());

      objectData.sectionList = selectedSections;

      const response = await FetchData(
        `admin/register-sub-admin/${adminId}`,
        "post",
        objectData,
      );

      alert(response.data.message);

      formRef.current.reset();

      setSelectedSections([]);

      onCancel();
    } catch (err) {
      console.log(err);

      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl bg-white rounded-3xl p-8 shadow-2xl"
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#FFC20E] p-4 rounded-2xl">
          <FaUserShield className="text-3xl text-black" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Register New Sub Admin</h1>

          <p className="text-gray-500 mt-1">
            Create restricted admin access for specific dashboard sections.
          </p>
        </div>
      </div>

      {/* FORM */}
      <form ref={formRef} onSubmit={handleSubmit}>
        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subAdminFormInputs.map((i, index) => (
            <InputBox
              key={index}
              LabelName={i.label}
              Name={i.name}
              Placeholder={i.placeHolder}
              Type={i.type}
              PasswordIndication={i.passwordTrue}
            />
          ))}
        </div>

        {/* SECTION ACCESS */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Section Access</h2>

              <p className="text-gray-500 mt-1">
                Select which dashboard sections this subadmin can access.
              </p>
            </div>

            <div className="bg-[#FFC20E] px-5 py-2 rounded-xl font-semibold">
              {selectedSections.length} Selected
            </div>
          </div>

          {/* CHECKBOX GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {sections.map((section, index) => {
              const isSelected = selectedSections.includes(section);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleSection(section)}
                  className={`border-2 rounded-2xl px-5 py-4 transition-all duration-200 text-left ${
                    isSelected
                      ? "border-[#FFC20E] bg-[#FFF8E0] shadow-md scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-[#FFC20E]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{section}</p>

                    <div
                      className={`w-6 h-6 rounded-md border-2 flex justify-center items-center ${
                        isSelected
                          ? "bg-[#FFC20E] border-[#FFC20E]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end items-center gap-5 mt-10">
          <Button
            label={"Cancel"}
            type={"button"}
            normal={false}
            className={"px-8 py-3"}
            onClick={() => {
              formRef.current.reset();
              setSelectedSections([]);
              onCancel();
            }}
          />

          <Button
            label={"Register Sub Admin"}
            type={"submit"}
            className={"px-8 py-3 font-semibold"}
          />
        </div>
      </form>
    </motion.div>
  );
};

export default LoadingUI(SubAdmin);
