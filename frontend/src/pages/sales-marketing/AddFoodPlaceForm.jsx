import InputBox from "../../components/InputBox";
import { useState, useEffect, useRef } from "react";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { foodKiosksFormInputs } from "../../constants/Constants";
import { FaCircleCheck } from "react-icons/fa6";
import LoadingUI from "../../components/LoadingUI";

const AddFoodPlaceByExecutive = ({
  startLoading,
  stopLoading,
  onClose,
  executiveId,
}) => {
  const formRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [storeImagePreview, setStoreImagePreview] = useState([]);
  const [menuImagePreview, setMenuImagePreview] = useState([]);
  const [foodImagePreview, setFoodImagePreview] = useState([]);
  const [location, setLocation] = useState(null);

  const GetLocation = () => {
    // const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchLocation = async () => {
      setLoading(true);

      if (!navigator.geolocation) {
        alert("Your browser does not support location services.");
        setLoading(false);
        return;
      }

      try {
        // Check current permission status
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "denied") {
          alert(
            "Location permission is blocked. Please enable location access from your browser settings and try again.",
          );
          setLoading(false);
          return;
        }

        if (permission.state === "prompt") {
          alert(
            "Parikrama needs access to your location to continue. Please click 'Allow' when the browser asks for permission.",
          );
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            setSuccess("Location fetched successfully.");
            setLoading(false);
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert(
                  "Location access was denied. Please allow location permission and try again.",
                );
                break;

              case error.POSITION_UNAVAILABLE:
                alert(
                  "Unable to determine your location. Please ensure GPS/Location is enabled.",
                );
                break;

              case error.TIMEOUT:
                alert("Location request timed out. Please try again.");
                break;

              default:
                alert("Error fetching location. Please try again later.");
            }

            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          },
        );
      } catch (err) {
        console.error(err);
        alert("Unable to access location permissions.");
        setLoading(false);
      }
    };

    return (
      <div className="flex w-full items-center justify-between bg-neutral-200 p-3 text-sm rounded-xl gap-2">
        <h1>Click here to fetch your current location</h1>
        <Button
          Disabled={loading}
          onClick={fetchLocation}
          label={loading ? "Fetching Location..." : "Attach Location"}
        />
        {/* <button onClick={fetchLocation}>
            {loading ? "Fetching Location..." : "Get Current Location"}
          </button> */}

        {/* {location && (
            <div>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </div>
          )} */}
      </div>
    );
  };

  //   fetch city
  useEffect(() => {
    const loadCities = async () => {
      try {
        startLoading();
        const res = await FetchData("cities", "get");
        setCities(res?.data?.data || []);
      } catch (err) {
        // console.log(err);
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
        startLoading();
        const res = await FetchData("places", "get");
        setPlaces(res?.data?.data || []);
      } catch (err) {
        // console.log(err);
      } finally {
        stopLoading();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);

      const response = await FetchData(
        `executive/create/new/executive/verified/food-court/${executiveId}`,
        "post",
        formData,
        true,
      );
      formRef.current.reset();
      setSelectedCity([]);
      setSelectedState([]);
      setStoreImagePreview([]);
      setMenuImagePreview([]);
      setFoodImagePreview([]);
      setLocation({
        latitude: null,
        longitude: null,
      });
      onClose();
      alert(response.data.message);
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
      // console.log(err);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="w-full h-full overflow-scroll bg-white p-3 md:p-10">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-4 pb-20 relative"
      >
        <p className="font-semibold text-2xl">
          Add food Kiosk, Stall, Shop, Outlet etc.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center w-full gap-0 lg:gap-2 bg-neutral-100 rounded-lg p-4">
          <p className=" col-span-1 lg:col-span-3 text-left w-full font-semibold text-lg">
            Basic details
          </p>
          {foodKiosksFormInputs.slice(0, 5).map((i) => (
            <InputBox
              LabelName={i.label}
              Placeholder={i.placeHolder}
              Name={i.name}
              Required={i.required}
              Type={i.type}
            />
          ))}
          <div className="py-8 w-full">
            <label className="block text-sm font-medium mb-1">
              Category ( Veg, Non-Veg, Both )*
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
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center w-full gap-2 bg-neutral-100 rounded-lg p-4">
          <p className="col-span-1 lg:col-span-2 text-left w-full font-semibold text-lg">
            Location & Nearest Tourist attraction
          </p>
          <div className="py-8 w-full">
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
          {/* PLACE */}
          <div className="py-8 w-full">
            <label className="block text-sm font-medium mb-1">
              Nearest Tourist Place*
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
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 place-items-center w-full gap-2 bg-neutral-100 rounded-lg p-4">
          <p className="col-span-1 lg:col-span-4 text-left w-full font-semibold text-lg">
            More location details*
          </p>
          <InputBox
            LabelName="Longitude"
            Placeholder="Longitude of the place"
            Name="lng"
            Type="text"
            Required={false}
            Value={location?.longitude}
            Disabled={localStorage.role === "Admin" ? true : false}
          />
          <InputBox
            LabelName="Latitude"
            Placeholder="Latitude of the place"
            Name="lat"
            Type="text"
            Required={false}
            Value={location?.latitude}
            Disabled={localStorage.role === "Admin" ? true : false}
          />
          <span>or</span>
          <div className="flex justify-between items-center">
            {!location ? (
              <GetLocation />
            ) : (
              success && (
                <p className="text-green-700 flex justify-center items-center gap-2">
                  <FaCircleCheck />
                  {success}
                </p>
              )
            )}
          </div>
        </div>
        <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
          <label className="block text-sm font-medium mb-1">
            Store Images (You can select all 5 images at a time)
          </label>
          <input
            required={true}
            type="file"
            name="storeImages"
            multiple
            accept="image/*"
            onChange={handleStoreImages}
            className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
          />

          <div className="flex gap-2 mt-2 overflow-scroll">
            {storeImagePreview.map((img, i) => (
              <img key={i} src={img} className="w-24 h-24 object-cover" />
            ))}
          </div>
        </div>
        <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
          <label className="block text-sm font-medium mb-1">
            Menu Images (You can select all 5 images at a time)
          </label>
          <input
            required={true}
            type="file"
            name="menuImages"
            multiple
            accept="image/*"
            onChange={handleMenuImages}
            className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
          />

          <div className="flex gap-2 mt-2 overflow-scroll">
            {menuImagePreview.map((img, i) => (
              <img key={i} src={img} className="w-24 h-24 object-cover" />
            ))}
          </div>
        </div>
        <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
          <label className="block text-sm font-medium mb-1">
            Food Images (You can select all 5 images at a time)*
          </label>
          <input
            required={true}
            type="file"
            name="foodImages"
            multiple
            accept="image/*"
            onChange={handleFoodImages}
            className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
          />

          <div className="flex gap-2 mt-2 overflow-scroll">
            {foodImagePreview.map((img, i) => (
              <img key={i} src={img} className="w-24 h-24 object-cover" />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center w-full gap-2">
          <input type="checkbox" name="markAsVerified" />
          <label>Mark as verified food place ?</label>
        </div>
        <InputBox
          LabelName="State"
          Name="state"
          Value={selectedState}
          required
          className="hidden"
          LabelClassname="hidden"
        />
        <div className="fixed bottom-0 left-0 w-full pb-10 flex gap-4 px-4">
          <Button
            label={"Cancel"}
            className={"w-full bg-white"}
            onClick={() => {
              formRef.current.reset();
              setSelectedCity([]);
              setSelectedState([]);
              setStoreImagePreview([]);
              setMenuImagePreview([]);
              setFoodImagePreview([]);
              setLocation({
                latitude: null,
                longitude: null,
              });
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

export default LoadingUI(AddFoodPlaceByExecutive);
