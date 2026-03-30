import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import { communityInputs, personalInputs } from "../../constants/Constants";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import RandomImageSlider from "../../components/ui/RandomImageSlider";

const CommunityRegForm = ({ startLoading, stopLoading }) => {
  const [rightBanner, setRightBanner] = useState([]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);
  const formRef = useRef();

  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setRightBanner(response.data.data.promotionsMid);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    banner();
  }, []);
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
    formRef.current.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `communities/community/auth/register`,
        "post",
        formData,
        true,
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex flex-row justify-between items-start gap-10">
      <div className="md:w-1/2 w-[90vw] h-96 rounded-xl overflow-hidden hidden lg:flex justify-center items-center flex-col gap-5 lg:sticky top-24 left-0">
        <h1 className="font-semibold text-xl">Book Flight, Bus or Hotels</h1>
        <RandomImageSlider images={right} />
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full flex justify-center items-center py-20"
      >
        <div className="flex flex-col justify-center items-center gap-2 px-5">
          <div className="w-full flex-col justify-start items-start">
            <h1 className="text-xl font-semibold w-full border-b px-10 ">
              Personal Details
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {personalInputs.map((i, index) => (
                <InputBox
                  key={index}
                  LabelName={i.label}
                  Placeholder={i.placeHolder}
                  Name={i.name}
                  Type={i.type}
                  PasswordIndication={i.passwordTrue}
                  Required={i.required}
                />
              ))}
            </div>
          </div>
          <div className="w-full flex-col justify-start items-start">
            <h1 className="text-xl font-semibold w-full border-b px-10 ">
              Community Details
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {communityInputs.map((i,index) => (
                <InputBox
                  key={index}
                  LabelName={i.label}
                  Placeholder={i.placeHolder}
                  Name={i.name}
                  Type={i.type}
                  PasswordIndication={i.passwordTrue}
                  Required={i.required}
                />
              ))}
              <div className="flex justify-center items-center w-full md:col-span-2">
                <div className="py-4 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Write a short description about your community..."
                    name="bio"
                    rows="3"
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-5">
            <Button label={"Register"} type={"submit"} />
            <Button label={"Cancel"} onClick={() => handleHome()} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(CommunityRegForm);
