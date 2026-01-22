import React, { useEffect, useRef, useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RandomImageSlider = ({ images = [], className = "", speed = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const hasMultipleImages = images.length > 1;

  const getRandomIndex = (excludeIndex) => {
    if (!hasMultipleImages) return 0;

    let newIndex = excludeIndex;
    while (newIndex === excludeIndex) {
      newIndex = Math.floor(Math.random() * images.length);
    }
    return newIndex;
  };

  const stopSlider = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startSlider = () => {
    if (!hasMultipleImages) return;

    stopSlider();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => getRandomIndex(prev));
    }, speed);
  };

  const goToNext = () => {
    if (!hasMultipleImages) return;
    stopSlider();
    setCurrentIndex((prev) => getRandomIndex(prev));
    startSlider();
  };

  const goToPrevious = () => {
    if (!hasMultipleImages) return;
    stopSlider();
    setCurrentIndex((prev) => getRandomIndex(prev));
    startSlider();
  };

  useEffect(() => {
    startSlider();
    return stopSlider;
  }, [images.length]);

  if (!images.length) {
    return (
      <div
        className={`relative w-full h-full bg-neutral-200 rounded-xl ${className}`}
        style={{ minHeight: "200px" }}
      />
    );
  }

  return (
    <div
      className={`relative w-full mx-auto h-full overflow-hidden rounded-xl shadow-lg ${className}`}
      style={{ minHeight: "200px" }}
      onMouseEnter={() => {
        setIsHovered(true);
        stopSlider();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        startSlider();
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt="Slide"
          className="w-full h-full object-cover absolute top-0 left-0 rounded-xl bg-neutral-700"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {isHovered && hasMultipleImages && (
        <>
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 text-black p-2 rounded-full transition"
            onClick={goToPrevious}
          >
            <FaChevronLeft size={24} />
          </button>

          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 text-black p-2 rounded-full transition"
            onClick={goToNext}
          >
            <FaChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default RandomImageSlider;
