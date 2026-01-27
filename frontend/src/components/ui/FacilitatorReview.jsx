import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../LoadingUI";
import { MdEmail, MdOutlineWork } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import Button from "../Button";
import InputBox from "../InputBox";

const FacilitatorReview = ({ startLoading, stopLoading }) => {
  const { facilitatorId } = useParams();
  const [data, setData] = useState();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [communication, setCommunication] = useState(0);
  const [knowledge, setKnowledge] = useState(0);
  const [behaviour, setBehaviour] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getCurrentFacilitator = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `facilitator/current-facilitator/${facilitatorId}`,
        "get",
      );
      setData(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    getCurrentFacilitator();
  }, []);

  const StarRating = ({ label, value, onChange }) => {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{label}</p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`text-2xl transition ${
                num <= value ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !customerName ||
      !customerPhone ||
      !communication ||
      !knowledge ||
      !behaviour
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await FetchData(
        `facilitator/user/${facilitatorId}/reviews`,
        "post",
        {
          customerName,
          customerPhone,
          communication,
          knowledge,
          behaviour,
          comment,
        },
      );

      console.log(res);

      setSuccess("Thank you for your feedback!");
      setCustomerName("");
      setCustomerPhone("");
      setCommunication(0);
      setKnowledge(0);
      setBehaviour(0);
      setComment("");
      alert(res.data.data.message);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center gap-5 py-10 px-5">
      {/* FacilitatorReview <h1>{facilitatorId}:id</h1> */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 bg-gray-200 lg:w-3/4 w-full rounded-xl py-5">
        {/* image  */}
        <div className="w-32 h-32 rounded-full overflow-hidden  flex-shrink-0">
          {data?.images?.length > 0 ? (
            <img
              src={data?.images[0]?.url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>
        {/* initial details  */}
        <div>
          <h1 className="text-2xl font-bold">{data?.name}</h1>
          <p className="bg-[#FFC20E] px-2 py-1 rounded-2xl w-fit">
            {data?.role}
          </p>

          <div className="mt-2 text-sm space-y-1">
            <p className="flex justify-start items-center gap-2 border-b border-gray-900">
              <MdEmail />
              {data?.email}
            </p>
            <p className="flex justify-start items-center gap-2 border-b border-gray-900">
              <IoCall />
              {data?.phone}
            </p>
            <p className="flex justify-start items-center gap-2 border-b border-gray-900">
              <FaStar />
              Rating: {data?.rating}
            </p>
            <p className="flex justify-start items-center gap-2 border-b border-gray-900">
              <MdOutlineWork />
              Experience: {data?.experienceYears} years
            </p>
          </div>
        </div>
      </div>
      <h1>Fill the below form to review the above facilitator you hired..</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 lg:w-3/4 w-full px-5 bg-gray-100 rounded-xl py-5"
      >
        <div className="flex justify-center items-center md:flex-row flex-col gap-1">
          <InputBox
            LabelName="Your name"
            Type="text"
            Placeholder="Your name"
            Value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <InputBox
            LabelName="Your contact number"
            Type="text"
            Placeholder="Your contact number"
            Value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 ">
          <StarRating
            label="Communication"
            value={communication}
            onChange={setCommunication}
          />

          <StarRating
            label="Knowledge"
            value={knowledge}
            onChange={setKnowledge}
          />

          <StarRating
            label="Behaviour"
            value={behaviour}
            onChange={setBehaviour}
          />
        </div>

        <textarea
          placeholder="Write your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
        />

        <Button
          type="submit"
          label={loading ? "Submitting..." : "Submit Review"}
          disabled={loading}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default LoadingUI(FacilitatorReview);
