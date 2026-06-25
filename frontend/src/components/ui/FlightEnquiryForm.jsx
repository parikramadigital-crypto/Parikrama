import { useRef } from "react";
import Button from "../Button";
import InputBox from "../InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

export const FlightBusForm = () => {
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
      alert(response.data.message);
      formRef.current.reset();
    } catch (err) {

      alert(parseErrorMessage(err.response.data));
    }
  };
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="sticky top-24 right-0 md:w-[50vw] w-full md:p-5 rounded-md py-5 px-3 bg-white shadow-2xl"
    >
      <h1 className="text-sm md:text-xl font-semibold ">
        Please fill out this form so we can get in touch with you and provide
        the best solution for your requirements.
      </h1>
      <div className="flex md:flex-row flex-col justify-center items-center gap-2">
        <InputBox
          Placeholder="Name"
          Type="text"
          LabelName="Name"
          Name="contactPersonName"
        />
        <InputBox
          Placeholder="Contact number"
          Type="text"
          LabelName="Contact number"
          Name="contactPersonPhone"
        />
      </div>
      <InputBox
        Placeholder="Email"
        Type="text"
        LabelName="Email"
        Name="contactPersonEmail"
      />
      <div className="flex md:flex-row flex-col justify-center items-center gap-2">
        <InputBox
          Name="fromCity"
          Placeholder="From which city"
          Type="text"
          LabelName="From"
        />
        <InputBox
          Name="toCity"
          Placeholder="To which city"
          Type="text"
          LabelName="To"
        />
      </div>
      <div className="flex md:flex-row flex-col justify-center items-center gap-2">
        <InputBox Name="fromDate" Type="date" LabelName="From date" />
        <InputBox Name="toDate" Type="date" LabelName="To date" />
      </div>
      <InputBox
        Placeholder="Comments if any"
        Type="text"
        LabelName="Comments"
        Name="comments"
      />
      <input
        value="flightBusHotel"
        name="enquiryType"
        // disabled={true}
        className="hidden"
        type="text"
      />
      <Button label={"Submit"} />
    </form>
  );
};
