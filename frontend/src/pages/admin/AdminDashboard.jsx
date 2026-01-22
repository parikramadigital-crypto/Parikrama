import React, { useEffect, useState } from "react";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slices/authSlice";
import { City, Place, State } from "../../components/ui/TableUI";

const AdminDashboard = ({ startLoading, stopLoading }) => {
  const [placeData, setPlaceData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchDashboard = async () => {
    try {
      startLoading();
      const res = await FetchData("admin/dashboard/data", "get");
      setPlaceData(res.data.data.place);
      setCityData(res.data.data.city);
      setStateData(res.data.data.state);
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    alert("You are logged out successfully");
    navigate("/");
  };

  const userDetails = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Phone number", value: user?.phoneNumber },
    { label: "Admin Id", value: user?.employeeId },
    { label: "Role", value: user?.role },
  ];

  const commands = [
    { label: "Add new Place", path: "/admin/register-place" },
    { label: "Add new City / State", path: "/admin/register-city-state" },
    // { label: "Add new State", path: "/admin/register-state" },
  ];

  return user ? (
    <div className="p-6 px-20">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex w-full shadow-2xl p-5 rounded-xl bg-neutral-200 justify-between ">
        <div className="md:space-y-2">
          {userDetails.map((item, index) => (
            <h1 key={index}>
              <strong>{item.label} :</strong> {item.value ?? "NA"}
            </h1>
          ))}
        </div>
        <div className="flex justify-center items-start gap-5">
          <Button
            label={"Reload Dashboard"}
            className={"w-full text-nowrap"}
            onClick={() => fetchDashboard()}
          />
          {commands.map((item, index) => (
            <Button
              key={index}
              label={item.label}
              className={"w-full text-nowrap"}
              onClick={() => navigate(item.path)}
            />
          ))}
          <Button
            label={"Log Out"}
            className={"w-full"}
            onClick={() => logout()}
          />
        </div>
      </div>
      <Place TableData={placeData} Text="Listed Places" />
      <City TableData={cityData} Text="Listed Cities" />
      <State TableData={stateData} Text="Listed States" />
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

export default LoadingUI(AdminDashboard);
