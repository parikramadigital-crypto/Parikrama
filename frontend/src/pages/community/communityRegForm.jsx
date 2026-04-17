import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import { communityInputs, personalInputs } from "../../constants/Constants";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import { formatProdErrorMessage } from "@reduxjs/toolkit";
import logo from "../../assets/Logo1.png";
import logo2 from "../../assets/Logo3.png";
import { BiChevronRight } from "react-icons/bi";

const CommunityRegForm = ({ startLoading, stopLoading }) => {
  const [rightBanner, setRightBanner] = useState([]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);
  const formRef = useRef();
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState([]);
  const [logoPreview, setLogoPreview] = useState([]);

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

  const handleHome = () => {
    navigate("/");
    formRef.current.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const response = await FetchData(
        `communities/community/auth/register`,
        "post",
        formData,
        true,
      );
      console.log(response);
      alert(response.data.message);
      formRef.current.reset();
      navigate("/login/community");
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  const handleProfileImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 1) {
      alert("Only 1 profile image allowed");
      e.target.value = "";
      return;
    }

    setProfilePreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleLogoImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 1) {
      alert("Maximum 1 image allowed");
      e.target.value = "";
      return;
    }

    setLogoPreview(files.map((f) => URL.createObjectURL(f)));
  };

  return (
    <div className="flex flex-row md:justify-between md:items-start gap-10 justify-center items-center">
      <div className="md:w-1/2 w-[90vw] h-96 rounded-xl overflow-hidden hidden lg:flex justify-center items-center flex-col gap-5 lg:sticky top-24 left-0">
        <h1 className="font-semibold text-xl">Book Flight, Bus or Hotels</h1>
        <RandomImageSlider images={right} />
        <Button label={"Login"} onClick={() => navigate("/login/community")} />
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full flex justify-center items-center lg:py-10 py-5 px-5"
      >
        <div className="flex flex-col justify-center items-center gap-5 ">
          <div className="flex justify-center items-center lg:hidden gap-5">
            <h1>Already registered ?</h1>
            <Button
              onClick={() => navigate("/login/community")}
              label={
                <h1 className="flex justify-center items-center">
                  Login <BiChevronRight />
                </h1>
              }
            />
          </div>
          <div className="lg:flex items-center hidden">
            <img src={logo} className="w-28" />
            {/* <img src={logo2} className="w-28" /> */}
          </div>
          <h1 className="font-medium w-full text-left">
            <span className="border-b-2 border-[#FFC20E] text-3xl">
              Let's collaborate! Fill out the form below to join us.
            </span>
            <br /> If you are an Influencer, Blogger, Solo-Traveler, Group
            Travelers, Motor-Cycle Club, Cycling Club, Data Feeder etc.
          </h1>
          {/* personal details  */}
          <div className="w-full flex-col justify-start items-start">
            {/* <h1 className="text-xl font-semibold w-full border-b px-10 ">
              Personal Details
            </h1> */}
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
                  className={i.className}
                />
              ))}
            </div>
            <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden w-[90vw] md:w-full">
              <label className="block text-sm font-medium mb-1">
                Profile Image*
              </label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleProfileImage}
                className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
              />

              {profilePreview.length > 0 && (
                <img src={profilePreview[0]} className="w-32 mt-2 rounded" />
              )}
            </div>
          </div>
          {/* community details  */}
          {/* <div className="w-full flex-col justify-start items-start">
            <h1 className="text-xl font-semibold w-full border-b px-10 ">
              Community Details
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {communityInputs.map((i, index) => (
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
                    required={false}
                    placeholder="Write a short description about your community..."
                    name="bio"
                    rows="3"
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                  />
                </div>
              </div>
              <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
                <label className="block text-sm font-medium mb-1">
                  Company Logo*
                </label>
                <input
                  required={false}
                  type="file"
                  name="companyLogo"
                  accept="image/*"
                  onChange={handleLogoImage}
                  className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
                />

                {logoPreview.length > 0 && (
                  <img src={logoPreview[0]} className="w-32 mt-2 rounded" />
                )}
              </div>
            </div>
          </div> */}

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
