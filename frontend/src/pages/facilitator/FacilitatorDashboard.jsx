import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { IoMdLogOut } from "react-icons/io";
import { clearUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const FacilitatorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const FacilitatorProfile = ({ facilitator }) => {
    if (!facilitator) return null;
    console.log(facilitator);
    const logout = () => {
      localStorage.clear();
      dispatch(clearUser());
      alert("You are logged out successfully");
      navigate("/");
    };

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
        <div className="flex gap-6 items-center bg-white p-6 rounded-xl shadow">
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

          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-gray-600">{role}</p>

            <div className="mt-2 text-sm space-y-1">
              <p>📧 {email}</p>
              <p>📞 {phone}</p>
              <p>⭐ Rating: {rating}</p>
              <p>🧳 Experience: {experienceYears} years</p>
            </div>
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

        {/* ================= LOCATION ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Location</h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <p>
              <b>State:</b> {state.name}
            </p>
            <p>
              <b>City:</b> {city?.name}
            </p>
            <p>
              <b>Place ID:</b> {place.name}
            </p>
          </div>
        </div>

        {/* ================= BIO ================= */}
        {bio && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{bio}</p>
          </div>
        )}

        {/* ================= LANGUAGES ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
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
        <div className="bg-white p-6 rounded-xl shadow">
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
        <div className="bg-white p-6 rounded-xl shadow">
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
        <div className="bg-white p-6 rounded-xl shadow">
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
