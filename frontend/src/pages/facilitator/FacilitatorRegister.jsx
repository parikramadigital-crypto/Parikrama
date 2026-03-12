import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const FacilitatorRegister = ({
  startLoading,
  stopLoading,
  completeProfile = false,
  onCancel,
  facilitatorId,
}) => {
  const formRef = useRef();
  const navigate = useNavigate();
  console.log(facilitatorId);

  /* ---------------- STEP CONTROL ---------------- */
  const [step, setStep] = useState("REGISTER"); // REGISTER | VERIFY

  /* ---------------- OTP DATA ---------------- */
  const [otp, setOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [facilitator, setFacilitator] = useState(null);

  /* ---------------- UI STATES ---------------- */
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [profilePreview, setProfilePreview] = useState([]);
  const [docPreview, setDocPreview] = useState([]);

  /* ---------------- IMAGE HANDLERS ---------------- */

  const handleProfileImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 1) {
      alert("Only 1 profile image allowed");
      e.target.value = "";
      return;
    }

    setProfilePreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleDocumentImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 2) {
      alert("Maximum 2 document images allowed");
      e.target.value = "";
      return;
    }

    setDocPreview(files.map((f) => URL.createObjectURL(f)));
  };

  /* ---------------- FETCH CITIES ---------------- */

  useEffect(() => {
    const loadCities = async () => {
      try {
        startLoading();
        const res = await FetchData("cities", "get");
        setCities(res?.data?.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        stopLoading();
      }
    };

    loadCities();
  }, []);

  /* ---------------- FETCH PLACES ---------------- */

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const res = await FetchData("places", "get");
        setPlaces(res?.data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadPlaces();
  }, []);

  /* ---------------- CITY CHANGE ---------------- */

  const handleCityChange = (cityId) => {
    const city = cities.find((c) => c._id === cityId);

    setSelectedCity(cityId);
    setSelectedState(city?.state?._id || "");

    const cityPlaces = places.filter((p) => p.city?._id === cityId);

    setFilteredPlaces(cityPlaces);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(formRef.current);

    try {
      startLoading();

      const res = await FetchData(
        "facilitator/register",
        "post",
        formData,
        true,
      );

      setOtp(res.data.data.otp);
      setFacilitator(res.data.data.facilitator);
      setStep("VERIFY");
    } catch (err) {
      setError(parseErrorMessage(err?.response?.data));
    } finally {
      stopLoading();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      startLoading();

      const response = await FetchData("facilitator/verify-otp", "post", {
        facilitatorId: facilitator?._id,
        otp: enteredOtp,
      });
      console.log(response);
      alert(response.data.message);
      navigate("/");
    } catch (err) {
      setError(parseErrorMessage(err?.response?.data) || "Invalid OTP");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-start items-start md:w-[90vw]">
      <form
        ref={formRef}
        onSubmit={step === "REGISTER" ? handleRegister : handleVerifyOtp}
        className={`bg-white md:p-8 rounded-xl  ${completeProfile === true ? "md:w-full w-[95vw] px-5 py-5" : "w-fit"}`}
      >
        {completeProfile === false ? (
          <h2 className="md:text-2xl  font-bold mb-6 text-wrap leading-[1.1]">
            Facilitator Registration{" "}
            <span className="text-xs md:text-sm font-normal">
              You can register yourself as a Facilitator (Photographer, Pandit,
              Guide, etc.) for a particular place.
            </span>
          </h2>
        ) : (
          ""
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* ================= OTP STEP ================= */}

        {step === "VERIFY" && (
          <>
            <p className="mb-2">OTP Sent Successfully {otp}</p>

            <InputBox
              LabelName="Enter OTP"
              Type="password"
              Value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              required
            />
            {console.log(enteredOtp)}

            <Button label="Verify OTP" type="submit" className="w-full mt-4" />
          </>
        )}

        {/* ================= REGISTER STEP ================= */}

        {step === "REGISTER" && (
          <div className="">
            {completeProfile === false ? (
              <div>
                <InputBox
                  LabelName="Full Name"
                  Name="name"
                  required
                  Placeholder="Enter your name"
                />
                <InputBox
                  LabelName="Phone"
                  Name="phone"
                  required
                  Placeholder="Enter your contact number"
                />

                <InputBox
                  LabelName="Role"
                  Name="role"
                  required
                  Placeholder="Photographer, Pandit, Guide, Pujari, Cab Driver many more.."
                />
                <InputBox
                  LabelName="Password"
                  Name="password"
                  Type="password"
                  required
                  Placeholder="Password"
                  PasswordIndication={true}
                />
                <Button
                  label="Register"
                  type="submit"
                  className="w-full md:col-span-2 mt-4"
                />
              </div>
            ) : (
              ""
            )}

            {completeProfile === true ? (
              <div>
                <InputBox LabelName="Email" Name="email" required />
                <InputBox
                  LabelName="Pan / Aadhar Number"
                  Name="documentNumber"
                  required
                />

                <InputBox
                  LabelName="Experience Years"
                  Name="experienceYears"
                  required
                />
                <InputBox
                  LabelName="Languages (comma separated)"
                  Name="languages"
                  required
                />

                {/* CITY */}
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <select
                    name="city"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                    onChange={(e) => handleCityChange(e.target.value)}
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} , {c.state?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PLACE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Place
                  </label>
                  <select
                    name="place"
                    required
                    disabled={!selectedCity}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                  >
                    <option value="">Select Place</option>
                    {filteredPlaces.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BIO */}
                <div className="flex justify-center items-center w-full md:col-span-2">
                  <div className="py-4 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Write a short description about your self..."
                      name="bio"
                      rows="3"
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                    />
                  </div>
                </div>

                {/* PROFILE IMAGE */}
                <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
                  <label className="block text-sm font-medium mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleProfileImage}
                    className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
                  />

                  {profilePreview.length > 0 && (
                    <img
                      src={profilePreview[0]}
                      className="w-32 mt-2 rounded"
                    />
                  )}
                </div>

                {/* DOCUMENT IMAGES */}
                <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
                  <label className="block text-sm font-medium mb-1">
                    Document Images
                  </label>
                  <input
                    type="file"
                    name="documentImage"
                    multiple
                    accept="image/*"
                    onChange={handleDocumentImages}
                    className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
                  />

                  <div className="flex gap-2 mt-2">
                    {docPreview.map((img, i) => (
                      <img key={i} src={img} className="w-24" />
                    ))}
                  </div>
                </div>

                {/* HIDDEN STATE */}
                <InputBox
                  LabelName="State"
                  Name="state"
                  Value={selectedState}
                  required
                  className="hidden"
                  LabelClassname="hidden"
                />

                <Button
                  label="Update profile"
                  className="w-full md:col-span-2 mt-4"
                />
                <Button
                  label="Cancel"
                  className="w-full md:col-span-2 mt-4"
                  onClick={onCancel}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoadingUI(FacilitatorRegister);
