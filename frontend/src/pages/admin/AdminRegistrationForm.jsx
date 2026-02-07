import React, { useRef } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRegistrationForm = ({ startLoading, stopLoading, onCancel }) => {
  const formRef = useRef();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    // for (let pair of data.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }

    try {
      startLoading();
      const response = await FetchData(
        `admin/register/${user?._id}`,
        "post",
        data,
        // true
      );
      alert("Admin Registered Successfully");
      // navigate("/admin/dashboard");
      formRef.current.reset();
    } catch (err) {
      alert(parseErrorMessage(err?.response?.data));
    } finally {
      stopLoading();
    }
  };
  return user && user?.role === "Admin" ? (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white p-8 max-w-3xl mx-auto shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Register Admin</h2>
      <h2 className="">
        <strong>Note: </strong>Kindly note-down the Email and Password before
        submitting form
      </h2>

      <div className="md:grid-cols-3 grid md:gap-2">
        <InputBox LabelName="Name" Name="name" required />
        <InputBox LabelName="Employee ID" Name="employeeId" required />
        <InputBox LabelName="Email" Name="email" Type="email" required />
        <InputBox LabelName="Phone Number" Name="phoneNumber" required />
        <InputBox
          LabelName="Password"
          Name="password"
          Type="password"
          required
        />
      </div>

      <div className="flex justify-center items-center gap-5">
        <Button
          label="Cancel"
          type="reset"
          className="mt-4 bg-gray-300 text-black"
          onClick={onCancel}
        />
        <Button label="Reset" type="reset" className="mt-4" />
        <Button label="Register Admin" type="submit" className="mt-4" />
      </div>
    </form>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !!
      </h2>
    </div>
  );
};

export default LoadingUI(AdminRegistrationForm);
