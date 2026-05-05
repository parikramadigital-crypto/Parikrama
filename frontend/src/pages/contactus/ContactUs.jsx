import React, { useRef } from "react";
import { contactUsFormInputs } from "../../constants/Constants";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import Logo from "../../assets/Logo1.png";
import { Link } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const ContactUs = () => {
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        "enquiry/guest/create-enquiry",
        "post",
        formData,
      );
      alert(response.data.data.message);
      formRef.current.reset();
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div className="flex justify-around items-center w-full p-5">
      <div className="w-full md:w-[50vw] md:flex flex-col justify-center items-center hidden gap-20">
        <img src={Logo} className="w-48" />
        <div className="flex flex-col justify-center items-center">
          <h1>
            <strong>Address: </strong>C-25, 2nd Floor, C Block, Sector 58,
            Noida, Uttar Pradesh 201309
          </h1>
          <h1>
            <strong>Contact: </strong>
            <Link
              to={
                "https://mail.google.com/mail/?view=cm&fs=1&to=connect@parikramaglobal.com"
              }
              target="blank"
            >
              connect@parikramaglobal.com
            </Link>
          </h1>
        </div>
      </div>
      <div className="w-full md:w-[50vw]">
        <p className="font-semibold text-xl">Contact form</p>
        <form ref={formRef} onSubmit={handleSubmit}>
          {contactUsFormInputs.map((i) => (
            <InputBox
              LabelName={i.label}
              Name={i.name}
              Placeholder={i.placeHolder}
              Type={i.placeHolder}
            />
          ))}
          <input
            name="enquiryType"
            value="ContactUsForm"
            // disabled={true}
            className="hidden"
            type="text"
          />
          <div className="flex justify-center items-center w-full md:col-span-2">
            <div className="py-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                placeholder="Write a short description about your help..."
                name="comments"
                rows="6"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
              />
            </div>
          </div>
          <Button label={"Submit"} type={"submit"} className={"w-full"} />
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
