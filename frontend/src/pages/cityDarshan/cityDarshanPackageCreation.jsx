import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";

import LoadingUI from "../../components/LoadingUI";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";

import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useSelector } from "react-redux";

const emptyVehicle = {
  vehicleType: "",
  maxPersons: "",
  price: "",
};

const CityDarshanPackageCreation = ({ startLoading, stopLoading }) => {
  const formRef = useRef();
  const user = useSelector((state) => state.auth);
  const adminId = user?._id || user?.user?._id;
  // console.log(user);
  // console.log(adminId);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [vehicleList, setVehicleList] = useState([{ ...emptyVehicle }]);
  const [previewImages, setPreviewImages] = useState([]);
  const vehicleListEnum = [
    "Mini (Hatchback)",
    "Sedan",
    "SUV",
    "MUV",
    "Tempo Traveller",
    "Luxury Sedan",
    "Luxury SUV",
  ];

  useEffect(() => {
    const load = async () => {
      try {
        startLoading();

        const [countryRes, stateRes, cityRes] = await Promise.all([
          FetchData("country/get/all-country", "get"),
          FetchData("states", "get"),
          FetchData("cities", "get"),
        ]);

        setCountries(countryRes.data.data || []);
        setStates(stateRes.data.data || []);
        setCities(cityRes.data.data || []);
      } catch (e) {
        console.log(e);
      } finally {
        stopLoading();
      }
    };

    load();
  }, []);

  const addVehicle = () => setVehicleList((v) => [...v, { ...emptyVehicle }]);

  const removeVehicle = (index) =>
    setVehicleList((v) => v.filter((_, i) => i !== index));

  const updateVehicle = (index, field, value) => {
    const copy = [...vehicleList];
    copy[index][field] = value;
    setVehicleList(copy);
  };

  const handleImages = (e) => {
    const files = [...e.target.files];
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      startLoading();

      const fd = new FormData(formRef.current);

      fd.set("vehicles", JSON.stringify(vehicleList));

      const files = formRef.current.images.files;
      for (let i = 0; i < files.length; i++) {
        fd.append("images", files[i]);
      }
      for (let pair of fd.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await FetchData(
        `city-darshan/admin/register/${adminId}`,
        "post",
        fd,
        true,
      );
      console.log(response);

      alert(response.data.message);
      formRef.current.reset();
      setVehicleList([{ ...emptyVehicle }]);
      setPreviewImages([]);
    } catch (e) {
      alert(parseErrorMessage(e?.response?.data || ""));
    } finally {
      stopLoading();
    }
  };

  return localStorage.role === "Admin" ? (
    <div className="min-h-screen bg-neutral-100 py-10">
      <div className="max-w-7xl mx-auto px-5">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-8"
        >
          <h1 className="text-4xl font-bold">Create City Darshan Package</h1>

          <div className="grid md:grid-cols-2 md:gap-2">
            <InputBox LabelName="Package Name" Name="name" />
            <InputBox
              LabelName="Description"
              Name="description"
              Required={false}
            />
            <InputBox LabelName="Adults" Name="numberOfAdults" Type="number" />
            <InputBox
              LabelName="Children"
              Name="numberOfChildren"
              Type="number"
              Required={false}
            />
            <InputBox LabelName="Total Hours" Name="totalHours" Type="number" />
            <InputBox
              LabelName="Total Distance (KM)"
              Name="totalDistance"
              Type="number"
            />
            <InputBox LabelName="Pickup Time" Name="pickupTime" Type="time" />
            <InputBox LabelName="Drop Time" Name="dropTime" Type="time" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-medium">Country</label>
              <select
                name="country"
                className="w-full border rounded-md p-2 mt-2"
              >
                {countries.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">State</label>
              <select
                name="state"
                className="w-full border rounded-md p-2 mt-2"
              >
                {states.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">City</label>
              <select name="city" className="w-full border rounded-md p-2 mt-2">
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InputBox
            LabelName="Places (comma separated)"
            Name="placesToCover"
            Required={false}
          />
          <InputBox
            LabelName="Inclusions (comma separated)"
            Name="inclusions"
            Required={false}
          />
          <InputBox
            LabelName="Exclusions (comma separated)"
            Name="exclusions"
            Required={false}
          />

          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                Vehicles{" "}
                {/* <span>
                  {vehicleListEnum.map((v) => (
                    <span>{v},</span>
                  ))}
                </span> */}
              </h2>
              <Button
                type="button"
                label={
                  <span className="flex items-center gap-2">
                    <FaPlus />
                    Add Vehicle
                  </span>
                }
                onClick={addVehicle}
              />
            </div>

            <div className="space-y-5">
              {vehicleList.map((v, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-5 grid md:grid-cols-4 gap-4 justify-center items-center "
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vehicle Type*
                    </label>
                    <select
                      required
                      value={v.vehicleType}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                      onChange={(e) =>
                        updateVehicle(index, "vehicleType", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {vehicleListEnum.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <InputBox
                    LabelName="Vehicle Type"
                    Required={false}
                    Value={v.vehicleType}
                    onChange={(e) =>
                      updateVehicle(index, "vehicleType", e.target.value)
                    }
                  /> */}
                  <InputBox
                    LabelName="Max Persons"
                    Type="number"
                    Required={false}
                    Value={v.maxPersons}
                    onChange={(e) =>
                      updateVehicle(index, "maxPersons", e.target.value)
                    }
                  />
                  <InputBox
                    LabelName="Price"
                    Type="number"
                    Required={false}
                    Value={v.price}
                    onChange={(e) =>
                      updateVehicle(index, "price", e.target.value)
                    }
                  />
                  <div className="flex items-end">
                    <Button
                      normal={false}
                      type="button"
                      className="w-full flex items-center justify-center gap-2"
                      label={
                        <>
                          <FaTrash />
                          Remove
                        </>
                      }
                      onClick={() => removeVehicle(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-xl flex items-center gap-3">
              <FaImage />
              Package Images
            </label>

            <input
              className="mt-5"
              type="file"
              multiple
              name="images"
              onChange={handleImages}
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {previewImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="h-32 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3"
            label="Create Package"
          />
        </form>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !! Please log in to view the dashboard.
      </h2>
    </div>
  );
};

export default LoadingUI(CityDarshanPackageCreation);
