import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { clearUser } from "../../redux/slices/authSlice";
import { IoIosAdd } from "react-icons/io";
import { communityMembersInputs } from "../../constants/Constants";
import InputBox from "../../components/InputBox";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import CommunityRegForm from "./communityRegForm";
import CityDarshanBookedCard from "../cityDarshan/cityDarshanBookedCard";

const CommunityDashboard = ({
  startLoading,
  stopLoading,
  showQuickActions = true,
}) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();
  const [data, setData] = useState();
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [personalData, setPersonalData] = useState();
  const [communityData, setCommunityData] = useState();
  const [bankData, setBankData] = useState();
  const [members, setMembers] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [userRequests, setUserRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [communityRequests, setCommunityRequests] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [communityFollowers, setCommunityFollowers] = useState([]);
  const [active, setActive] = useState(
    () => localStorage.getItem("active") || "Followers",
  );

  const CSSClassName =
    "w-full flex flex-col justify-center items-center shadow p-5 bg-neutral-200 gap-4 rounded-xl ";
  const CSSClassNameP =
    "w-full flex justify-between items-center border-b border-neutral-300";

  const DashboardData = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `communities/community/dashboard/${user?._id}`,
        "get",
      );
      setBookings(response.data.data.bookings || []);
      setUserRequests(response.data.data.community.userFollowRequests);
      setCommunityRequests(
        response.data.data.community.communityFollowRequests,
      );
      setUserFollowers(response.data.data.community.acceptedRequestsUser);
      setCommunityFollowers(
        response.data.data.community.acceptedRequestsCommunity,
      );
      setMembers(response.data.data.community.members);
      setData(response.data.data.community || []);
      setPersonalData(response.data.data.community.personalDetails || []);
      setCommunityData(response.data.data.community.communityDetails || []);
      setBankData(
        response.data.data.community.communityDetails.bankDetails || [],
      );
    } catch (err) {
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        startLoading();
        const res = await FetchData("states", "get");
        setStates(res?.data?.data || []);
      } catch (err) {
        // console.error(err);
      } finally {
        stopLoading();
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) return;

    const fetchCities = async () => {
      try {
        const res = await FetchData(`cities/state/${selectedState}`, "get");
        setCities(res?.data?.data || []);
      } catch (err) {
        // console.error(err);
      }
    };

    fetchCities();
  }, [selectedState]);

  useEffect(() => {
    DashboardData();
  }, [user]);

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    alert("You are logged out successfully");
    navigate("/");
  };

  const Card = ({ name, number, id, img, userType, showButton = true }) => {
    const acceptRequest = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `communities/community/accept-request/${user?._id}`,
          "post",
          {
            userId: id,
            userType: userType,
          },
        );
        alert(response.data.message);
        DashboardData();
      } catch (err) {
        // console.log(err);
      }
    };

    const rejectRequest = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `communities/community/accept-request/${user?._id}`,
          "post",
          {
            userId: id,
            userType: userType,
          },
        );
        alert(response.data.message);
        DashboardData();
      } catch (err) {
        // console.log(err);
      }
    };

    return (
      <div className="flex justify-between items-center bg-neutral-100 shadow-md hover:shadow-xl duration-300 ease-in-out hover:scale-105 p-4 rounded-xl w-full md:w-96 ">
        <div className="flex flex-col justify-center items-center gap-2 relative">
          <img
            className="w-20 bg-neutral-200 rounded-full"
            src={
              img ||
              "https://ik.imagekit.io/parikrama/gray-user-profile-icon-png-fP8Q1P.png"
            }
          />
          <p className="absolute top-0 right-0 ">
            {userType === "User" ? (
              <span className="bg-green-300 font-semibold text-[10px] text-green-600 p-1 rounded-xl">
                User
              </span>
            ) : (
              <span className="bg-yellow-300 font-semibold text-[10px] text-yellow-600 p-1 rounded-xl">
                Community
              </span>
            )}
          </p>
        </div>
        <h1 className="flex flex-col justify-center items-center gap-2">
          <span>{name}</span>
          {/* <span>{number}</span> */}
          {showButton === true ? (
            <div className="flex justify-center items-center gap-2">
              <Button label={"Accept"} onClick={() => acceptRequest()} />
              <Button label={"Reject"} onClick={() => rejectRequest()} />
            </div>
          ) : (
            ""
          )}
        </h1>
      </div>
    );
  };

  const sections = ["Followers", "Follow Requests"];

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `communities/add-new/${user?._id}/member`,
        "post",
        formData,
      );
      alert(response.data.message);
      formRef.current.reset();
      setPopup(false);
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-start items-start p-5 md:p-10 flex-col lg:flex-row gap-5">
      <div className="flex flex-col justify-center items-start gap-10 w-full lg:w-1/2">
        {/* personal details  */}
        <div className={`${CSSClassName}`}>
          <h1 className="font-semibold text-xl">Personal details</h1>
          <div className="flex w-full justify-between items-center flex-col md:flex-row gap-5">
            {" "}
            <div className="w-28 lg:w-60 h-28 lg:h-60 bg-neutral-400 rounded-full overflow-hidden shadow-2xl ">
              <img
                src={data?.images?.profileImage?.url}
                className="w-full h-full object-cover"
              />
              {/* <img src={imageData?.profileImage?.url} className="w-full h-full" /> */}
            </div>
            <div className="flex flex-col justify-start items-center gap-5">
              <p className={`${CSSClassNameP}`}>
                <strong>Name: </strong>
                {personalData?.name}
              </p>
              <p className={`${CSSClassNameP}`}>
                <strong>Email: </strong>
                {personalData?.email}
              </p>
              <p className={`${CSSClassNameP}`}>
                <strong>Contact number: </strong>
                {personalData?.contactNumber}
              </p>
              {personalData?.aadhar ? (
                <p className={`${CSSClassNameP}`}>
                  <strong>Aadhar details: </strong>
                  {personalData?.aadhar}
                </p>
              ) : (
                ""
              )}
              {personalData?.pan ? (
                <p className={`${CSSClassNameP}`}>
                  <strong>Pan details</strong>
                  {personalData?.pan || "No data"}
                </p>
              ) : (
                ""
              )}
              {showQuickActions === true ? (
                <div>
                  <div className="flex justify-center items-center gap-10">
                    <Button label={"Logout"} onClick={() => logout()} />
                    <Button
                      onClick={() => setPopup(true)}
                      label={
                        <p className="flex justify-center items-center ">
                          <IoIosAdd />
                          Members
                        </p>
                      }
                    />
                    <Button
                      label={"Update Profile"}
                      className={"text-xs"}
                      onClick={() => {
                        setPopup2(true);
                        console.log("Button clicked");
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {/* community details  */}
        <div className={`${CSSClassName}`}>
          <h1 className="font-semibold text-xl">Community details</h1>
          <div className="w-28 lg:w-60 h-28 lg:h-60 bg-neutral-400 rounded-full overflow-hidden shadow-2xl">
            <img
              src={data?.images?.companyLogo?.url}
              className="w-full h-full"
            />
          </div>
          <p className={`${CSSClassNameP}`}>
            <strong>Name: </strong>
            {communityData?.communityName || "Kindly update your profile"}
          </p>
          {data?.communityEstablishment ? (
            <p className={`${CSSClassNameP}`}>
              <strong>Community establishment year: </strong>
              {data?.communityEstablishment}
            </p>
          ) : (
            ""
          )}
          {communityData?.communityEmail ? (
            <p className={`${CSSClassNameP}`}>
              <strong>Email: </strong>
              {communityData?.communityEmail}
            </p>
          ) : (
            ""
          )}
          <p className={`${CSSClassNameP}`}>
            <strong>Contact number: </strong>
            {communityData?.communityContactNumber}
          </p>
          {communityData?.gst ? (
            <p className={`${CSSClassNameP}`}>
              <strong>G.S.T.: </strong>
              {communityData?.gst}
            </p>
          ) : (
            ""
          )}
          <p className={`${CSSClassNameP}`}>
            <strong>Profession</strong>
            {communityData?.profession}
          </p>
        </div>
        {/* members */}
        <div className={`${CSSClassName}`}>
          <h1 className="font-semibold text-xl">
            Added Members (<span>{members?.length}</span>)
          </h1>
          <div className="flex flex-col gap-4">
            {members?.map((m, index) => (
              <div className="bg-neutral-100 p-4 rounded-md shadow-2xl grid grid-cols-1 md:grid-cols-2">
                <h1>
                  <strong>Name:</strong> {m.name || "Na"}
                </h1>
                <h1>
                  <strong>Email:</strong> {m.email || "Na"}
                </h1>
                <h1>
                  <strong>Address:</strong> {m.address || "Na"}
                </h1>
                <h1>
                  <strong>Contact No:</strong> {m.contactNumber || "Na"}
                </h1>
              </div>
            ))}
          </div>
        </div>
        {/* banking details  */}
        <div>
          {bankData?.bankName &&
          bankData?.ifsc &&
          bankData?.accountNumber &&
          bankData?.accountHolderName ? (
            <div className={`${CSSClassName}`}>
              <h1 className="font-semibold text-xl">Bank details</h1>
              <p className={`${CSSClassNameP}`}>
                <strong>Account holder name: </strong>
                {bankData?.accountHolderName}
              </p>
              <p className={`${CSSClassNameP}`}>
                <strong>Account number: </strong>
                {bankData?.accountNumber}
              </p>
              <p className={`${CSSClassNameP}`}>
                <strong>Bank name: </strong>
                {bankData?.bankName}
              </p>
              <p className={`${CSSClassNameP}`}>
                <strong>IFSC: </strong>
                {bankData?.ifsc}
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
        {/* community description */}
        <div>
          {data?.about ? (
            <div className={`${CSSClassName}`}>
              <h1 className="font-semibold text-xl">About your community</h1>
              <p>{data?.about}</p>
            </div>
          ) : (
            ""
          )}
        </div>
        {/* City darshan pending / confirmed booking */}
        <div className="p-4 md:p-10 w-[95vw] overflow-scroll">
          <CityDarshanBookedCard booking={bookings} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-neutral-200 rounded-xl py-5">
        <div className="flex justify-center items-center w-full">
          <nav>
            <ul className="flex md:gap-20 gap-5 items-center justify-center">
              {sections.map((section, idx) => (
                <li
                  key={idx}
                  className={`cursor-pointer transition-all duration-300 rounded-xl w-full px-4 py-2 text-nowrap ${
                    active === section
                      ? "bg-[#FFC20E] shadow-xl"
                      : "bg-neutral-100 "
                  }`}
                  onClick={() => {
                    localStorage.setItem("active", section);
                    setActive(section);
                  }}
                >
                  <p className="flex justify-between items-center">{section}</p>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="px-5 overflow-scroll w-full flex justify-center items-center flex-col">
          {active === "Followers" && (
            <div className="flex flex-col w-full md:w-fit justify-center items-center">
              <div className="w-full m-2">
                {userFollowers.map((r) => (
                  <Card
                    id={r?._id}
                    img={r?.images?.url}
                    name={r?.name}
                    number={r?.contactNumber}
                    userType={"User"}
                    showButton={false}
                  />
                ))}
              </div>
              <div className="w-full m-2">
                {communityFollowers?.map((r) => (
                  <Card
                    id={r?._id}
                    img={r?.images?.profileImage?.url}
                    name={r?.personalDetails?.name}
                    number={r?.personalDetails?.contactNumber}
                    userType={"Community"}
                    showButton={false}
                  />
                ))}
              </div>
            </div>
          )}
          {active === "Follow Requests" && (
            <div className="flex flex-col w-full md:w-fit justify-center items-center">
              <div className="w-full m-2">
                {userRequests.map((r) => (
                  <Card
                    id={r?._id}
                    img={r?.images?.url}
                    name={r?.name}
                    number={r?.contactNumber}
                    userType={"User"}
                  />
                ))}
              </div>
              <div className="w-full m-2">
                {communityRequests?.map((r) => (
                  <Card
                    id={r?._id}
                    img={r?.images?.profileImage?.url}
                    name={r?.personalDetails?.name}
                    number={r?.personalDetails?.contactNumber}
                    userType={"Community"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-start md:items-center bg-black/70 z-50 overflow-scroll"
          >
            <div className="bg-white p-5 rounded-xl">
              <h1 className="text-xl font-semibold ">Add new member</h1>
              <form
                ref={formRef}
                onSubmit={handleAddMember}
                className="flex flex-col md:grid grid-cols-2 gap-2"
              >
                {communityMembersInputs.map((i) => (
                  <InputBox
                    LabelName={i.label}
                    Placeholder={i.placeHolder}
                    Name={i.name}
                    Type={i.type}
                  />
                ))}
                {/* state  */}
                <div className="flex justify-center items-center w-full">
                  <div className="py-4 w-full">
                    <label className="block text-sm font-medium mb-1">
                      State*
                    </label>
                    <select
                      name="state"
                      required
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {states?.map((state) => (
                        <option key={state._id} value={state._id}>
                          {state.name}, {state?.country?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* city  */}
                <div className="flex justify-center items-center w-full">
                  <div className="py-4 w-full">
                    <label className="block text-sm font-medium mb-1">
                      City*
                    </label>
                    <select
                      name="city"
                      required
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                      // onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="">Select City</option>
                      {cities?.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full gap-5 col-span-2">
                  <Button label={"Submit"} type={"submit"} />
                  <Button
                    label={"Cancel"}
                    onClick={() => {
                      setPopup(false);
                      formRef.current.reset();
                      setCities([]);
                      setStates([]);
                      setSelectedState([]);
                    }}
                  />
                </div>
              </form>
            </div>
          </motion.div>
        )}
        {popup2 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-start bg-black/70 z-50 overflow-scroll"
          >
            <div className="bg-white p-5 rounded-xl w-full md:w-3/4">
              <h1 className="text-xl font-semibold ">Update profile</h1>
              <CommunityRegForm
                communityId={user?._id}
                updateProfile={true}
                onCancel={() => {
                  setPopup2(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(CommunityDashboard);
