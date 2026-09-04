import { useState, useEffect, useRef } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { motion, AnimatePresence } from "framer-motion";

const RegisterExecutive = ({
  startLoading,
  stopLoading,
  onClose,
  adminId,
  handleReload,
}) => {
  const formRef = useRef(null);

  const [preview, setPreview] = useState(null);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [otherState, setOtherState] = useState(false);
  const [otherCity, setOtherCity] = useState(false);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [newExecutive, setNewExecutive] = useState(null);
  const [passwordView, setPasswordView] = useState(null);

  useEffect(() => {
    const getStates = async () => {
      try {
        setLoadingStates(true);

        const response = await FetchData("states/", "get");

        setStates(response?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      } finally {
        setLoadingStates(false);
      }
    };

    getStates();
  }, []);

  useEffect(() => {
    const getCities = async () => {
      try {
        setLoadingCities(true);

        const response = await FetchData("cities/", "get");

        setCities(response?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };

    getCities();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert("Image size must be less than 2 MB");
      e.target.value = "";
      setPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      e.target.value = "";
      setPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    setSelectedCity("");
    if (value) {
      setOtherState(false);
    }
  };

  const handleOtherStateChange = (e) => {
    const checked = e.target.checked;
    setOtherState(checked);
    if (checked) {
      setSelectedState("");
      setSelectedCity("");
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    if (value) {
      setOtherCity(false);
    }
  };

  const handleOtherCityChange = (e) => {
    const checked = e.target.checked;
    setOtherCity(checked);
    if (checked) {
      setSelectedCity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const form = formRef.current;
      const formData = new FormData(form);
      const response = await FetchData(
        `executive/add/register/new-executive/${adminId}`,
        "post",
        formData,
        true,
      );

      console.log("Executive registration response:", response);
      alert(response?.data?.message || "Executive registered successfully");
      // onClose();
      setNewExecutive(response.data.data.newExecutive);
      setPasswordView(response.data.data.password);
      // handleReload();
    } catch (err) {
      console.error("Executive registration error:", err);
      alert(
        parseErrorMessage(
          err?.response?.data || err?.message || "Something went wrong",
        ),
      );
    } finally {
      stopLoading();
    }
  };

  const filteredCities = cities.filter((city) => {
    if (otherState) {
      return true;
    }
    if (!selectedState) {
      return false;
    }

    const cityStateId =
      city?.state?._id || city?.state || city?.stateId?._id || city?.stateId;

    return String(cityStateId) === String(selectedState);
  });

  const data = [
    { label: "Name", value: newExecutive.name },
    { label: "Email", value: newExecutive.email },
    { label: "Employee ID", value: newExecutive.employeeId },
    { label: "Contact number", value: newExecutive.contactNumber },
    {
      label: "Alternate contact number",
      value: newExecutive.alternateContactNumber,
    },
    { label: "City", value: newExecutive.city },
    { label: "State", value: newExecutive.state },
    { label: "Password", value: passwordView },
  ];

  return (
    <div className="bg-neutral-50 rounded-xl flex flex-col justify-start items-center w-3/4 max-h-[90vh] overflow-y-auto p-8 md:p-10">
      <h1 className="text-xl font-semibold mb-6">Register New Executive</h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-5 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 w-full">
          <InputBox LabelName="Name" Name="name" Type="text" Required={true} />
          <InputBox
            LabelName="Email"
            Name="email"
            Type="email"
            Required={true}
          />
          <InputBox
            LabelName="Contact Number"
            Name="contactNumber"
            Type="tel"
            Required={true}
          />
          <InputBox
            LabelName="Alternate Contact Number"
            Name="alternateContactNumber"
            Type="tel"
            Required={true}
          />
          <InputBox
            LabelName="Employee ID"
            Name="employeeId"
            Type="text"
            Required={true}
          />
          <InputBox
            LabelName="Password"
            Name="password"
            Type="password"
            PasswordIndication={true}
            Required={true}
          />
          <div className="w-full">
            <div className="py-4 w-full">
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State
              </label>
              <select
                id="state"
                name="state"
                value={otherState ? "" : selectedState}
                onChange={handleStateChange}
                disabled={otherState}
                required={!otherState}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingStates ? "Loading states..." : "Select State"}
                </option>
                {states.map((state) => (
                  <option key={state?._id} value={state?._id}>
                    {state?.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer -mt-2 mb-3">
              <input
                type="checkbox"
                checked={otherState}
                onChange={handleOtherStateChange}
                className="w-4 h-4 accent-[#FFC20E]"
              />
              <span>Executive belongs to another state</span>
            </label>
            {otherState && (
              <div className="mb-3">
                <InputBox
                  LabelName="Other State Name"
                  Name="otherStateName"
                  Type="text"
                  Required={true}
                />
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="py-4 w-full">
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City
              </label>
              <select
                id="city"
                name="city"
                value={otherCity ? "" : selectedCity}
                onChange={handleCityChange}
                disabled={(!selectedState && !otherState) || otherCity}
                required={!otherCity}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedState && !otherState
                    ? "Select state first"
                    : loadingCities
                      ? "Loading cities..."
                      : "Select City"}
                </option>
                {filteredCities.map((city) => (
                  <option key={city?._id} value={city?._id}>
                    {city?.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer -mt-2 mb-3">
              <input
                type="checkbox"
                checked={otherCity}
                onChange={handleOtherCityChange}
                disabled={!selectedState && !otherState}
                className="w-4 h-4 accent-[#FFC20E]"
              />
              <span>Executive belongs to another city</span>
            </label>
            {otherCity && (
              <div className="mb-3">
                <InputBox
                  LabelName="Other City Name"
                  Name="otherCityName"
                  Type="text"
                  Required={true}
                />
              </div>
            )}
          </div>
          <div className="md:col-span-2 w-full bg-gray-200 py-5 px-4 rounded-xl overflow-hidden mt-2">
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Profile Picture
            </label>
            <input
              id="image"
              type="file"
              name="image"
              required={true}
              accept="image/*"
              onChange={handleImage}
              className="bg-gray-300 w-full md:w-fit py-2 px-5 rounded-xl cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">Maximum size: 2 MB</p>
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Executive preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center gap-10 mt-3">
          <Button
            label="Cancel"
            normal={false}
            onClick={onClose}
            type="button"
          />
          <Button label="Submit" type="submit" />
        </div>
      </form>
      <AnimatePresence>
        {newExecutive && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <div className="w-1/2 h-fit p-5 rounded-xl bg-white ">
              {data?.map((i, index) => (
                <h1
                  key={index}
                  className="w-full justify-between items-center flex"
                >
                  <strong>{i?.label}</strong>
                  <p>{i?.value}</p>
                </h1>
              ))}
              <div className="w-full border-b-[0.1px] border-dashed" />
              <h1>
                Please capture the screenshot and share it to the employee which
                you just created
              </h1>
              <Button
                label={"Done"}
                onClick={() => {
                  onClose();
                  handleReload();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(RegisterExecutive);
