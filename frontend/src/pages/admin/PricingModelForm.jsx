// SubAdmin.jsx

import React, { useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import Button from "../../components/Button";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";

const PricingModelForm = ({ startLoading, stopLoading, onCancel, adminId }) => {
  const formRef = useRef(null);
  const [customModelInput, setShowCustomModelInput] = useState(false);
  const [faqs, setFaqs] = useState([
    {
      question: "",
      answer: "",
    },
  ]);

  const addFaqs = () => {
    setFaqs((prev) => [
      ...prev,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  const removeFaqs = (index) => {
    if (faqs.length === 1) return;

    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      startLoading();

      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `admin/register-sub-admin/${adminId}`,
        "post",
        // objectData,
      );
      alert(response.data.message);
      formRef.current.reset();
      onCancel();
    } catch (err) {
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
        <h1 className="text-3xl font-bold">Create new pricing model</h1>
      </div>

      {/* FORM */}
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 place-items-center w-full">
          <div className="col-span-1 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                This pricing model is for
              </label>
              <select
                name="modelFor"
                required
                onChange={(e) => {
                  if (e.target.value === "Custom") {
                    setShowCustomModelInput(true);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out"
              >
                <option value="">Select Option</option>
                {["User", "Facilitator", "Food Place", "Hotel", "Custom"].map(
                  (i, index) => (
                    <option value={i}>{i}</option>
                  ),
                )}
              </select>
            </div>
            {customModelInput === true ? (
              <div className="w-full">
                <InputBox
                  Name="customModelFor"
                  Placeholder="Write for whom this model is for"
                  // LabelName="Custom model for"
                />
                <InputBox className="hidden" Value={true} Name="customModel" />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Name
            </label>
            <select
              name="modelFor"
              required
              // onChange={(e) => {
              //   if (e.target.value === "Custom") {
              //     setShowCustomModelInput(true);
              //   }
              // }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out"
            >
              <option value="">Select Option</option>
              {[
                "Free",
                "Starter",
                "Standard",
                "Professional",
                "Enterprise",
              ].map((i, index) => (
                <option value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div className="py-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <textarea
              required={false}
              placeholder="Write a short tagline..."
              name="bio"
              rows="2"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
            />
          </div>
          <div className="flex justify-between items-center w-full gap-5">
            <InputBox Name="mrp" Type="number" LabelName="MRP" />
            <InputBox
              Name="discount"
              Type="number"
              LabelName="Discount (in %)"
            />
            <InputBox
              Name="sellingPrice"
              Type="number"
              LabelName="Discounted Price"
              Disabled={true}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan duration
            </label>
            <select
              name="planDuration"
              required
              // onChange={(e) => {
              //   if (e.target.value === "Custom") {
              //     setShowCustomModelInput(true);
              //   }
              // }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out"
            >
              <option value="">Select Option</option>
              {["Quarter", "Half-Year", "Per-Year"].map((i, index) => (
                <option value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div className="w-full border border-neutral-300 rounded-xl p-5 gap-2 flex flex-col ">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-semibold">FAQs</h2>
              <Button label={"Add"} type={"button"} onClick={addFaqs} />
            </div>

            {faqs.map((item, index) => (
              <div
                key={index}
                className="flex justify-center items-start bg-neutral-100 rounded-xl w-full gap-5 px-5 py-2"
              >
                <InputBox
                  LabelName="Question"
                  Name={`question-${index}`}
                  Value={item.question}
                  onChange={(e) =>
                    handleFAQChange(index, "question", e.target.value)
                  }
                />

                <InputBox
                  LabelName="Answer"
                  Name={`answer-${index}`}
                  Value={item.answer}
                  onChange={(e) =>
                    handleFAQChange(index, "answer", e.target.value)
                  }
                />
                <Button
                  normal={false}
                  label={"Remove"}
                  Disabled={faqs.length === 1}
                  onClick={() => removeFaqs(index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end items-center gap-5 mt-10">
          <Button
            label={"Cancel"}
            type={"button"}
            normal={false}
            onClick={() => {
              formRef.current.reset();
              onCancel();
            }}
          />

          <Button label={"Create Model"} type={"submit"} />
        </div>
      </form>
    </motion.div>
  );
};

export default LoadingUI(PricingModelForm);
