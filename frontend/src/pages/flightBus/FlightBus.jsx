import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const FlightBus = ({ stopLoading, startLoading }) => {
  const [rightBanner, setRightBanner] = useState([]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);
  const formRef = useRef();

  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setRightBanner(response.data.data.promotionsMid);
      // setTopBanner(response.data.data.promotionsMax);
      // setTopBannerMobile(response.data.data.promotionsMaxMobile);
      // setLeftBanner(response.data.data.promotionsMin);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    banner();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        "enquiry/guest/create-enquiry",
        "post",
        formData,
      );
      console.log(response);
      alert(response.data.message);
      formRef.current.reset();
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full flex-col">
      <h1 className="text-xl md:text-3xl font-semibold md:py-40 py-6 text-center">
        Parikrama <br /> Welcomes you to Travel and Explore places together
      </h1>
      <div className="flex justify-center md:justify-between items-center md:items-start w-full md:px-20 flex-col md:flex-row">
        <div className="md:w-96 w-[90vw] h-96 rounded-xl overflow-hidden flex justify-center items-center flex-col gap-5 lg:sticky top-24 left-0">
          <h1 className="font-semibold text-xl">Book Flight, Bus or Hotels</h1>
          <RandomImageSlider images={right} />
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="md:w-[50vw] w-[90vw] md:shadow md:p-10 rounded-md py-10"
        >
          <h1 className="text-xl font-semibold">
            Please fill out this form so we can get in touch with you and
            provide the best solution for your requirements..
          </h1>
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
          <InputBox
            Placeholder="Email"
            Type="text"
            LabelName="Email"
            Name="contactPersonEmail"
          />
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
          <InputBox Name="fromDate" Type="date" LabelName="From date" />
          <InputBox Name="toDate" Type="date" LabelName="To date" />
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
      </div>
    </div>
  );
};

export default LoadingUI(FlightBus);
