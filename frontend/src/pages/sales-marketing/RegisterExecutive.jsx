import { useState, useEffect, useRef } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

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

  const [otherState, setOtherState] = useState(false);
  const [otherCity, setOtherCity] = useState(false);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  /*
   * ------------------------------------------------------------
   * GET STATES
   * ------------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------------
   * GET CITIES
   *
   * If your backend supports filtering by state, you can change:
   *
   * FetchData(`cities/?state=${selectedState}`, "get")
   *
   * Otherwise this fetches all cities and filters them on frontend.
   * ------------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------------
   * IMAGE HANDLER
   * ------------------------------------------------------------
   */

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      return;
    }

    // Maximum image size = 2 MB
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

  /*
   * ------------------------------------------------------------
   * STATE CHANGE
   * ------------------------------------------------------------
   */

  const handleStateChange = (e) => {
    const value = e.target.value;

    setSelectedState(value);

    // Reset city when state changes
    const citySelect = formRef.current?.elements?.city;

    if (citySelect) {
      citySelect.value = "";
    }
  };

  /*
   * ------------------------------------------------------------
   * OTHER STATE TOGGLE
   * ------------------------------------------------------------
   */

  const handleOtherStateChange = (e) => {
    const checked = e.target.checked;

    setOtherState(checked);

    if (checked) {
      setSelectedState("");

      const stateSelect = formRef.current?.elements?.state;

      if (stateSelect) {
        stateSelect.value = "";
      }

      // Since state is not being selected from DB,
      // city selection should also be reset.
      setOtherCity(false);

      const citySelect = formRef.current?.elements?.city;

      if (citySelect) {
        citySelect.value = "";
      }
    }
  };

  /*
   * ------------------------------------------------------------
   * OTHER CITY TOGGLE
   * ------------------------------------------------------------
   */

  const handleOtherCityChange = (e) => {
    const checked = e.target.checked;

    setOtherCity(checked);

    if (checked) {
      const citySelect = formRef.current?.elements?.city;

      if (citySelect) {
        citySelect.value = "";
      }
    }
  };

  /*
   * ------------------------------------------------------------
   * SUBMIT
   * ------------------------------------------------------------
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      startLoading();

      const form = formRef.current;

      const formData = new FormData(form);

      /*
       * Explicitly set boolean values.
       *
       * HTML checkboxes only submit when checked, so we
       * explicitly append the values expected by MongoDB.
       */

      formData.set("otherState", otherState);
      formData.set("otherCity", otherCity);

      /*
       * If "other state" is selected, remove normal state.
       */

      if (otherState) {
        formData.delete("state");
      }

      /*
       * If "other city" is selected, remove normal city.
       */

      if (otherCity) {
        formData.delete("city");
      }

      /*
       * Admin is included explicitly.
       *
       * Your backend can alternatively take this from req.params
       * using adminId.
       */

      if (adminId) {
        formData.set("admin", adminId);
      }

      const response = await FetchData(
        `executive/add/register/new-executive/${adminId}`,
        "post",
        formData,
        true,
      );

      console.log("Executive registration response:", response);

      alert(response?.data?.message || "Executive registered successfully");

      onClose?.();
      handleReload?.();
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

  /*
   * ------------------------------------------------------------
   * FILTER CITIES BY SELECTED STATE
   *
   * Supports several possible backend structures:
   *
   * city.state
   * city.state._id
   * city.stateId
   * city.stateId._id
   * ------------------------------------------------------------
   */

  const filteredCities = cities.filter((city) => {
    if (!selectedState || otherState) {
      return false;
    }

    const cityStateId =
      city?.state?._id || city?.state || city?.stateId?._id || city?.stateId;

    return String(cityStateId) === String(selectedState);
  });

  return (
    <div className="bg-neutral-50 rounded-xl flex flex-col justify-center items-center w-3/4 max-h-[90vh] overflow-y-auto p-8 md:p-10">
      <h1 className="text-xl font-semibold mb-6">Register New Executive</h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col justify-center items-center gap-5 w-full"
      >
        {/* =====================================================
            BASIC INFORMATION
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 w-full">
          {/* NAME */}

          <InputBox LabelName="Name" Name="name" Type="text" Required={true} />

          {/* EMAIL */}

          <InputBox
            LabelName="Email"
            Name="email"
            Type="email"
            Required={true}
          />

          {/* CONTACT */}

          <InputBox
            LabelName="Contact Number"
            Name="contactNumber"
            Type="tel"
            Required={true}
          />

          {/* ALTERNATE CONTACT */}

          <InputBox
            LabelName="Alternate Contact Number"
            Name="alternateContactNumber"
            Type="tel"
            Required={true}
          />

          {/* EMPLOYEE ID */}

          <InputBox
            LabelName="Employee ID"
            Name="employeeId"
            Type="text"
            Required={true}
          />

          {/* PASSWORD */}

          <InputBox
            LabelName="Password"
            Name="password"
            Type="password"
            PasswordIndication={true}
            Required={true}
          />

          {/* =================================================
              STATE
          ================================================== */}

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

            {/* OTHER STATE */}

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

          {/* =================================================
              CITY
          ================================================== */}

          <div className="w-full">
            <div className="py-4 w-full">
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City
              </label>

              <select
                id="city"
                name="city"
                disabled={!selectedState || otherState || otherCity}
                required={!otherCity}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedState
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

            {/* OTHER CITY */}

            <label className="flex items-center gap-2 text-sm cursor-pointer -mt-2 mb-3">
              <input
                type="checkbox"
                checked={otherCity}
                onChange={handleOtherCityChange}
                disabled={otherState}
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

          {/* =================================================
              PROFILE IMAGE
          ================================================== */}

          <div className="md:col-span-2 w-full bg-gray-200 py-5 px-4 rounded-xl overflow-hidden mt-2">
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Profile Picture
            </label>

            <input
              id="image"
              type="file"
              name="image"
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

        {/* =====================================================
            ACTION BUTTONS
        ====================================================== */}

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
    </div>
  );
};

export default LoadingUI(RegisterExecutive);
