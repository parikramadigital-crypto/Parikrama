import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("We will reach you out");
    formRef.current.reset();
  };

  return (
    <div className="flex justify-between items-center w-full md:px-20 px-20 h-full flex-col md:flex-row gap-5">
      <div className="md:w-96 w-[90vw] h-96 rounded-xl overflow-hidden flex justify-center items-center flex-col gap-5">
        <h1 className="font-semibold text-xl">Book Flight, Bus or Hotels</h1>
        <RandomImageSlider images={right} />
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="md:w-[50vw] w-[90vw] shadow p-10 rounded-md"
      >
        <InputBox Placeholder="Name" Type="text" LabelName="Name" />
        <InputBox
          Placeholder="Contact number"
          Type="text"
          LabelName="Contact number"
        />
        <InputBox Placeholder="Email" Type="text" LabelName="Email" />
        <InputBox
          Placeholder="Comments if any"
          Type="text"
          LabelName="Comments"
        />
        <Button label={"Submit"} />
      </form>
    </div>
  );
};

export default LoadingUI(FlightBus);
