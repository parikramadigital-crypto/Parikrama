import React from "react";
import logo from "../../assets/Logo1.png";

const ParikramaCircle = () => {
  const radius = 120;
  const centerSize = 100;

  const items = [
    "Book a Facilitator",
    "Explore Places",
    "Book Flight or Bus tickets",
    "Be a Facilitator",
    "Plan Your Journey",
  ];

  return (
    <div className="relative md:w-[400px] w-full h-[300px] mx-auto flex items-center justify-center bg-gray-200 rounded-xl shadow text-xs">
      {/* ===== CENTER CIRCLE ===== */}
      <div
        className="absolute flex items-center justify-center flex-col rounded-full bg-[#FFC20E] font-semibold shadow-lg z-20 text-center px-4"
        style={{ width: centerSize, height: centerSize }}
      >
        <img src={logo} className="w-10 h-10"/>
        Parikrama
      </div>

      {/* ===== RADIAL ITEMS ===== */}
      {items.map((item, index) => {
        const angle = (2 * Math.PI * index) / items.length;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const lineLength = Math.sqrt(x * x + y * y);

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {/* dashed line */}
            <div
              className="absolute top-1/2 right-1/2 origin-right border-t border-dashed border-gray-500"
              style={{
                width: lineLength,
                transform: `rotate(${Math.atan2(y, x)}rad)`,
              }}
            />

            {/* item card */}
            <div className="relative bg-black text-white rounded shadow text-xs text-center p-1">
              {item}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ParikramaCircle;
