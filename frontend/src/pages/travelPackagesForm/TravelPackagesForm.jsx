import { useState } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import SelectBox from "../../components/SelectionBox";

export default function TravelPackagesForm() {
  const [activeTab, setActiveTab] = useState("package");

  /* ---------------- PACKAGE FORM STATE ---------------- */
  const [packageData, setPackageData] = useState({
    type: "ordinary",
    title: "",
    destination: "",
    duration: "",
    price: "",
    discountPrice: "",
    category: "",
    overview: "",
    included: "",
    excluded: "",
    organizerName: "",
    contact: "",
    email: "",
  });

  /* ---------------- CLUB FORM STATE ---------------- */
  const [clubData, setClubData] = useState({
    clubName: "",
    clubType: "",
    state: "",
    city: "",
    membersCount: "",
    description: "",
    leaderName: "",
    contact: "",
    email: "",
  });

  /* ---------------- OPTIONS ---------------- */

  const packageCategoryOptions = [
    { _id: "adventure", label: "Adventure" },
    { _id: "spiritual", label: "Spiritual" },
    { _id: "heritage", label: "Heritage" },
    { _id: "luxury", label: "Luxury" },
    { _id: "weekend", label: "Weekend Getaway" },
  ];

  const clubTypeOptions = [
    { _id: "biker", label: "Biker Group" },
    { _id: "travel", label: "Travel Group" },
    { _id: "trekking", label: "Trekking Group" },
    { _id: "backpacking", label: "Backpacking Community" },
    { _id: "corporate", label: "Corporate Travel Group" },
  ];

  /* ---------------- HANDLERS ---------------- */

  const handlePackageChange = (e) => {
    setPackageData({ ...packageData, [e.target.name]: e.target.value });
  };

  const handleClubChange = (e) => {
    setClubData({ ...clubData, [e.target.name]: e.target.value });
  };

  const submitPackage = (e) => {
    e.preventDefault();
    console.log("Package Data:", packageData);
  };

  const submitClub = (e) => {
    e.preventDefault();
    console.log("Club Data:", clubData);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-[#FFC20E]/20 p-8">
        {/* HEADER */}
        <h1 className="text-3xl font-bold border-l-4 border-[#FFC20E] pl-4 mb-8">
          Travel Registration
        </h1>

        {/* TAB SWITCH */}
        <div className="flex gap-4 mb-8">
          <Button
            label="List a Package"
            onClick={() => setActiveTab("package")}
            className={`${
              activeTab !== "package" && "bg-white border border-[#FFC20E]"
            }`}
          />

          <Button
            label="Register as Club"
            onClick={() => setActiveTab("club")}
            className={`${
              activeTab !== "club" && "bg-white border border-[#FFC20E]"
            }`}
          />
        </div>

        {/* ================= PACKAGE FORM ================= */}
        {activeTab === "package" && (
          <form onSubmit={submitPackage} className="space-y-6">
            {/* Package Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Priority
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="trending"
                    checked={packageData.type === "trending"}
                    onChange={handlePackageChange}
                  />
                  Hot & Trending 🔥
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="ordinary"
                    checked={packageData.type === "ordinary"}
                    onChange={handlePackageChange}
                  />
                  Ordinary Package
                </label>
              </div>
            </div>

            {/* BASIC INFO */}
            <div className="grid md:grid-cols-2 gap-4">
              <InputBox
                LabelName="Package Title"
                Name="title"
                Value={packageData.title}
                onChange={handlePackageChange}
              />

              <InputBox
                LabelName="Destination"
                Name="destination"
                Value={packageData.destination}
                onChange={handlePackageChange}
              />

              <InputBox
                LabelName="Duration (3 Days 2 Nights)"
                Name="duration"
                Value={packageData.duration}
                onChange={handlePackageChange}
              />

              <InputBox
                LabelName="Price"
                Name="price"
                Type="number"
                Value={packageData.price}
                onChange={handlePackageChange}
              />

              <InputBox
                LabelName="Discount Price"
                Name="discountPrice"
                Type="number"
                Value={packageData.discountPrice}
                onChange={handlePackageChange}
              />

              <SelectBox
                LabelName="Category"
                Name="category"
                Value={packageData.category}
                onChange={handlePackageChange}
                Options={packageCategoryOptions}
              />
            </div>

            {/* TEXT AREAS */}
            <Textarea
              label="Overview"
              name="overview"
              value={packageData.overview}
              onChange={handlePackageChange}
            />

            <Textarea
              label="Included Services"
              name="included"
              value={packageData.included}
              onChange={handlePackageChange}
            />

            <Textarea
              label="Excluded Services"
              name="excluded"
              value={packageData.excluded}
              onChange={handlePackageChange}
            />

            {/* ORGANIZER */}
            <h2 className="text-xl font-semibold mt-6">Organizer Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <InputBox
                LabelName="Organizer Name"
                Name="organizerName"
                Value={packageData.organizerName}
                onChange={handlePackageChange}
              />

              <InputBox
                LabelName="Contact Number"
                Name="contact"
                Value={packageData.contact}
                onChange={handlePackageChange}
              />

              <InputBox
                LabelName="Email"
                Name="email"
                Type="email"
                Value={packageData.email}
                onChange={handlePackageChange}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" label="Submit Package" />
            </div>
          </form>
        )}

        {/* ================= CLUB FORM ================= */}
        {activeTab === "club" && (
          <form onSubmit={submitClub} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <InputBox
                LabelName="Club Name"
                Name="clubName"
                Value={clubData.clubName}
                onChange={handleClubChange}
              />

              <SelectBox
                LabelName="Club Type"
                Name="clubType"
                Value={clubData.clubType}
                onChange={handleClubChange}
                Options={clubTypeOptions}
              />

              <InputBox
                LabelName="State"
                Name="state"
                Value={clubData.state}
                onChange={handleClubChange}
              />

              <InputBox
                LabelName="City"
                Name="city"
                Value={clubData.city}
                onChange={handleClubChange}
              />

              <InputBox
                LabelName="Members Count"
                Name="membersCount"
                Type="number"
                Value={clubData.membersCount}
                onChange={handleClubChange}
              />

              <InputBox
                LabelName="Leader Name"
                Name="leaderName"
                Value={clubData.leaderName}
                onChange={handleClubChange}
              />

              <InputBox
                LabelName="Contact Number"
                Name="contact"
                Value={clubData.contact}
                onChange={handleClubChange}
              />

              <InputBox
                LabelName="Email"
                Name="email"
                Type="email"
                Value={clubData.email}
                onChange={handleClubChange}
              />
            </div>

            <Textarea
              label="About Club"
              name="description"
              value={clubData.description}
              onChange={handleClubChange}
            />

            <div className="pt-4">
              <Button type="submit" label="Submit Club Registration" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------- TEXTAREA (kept minimal for consistency) ---------- */

function Textarea({ label, ...props }) {
  return (
    <div className="w-full py-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <textarea
        rows={4}
        {...props}
        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
      />
    </div>
  );
}
