import { useState, useEffect, useRef } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { foodKiosksFormInputs } from "../../constants/Constants";

const FoodKiosk = ({ stopLoading, startLoading, onCancel, user }) => {
  const formRef = useRef();
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [storeImagePreview, setStoreImagePreview] = useState([]);
  const [menuImagePreview, setMenuImagePreview] = useState([]);
  const [foodImagePreview, setFoodImagePreview] = useState([]);

  //   fetch city
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

  //   fetch places
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

  //   handle city change
  const handleCityChange = (cityId) => {
    const city = cities.find((c) => c._id === cityId);

    setSelectedCity(cityId);
    setSelectedState(city?.state?._id || "");

    const cityPlaces = places.filter((p) => p.city?._id === cityId);

    setFilteredPlaces(cityPlaces);
  };

  // handles for image selections of all type
  const handleStoreImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      e.target.value = "";
      return;
    }

    setStoreImagePreview(files.map((f) => URL.createObjectURL(f)));
  };
  const handleMenuImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      e.target.value = "";
      return;
    }

    setMenuImagePreview(files.map((f) => URL.createObjectURL(f)));
  };
  const handleFoodImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      e.target.value = "";
      return;
    }

    setFoodImagePreview(files.map((f) => URL.createObjectURL(f)));
  };

  // handle submit function for sending data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `foodCourt/create/new/food-court/${user}`,
        "post",
        formData,
        true,
      );
      console.log(response);
      formRef.current.reset();
      alert(response.data.message);
      
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full "
      >
        <h1 className="font-semibold text-xl">Add new food place</h1>
        <div className="grid grid-cols-2 gap-4">
          {foodKiosksFormInputs.map((i) => (
            <InputBox
              LabelName={i.label}
              Placeholder={i.placeHolder}
              Name={i.name}
              Required={i.required}
              Type={i.type}
            />
          ))}
          <div className="py-8">
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
            <label className="block text-sm font-medium mb-1">Place</label>
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
          <div>
            <label className="block text-sm font-medium mb-1">
              Category ( Veg, Non-Veg, Both )
            </label>
            <select
              name="category"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
            >
              <option value="">Select Category</option>
              {["Veg", "Non-Veg", "Both"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
            <label className="block text-sm font-medium mb-1">
              Store Images
            </label>
            <input
              type="file"
              name="storeImages"
              multiple
              accept="image/*"
              onChange={handleStoreImages}
              className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
            />

            <div className="flex gap-2 mt-2">
              {storeImagePreview.map((img, i) => (
                <img key={i} src={img} className="w-24" />
              ))}
            </div>
          </div>
          <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
            <label className="block text-sm font-medium mb-1">
              Menu Images
            </label>
            <input
              type="file"
              name="menuImages"
              multiple
              accept="image/*"
              onChange={handleMenuImages}
              className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
            />

            <div className="flex gap-2 mt-2">
              {menuImagePreview.map((img, i) => (
                <img key={i} src={img} className="w-24" />
              ))}
            </div>
          </div>
          <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
            <label className="block text-sm font-medium mb-1">
              Food Images
            </label>
            <input
              type="file"
              name="foodImages"
              multiple
              accept="image/*"
              onChange={handleFoodImages}
              className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
            />

            <div className="flex gap-2 mt-2">
              {foodImagePreview.map((img, i) => (
                <img key={i} src={img} className="w-24" />
              ))}
            </div>
          </div>
          <InputBox
            LabelName="State"
            Name="state"
            Value={selectedState}
            required
            className="hidden"
            LabelClassname="hidden"
          />
        </div>
        <div className="flex justify-center items-center gap-10 ">
          <Button label="Cancel" onClick={onCancel} />
          <Button label={"Submit"} type={"submit"} />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(FoodKiosk);
