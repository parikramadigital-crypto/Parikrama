import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { motion, AnimatePresence } from "framer-motion";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { addUser, clearUser } from "../../redux/slices/authSlice";

const UserRegisterLogin = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState();
  const [newUser, setNewUser] = useState();
  const [modelOTP, openModelOTP] = useState(false);
  const [loginComp, setLoginComp] = useState(false);
  const [error, setError] = useState();

  const showError = (message) => {
    setError(message);

    setTimeout(() => {
      setError("");
    }, 3000); // disappears after 3 seconds
  };

  const validatePhone = (phone) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
  };

  const handleUserRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const contactNumber = formData.get("contactNumber");

      if (!validatePhone(contactNumber)) {
        alert("Please enter a valid contact number");
        formRef.current.reset();
        return;
      }
      const response = await FetchData("users/create-user", "post", formData);
      console.log(response);
      setOtp(response.data.data.otp);
      setNewUser(response.data.data.newUser);
    } catch (err) {
      console.log(err);
      showError(parseErrorMessage(err.response.data));
    }
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const contactNumber = formData.get("contactNumber");

      if (!validatePhone(contactNumber)) {
        alert("Please enter a valid contact number");
        formRef.current.reset();
        return;
      }
      const response = await FetchData("users/login-user", "post", formData);
      console.log(response);
      setOtp(response.data.data.otp);
      setNewUser(response.data.data.user);
    } catch (err) {
      console.log(err);
      showError(parseErrorMessage(err.response.data));
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData("users/verify-user", "post", formData);

      console.log(response);

      if (response.data.success) {
        const { user, tokens } = response.data.data;
        console.log(user);

        localStorage.setItem("AccessToken", tokens.accessToken);
        localStorage.setItem("RefreshToken", tokens.refreshToken);
        localStorage.setItem("role", "User");

        dispatch(clearUser());
        dispatch(addUser(user));
        openModelOTP(false);
        formRef.current.reset();
      }
      alert(response.data.message);
      navigate("/user/dashboard");
    } catch (err) {
      showError(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div className={`flex justify-center items-center w-full`}>
      {error && (
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="bg-red-400 text-black w-96 p-3 fixed top-24 rounded-md shadow-2xl text-center"
        >
          {error}
        </motion.h1>
      )}
      <div className={`shadow-xl rounded-2xl p-6 w-full md:w-96`}>
        {/* Toggle Buttons */}
        <div className="flex mb-6 rounded-xl overflow-hidden">
          <button
            onClick={() => setLoginComp(true)}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              loginComp ? "bg-[#FFC20E]" : "bg-gray-100 text-gray-700"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setLoginComp(false)}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              !loginComp ? "bg-[#FFC20E]" : "bg-gray-100 text-gray-700"
            }`}
          >
            Login
          </button>
        </div>

        {/* Animated Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loginComp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full flex justify-center items-center "
          >
            {loginComp ? (
              <form ref={formRef} className="w-full">
                <InputBox
                  LabelName="Enter your mobile number"
                  Name="contactNumber"
                  Placeholder="Enter contact number"
                  Type="text"
                />
                {otp ? (
                  <div>
                    <InputBox LabelName="Enter OTP" Name="otp" />
                    <InputBox
                      Value={newUser._id}
                      className="hidden"
                      Name="userId"
                    />
                    <Button label={"Confirm"} onClick={handleOtp} />
                  </div>
                ) : (
                  <Button
                    label={"Submit"}
                    className={"w-full"}
                    onClick={handleUserRegister}
                  />
                )}
              </form>
            ) : (
              <form ref={formRef} className="w-full">
                <InputBox
                  LabelName="Enter your mobile number"
                  Name="contactNumber"
                  Placeholder="Enter contact number"
                  Type="text"
                />
                {otp ? (
                  <div>
                    <InputBox LabelName="Enter OTP" Name="otp" />
                    <InputBox
                      Value={newUser._id}
                      className="hidden"
                      Name="userId"
                    />
                    <Button label={"Confirm"} onClick={handleOtp} />
                  </div>
                ) : (
                  <Button
                    label={"Submit"}
                    className={"w-full"}
                    onClick={handleUserLogin}
                  />
                )}
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserRegisterLogin;
