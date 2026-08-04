import { useState, useEffect, useRef } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { useNavigate } from "react-router-dom";
import { ExecutiveInputs } from "../../constants/Constants";
import LoadingUI from "../../components/LoadingUI";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const RegisterExecutive = ({
  startLoading,
  stopLoading,
  onClose,
  adminId,
  handleReload,
}) => {
  const formRef = useRef();
  const [preview, setPreview] = useState([]);

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.length > 1) {
      alert("Maximum 1 image allowed");
      e.target.value = "";
      setPreview(null);
      return;
    }

    const file = files[0];

    const MAX_SIZE = 2 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert("File size must be less than 1 MB");
      e.target.value = "";
      setPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      e.target.value = "";
      setPreview(null);
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `executive/add/register/new-executive/${adminId}`,
        "post",
        formData,
        true,
      );
      console.log(response);
      alert(response.data.message);
      onClose();
      handleReload();
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="bg-neutral-50 rounded-xl flex flex-col justify-center items-center w-3/4 p-10">
      <h1 className="text-xl font-semibold ">Register new executive</h1>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-5 w-full"
      >
        <div className="grid grid-cols-2 place-items-center gap-2 w-full">
          {ExecutiveInputs.map((i, index) => (
            <InputBox
              LabelName={i.label}
              Name={i.name}
              Type={i.type}
              PasswordIndication={i.passwordTrue}
            />
          ))}
          <div className="md:col-span-2 bg-gray-200 py-5 px-2 rounded-xl overflow-hidden">
            <label className="block text-sm font-medium mb-1">
              Profile Picture*
            </label>
            <input
              required={false}
              type="file"
              name="companyLogo"
              accept="image/*"
              onChange={handleImage}
              className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
            />
            {preview?.length > 0 && (
              <img src={preview} className="w-32 mt-2 rounded" />
            )}
          </div>
        </div>
        <div className="flex justify-center items-center gap-10">
          <Button label={"Cancel"} normal={false} onClick={onClose} />
          <Button label={"Submit"} type={"submit"} />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(RegisterExecutive);
