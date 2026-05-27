// import React, { useEffect, useState } from "react";
// import { FetchData } from "../../utils/FetchFromApi";
// import LoadingUI from "../../components/LoadingUI";
// import InputBox from "../../components/InputBox";
// import Button from "../../components/Button";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRef } from "react";
// import { parseErrorMessage } from "../../utils/ErrorMessageParser";
// import { GiClubs } from "react-icons/gi";
// import { BiMap, BiSolidStar } from "react-icons/bi";

// const ClubUpdates = ({ stopLoading, startLoading }) => {
//   const [data, setData] = useState();
//   const [preview, setPreview] = useState(false);
//   const [currentClub, setCurrentClub] = useState();
//   const [otp, setOtp] = useState("");
//   const [members, setMembers] = useState([]);
//   const [memberPopup, setMemberPopup] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [gallery, setGallery] = useState([]);
//   const [verifiedClub, setVerifiedClub] = useState(false);
//   const [verifiedClubData, setVerifiedClubData] = useState();
//   const formRef = useRef();
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedState, setSelectedState] = useState("");

//   // the following functions are for club authentication and display purpose
//   const getClubs = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(formRef.current);
//     try {
//       startLoading();
//       const response = await FetchData(
//         "clubs/club/get/club-by-information",
//         "post",
//         formData,
//       );
//       setPreview(response.data.data);
//     } catch (err) {
//       alert(parseErrorMessage(err.response.data));
//     } finally {
//       stopLoading();
//     }
//   };

//   const getOTP = async ({ clubId, clubEmail, clubName }) => {
//     try {
//       startLoading();
//       const response = await FetchData(
//         `clubs/club/get/otp-club/${clubId}`,
//         "post",
//         {
//           clubName,
//           clubEmail,
//         },
//       );
//       setOtp(response.data.data.otp);
//       setCurrentClub(response.data.data.club);
//       setPreview(false);
//     } catch (err) {
//       alert(parseErrorMessage(err.response.data));
//     } finally {
//       stopLoading();
//     }
//   };

//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       startLoading();
//       const formData = new FormData(formRef.current);
//       const response = await FetchData(
//         `clubs/club/verify-otp/${currentClub?._id}`,
//         "post",
//         formData,
//       );
//       alert(response.data.message);
//       setVerifiedClub(true);
//       setVerifiedClubData(response.data.data);
//     } catch (err) {
//       alert(parseErrorMessage(err.response.data));
//     } finally {
//       stopLoading();
//     }
//   };

//   // the below functions are for fetching states or cities
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         startLoading();
//         const res = await FetchData("states", "get");
//         setStates(res?.data?.data || []);
//       } catch (err) {
//         // console.error(err);
//       } finally {
//         stopLoading();
//       }
//     };
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     if (!selectedState) return;

//     const fetchCities = async () => {
//       try {
//         const res = await FetchData(`cities/state/${selectedState}`, "get");
//         setCities(res?.data?.data || []);
//       } catch (err) {
//         // console.error(err);
//       }
//     };

//     fetchCities();
//   }, [selectedState]);

//   const handleAddMember = async (e) => {
//     e.preventDefault();
//     try {
//       startLoading();
//       const formData = new FormData(formRef.current);
//       const response = await FetchData(
//         `communities/add-new/${user?._id}/member`,
//         "post",
//         formData,
//       );
//       alert(response.data.message);
//       formRef.current.reset();
//       setPopup(false);
//     } catch (err) {
//       // console.log(err);
//     } finally {
//       stopLoading();
//     }
//   };

//   return (
//     <div className="flex justify-center items-center ">
//       {/* {console.log(verifiedClubData)} */}
//       {verifiedClub === true ? (
//         <div>
//           <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm h-96">
//             <img
//               src={verifiedClubData?.images?.coverImage?.url}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500 flex items-center gap-2">
//               <BiMap /> {verifiedClubData.location?.address || "No address"},{" "}
//               {verifiedClubData.location?.city?.name},{" "}
//               {verifiedClubData.location?.state?.name}{" "}
//               <span className="font-semibold text-base">
//                 {verifiedClubData.location?.country?.name}
//               </span>
//             </p>
//             <h1 className="text-3xl font-bold text-gray-900 mt-3">
//               {verifiedClubData.clubName}
//             </h1>
//             <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
//               <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4D3] px-4 py-2">
//                 <BiSolidStar /> {verifiedClubData.ratings?.average || 0} / 5 (
//                 {verifiedClubData.ratings?.count || 0} ratings)
//               </span>
//               <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-4 py-2">
//                 {verifiedClubData.category || "Social verifiedClubData"}
//               </span>
//               {verifiedClubData.adminVerified && (
//                 <span className="inline-flex items-center gap-2 rounded-full bg-[#F0FDF4] px-4 py-2">
//                   ✓ Verified
//                 </span>
//               )}
//             </div>
//           </div>
//           <div>
//             <h1>Add new member</h1>
//             <form></form>
//           </div>
//           <div>
//             <h1>Current members</h1>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col md:flex-row justify-center items-center h-[550px] border-[0.5px] border-neutral-300 rounded-xl">
//           <div className="h-full w-[50vw] rounded-xl overflow-hidden hidden md:block">
//             <img
//               className="w-full h-full bg-[#fad57758] object-contain"
//               src={
//                 "https://ik.imagekit.io/parikrama/ChatGPT%20Image%20May%2026,%202026,%2002_48_51%20PM.png"
//               }
//             />
//           </div>
//           <div className="flex flex-col justify-evenly items-center w-full md:w-1/2 p-5 h-full">
//             <GiClubs className="text-7xl text-[#FFC20D] drop-shadow" />
//             <h1 className="font-semibold text-xl text-center">
//               Enter your details for <br /> posting updates for your Club
//             </h1>
//             <form
//               onSubmit={otp ? verifyOtp : getClubs}
//               ref={formRef}
//               className="w-full"
//             >
//               <span className="bg-red-300 text-red-600 font-semibold">
//                 {otp ? <p>Paste this OTP {otp}</p> : ""}
//               </span>
//               <InputBox
//                 LabelName="Registered Email"
//                 Type="email"
//                 Placeholder="Enter your registered email"
//                 Name="email"
//               />
//               <InputBox
//                 LabelName="Registered Contact Number"
//                 Type="text"
//                 Placeholder="Enter your registered number"
//                 Name="contactNumber"
//               />

