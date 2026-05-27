// ClubAuthSection.jsx

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiCastle } from "react-icons/gi";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const ClubAuthSection = ({ setClubSession }) => {
  const formRef = useRef();
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("search");

  const [clubs, setClubs] = useState([]);

  const [selectedClub, setSelectedClub] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(formRef.current);

      const response = await FetchData(
        "clubs/club/get/club-by-information",
        "post",
        formData,
      );

      const data = response.data.data;

      if (Array.isArray(data)) {
        setClubs(data);
        setStep("select");
      } else {
        setSelectedClub(data);
        await requestOtp(data);
      }
    } catch (err) {
      alert(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (club) => {
    try {
      setLoading(true);

      const response = await FetchData(
        `clubs/club/get/otp-club/${club._id}`,
        "post",
        {
          clubName: club.clubName,
          clubEmail: club.contactDetails.email,
        },
      );

      setSelectedClub(club);
      setOtp(response.data.data.otp);
      setStep("otp");
    } catch (err) {
      alert(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(formRef.current);

      const response = await FetchData(
        `clubs/club/verify-otp/${selectedClub._id}`,
        "post",
        formData,
      );

      setClubSession({
        verified: true,
        club: response.data.data,
      });
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2"
      >
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#FFC20D] p-10">
          <GiCastle className="text-8xl text-white mb-5" />

          <h1 className="text-4xl font-bold text-white text-center">
            Club Verification
          </h1>

          <p className="text-white/80 mt-4 text-center">
            Securely verify your club profile and manage your content.
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === "search" && (
              <motion.form
                key="search"
                ref={formRef}
                onSubmit={handleSearch}
                className="space-y-5"
              >
                <h2 className="text-3xl font-bold">Verify Club</h2>

                <input
                  name="email"
                  placeholder="Registered Email"
                  className="w-full border rounded-xl p-4"
                />

                <input
                  name="contactNumber"
                  placeholder="Registered Contact Number"
                  className="w-full border rounded-xl p-4"
                />

                <button
                  disabled={loading}
                  className="w-full bg-black text-white p-4 rounded-xl"
                >
                  Continue
                </button>
              </motion.form>
            )}

            {step === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-6">Select Your Club</h2>

                <div className="space-y-4">
                  {clubs.map((club) => (
                    <button
                      key={club._id}
                      onClick={() => requestOtp(club)}
                      className="w-full border rounded-2xl p-2 flex flex-col md:flex-row items-center gap-4 hover:border-black"
                    >
                      <img
                        src={club.images.logo.url}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div className="text-left">
                        <h3 className="font-semibold ">{club.clubName}</h3>

                        <p className="text-gray-500">
                          {club.contactDetails.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                ref={formRef}
                onSubmit={verifyOtp}
                className="space-y-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={selectedClub?.images?.logo?.url}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedClub?.clubName}
                    </h2>

                    <p className="text-gray-500">OTP sent successfully</p>
                  </div>
                </div>

                <input
                  name="email"
                  defaultValue={selectedClub?.contactDetails?.email}
                  hidden
                />

                <input
                  name="contactNumber"
                  defaultValue={selectedClub?.contactDetails?.phone}
                  hidden
                />

                <input
                  name="otp"
                  placeholder="Enter OTP"
                  className="w-full border rounded-xl p-4 text-center tracking-[10px] text-2xl"
                />

                <span className="bg-red-300 text-red-600 font-semibold">
                  {otp ? <p>Paste this OTP {otp}</p> : ""}
                </span>

                <button
                  type="submit"
                  className="w-full bg-[#FFC20D] p-4 rounded-xl font-semibold"
                >
                  Verify OTP
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ClubAuthSection;
