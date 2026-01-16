import React from "react";
import InputBox from "../InputBox";
import { useState } from "react";
import Button from "../Button";
import { useRef } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../LoadingUI";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const NewState = ({ startLoading, stopLoading }) => {
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [states, setStates] = useState([]);
  const formRef = useRef();
  //   console.log(states);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        startLoading();
        const res = await FetchData("states", "get");
        setStates(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        stopLoading();
      }
    };
    fetchStates();
  }, []);

  const addNewState = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        "states/add/new/state",
        "post",
        formData
      );
      setSuccess(response.data.data.message);
      formRef.current.reset();
      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message || "Something went wrong");
    } finally {
      stopLoading();
    }
  };

  return user ? (
    <div className="w-full ">
      <h1>Add New State</h1>
      {states?.length === 36 ? (
        ""
      ) : (
        <form ref={formRef} onSubmit={addNewState}>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <div>
            <InputBox
              Placeholder="State name"
              LabelName="State Name"
              Name="name"
            />
            <InputBox
              Placeholder="Eg: MP, RJ, etc"
              LabelName="State Code"
              Name="code"
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <Button label={"Cancel"} />
            <Button label={"Submit"} type={"submit"} />
          </div>
        </form>
      )}

      {states?.length === 36 ? (
        <div className="flex flex-wrap">
          <h1 className="font-semibold">
            All {states?.length} states are listed you cannot add more !
          </h1>
          <div className="flex flex-wrap">
            {states?.map((state) => (
              <h1 className="bg-neutral-200 px-2 py-1 mx-1 my-1 rounded-full">
                {state.name}
              </h1>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !! Please log in to view the dashboard.
      </h2>
    </div>
  );
};

export default LoadingUI(NewState);
