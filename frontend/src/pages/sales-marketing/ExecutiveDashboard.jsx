import { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";
import { MdFoodBank, MdNoFood } from "react-icons/md";
import { ImSpoonKnife } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import {
  IoChevronDownOutline,
  IoLogOut,
  IoLocationOutline,
} from "react-icons/io5";
import {
  FaCopy,
  FaCheck,
  FaUserTie,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import LoadingUI from "../../components/LoadingUI";
import AddFoodPlaceByExecutive from "./AddFoodPlaceForm";
import AddFacilitatorByExecutive from "./AddFacilitatorForm";

const ExecutiveDashboard = ({ startLoading, stopLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const [data, setData] = useState({});
  const [showDetails, setShowDetails] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [addFood, setAddFood] = useState(false);
  const [addFacilitator, setAddFacilitator] = useState(false);

  const [copied, setCopied] = useState(false);

  const fetchDashboard = async () => {
    try {
      startLoading();
      setLoading(true);
      setError("");
      const response = await FetchData(
        `executive/dashboard/${user?._id}`,
        "get",
      );
      console.log("Executive Dashboard:", response);
      setData(response?.data?.data || {});
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard. Please try again.",
      );
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchDashboard();
    }
  }, [user?._id]);

  const handleCopyCoupon = async () => {
    if (!data?.couponCode) return;
    try {
      await navigator.clipboard.writeText(data.couponCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log("Unable to copy coupon:", error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("AccessToken");
      localStorage.removeItem("RefreshToken");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const userData = [
    {
      label: "Name",
      value: user?.name,
    },
    {
      label: "Contact",
      value: user?.contactNumber,
    },
    {
      label: "Email",
      value: user?.email,
    },
    {
      label: "Employee Code",
      value: user?.employeeId,
    },
    {
      label: "Coupon Code",
      value: user?.couponCode,
    },
    {
      label: "Location",
      value: (
        <span>
          {user?.otherCity === false ? user?.city : user?.otherCityName} |{" "}
          {user?.otherState === false ? user?.state : user?.otherStateName}
        </span>
      ),
    },
  ];

  console.log(data);

  const stats = [
    {
      title: "Food Places",
      value: data?.foodPlace?.length || 0,
      icon: <FaUtensils className="text-[#FFC20D]" />,
    },
    {
      title: "Facilitators",
      value: data?.facilitator?.length || 0,
      icon: <FaUsers className="text-[#FFC20D]" />,
    },
    {
      title: "Total Added",
      value: (data?.foodPlace?.length || 0) + (data?.facilitator?.length || 0),
      icon: <IoMdAdd className="text-[#FFC20D]" />,
    },
  ];

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />

        <p className="text-neutral-600">Preparing your dashboard...</p>
      </div>
    );
  }

  return user ? (
    <div className="w-full min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-12 py-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <p className="text-sm text-neutral-500">Executive Dashboard</p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Welcome, {data?.name?.split(" ")[0] || "Executive"}
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage your places and facilitators from here.
          </p>
        </div>
        <Button
          onClick={fetchDashboard}
          label={
            <h1 className="flex justify-center items-center gap-3">
              <FiRefreshCw />
              Refresh
            </h1>
          }
        />
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex justify-between items-center">
          <p>{error}</p>

          <button onClick={fetchDashboard} className="font-semibold">
            Retry
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.1,
            }}
            className="bg-white border border-neutral-200 rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-neutral-500">{item.title}</p>

              <h2 className="text-3xl font-semibold mt-1">{item.value}</h2>
            </div>

            <div className="w-12 h-12 bg-neutral-100 rounded-full flex justify-center items-center text-xl">
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="w-full bg-neutral-200 flex justify-between items-center px-5 py-4 rounded-xl font-semibold"
          >
            <span className="flex items-center gap-2">
              <FaUserTie />
              Your Details
            </span>

            <motion.span
              animate={{
                rotate: showDetails ? 180 : 0,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <IoChevronDownOutline />
            </motion.span>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-neutral-200 rounded-xl mt-3 p-5 md:p-7">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-7">
                    <div className="shrink-0">
                      {user?.image?.url ? (
                        <img
                          src={user?.image?.url}
                          alt={user?.name || "Executive"}
                          className="h-36 w-36 lg:h-40 lg:w-40 rounded-full object-cover bg-neutral-200"
                        />
                      ) : (
                        <div className="h-36 w-36 lg:h-40 lg:w-40 rounded-full bg-neutral-200 flex justify-center items-center">
                          <FaUserTie className="text-5xl text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                      {userData.map((item) => (
                        <div key={item.label}>
                          <p className="text-xs uppercase tracking-wide text-neutral-400">
                            {item.label}
                          </p>

                          <p className="font-medium mt-1 break-all">
                            {item.value || "NA"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {(data?.city?.name || data?.state?.name) && (
                    <div className="mt-7 pt-5 border-t border-neutral-200 flex items-center gap-2 text-neutral-600">
                      <IoLocationOutline />
                      <span>
                        {data?.city?.name}
                        {data?.city?.name && data?.state?.name && ", "}
                        {data?.state?.name}
                      </span>
                    </div>
                  )}

                  <div className="mt-7 pt-5 border-t border-neutral-200">
                    <Button
                      onClick={handleLogout}
                      label={
                        <span className="flex justify-center items-center gap-2">
                          <IoLogOut />
                          Log out
                        </span>
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-1/4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="font-semibold text-lg">Quick Actions</h2>
            <p className="text-sm text-neutral-500 mt-1 mb-5">
              Common executive actions
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setAddFood(true)}
                label={
                  <span className="flex justify-center items-center gap-2">
                    <ImSpoonKnife />
                    Add Food Place
                  </span>
                }
                className="w-full"
              />
              <Button
                onClick={() => setAddFacilitator(true)}
                label={
                  <span className="flex justify-center items-center gap-2">
                    <IoMdAdd />
                    Add Facilitator
                  </span>
                }
                className="w-full"
              />
              <Button
                onClick={handleCopyCoupon}
                disabled={!data?.couponCode}
                label={
                  <span className="flex justify-center items-center gap-2">
                    {copied ? (
                      <>
                        <FaCheck />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        Copy Coupon Code
                      </>
                    )}
                  </span>
                }
                className="w-full"
              />
            </div>

            {data?.couponCode && (
              <div className="mt-5 bg-neutral-100 rounded-lg p-4">
                <p className="text-xs text-neutral-500">Your coupon code</p>
                <div className="flex justify-between items-center mt-1">
                  <strong className="tracking-wider">{data.couponCode}</strong>
                  <button
                    onClick={handleCopyCoupon}
                    className="p-2 hover:bg-neutral-200 rounded-lg transition-all"
                  >
                    {copied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border border-neutral-200 rounded-xl p-5 md:p-7">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold">Food Places</h2>
            <p className="text-sm text-neutral-500">Places added by you</p>
          </div>
          <Button
            onClick={() => setAddFood(true)}
            normal={false}
            label={
              <h1 className="flex items-center gap-2 text-sm font-medium">
                <IoMdAdd />
                Add New
              </h1>
            }
          />
        </div>
        {data?.foodPlace?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.foodPlace?.map((place) => (
              <button
                onClick={() => navigate(`/current/food-court/${place?._id}`)}
                key={place._id}
                className="border border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-neutral-300 duration-300 ease-in-out"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-neutral-100 flex justify-center items-center">
                    <MdFoodBank className="text-xl" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {place?.name || "Food Place"}
                    </h3>

                    {/* <p className="text-sm text-neutral-500">
                      {place?.city?.name || data?.city?.name}
                    </p> */}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col justify-center items-center text-center">
            <MdNoFood className="text-5xl text-neutral-300" />

            <h3 className="font-semibold mt-4">No food places added yet</h3>

            <p className="text-neutral-500 text-sm mt-1">
              Add your first food place to get started.
            </p>

            <button
              onClick={() => setAddFood(true)}
              className="mt-4 flex items-center gap-2 font-medium"
            >
              <IoMdAdd />
              Add Food Place
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 bg-white border border-neutral-200 rounded-xl p-5 md:p-7">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold">Facilitators</h2>
            <p className="text-sm text-neutral-500">
              Facilitators added by you
            </p>
          </div>
          <Button
            onClick={() => setAddFacilitator(true)}
            normal={false}
            label={
              <h1 className="flex items-center gap-2 text-sm font-medium">
                <IoMdAdd />
                Add New
              </h1>
            }
          />
        </div>

        {data?.facilitator?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.facilitator?.map((facilitator) => (
              <div
                key={facilitator._id}
                className="border border-neutral-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-neutral-100 flex justify-center items-center">
                    <FaUserTie />
                  </div>
                  <div>
                    <h3 className="font-semibold">{facilitator?.name}</h3>
                    {/* <p className="text-sm text-neutral-500">
                      {facilitator?.city?.name || data?.city?.name}
                    </p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col justify-center items-center text-center">
            <FaUsers className="text-5xl text-neutral-300" />
            <h3 className="font-semibold mt-4">No facilitators added yet</h3>
            <p className="text-neutral-500 text-sm mt-1">
              Facilitators added by you will appear here.
            </p>
            <button
              onClick={() => setAddFacilitator(true)}
              className="mt-4 flex items-center gap-2 font-medium"
            >
              <IoMdAdd />
              Add Facilitator
            </button>
          </div>
        )}
      </div>
      {/* popups are below  */}
      <AnimatePresence>
        {addFood && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <AddFoodPlaceByExecutive
              onClose={() => setAddFood(false)}
              executiveId={user?._id}
            />
          </motion.div>
        )}
        {addFacilitator && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <AddFacilitatorByExecutive
              onClose={() => setAddFacilitator(false)}
              executiveId={user?._id}
            />
          </motion.div>
        )}
      </AnimatePresence>
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

export default LoadingUI(ExecutiveDashboard);
