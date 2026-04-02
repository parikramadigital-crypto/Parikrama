import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { clearUser } from "../../redux/slices/authSlice";

const CommunityDashboard = ({
  startLoading,
  stopLoading,
  showQuickActions = true,
}) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [personalData, setPersonalData] = useState();
  const [communityData, setCommunityData] = useState();
  const [bankData, setBankData] = useState();
  const [imageData, setImageData] = useState();

  const CSSClassName =
    "w-full flex flex-col justify-center items-center shadow p-5 bg-neutral-200 gap-4 rounded-xl ";
  const CSSClassNameP =
    "w-full flex justify-between items-center border-b border-neutral-300";

  const DashboardData = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `communities/community/details/${user?._id}`,
        "get",
      );
      setData(response.data.data);
      setPersonalData(response.data.data.personalDetails);
      setCommunityData(response.data.data.communityDetails);
      setBankData(response.data.data.communityDetails.bankDetails);
      setImageData(response.data.data.images);
    } catch (err) {
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    DashboardData();
  }, [user]);

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    alert("You are logged out successfully");
    navigate("/");
  };

  return (
    <div className="lg:px-40 flex flex-col justify-center items-center gap-10 py-10">
      {showQuickActions === true ? (
        <div className={`${CSSClassName}`}>
          <h1>Quick actions</h1>
          <div className="flex justify-center items-center gap-10">
            {/* <Button label={"Add new member"} /> */}
            <Button label={"Logout"} onClick={() => logout()} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className={`${CSSClassName}`}>
        <h1 className="font-semibold text-xl">Personal details</h1>
        <div className="w-28 lg:w-60 h-28 lg:h-60 bg-neutral-400 rounded-full overflow-hidden shadow-2xl">
          <img src={imageData?.profileImage?.url} className="w-full h-full" />
        </div>
        <p className={`${CSSClassNameP}`}>
          <strong>Name: </strong>
          {personalData?.name}
        </p>
        <p className={`${CSSClassNameP}`}>
          <strong>Email: </strong>
          {personalData?.email}
        </p>
        <p className={`${CSSClassNameP}`}>
          <strong>Contact number: </strong>
          {personalData?.contactNumber}
        </p>
        {personalData?.aadhar ? (
          <p className={`${CSSClassNameP}`}>
            <strong>Aadhar details: </strong>
            {personalData?.aadhar}
          </p>
        ) : (
          ""
        )}
        {personalData?.pan ? (
          <p className={`${CSSClassNameP}`}>
            <strong>Pan details</strong>
            {personalData?.pan || "No data"}
          </p>
        ) : (
          ""
        )}
      </div>
      <div className={`${CSSClassName}`}>
        <h1 className="font-semibold text-xl">Community details</h1>
        <div className="w-28 lg:w-60 h-28 lg:h-60 bg-neutral-400 rounded-full overflow-hidden shadow-2xl">
          <img src={imageData?.companyLogo?.url} className="w-full h-full" />
        </div>
        <p className={`${CSSClassNameP}`}>
          <strong>Name: </strong>
          {communityData?.communityName}
        </p>
        {data?.communityEstablishment ? (
          <p className={`${CSSClassNameP}`}>
            <strong>Community establishment year: </strong>
            {data?.communityEstablishment}
          </p>
        ) : (
          ""
        )}
        {communityData?.communityEmail ? (
          <p className={`${CSSClassNameP}`}>
            <strong>Email: </strong>
            {communityData?.communityEmail}
          </p>
        ) : (
          ""
        )}
        <p className={`${CSSClassNameP}`}>
          <strong>Contact number: </strong>
          {communityData?.communityContactNumber}
        </p>
        {communityData?.gst ? (
          <p className={`${CSSClassNameP}`}>
            <strong>G.S.T.: </strong>
            {communityData?.gst}
          </p>
        ) : (
          ""
        )}
        <p className={`${CSSClassNameP}`}>
          <strong>Profession</strong>
          {communityData?.profession}
        </p>
      </div>
      {bankData?.bankName &&
      bankData?.ifsc &&
      bankData?.accountNumber &&
      bankData?.accountHolderName ? (
        <div className={`${CSSClassName}`}>
          <h1 className="font-semibold text-xl">Bank details</h1>
          <p className={`${CSSClassNameP}`}>
            <strong>Account holder name: </strong>
            {bankData?.accountHolderName}
          </p>
          <p className={`${CSSClassNameP}`}>
            <strong>Account number: </strong>
            {bankData?.accountNumber}
          </p>
          <p className={`${CSSClassNameP}`}>
            <strong>Bank name: </strong>
            {bankData?.bankName}
          </p>
          <p className={`${CSSClassNameP}`}>
            <strong>IFSC: </strong>
            {bankData?.ifsc}
          </p>
        </div>
      ) : (
        ""
      )}
      {data?.about ? (
        <div className={`${CSSClassName}`}>
          <h1 className="font-semibold text-xl">About your community</h1>
          <p>{data?.about}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoadingUI(CommunityDashboard);
