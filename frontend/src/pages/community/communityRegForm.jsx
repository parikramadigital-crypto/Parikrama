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
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const CommunityRegForm = ({
  startLoading,
  stopLoading,
  updateProfile = false,
  onCancel = {},
  communityId = "",
}) => {
  const [rightBanner, setRightBanner] = useState([]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);
  const formRef = useRef();
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState([]);
  const [logoPreview, setLogoPreview] = useState([]);
  const [soloTraveler, setSoloTraveler] = useState("");
  const [travelerType, setTravelerType] = useState("");
  const [otherTravelerType, setOtherTravelerType] = useState("");
  const [socialLinks, setSocialLinks] = useState([
    {
      platformName: "",
      url: "",
    },
  ]);

  const socialPlatforms = [
    "Instagram",
    "Facebook",
    "X",
    "YouTube",
    "LinkedIn",
    "Portfolio",
    "Website",
    "Discord",
    "Telegram",
    "Medium",
    "Pinterest",
  ];

  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setRightBanner(response.data.data.promotionsMid);
    } catch (err) {

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
      formData.set("soloTraveler", soloTraveler);

      if (soloTraveler === "No") {
        formData.set(
          "travelerInfo",
          travelerType === "Others" ? otherTravelerType : travelerType,
        );
      }
      const response = await FetchData(
        `communities/community/auth/register`,
        "post",
        formData,
        true,
      );

      alert(response.data.message);
      formRef.current.reset();
      navigate("/login/community");
    } catch (err) {

      alert(parseErrorMessage(err.response.data));
      // formRef.current.reset();
      // setProfilePreview([]);
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

  const handleCompleteProfile = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(formRef.current);
      formData.append("socialLinks", JSON.stringify(socialLinks));
      const response = await FetchData(
        `communities/complete/profile/${communityId}`,
        "post",
        formData,
        true,
      );

      alert(response.data.message);
    } catch (err) {

    }
  };

  return (
    <div className="flex flex-row md:justify-between md:items-start gap-5 justify-center items-center w-full">
      {updateProfile === true ? (
        ""
      ) : (
        <div className="md:w-1/2 w-[90vw] rounded-xl overflow-hidden hidden lg:flex justify-center items-center flex-col gap-5 lg:sticky top-24 left-0">
          <h1 className="font-semibold text-xl">Book Flight, Bus or Hotels</h1>
          <RandomImageSlider images={right} />
          <Button
            label={"Login"}
            onClick={() => navigate("/login/community")}
          />
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={updateProfile === true ? handleCompleteProfile : handleSubmit}
        className="w-full flex justify-center items-center lg:py-10 py-5 px-2 md:px-5"
      >
        <div className="flex flex-col justify-center items-center gap-5 w-full">
          {updateProfile === true ? (
            ""
          ) : (
            <div className="flex justify-center items-center gap-5 ">
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
                <span className="text-3xl">
                  Let's collaborate! Fill out the form below to join us.
                </span>
                <br /> If you are an Influencer, Blogger, Solo-Traveller, Group
                Travellers, Bikers, Cycling etc.
              </h1>
            </div>
          )}

          {updateProfile === true ? (
            ""
          ) : (
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
              {/* // SOLO TRAVELLER SECTION */}
              <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-5 my-5">
                {/* TITLE */}
                <div className="mb-5">
                  <h2 className="text-xl font-bold">Travel Information</h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Tell us about your travelling style
                  </p>
                </div>

                {/* SOLO TRAVELLER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Are you a solo traveller ?*
                    </label>

                    <select
                      required
                      value={soloTraveler}
                      onChange={(e) => {
                        setSoloTraveler(e.target.value);

                        // reset extra fields
                        if (e.target.value === "Yes") {
                          setTravelerType("");
                          setOtherTravelerType("");
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out"
                    >
                      <option value="">Select Option</option>

                      <option value="Yes">Yes</option>

                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* HIDDEN INPUT FOR FORM */}
                  <input
                    hidden
                    name="soloTraveler"
                    value={
                      soloTraveler === "Yes"
                        ? "Yes"
                        : travelerType === "Others"
                          ? otherTravelerType
                          : travelerType
                    }
                    readOnly
                  />

                  {/* TRAVELLER TYPE */}
                  {soloTraveler === "No" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What describes you best ?*
                      </label>

                      <select
                        required
                        value={travelerType}
                        onChange={(e) => {
                          setTravelerType(e.target.value);

                          if (e.target.value !== "Others") {
                            setOtherTravelerType("");
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out"
                      >
                        <option value="">Select Category</option>

                        <option value="Influencer">Influencer</option>

                        <option value="Blogger">Blogger</option>

                        <option value="Solo-Traveller">Solo-Traveller</option>

                        <option value="Group Travellers">
                          Group Travellers
                        </option>

                        <option value="Bikers">Bikers</option>

                        <option value="Cycling">Cycling</option>

                        <option value="Others">Others</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* OTHER TYPE INPUT */}
                {soloTraveler === "No" && travelerType === "Others" && (
                  <div className="mt-5">
                    <InputBox
                      LabelName="Please Specify"
                      Placeholder="Tell us what you do..."
                      Value={otherTravelerType}
                      onChange={(e) => setOtherTravelerType(e.target.value)}
                      Required={true}
                    />
                  </div>
                )}
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
          )}
          {/* community details  */}
          {updateProfile === true ? (
            <div className="w-full flex-col justify-start items-start">
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
                {/* // SOCIAL LINKS SECTION */}
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 mt-2">
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-bold">Social Links</h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Add your social media and portfolio links
                      </p>
                    </div>

                    <Button
                      type="button"
                      label={"+ Add Link"}
                      onClick={() =>
                        setSocialLinks([
                          ...socialLinks,
                          {
                            platformName: "",
                            url: "",
                          },
                        ])
                      }
                    />
                  </div>

                  {/* SOCIAL INPUTS */}
                  <div className="space-y-4">
                    {socialLinks.map((social, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 justify-center items-center bg-gray-50 p-4 rounded-2xl"
                      >
                        {/* PLATFORM */}
                        <div className="md:col-span-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform
                          </label>

                          <select
                            value={social.platformName}
                            onChange={(e) => {
                              const updated = [...socialLinks];

                              updated[index].platformName = e.target.value;

                              setSocialLinks(updated);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                          >
                            <option value="">Select Platform</option>

                            {socialPlatforms.map((platform) => (
                              <option key={platform} value={platform}>
                                {platform}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* URL */}
                        <div className="md:col-span-7">
                          <InputBox
                            LabelName="Profile URL"
                            Placeholder="https://"
                            Required={false}
                            Value={social.url}
                            onChange={(e) => {
                              const updated = [...socialLinks];

                              updated[index].url = e.target.value;

                              setSocialLinks(updated);
                            }}
                          />
                        </div>

                        {/* REMOVE */}
                        <div className="md:col-span-1 flex justify-center items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSocialLinks(
                                socialLinks.filter((_, i) => i !== index),
                              );
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-xl transition"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                    Community Logo*
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
            </div>
          ) : (
            ""
          )}
          {updateProfile === true ? (
            <div className="flex justify-center items-center gap-5">
              <Button label={"Update Profile"} type={"submit"} />
              <Button label={"Cancel"} onClick={() => onCancel()} />
            </div>
          ) : (
            <div className="flex justify-center items-center gap-5">
              <Button label={"Register"} type={"submit"} />
              <Button label={"Cancel"} type={""} onClick={() => handleHome()} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(CommunityRegForm);
