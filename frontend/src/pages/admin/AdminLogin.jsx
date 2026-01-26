import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../../redux/slices/authSlice";

const AdminLogin = ({ startLoading, stopLoading }) => {
  const formRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
    try {
      startLoading();
      const res = await FetchData("admin/login", "post", formData);
      console.log(res);
      if (res.data.success) {
        const { admin, tokens } = res.data.data;

        localStorage.setItem("AccessToken", tokens.AccessToken);
        localStorage.setItem("RefreshToken", tokens.RefreshToken);
        localStorage.setItem("role", "Admin");

        dispatch(clearUser());
        dispatch(addUser(admin));

        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.log(err);
      // setError(parseErrorMessage(err?.response?.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <InputBox LabelName="Email" Name="email" Type="email" required />
        <InputBox
          LabelName="Password"
          Name="password"
          Type="password"
          required
        />

        <Button label="Login" type="submit" className="w-full mt-4" />
      </form>
    </div>
  );
};

export default LoadingUI(AdminLogin);
