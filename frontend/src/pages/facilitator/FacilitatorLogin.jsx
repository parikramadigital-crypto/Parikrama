import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { addUser, clearUser } from "../../redux/slices/authSlice";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const FacilitatorLogin = ({ startLoading, stopLoading }) => {
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(formRef.current);
    // const payload = Object.fromEntries(formData.entries());

    try {
      startLoading();
      const res = await FetchData("facilitator/login", "post", formData);
      console.log(res);

      if (res.data.success) {
        const { facilitator, tokens } = res.data.data;

        localStorage.setItem("AccessToken", tokens.accessToken);
        localStorage.setItem("RefreshToken", tokens.refreshToken);
        localStorage.setItem("role", "Facilitator");

        dispatch(clearUser());
        dispatch(addUser(facilitator));

        navigate("/facilitator/dashboard");
      }
    } catch (err) {
      setError(parseErrorMessage(err?.response?.data) || "Login failed");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Facilitator Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 fixed top-36 right-10 bg-white px-4 py-2 rounded shadow z-50">
            {error}
          </p>
        )}

        <InputBox
          LabelName="Email or Phone"
          Name="email"
          Placeholder="Email or Phone"
          required
        />

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

export default LoadingUI(FacilitatorLogin);
