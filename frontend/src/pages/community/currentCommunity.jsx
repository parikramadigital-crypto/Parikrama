import React from "react";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import CommunityCard from "../../components/ui/CommunityCard";

const CurrentCommunity = ({ startLoading, stopLoading }) => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("role");
  const userId = user?._id;
  const [communities, setCommunities] = useState([]);

  const loadCommunity = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `communities/community/details/${communityId}`,
        "get",
      );
      setCommunity(response?.data?.data || null);
    } catch (err) {
      console.log(err);
      setError("Unable to load community details. Please try again.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadCommunity();
  }, [communityId]);

  const followRequest = async () => {
    if (userType === "club" || userType === "Club") {
      alert(
        "you are registered as Club, kindly register as Community or a normal user to follow other communities. ",
      );
      return;
    }
    try {
      const response = await FetchData(
        `communities/community/follow-request/${community?._id}`,
        "post",
        { userType, userId },
      );
      console.log(response);
      alert(response.data.message || "Request sent successfully");
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
    }
  };

  const loadCommunities = async () => {
    try {
      startLoading();
      const response = await FetchData("communities/community/all/list", "get");
      setCommunities(response?.data?.data || []);
    } catch (err) {
      setError("Unable to load clubs. Please try again.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const totalFollowers =
    community?.acceptedRequestsUser?.length +
      community?.acceptedRequestsCommunity?.length || 0;

  return (
    <div className="px-5 md:px-20 ">
      <div className="bg-neutral-200 shadow rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-5">
        <div className=" rounded-full w-72 h-7w-72  relative">
          <img
            src={community?.images.profileImage.url}
            className="w-full h-full rounded-full shadow-2xl"
          />
          <h1 className="absolute top-0 right-0">
            {community?.personalDetails?.soloTraveler === "Yes" ? (
              <p className="text-xs bg-green-200 text-green-800 font-semibold p-1 rounded-full">
                {" "}
                Solo traveler
              </p>
            ) : (
              ""
            )}
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <h2>
            <strong>Name: </strong> {community?.personalDetails?.name}
          </h2>
          <h2>
            <strong>Contact: </strong>{" "}
            {community?.personalDetails?.contactNumber}
          </h2>
          <h2>
            <strong>Email: </strong> {community?.personalDetails?.email}
          </h2>
          <h2>
            <strong>Followers: </strong> {totalFollowers}
          </h2>

          {user === null ? (
            <Button
              label={"Follow"}
              className={"w-full "}
              onClick={() => {
                setPopup(true);
                setTimeout(() => {
                  setPopup(false);
                }, 4000);
              }}
            />
          ) : user?._id === communityId ? (
            ""
          ) : (
            <Button
              label={"Follow"}
              className={"w-full "}
              onClick={() => followRequest()}
            />
          )}
        </div>
      </div>

      <div className="flex justify-center items-center">
        {communities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No communities found matching your search.
            </p>
          </div>
        ) : (
          <div className="my-20">
            <h1 className="text-2xl ">Suggested for you</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 p-10 w-full">
              {communities.map((community) => (
                <CommunityCard key={community._id} community={community} />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-white"
          >
            <div className="flex justify-center items-center flex-col gap-5 bg-neutral-200 shadow-2xl p-5 rounded-xl">
              <h1 className="flex justify-center items-center gap-2">
                Please login or register as community or normal user to Follow{" "}
                <span className="font-semibold">
                  {community?.personalDetails?.name}
                </span>
              </h1>
              <div className="flex justify-center items-center gap-5">
                <Button
                  label={"Register"}
                  onClick={() => navigate("/authentication")}
                />
                <Button
                  label={"Login"}
                  onClick={() => navigate("/authentication")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(CurrentCommunity);
