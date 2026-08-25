// import React from "react";
// import logo from "../../assets/Logo1.png";
// import { Link } from "react-router-dom";

// const ParikramaCircle = () => {
//   const radius = 120;
//   const centerSize = 100;

//   const items = [
//     { title: "Register as Facilitator", url: "/login/facilitator" },
//     { title: "Book a Facilitator", url: "/" },
//     { title: "Explore Places", url: "/explore" },
//     { title: "Book Flight Tickets", url: "/flights-busses" },
//     { title: "Book Bus Tickets", url: "/flights-busses" },
//     { title: "Travel package", url: "/travel-packages" },
//   ];

//   return (
//     <div className="relative md:w-[400px] w-full h-[300px] mx-auto flex items-center justify-center bg-gray-200 rounded-xl shadow text-xs">
//       {/* ===== CENTER CIRCLE ===== */}
//       <div
//         className="absolute flex items-center justify-center flex-col rounded-full bg-[#FFC20E] font-semibold shadow-lg z-20 text-center px-4"
//         style={{ width: centerSize, height: centerSize }}
//       >
//         <img src={logo} className="w-10 h-10" />
//         Parikrama
//       </div>

//       {/* ===== RADIAL ITEMS ===== */}
//       {items.map((item, index) => {
//         const angle = (2 * Math.PI * index) / items.length;

//         const x = radius * Math.cos(angle);
//         const y = radius * Math.sin(angle);

//         const lineLength = Math.sqrt(x * x + y * y);

//         return (
//           <div
//             key={index}
//             className="absolute flex flex-col items-center"
//             style={{
//               transform: `translate(${x}px, ${y}px)`,
//             }}
//           >
//             {/* dashed line */}
//             <div
//               className="absolute top-1/2 right-1/2 origin-right border-t border-dashed border-gray-500"
//               style={{
//                 width: lineLength,
//                 transform: `rotate(${Math.atan2(y, x)}rad)`,
//               }}
//             />

//             {/* item card */}
//             <Link
//               to={item.url}
//               className="relative bg-black text-white rounded shadow text-xs text-center p-1"
//             >
//               {item.title}
//             </Link>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ParikramaCircle;

// import { Link } from "react-router-dom";
// import logo from "../../assets/Logo1.png";

// const ParikramaCircle = () => {
//   // responsive circle size
//   const size = Math.min(window.innerWidth * 0.9, 390);

//   const center = size / 2;
//   const radius = size * 0.32;
//   const centerCircle = size * 0.25;

//   const items = [
//     {
//       title: "Register as Facilitator",
//       url: "/login/facilitator",
//     },
//     { title: "Book Bus Tickets", url: "/flights-busses" },
//     { title: "Explore Places", url: "/explore" },
//     { title: "Travel package", url: "/travel-packages" },
//     { title: "Book a Facilitator", url: "/" },
//     { title: "Book Flight Tickets", url: "/flights-busses" },
//   ];

//   return (
//     <div className="flex justify-center items-center py-10 px-4">
//       <div
//         className="relative rounded-full bg-white shadow-xl border border-black/5"
//         style={{ width: size, height: size }}
//       >
//         {/* Center Logo */}
//         <div
//           className="absolute rounded-full flex flex-col items-center justify-center bg-[#FFC20E] text-white z-20 shadow-lg"
//           style={{
//             width: centerCircle,
//             height: centerCircle,
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//           }}
//         >
//           <img src={logo} className="w-9 h-9" />
//           {/* <p className="uppercase text-black text-xs font-semibold">
//             Parikrama
//           </p> */}
//         </div>

//         {/* Divider Lines */}
//         {[...Array(8)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute bg-black/10"
//             style={{
//               width: 2,
//               height: "100%",
//               left: "50%",
//               top: 0,
//               transform: `rotate(${i * 60}deg)`,
//               transformOrigin: "center",
//             }}
//           />
//         ))}

//         {/* Items */}
//         {items.map((item, i) => {
//           const angle = (i * 360) / items.length;
//           const rad = (angle * Math.PI) / 180;

//           const x = center + radius * Math.cos(rad) - 60;
//           const y = center + radius * Math.sin(rad) - 15;

//           return (
//             <Link
//               key={i}
//               to={item.url}
//               className="absolute text-xs hover:bg-[#FFC20E] text-center p-2 rounded-md hover:shadow-2xl shadow-black hover:scale-105 duration-300 ease-in-out"
//               style={{
//                 left: x,
//                 top: y,
//               }}
//             >
//               {item.title}
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ParikramaCircle;

