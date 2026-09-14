import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useRef, useState, useEffect } from "react";
import LoadingUI from "../../components/LoadingUI";

const AddFacilitatorByExecutive = ({
  startLoading,
  stopLoading,
  onClose,
  executiveId,
}) => {
  const formRef = useRef();
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [profilePreview, setProfilePreview] = useState([]);
  const [otherRole, setOtherRole] = useState("");

  const handleProfileImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 1) {
      alert("Only 1 profile image allowed");
      e.target.value = "";
      return;
    }

    setProfilePreview(files.map((f) => URL.createObjectURL(f)));
  };

  useEffect(() => {
    const loadCities = async () => {
      try {
        startLoading();
        const res = await FetchData("cities", "get");
        setCities(res?.data?.data || []);
      } catch (err) {
        //  console.log(err);
      } finally {
        stopLoading();
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        startLoading();
        const res = await FetchData("places", "get");
        setPlaces(res?.data?.data || []);
      } catch (err) {
        //console.log(err);
      } finally {
        stopLoading();
      }
    };

    loadPlaces();
  }, []);

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
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      startLoading();

      const res = await FetchData(
        `executive/create/new/facilitator/verified/facilitator/${executiveId}`,
        "post",
        formData,
        true,
      );
      setCities([]);
      setOtherRole("");
      setProfilePreview([]);
      setSelectedState("");
      onClose();
    } catch (err) {
      alert(parseErrorMessage(err?.response?.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="w-full h-full overflow-scroll bg-white p-3 md:p-10">
      <form
        ref={formRef}
        onSubmit={handleRegister}
        className="flex flex-col w-full pb-20 relative"
      >
        <p className="font-semibold text-2xl">Add new facilitator</p>
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
        <div>
          <label className="block text-sm font-medium mb-1">City*</label>
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
        <div>
          <label className="block text-sm font-medium mb-1">Role*</label>
          <select
            name="role"
            required
            value={otherRole}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
            onChange={(c) => {
              setOtherRole(c.target.value);
              // if (setOtherRole != "Others") {
              //   setOtherRole("");
              // }
            }}
          >
            <option value="">Select your role</option>
            {[
              "Travel Guide",
              "Photographer",
              "Spiritual Guide",
              "Temple Guide",
              "Tour Guide",
              "Activity Instructor",
              "Driver",
              "Boat Captain",
              "Porter",
              "Translator",
              "Geat Outfitter",
              "Itinerary Planner",
              "Agency Representative",
              "Others",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {otherRole === "Others" ? (
          <InputBox
            LabelName="Please Specify"
            Placeholder="Tell us what you do..."
            Name="otherRole"
            // required
          />
        ) : (
          ""
        )}
        <InputBox
          LabelName="Password"
          Name="password"
          Type="password"
          required
          Placeholder="Password"
          PasswordIndication={true}
        />
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
            <img src={profilePreview[0]} className="w-24 h-24 mt-2 rounded" />
          )}
        </div>
        <InputBox
          LabelName="State"
          Name="state"
          Value={selectedState}
          required
          className="hidden"
          LabelClassname="hidden"
        />
        <div className="fixed bottom-0 left-0 w-full pb-5 flex gap-4 px-4">
          <Button
            label={"Cancel"}
            className={"w-full bg-white"}
            onClick={() => {
              formRef.current.reset();
              setSelectedCity([]);
              onClose();
            }}
            type={"reset"}
            normal={false}
          />
          <Button label={"Submit"} className={"w-full "} />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(AddFacilitatorByExecutive);
