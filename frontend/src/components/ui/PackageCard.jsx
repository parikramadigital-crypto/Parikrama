import { useRef, useState } from "react";
import InputBox from "../InputBox";
import Button from "../Button";
import { packagesInputs } from "../../constants/Constants";
import { FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PackageCard = ({ data }) => {
  const [model, setModel] = useState(false);
  const [model2, setModel2] = useState(false);
  const formRef = useRef();

  const handleSubmit = () => {
    alert("We will reach you out soon !");
    formRef.current.reset();
    setModel(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-200">
      {/* Image */}
      <div className="h-52 overflow-hidden">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{data.title}</h3>

        <p className="text-gray-500 text-sm">{data.duration}</p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {data.tags?.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex justify-between items-end pt-3 border-t">
          <div>
            <p className="text-xs text-gray-400 flex justify-center items-center gap-2">
              Starting Price{" "}
              <button onClick={() => setModel2(true)}>
                <FaInfoCircle className="text-black text-base hover:text-red-600 duration-300 ease-in-out" />
              </button>
            </p>
            <p className="text-xl font-bold">₹ {data.price.toLocaleString()}</p>
          </div>

          <button
            onClick={() => setModel(true)}
            className="text-[#FFC20E] font-semibold"
          >
            Book Now →
          </button>
        </div>
      </div>
      <AnimatePresence>
        {model && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="bg-black/80 h-screen w-full fixed top-0 left-0 z-50 flex md:justify-center items-center flex-col gap-5 overflow-scroll py-5"
          >
            <h1 className="text-base md:text-2xl font-bold text-center text-neutral-200">
              We are happy that showed interest in{" "}
              <span className="bg-[#FFC20E] py-1 px-3 rounded-full text-black">
                {data.title}
              </span>{" "}
              package.
            </h1>
            <span className="text-neutral-200">
              Please fill out this form so we can get in touch with you
              regarding your requirements.
            </span>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white w-[90vw] md:w-[70vw] p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {packagesInputs.map((i) => (
                <InputBox
                  Placeholder={i.placeHolder}
                  Name={i.name}
                  LabelName={i.label}
                  Type={i.type}
                />
              ))}
              <InputBox
                Placeholder={"Explain your all requirements"}
                Name={"description"}
                LabelName={"Enter your description"}
                Type={"text"}
                Required={false}
              />
              <div className="w-full h-full flex justify-evenly items-center">
                <Button label={"Submit"} type={"submit"} />
                <Button label={"Cancel"} onClick={() => setModel(false)} />
              </div>
            </form>
          </motion.div>
        )}
        {model2 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="bg-black/80 h-screen w-full fixed top-0 left-0 z-50 flex md:justify-center items-center flex-col gap-5 overflow-scroll py-5"
          >
            <div className="bg-white p-5 rounded-md flex justify-center items-center gap-5 flex-col">
              <h1>For updated trip details please contact our trip advisor.</h1>
              <Button label={"Ok"} onClick={() => setModel2(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackageCard;