//               {otp ? (
//                 <div>
//                   <input
//                     value={currentClub._id}
//                     name="clubId"
//                     className="hidden"
//                   />
//                   <InputBox
//                     LabelName="Enter your otp"
//                     Placeholder="OTP"
//                     Name="otp"
//                     Type="text"
//                   />
//                   <div className="bg-neutral-200 flex justify-start gap-2 items-center rounded-md p-1">
//                     <div className="w-20 h-20 rounded-full overflow-hidden">
//                       <img
//                         src={currentClub.images.logo.url}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <p>{currentClub.clubName}</p>
//                   </div>
//                 </div>
//               ) : (
//                 ""
//               )}
//               <div className="flex justify-center items-center gap-10">
//                 <Button
//                   label={"Cancel"}
//                   type={"reset"}
//                   onClick={() => formRef.current.reset()}
//                 />
//                 <Button label={"Submit"} type={"submit"} />
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <AnimatePresence>
//         {preview && (
//           <motion.div
//             whileInView={{ opacity: 1, x: 0 }}
//             initial={{ opacity: 0, x: -100 }}
//             exit={{ opacity: 0, x: 100 }}
//             transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
//             className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-white/90 overflow-scroll no-scrollbar"
//           >
//             <h1 className="bg-white h-fit w-full p-20 pb-0 text-xl font-semibold">
//               Select any one of your club for modification
//             </h1>
//             {preview.length > 1 ? (
//               <div className="grid w-full h-full grid-cols-1 md:grid-cols-3 p-20">
//                 {preview?.map((p) => (
//                   <button
//                     onClick={() => {
//                       getOTP({
//                         clubId: p._id,
//                         clubName: p.clubName,
//                         clubEmail: p.contactDetails.email,
//                       });
//                     }}
//                     className="w-96 h-60 flex flex-col justify-center items-center overflow-hidden relative rounded-xl border border-neutral-300 shadow-2xl"
//                   >
//                     <img src={p.images.logo.url} className="w-full" />
//                     <p className="absolute bottom-0 left-0 text-xl font-semibold bg-white text-center w-full">
//                       {p.clubName}
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               ""
//             )}
//           </motion.div>
//         )}
//         {memberPopup && (
//           <motion.div
//             whileInView={{ opacity: 1, x: 0 }}
//             initial={{ opacity: 0, x: -100 }}
//             exit={{ opacity: 0, x: 100 }}
//             transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
//             className="fixed top-0 left-0 h-screen w-full flex justify-center items-start md:items-center bg-black/70 z-50 overflow-scroll"
//           >
//             <div className="bg-white p-5 rounded-xl">
//               <h1 className="text-xl font-semibold ">Add new member</h1>
//               <form
//                 ref={formRef}
//                 onSubmit={handleAddMember}
//                 className="flex flex-col md:grid grid-cols-2 gap-2"
//               >
//                 {clubMembersInputs.map((i) => (
//                   <InputBox
//                     LabelName={i.label}
//                     Placeholder={i.placeHolder}
//                     Name={i.name}
//                     Type={i.type}
//                   />
//                 ))}
//                 {/* state  */}
//                 <div className="flex justify-center items-center w-full">
//                   <div className="py-4 w-full">
//                     <label className="block text-sm font-medium mb-1">
//                       State*
//                     </label>
//                     <select
//                       name="state"
//                       required
//                       className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
//                       onChange={(e) => setSelectedState(e.target.value)}
//                     >
//                       <option value="">Select State</option>
//                       {states?.map((state) => (
//                         <option key={state._id} value={state._id}>
//                           {state.name}, {state?.country?.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 {/* city  */}
//                 <div className="flex justify-center items-center w-full">
//                   <div className="py-4 w-full">
//                     <label className="block text-sm font-medium mb-1">
//                       City*
//                     </label>
//                     <select
//                       name="city"
//                       required
//                       className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
//                       // onChange={(e) => setSelectedState(e.target.value)}
//                     >
//                       <option value="">Select City</option>
//                       {cities?.map((city) => (
//                         <option key={city._id} value={city._id}>
//                           {city.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="flex justify-center items-center w-full gap-5 col-span-2">
//                   <Button label={"Submit"} type={"submit"} />
//                   <Button
//                     label={"Cancel"}
//                     onClick={() => {
//                       setPopup(false);
//                       formRef.current.reset();
//                       setCities([]);
//                       setStates([]);
//                       setSelectedState([]);
//                     }}
//                   />
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default LoadingUI(ClubUpdates);

// // addition of members
// // addition of events
// // addition of images
// // membership plan

// ClubUpdates.jsx

import React, { useState } from "react";
import ClubAuthSection from "./ClubAuthSection";
import ClubDashboard from "./ClubDashboard";

const ClubUpdates = () => {
  const [clubSession, setClubSession] = useState({
    verified: false,
    club: null,
  });

  return (
    <div className="bg-[#fafafa]">
      {!clubSession.verified ? (
        <ClubAuthSection setClubSession={setClubSession} />
      ) : (
        <ClubDashboard club={clubSession.club} />
      )}
    </div>
  );
};

export default ClubUpdates;
