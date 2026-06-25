import React, { useRef, useState, useEffect } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import { useNavigate } from "react-router-dom";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";

const AddCountry = ({ startLoading, stopLoading, onCancel, adminId }) => {
  const formRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `country/admin/create-country/${adminId}`,
        "post",
        formData,
      );
      alert(response.data.message);
      formRef.current.reset();
      onCancel();
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };
  return (
    <div className="bg-white p-5 rounded-md flex flex-col justify-center items-center w-[50vw]">
      <h1 className="text-2xl font-semibold">Add new country</h1>
      <form ref={formRef} className="w-full" onSubmit={handleSubmit}>
        <InputBox
          Name="name"
          LabelName="Enter country name"
          Placeholder="Country name"
          Type="text"
        />
        <InputBox
          Name="code"
          LabelName="Enter country code"
          Placeholder="Country code"
          Type="text"
        />
        <InputBox
          Name="totalStates"
          LabelName="Total states in this country"
          Placeholder="Total states in this country"
          Type="number"
        />
        <div className="flex justify-center items-center gap-5 w-full">
          <Button label={"Cancel"} onClick={onCancel} />
          <Button label={"Submit"} type={"submit"} />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(AddCountry);
