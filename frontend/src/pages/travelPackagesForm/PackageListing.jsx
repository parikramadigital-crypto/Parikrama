import { useState } from "react";
import PackageCard from "../../components/ui/PackageCard";
import mockPackages, { packagesInputs } from "../../constants/Constants";
import InputBox from "../../components/InputBox";
import { CiSearch } from "react-icons/ci";
import { useEffect } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import { useRef } from "react";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import Button from "../../components/Button";

export default function PackagesListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [packages, setPackages] = useState({});

  // get all country
  const getAllCountry = async () => {
    try {
      const response = await FetchData("country/get/all-country", "get");
      setCountries(response.data.data);
    } catch (err) {}
  };
  const getPackageByPriority = async () => {
    try {
      const response = await FetchData("packages/by-priority/status", "get");
      setPackages(response.data.data);
    } catch (err) {}
  };

  useEffect(() => {
    getAllCountry();
    getPackageByPriority();
  }, []);

  // Later replace this with API response
  const demoPackages = mockPackages;

  // Function to filter packages based on search query
  const filterPackages = (data) => {
    if (!searchQuery) return data;
    return data?.filter(
      (pkg) =>
        pkg?.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        pkg?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        pkg?.location?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        pkg?.description?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        pkg?.state?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        pkg?.country?.name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase()) ||
        pkg?.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery?.toLowerCase()),
        ),
    );
  };

  return (
    <div className="md:py-12  px-6">
      <div className="flex justify-center items-center gap-5">
        {/* <div className="grid grid-cols-3 w-full gap-4 ">
          {countries?.map((c) => (
            <button className="border border-[#FFC20D] rounded-full px-3 py-1">
              {c.name}
            </button>
          ))}
        </div> */}
        <div className="flex justify-center items-center w-full md:w-1/2 relative">
          <InputBox
            Type="text"
            Placeholder="Search packages by title, location, or tags..."
            Value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="absolute right-3 text-gray-500 text-xl hidden md:block" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Search Bar */}
        <Section
          title="🔥 Last moment ones"
          data={filterPackages(
            packages?.lastMomentPackage?.length > 0
              ? packages?.lastMomentPackage
              : demoPackages?.lastMomentPackage,
          )}
        />
        <Section
          title="🔥 Hot Deals"
          data={filterPackages(
            packages?.hotDeals?.length > 0
              ? packages?.hotDeals
              : demoPackages?.hotDeals,
          )}
        />
        <Section
          title="📈 Trending Deals"
          data={filterPackages(
            packages?.trendingDeals?.length > 0
              ? packages?.trendingDeals
              : demoPackages?.trendingDeals,
          )}
        />
        <Section
          title="⭐ Exclusive Deals"
          data={filterPackages(
            packages?.exclusiveDeals?.length > 0
              ? packages?.exclusiveDeals
              : demoPackages?.exclusiveDeals,
          )}
        />
      </div>
    </div>
  );
}

/* ---------- Section Wrapper ---------- */

const Section = ({ title, data }) => {
  if (!data?.length) return;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-l-4 border-[#FFC20E] pl-3">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((pkg) => (
          <PackageCard key={pkg.id} data={pkg} />
        ))}
      </div>
    </div>
  );
};
