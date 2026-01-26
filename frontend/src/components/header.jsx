import { useSelector } from "react-redux";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo1.png";
import logo2 from "../assets/Logo2.png";
import { CiMenuFries } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState(false);

  const LinkNavigate = (link) => {
    navigate(link);
    setPopup(false);
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link to={"/"} className="flex items-center">
          <img src={logo} className="w-10" />
          <img src={logo2} className="w-20" />
        </Link>

        <button onClick={() => setPopup(true)}>
          <CiMenuFries className="font-bold text-xl" />
        </button>
      </div>
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-end"
          >
            <div
              className="bg-black/80 w-full h-full"
              onClick={() => setPopup(false)}
            ></div>
            <div className="md:w-1/2 w-[90%] bg-white flex justify-between items-start flex-col h-full py-20 px-20">
              <div className="flex justify-center items-center gap-5 p-5">
                <Button
                  label={
                    <h1 className="flex justify-center items-center">
                      <IoMdClose /> Close
                    </h1>
                  }
                  onClick={() => setPopup(false)}
                />
              </div>
              {/* logo  */}
              <div className="flex items-center justify-center flex-col w-full">
                <img src={logo} className="w-40" />
                <img src={logo2} className="w-40" />
              </div>
              <div className="flex flex-col justify-center items-center w-full gap-5">
                <Button
                  label={"Facilitator Login"}
                  onClick={() => LinkNavigate("/login/facilitator")}
                />

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-4">
                  {user ? (
                    <Link
                      to={`/admin/dashboard`}
                      className="bg-[#FFC20E] px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out "
                    >
                      {window.location.pathname === "/"
                        ? "Go to Dashboard"
                        : `Welcome ${user.name}`}
                    </Link>
                  ) : (
                    <Button
                      label="Admin Login"
                      onClick={() => LinkNavigate("/login")}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
