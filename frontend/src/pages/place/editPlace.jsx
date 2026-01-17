import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import { useSelector } from "react-redux";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";

const MAX_IMAGES = 5;

const EditPlace = ({ stopLoading, startLoading }) => {
  const { placeId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------- FETCH PLACE ---------- */
  const fetchPlace = async () => {
    try {
      startLoading();
      const res = await FetchData(`places/${placeId}`, "get");
      const place = res.data.data;
      setData(place);
      setFormData({
        name: place.name,
        category: place.category,
        description: place.description,
        averageTimeSpent: place.averageTimeSpent,
        entryFee: place.entryFee,
      });
    } catch {
      setError("Failed to load place");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (user) fetchPlace();
  }, [user]);

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - (data?.images?.length || 0);

    if (files.length > remaining) {
      setError(`You can upload only ${remaining} more image(s)`);
      return;
    }

    setNewImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = new FormData();

    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));

    newImages.forEach((img) => payload.append("images", img));

    try {
      startLoading();
      const res = await FetchData(
        `places/update/${placeId}`,
        "post",
        payload,
        true,
      );
      if (res.data.success) {
        setSuccess("Place updated successfully");
        setNewImages([]);
        fetchPlace();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      stopLoading();
    }
  };

  if (!user) return <div>Restricted Access</div>;

  const remainingSlots = MAX_IMAGES - (data?.images?.length || 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Place</h1>

      {/* EXISTING IMAGES */}
      <div className="grid grid-cols-5 gap-3">
        {data?.images?.map((img) => (
          <img
            key={img.fileId}
            src={img.url}
            className="h-24 w-full object-cover rounded-md"
          />
        ))}
      </div>

      {/* IMAGE UPLOAD */}
      {remainingSlots > 0 ? (
        <div>
          <label className="block text-sm font-medium mb-1">
            Add Images (up to {remainingSlots})
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-400">Maximum 5 images uploaded</p>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <InputBox
          Name="name"
          LabelName="Place Name"
          Value={formData.name}
          onChange={handleChange}
        />
        <InputBox
          Name="category"
          LabelName="Category"
          Value={formData.category}
          onChange={handleChange}
        />
        <InputBox
          Name="averageTimeSpent"
          LabelName="Average Time Spent"
          Type="number"
          Value={formData.averageTimeSpent}
          onChange={handleChange}
        />
        <InputBox
          Name="entryFee"
          LabelName="Entry Fee"
          Type="number"
          Value={formData.entryFee}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <Button label={"Update Place"} type={"submit"} />
      </form>
    </div>
  );
};

export default LoadingUI(EditPlace);
