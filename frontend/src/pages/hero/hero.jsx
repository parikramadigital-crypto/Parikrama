import React, { useState } from "react";
import InputBox from "../../components/InputBox";
import logo from "../../assets/Logo.png";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import { useEffect } from "react";
import LoadingUI from "../../components/LoadingUI";
import {
  galleryBannerImages,
  galleryBannerImages2,
} from "../../constants/Constants";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import Card from "../../components/ui/card";

const Hero = ({ stopLoading, startLoading }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const searchedValue = useParams().searchData;
  const [searchInput, setSearchInput] = useState(searchedValue || "");
  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/employees/${searchInput}`);
    }
  };

  const getData = async () => {
    try {
      startLoading();
      const response = await FetchData("admin/places", "get");
      console.log(response);
      setData(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const getRandomItems = (arr, count) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="w-[90%]">
        <RandomImageSlider
          images={galleryBannerImages}
          className="lg:h-[300px] h-[200px]"
        />
        {/* <img
          src="https://ik.imagekit.io/pz8qfunss/Gallery/Gallery_Banner/create%20an%20image%20with%20a%20tag%20_Our%20new%20Collections_%20with%20adding%20jewelrries%20in%20the%20background%20write%20the%20text%20on%20the%20left%20or%20right%20side%20of%20the%20image%20and%20make%20it%20look%20asthetic.jpg?updatedAt=1751825753408"
          className="object-cover h-full w-full "
        /> */}
      </div>
      <div className="flex  justify-center py-5 px-2">
        <div className="w-96 h-96 bg-neutral-500 rounded-xl overflow-hidden">
          <RandomImageSlider images={galleryBannerImages} />
        </div>
        <div className="p-4">
          <div className="flex justify-center items-center w-full">
            <InputBox
              Value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              Placeholder="Search here..."
              className="w-full"
              keyPress={handleSearch}
            />
            <button
              onClick={handleSearch}
              className="relative lg:right-10 right-0 bg-neutral-300 rounded-full p-1"
            >
              <CiSearch />
            </button>
          </div>
          {data?.length > 0 ? (
            <div className="flex gap-2 flex-col w-[650px]">
              {getRandomItems(data || [], 8).map((places) => (
                <div key={places._id || places.id}>
                  <Card
                    name={places.name}
                    city={places?.city?.name}
                    state={places?.state?.name}
                    category={places?.category}
                    description={places?.description}
                    lat={places?.location?.coordinates[1]}
                    long={places?.location?.coordinates[0]}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>No data found...</div>
          )}
        </div>
        <div className="w-96 h-96 bg-neutral-500 rounded-xl overflow-hidden">
          <RandomImageSlider images={galleryBannerImages2} />
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(Hero);
