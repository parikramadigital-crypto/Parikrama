import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { IoMdLogOut } from "react-icons/io";
import { clearUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaRegCopy, FaStar } from "react-icons/fa";
import useCopyUrl from "../../components/hooks/CopyUrl";
import { MdEmail, MdOutlineWork } from "react-icons/md";
import { IoCall } from "react-icons/io5";

const FacilitatorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { copied, copy } = useCopyUrl();

  const FacilitatorProfile = ({ facilitator }) => {
    if (!facilitator) return null;
    console.log(facilitator);
    const logout = () => {
      localStorage.clear();
      dispatch(clearUser());
      alert("You are logged out successfully");
      navigate("/");
    };

    // const CopyUrlButton = () => {
    //   const [copied, setCopied] = useState(false);

    //   const copyUrl = async () => {
    //     await navigator.clipboard.writeText(
    //       `https://parikrama.riderskart.in/facilitator/review/${facilitator?._id}`,
    //     );
    //     // await navigator.clipboard.writeText(window.location.href);
    //     setCopied(true);
    //     setTimeout(() => setCopied(false), 2000);
    //   };

    //   return (
    //     <Button onClick={copyUrl} label={copied ? <FaCopy /> : <FaRegCopy />} />
    //   );
    // };

    const {
      name,
      email,
      phone,
      role,
      bio,
      experienceYears,
      languages,
      rating,
      totalBookings,
      images,
      city,
      state,
      place,
      verification,
      subscription,
    } = facilitator;

    return (
      <div className="md:max-w-8xl w-full mx-auto p-6 space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-gray-200 p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            {/* image  */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {images?.length > 0 ? (
                <img
                  src={images[0]?.url}
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
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="bg-[#FFC20E] px-2 py-1 rounded-2xl w-fit">{role}</p>

              <div className="mt-2 text-sm space-y-1">
                <p className="flex justify-start items-center gap-2 border-b border-gray-900">
                  <MdEmail />
                  {email}
                </p>
                <p className="flex justify-start items-center gap-2 border-b border-gray-900">
                  <IoCall />
                  {phone}
                </p>
                <p className="flex justify-start items-center gap-2 border-b border-gray-900">
                  <FaStar />
                  Rating: {rating}
                </p>
                <p className="flex justify-start items-center gap-2 border-b border-gray-900">
                  <MdOutlineWork />
                  Experience: {experienceYears} years
                </p>
              </div>
            </div>
          </div>
          {/* buttons  */}
          <div className="flex flex-col justify-center items-center md:gap-10 gap-5">
            <div className="flex justify-center items-center bg-gray-300 p-5 rounded-xl shadow">
              <h1 className="md:w-80">
                Get Reviews click here to copy and share the URL to your client
              </h1>
              <Button
                onClick={() => copy(`/facilitator/review/${facilitator._id}`)}
                label={copied ? <FaCopy /> : <FaRegCopy />}
              />
            </div>
            <Button
              label={
                <h1 className="flex justify-center items-center gap-2">
                  <IoMdLogOut />
                  Log out
                </h1>
              }
              className={"w-full"}
              onClick={() => logout()}
            />
          </div>
        </div>
        {/* ================= LOCATION ================= */}
        <div className="bg-gray-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Location</h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <p>
              <b>State:</b> {state?.name}
            </p>
            <p>
              <b>City:</b> {city?.name}
            </p>
            <p>
              <b>Place ID:</b> {place?.name}
            </p>
          </div>
        </div>
        {/* ================= BIO ================= */}
        {bio && (
          <div className="bg-gray-200 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{bio}</p>
          </div>
        )}
        {/* ================= LANGUAGES ================= */}
        <div className="bg-gray-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Languages</h2>

          <div className="flex flex-wrap gap-2">
            {languages?.map((lang, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
        {/* ================= VERIFICATION ================= */}
        <div className="bg-gray-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Verification</h2>

          <p>
            Status:
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm ${
                verification?.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : verification?.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {verification?.status}
            </span>
          </p>

          <p className="mt-2">
            Document Number: {verification?.documentNumber}
          </p>

          {/* DOCUMENT IMAGES */}
          {verification?.documents?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Documents</h3>

              <div className="flex gap-4 flex-wrap">
                {verification.documents.map((doc) => (
                  <img
                    key={doc._id}
                    src={doc.url}
                    alt="document"
                    className="w-40 h-40 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* ================= SUBSCRIPTION ================= */}
        <div className="bg-gray-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Subscription</h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <p>
              <b>Plan:</b> {subscription?.plan}
            </p>
            <p>
              <b>Priority Listing:</b>{" "}
              {subscription?.benefits?.priorityListing ? "Yes" : "No"}
            </p>
            <p>
              <b>Max Bookings:</b> {subscription?.benefits?.maxBookingsPerMonth}
            </p>
          </div>
        </div>
        {/* ================= STATS ================= */}
        <div className="bg-gray-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Stats</h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <p>Total Bookings: {totalBookings}</p>
            <p>Active: {facilitator.isActive ? "Yes" : "No"}</p>
            <p>Verified: {facilitator.isVerified ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="md:px-20">
      <h2 className="text-2xl font-bold mb-6">Facilitator Dashboard</h2>
      <FacilitatorProfile facilitator={user} />
    </div>
  );
};

export default FacilitatorDashboard;
