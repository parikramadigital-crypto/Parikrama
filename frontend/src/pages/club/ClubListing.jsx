import React, { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import ClubCard from "../../components/ui/ClubCard";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { useDebounce } from "../../utils/Utility-functions";

const ClubListing = ({ startLoading, stopLoading }) => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [error, setError] = useState("");

  const clubCategories = [
    "Travel Club",
    "Adventure Club",
    "Religious Club",
    "Bike Club",
    "Business Club",
    "Social Club",
  ];

  const loadClubs = async () => {
    try {
      startLoading();
      const response = await FetchData("clubs", "get");
      setClubs(response?.data?.data || []);
      setFilteredClubs(response?.data?.data || []);
    } catch (err) {
      setError("Unable to load clubs. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const handleSearch = useDebounce(async (value) => {
    if (!value.trim()) {
      applyFilters(clubs, value, categoryFilter);
      return;
    }

    try {
      const response = await FetchData("clubs/search", "get", { q: value });
      applyFilters(response?.data?.data || [], value, categoryFilter);
    } catch (err) {
      setError("Search failed. Please try again.");
    }
  }, 400);

  const applyFilters = (clubsList, searchTerm, category) => {
    let filtered = clubsList;

    if (category) {
      filtered = filtered.filter((club) => club.category === category);
    }

    setFilteredClubs(filtered);
  };

  const onSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    handleSearch(value);
  };

  const onCategoryChange = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    applyFilters(clubs, search, category);
  };

  useEffect(() => {
    loadClubs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Discover clubs, communities and memberships
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Browse verified club listings with membership options, events, and
          community details.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <InputBox
            type="text"
            placeholder="Search clubs by name, location, or category..."
            value={search}
            onChange={onSearchChange}
            className="flex-1"
          />
          <select
            value={categoryFilter}
            onChange={onCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {clubCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {filteredClubs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No clubs found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingUI(ClubListing);
