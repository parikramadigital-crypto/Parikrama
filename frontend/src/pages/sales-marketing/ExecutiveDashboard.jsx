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

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth);

  const [data, setData] = useState({});
  const [showDetails, setShowDetails] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  // ------------------------------------------------
  // FETCH DASHBOARD
  // ------------------------------------------------

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // Change endpoint according to your backend
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
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchDashboard();
    }
  }, [user?._id]);

  // ------------------------------------------------
  // COPY COUPON
  // ------------------------------------------------

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

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

  const handleLogout = async () => {
    try {
      // Call logout API here if required

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Dispatch your logout redux action here
      // dispatch(logout());

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // ------------------------------------------------
  // USER DETAILS
  // ------------------------------------------------

  const userData = [
    {
      label: "Name",
      value: data?.name,
    },
    {
      label: "Contact",
      value: data?.contactNumber,
    },
    {
      label: "Email",
      value: data?.email,
    },
    {
      label: "Employee Code",
      value: data?.employeeCode,
    },
    {
      label: "Coupon Code",
      value: data?.couponCode,
    },
    {
      label: "Location",
      value:
        data?.city?.name || data?.state?.name
          ? `${data?.city?.name || ""}${
              data?.city?.name && data?.state?.name ? ", " : ""
            }${data?.state?.name || ""}`
          : "NA",
    },
  ];

  // ------------------------------------------------
  // DASHBOARD STATS
  // Adjust these according to backend response
  // ------------------------------------------------

  const stats = [
    {
      title: "Food Places",
      value: data?.foodPlaces?.length || 0,
      icon: <FaUtensils className="text-[#FFC20D]" />,
    },
    {
      title: "Facilitators",
      value: data?.facilitators?.length || 0,
      icon: <FaUsers className="text-[#FFC20D]" />,
    },
    {
      title: "Total Added",
      value:
        (data?.foodPlaces?.length || 0) + (data?.facilitators?.length || 0),
      icon: <IoMdAdd className="text-[#FFC20D]" />,
    },
  ];

  // ------------------------------------------------
  // LOADING
  // ------------------------------------------------

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />

        <p className="text-neutral-600">Preparing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-12 py-6">
      {/* -------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------- */}

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

        <button
          onClick={fetchDashboard}
          className="flex items-center justify-center gap-2 border border-neutral-300 rounded-lg px-4 py-2 hover:bg-neutral-100 transition-all w-fit"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* -------------------------------------------- */}
      {/* ERROR */}
      {/* -------------------------------------------- */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex justify-between items-center">
          <p>{error}</p>

          <button onClick={fetchDashboard} className="font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* STATS */}
      {/* -------------------------------------------- */}

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

      {/* -------------------------------------------- */}
      {/* MAIN SECTION */}
      {/* -------------------------------------------- */}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ------------------------------------------ */}
        {/* DETAILS */}
        {/* ------------------------------------------ */}

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
                    {/* PROFILE IMAGE */}

                    <div className="shrink-0">
                      {data?.profileImage?.url ? (
                        <img
                          src={data.profileImage.url}
                          alt={data?.name || "Executive"}
                          className="h-36 w-36 lg:h-40 lg:w-40 rounded-full object-cover bg-neutral-200"
                        />
                      ) : (
                        <div className="h-36 w-36 lg:h-40 lg:w-40 rounded-full bg-neutral-200 flex justify-center items-center">
                          <FaUserTie className="text-5xl text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}

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

                  {/* LOCATION */}

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

                  {/* LOGOUT */}

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

        {/* ------------------------------------------ */}
        {/* QUICK ACTIONS */}
        {/* ------------------------------------------ */}

        <div className="w-full lg:w-1/4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="font-semibold text-lg">Quick Actions</h2>

            <p className="text-sm text-neutral-500 mt-1 mb-5">
              Common executive actions
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/executive/food-place/add")}
                label={
                  <span className="flex justify-center items-center gap-2">
                    <ImSpoonKnife />
                    Add Food Place
                  </span>
                }
                className="w-full"
              />

              <Button
                onClick={() => navigate("/executive/facilitator/add")}
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

            {/* COUPON DISPLAY */}

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

      {/* -------------------------------------------- */}
      {/* FOOD PLACES */}
      {/* -------------------------------------------- */}

      <div className="mt-8 bg-white border border-neutral-200 rounded-xl p-5 md:p-7">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold">Food Places</h2>

            <p className="text-sm text-neutral-500">Places added by you</p>
          </div>

          <Button
            onClick={() => navigate("/executive/food-place/add")}
            normal={false}
            label={
              <h1 className="flex items-center gap-2 text-sm font-medium">
                <IoMdAdd />
                Add New
              </h1>
            }
          />
        </div>

        {data?.foodPlaces?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.foodPlaces.map((place) => (
              <div
                key={place._id}
                className="border border-neutral-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-neutral-100 flex justify-center items-center">
                    <MdFoodBank className="text-xl" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {place?.name || "Food Place"}
                    </h3>

                    <p className="text-sm text-neutral-500">
                      {place?.city?.name || data?.city?.name}
                    </p>
                  </div>
                </div>
              </div>
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
              onClick={() => navigate("/executive/food-place/add")}
              className="mt-4 flex items-center gap-2 font-medium"
            >
              <IoMdAdd />
              Add Food Place
            </button>
          </div>
        )}
      </div>

      {/* -------------------------------------------- */}
      {/* FACILITATORS */}
      {/* -------------------------------------------- */}

      <div className="mt-6 bg-white border border-neutral-200 rounded-xl p-5 md:p-7">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold">Facilitators</h2>

            <p className="text-sm text-neutral-500">
              Facilitators added by you
            </p>
          </div>
          <Button
            onClick={() => navigate("/executive/facilitator/add")}
            normal={false}
            label={
              <h1 className="flex items-center gap-2 text-sm font-medium">
                <IoMdAdd />
                Add New
              </h1>
            }
          />
        </div>

        {data?.facilitators?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.facilitators.map((facilitator) => (
              <div
                key={facilitator._id}
                className="border border-neutral-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-neutral-100 flex justify-center items-center">
                    <FaUserTie />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {facilitator?.name ||
                        facilitator?.businessName ||
                        "Facilitator"}
                    </h3>

                    <p className="text-sm text-neutral-500">
                      {facilitator?.city?.name || data?.city?.name}
                    </p>
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
              onClick={() => navigate("/executive/facilitator/add")}
              className="mt-4 flex items-center gap-2 font-medium"
            >
              <IoMdAdd />
              Add Facilitator
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
