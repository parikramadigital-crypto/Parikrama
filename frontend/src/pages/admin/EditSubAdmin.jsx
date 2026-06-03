import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import LoadingUI from "../../components/LoadingUI";

import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const sections = [
  "Overview",
  "Enquiries",
  "Hotels",
  "Clubs",
  "Active Places",
  "Inactive Places",
  "Food Place",
  "Users",
  "Verified Facilitator",
  "Non-Verified Facilitator",
  "Cities",
  "States",
  "Countries",
  "Packages",
  "Promotions",
];

const EditSubAdmin = ({ startLoading, stopLoading }) => {
  const { adminId } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  console.log(user)

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
  });

  const [selectedSections, setSelectedSections] = useState([]);
  const [subAdmin, setSubAdmin] = useState();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= LOAD SUB ADMIN =================
  const loadSubAdmin = async () => {
    try {
      startLoading();

      const response = await FetchData(
        `admin/sub-admin/get-by/id/${adminId}`,
        "get",
      );

      const admin = response?.data?.data;

      setFormData({
        name: admin?.name,
        employeeId: admin?.employeeId || "",
        email: admin?.email || "",
        phoneNumber: admin?.phoneNumber || "",
      });
      setSubAdmin(admin);
      setSelectedSections(admin?.sectionList || []);
    } catch (err) {
      console.log(err);

      alert("Failed to load sub admin");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadSubAdmin();
    // if (adminId && user) {
    // }
  }, [adminId, user]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= TOGGLE SECTION =================
  const toggleSection = (section) => {
    setSelectedSections((prev) => {
      if (prev.includes(section)) {
        return prev.filter((s) => s !== section);
      }

      return [...prev, section];
    });
  };

  // ================= UPDATE SUB ADMIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      startLoading();

      setError("");
      setSuccess("");

      const payload = {
        ...formData,
        sectionList: selectedSections,
      };

      const response = await FetchData(
        `admin/sub-admin/update/${adminId}`,
        "post",
        payload,
      );

      setSuccess(response?.data?.message);
      alert(response?.data?.message);
      loadSubAdmin();
      navigate("/admin/dashboard");
    } catch (err) {
      alert(parseErrorMessage(err?.response?.data));
    } finally {
      stopLoading();
    }
  };

  const ActivationDeactivation = async ({ action }) => {
    try {
      startLoading();
      const endPoint =
        action === "activate"
          ? `admin/sub-admin/activate/${adminId}/${user?._id}`
          : action === "de-activate"
            ? `admin/sub-admin/de-activate/${adminId}/${user?._id}`
            : "";
      const response = await FetchData(endPoint, "post");
      console.log(response);
      alert(response.data.message);
      loadSubAdmin();
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl bg-white rounded-3xl p-8 shadow-2xl mx-auto"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#FFC20E] p-4 rounded-2xl">
          <FaUserShield className="text-3xl text-black" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Edit Sub Admin</h1>

          <p className="text-gray-500 mt-1">
            View and update sub admin information and permissions.
          </p>
        </div>
        {subAdmin?.isActive === true ? (
          <Button
            label={"De-Activate"}
            onClick={() => ActivationDeactivation({ action: "de-activate" })}
          />
        ) : (
          <Button
            label={"Activate"}
            onClick={() => ActivationDeactivation({ action: "activate" })}
          />
        )}
      </div>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit}>
        {/* ================= INPUTS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputBox
            LabelName="Full Name"
            Name="name"
            Placeholder="Enter full name"
            Type="text"
            Value={formData.name}
            onChange={handleChange}
          />

          <InputBox
            LabelName="Employee ID"
            Name="employeeId"
            Placeholder="Enter employee ID"
            Type="text"
            Value={formData.employeeId}
            onChange={handleChange}
          />

          <InputBox
            LabelName="Email Address"
            Name="email"
            Placeholder="Enter email address"
            Type="email"
            Value={formData.email}
            onChange={handleChange}
          />

          <InputBox
            LabelName="Phone Number"
            Name="phoneNumber"
            Placeholder="Enter phone number"
            Type="text"
            Value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* ================= SECTION ACCESS ================= */}
        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Section Access</h2>

              <p className="text-gray-500 mt-1">
                Select the sections accessible by this sub admin.
              </p>
            </div>

            <div className="bg-[#FFC20E] px-5 py-2 rounded-xl font-semibold w-fit">
              {selectedSections.length} Selected
            </div>
          </div>

          {/* ================= SECTION GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {sections.map((section, index) => {
              const isSelected = selectedSections.includes(section);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleSection(section)}
                  className={`border-2 rounded-2xl px-5 py-4 transition-all duration-200 text-left ${
                    isSelected
                      ? "border-[#FFC20E] bg-[#FFF8E0] shadow-md scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-[#FFC20E]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{section}</p>

                    <div
                      className={`w-6 h-6 rounded-md border-2 flex justify-center items-center ${
                        isSelected
                          ? "bg-[#FFC20E] border-[#FFC20E]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* ================= SUCCESS ================= */}
        {success && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        {/* ================= ACTION BUTTON ================= */}
        <div className="flex justify-end mt-10">
          <Button
            label={"Update Sub Admin"}
            type={"submit"}
            className={"px-8 py-3 font-semibold"}
          />
        </div>
      </form>
    </motion.div>
  );
};

export default LoadingUI(EditSubAdmin);
