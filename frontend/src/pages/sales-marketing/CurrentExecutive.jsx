import { useState, useEffect, useRef } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { useNavigate, useParams } from "react-router-dom";

const CurrentExecutive = ({ startLoading, stopLoading }) => {
  const { executiveId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const getExecutive = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `executive/current/executive/by-id/${executiveId}`,
        "get",
      );
      console.log(response.data.data);
      setData(response.data.data);
    } catch (err) {
      console.log(err.response.data);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    getExecutive();
  }, [executiveId]);

  const renderData = [
    { label: "Name", value: data?.name },
    { label: "Contact number", value: data?.contactNumber },
    { label: "Alternate contact number", value: data?.alternateContactNumber },
    { label: "Email", value: data?.email },
    {
      label: "Location",
      value: (
        <div>
          {data?.city?.name}, {data?.state?.name}
        </div>
      ),
    },
    { label: "Employee ID", value: data?.employeeId },
    {
      label: "Image",
      value: (
        <div className="w-40 h-40 overflow-hidden rounded-md">
          <img
            src={data?.image?.url}
            className="h-full w-full object-contain"
          />
        </div>
      ),
    },
    { label: "Made by", value: data?.admin?.name },
  ];

  const executiveActivity = async ({ action }) => {
    try {
      startLoading();
      const response = await FetchData(
        `executive/current/${action}/executive/${executiveId}`,
        "post",
      );
      console.log(response.data.data);
      getExecutive();
      alert(response?.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="px-20 py-10">
      <div className="pb-10 flex flex-col justify-center items-start">
        <h1 className="font-semibold text-2xl">
          Current executive details are as follows
        </h1>
        <div className="flex justify-start items-start gap-4">
          {data?.isActive === true ? (
            <Button
              label={"Suspend executive"}
              onClick={() => executiveActivity({ action: "inactive" })}
            />
          ) : (
            <Button
              label={"Activate executive"}
              onClick={() => executiveActivity({ action: "active" })}
            />
          )}
        </div>
      </div>
      <div className="w-full p-10 bg-neutral-100">
        {renderData?.map((i, index) => (
          <h1
            className={`w-full flex justify-between items-start py-3 ${renderData?.length === index + 1 ? "border-0" : "border-b"}`}
          >
            <strong>{i?.label}</strong>
            <span>{i?.value}</span>
          </h1>
        ))}
      </div>
      <div className="w-full flex justify-between items-start gap-5 py-10">
        <div className="w-1/2 text-center">
          <h1 className="font-semibold text-2xl pb-10">
            Food place listings ({data?.foodPlace?.length})
          </h1>
          <div className="w-full bg-neutral-100 flex-col flex gap-2">
            {data?.foodPlace?.map((i, index) => (
              <div className="flex w-full justify-between items-center gap-2 px-10 py-2">
                <h1>
                  {index + 1}. {i?.name}
                </h1>
                <Button
                  label={"View"}
                  onClick={() => navigate(`/current/food-court/${i?._id}`)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 text-center">
          <h1 className="font-semibold text-2xl pb-10">
            Facilitators ({data?.facilitator?.length})
          </h1>
          <div className="w-full bg-neutral-100 flex-col flex gap-2">
            {data?.facilitator?.map((i, index) => (
              <div className="flex w-full justify-between items-center gap-2 px-10 py-2">
                <h1>
                  {index + 1}. {i?.name}
                </h1>
                <Button
                  label={"View"}
                  onClick={() => navigate(`/current/facilitator/${i?._id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentExecutive);