import React from "react";

import {
  FaUserPlus,
  FaPlane,
  FaMapMarkedAlt,
  FaStore,
  FaUsers,
  FaUserFriends,
  FaArrowRight,
} from "react-icons/fa";

const ParikramaCircle = () => {
  const options = [
    {
      id: 1,
      title: "Register",
      highlight: "Here",
      description: "Create your account and get started",
      icon: FaUserPlus,
      color: "#2F80ED",
      bg: "#F4F8FF",
    },

    {
      id: 2,
      title: "Book Travel",
      highlight: "Packages",
      description: "Discover and book amazing travel deals",
      icon: FaPlane,
      color: "#F59E0B",
      bg: "#FFF9EF",
    },

    {
      id: 3,
      title: "List famous",
      highlight: "Places",
      description: "Explore top places around you",
      icon: FaMapMarkedAlt,
      color: "#65B741",
      bg: "#F7FCF4",
    },

    {
      id: 4,
      title: "List famous",
      highlight: "Food shop",
      description: "Find popular food shops near you",
      icon: FaStore,
      color: "#EC4D82",
      bg: "#FFF6F9",
    },

    {
      id: 5,
      title: "Join",
      highlight: "Club",
      description: "Join exclusive clubs and enjoy benefits",
      icon: FaUsers,
      color: "#8052C7",
      bg: "#FAF7FF",
    },

    {
      id: 6,
      title: "Join",
      highlight: "Community",
      description: "Be a part of our growing community",
      icon: FaUserFriends,
      color: "#179BAD",
      bg: "#F3FBFC",
    },
  ];

  return (
    <section className="w-full lg:w-[35vw] bg-white flex items-center justify-center py-2">
      <div className="relative w-full max-w-3xl bg-white rounded-4xl shadow-xl p-4 md:p-6">
        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((item, index) => {
            const Icon = item.icon;
            const isOdd = item.id % 2 === 1;

            return (
              <div
                key={index}
                className={`relative min-h-33 overflow-hidden shadow-lg flex items-center p-2 md:p-4 ${
                  item.id === 3
                    ? "rounded-r-full"
                    : item.id === 4
                      ? "rounded-l-full"
                      : "rounded-lg"
                } `}
                style={{
                  backgroundColor: item.bg,
                }}
              >
                {/* Left Line */}

                <div
                  className={`absolute  top-8 bottom-8 w-1  ${isOdd ? `left-0 rounded-r-full ` : ` right-0 rounded-l-full`}`}
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                {/* Dots */}

                <div className="absolute top-7 right-7 grid grid-cols-4 gap-2 opacity-20">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />
                  ))}
                </div>

                {/* Icon */}

                <div
                  className={`w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center border-3 border-white shadow-md shrink-0 ${item.id === 4 ? `ml-2` : ``}`}
                  style={{
                    backgroundColor: `${item.color}18`,
                  }}
                >
                  <Icon
                    className="text-2xl md:text-3xl"
                    style={{
                      color: item.color,
                    }}
                  />
                </div>

                {/* Content */}

                <div className="ml-3 md:ml-4 pr-7">
                  <h2 className="text-xs md:text-[14px] font-bold text-slate-900 leading-tight">
                    {item.title}
                    <br />
                    {item.highlight}
                  </h2>

                  <p className="mt-2 text-xs md:text-[13px] text-gray-500 leading-snug block lg:hidden">
                    {item.description}
                  </p>
                </div>

                {/* Arrow */}

                <button
                  className="absolute bottom-4 right-4 w-7 h-7 rounded-full text-white flex items-center justify-center"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  <FaArrowRight />
                </button>
              </div>
            );
          })}
        </div>

        {/* Center Logo */}

        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-23 h-23 rounded-full bg-white shadow-xl flex items-center justify-center">
            <div className="w-23 h-23 rounded-full bg-[#FFB800] shadow-sm shadow-[#FFB800] border-8 border-white flex items-center justify-center">
              <div className="w-17 h-17 rounded-full flex items-center justify-center">
                <img
                  src={
                    "https://ik.imagekit.io/parikrama/ChatGPT%20Image%20Aug%208,%202026,%2012_57_14%20PM.png"
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParikramaCircle;
