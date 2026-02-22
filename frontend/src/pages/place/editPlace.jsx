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

  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [telecast, setIsTelecast] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH PLACE ================= */

  const loadPlace = async () => {
    try {
      startLoading();
      const res = await FetchData(`places/${placeId}`, "get");
      const p = res.data.data.place;

      setPlace(p);
      setRemovedImages([]);
      setIsTelecast(p.isLiveDarshan);

      setFormData({
        name: p.name,
        category: p.category,
        description: p.description,
        averageTimeSpent: p.averageTimeSpent,
        entryFee: p.entryFee,
        telecastLink: p.telecastLink,
      });
    } catch {
      setError("Failed to load place");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadPlace();
  }, [user, placeId]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* ================= IMAGE REMOVE ================= */

  const handleRemoveImage = (fileId) => {
    setRemovedImages((prev) => [...prev, fileId]);

    setPlace((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.fileId !== fileId),
    }));
  };

  /* ================= IMAGE ADD ================= */

  const handleImageChange = (e) => {
    setError(
      " If uploaded image is not getting displayed proceed the process we are facing some technical issue for it.",
    );
    const files = Array.from(e.target.files);

    const currentCount = (place?.images?.length || 0) + newImages.length;

    if (currentCount + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = new FormData();

    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));

    newImages.forEach((img) => payload.append("images", img));
    removedImages.forEach((id) => payload.append("removedImages[]", id));

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
        alert("Place updated successfully");
        setNewImages([]);
        loadPlace();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      stopLoading();
    }
  };

  /* ================= GUARDS ================= */

  if (!user) return <div>Restricted Access</div>;
  if (!formData) return <div>Loading...</div>;

  const remainingSlots = MAX_IMAGES - (place.images.length + newImages.length);

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Place</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* EXISTING IMAGES */}
      <div className="grid grid-cols-5 gap-3">
        {place.images.map((img) => (
          <div key={img.fileId} className="relative">
            <img
              src={img.url}
              className="h-32 w-full object-cover rounded bg-neutral-300"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(img.fileId)}
              className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ADD IMAGES */}
      {remainingSlots > 0 && (
        <div>
          <label className="block text-sm mb-1">
            Add Images (up to {remainingSlots})
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-start items-start gap-5 flex-col">
          {formData.telecastLink ? (
            ""
          ) : (
            <div>
              <label className="block text-sm font-medium">
                Set live telecast active
              </label>

              <div className="flex items-center gap-4">
                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsTelecast((prev) => !prev)}
                  className={`relative w-14 h-7 flex items-center rounded-full transition ${
                    telecast ? "bg-[#FFC20E]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                      telecast ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Hidden input so FormData sends value */}
          {/* <input
            type="hidden"
            name="telecastLink"
            value={telecast ? "true" : "false"}
            /> */}
          {telecast && (
            <InputBox
              Name="telecastLink"
              LabelName="Telecast Link"
              // Required={false}
              onChange={handleChange}
              Value={formData.telecastLink}
            />
          )}
        </div>
        {formData.telecastLink && (
          <InputBox
            Name="telecastLink"
            LabelName="Telecast Link"
            // Required={false}
            onChange={handleChange}
            Value={formData.telecastLink}
          />
        )}

        <Button label="Update Place" type="submit" />
      </form>
    </div>
  );
};

export default LoadingUI(EditPlace);
