import React, { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";

const AdminCMS = ({ adminId, onClose }) => {
  // const { adminId } = useParams();

  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formState, setFormState] = useState({
    description: "",
    points: [""],
  });

  /* ================= FETCH CMS ================= */

  const fetchCMS = async () => {
    try {
      setLoading(true);
      const res = await FetchData("cms", "get");
      setCmsData(res?.data?.data || {});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  /* ================= EDIT HANDLER ================= */

  const startEdit = (section) => {
    setEditingSection(section);

    setFormState({
      description: cmsData?.[section]?.description || "",
      points:
        cmsData?.[section]?.points?.length > 0 ? cmsData[section].points : [""],
    });
  };

  /* ================= INPUT HANDLERS ================= */

  const handleDescriptionChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handlePointChange = (value, index) => {
    const updated = [...formState.points];
    updated[index] = value;

    setFormState((prev) => ({
      ...prev,
      points: updated,
    }));
  };

  const addPoint = () => {
    setFormState((prev) => ({
      ...prev,
      points: [...prev.points, ""],
    }));
  };

  const removePoint = (index) => {
    const updated = formState.points.filter((_, i) => i !== index);
    setFormState((prev) => ({
      ...prev,
      points: updated,
    }));
  };

  /* ================= SAVE ================= */

  const handleSave = async (section) => {
    try {
      setLoading(true);

      await FetchData(`cms/${section}/${adminId}`, "post", formState);

      setEditingSection(null);
      fetchCMS();
      alert("Updated successfully");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (section) => {
    if (!window.confirm("Delete this section?")) return;

    try {
      setLoading(true);

      await FetchData(`terms/${section}/${adminId}`, "delete");

      fetchCMS();
      alert("Deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SECTION UI ================= */

  const renderSection = (title, keyName) => {
    const section = cmsData?.[keyName];

    return (
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>

          <div className="flex gap-2">
            <Button label="Edit" onClick={() => startEdit(keyName)} />
            <Button
              label="Delete"
              className="bg-red-500 text-white"
              onClick={() => handleDelete(keyName)}
            />
          </div>
        </div>

        {/* EDIT MODE */}
        {editingSection === keyName ? (
          <div className="space-y-4">
            {/* DESCRIPTION */}
            <textarea
              value={formState.description}
              onChange={handleDescriptionChange}
              placeholder="Description"
              className="w-full border rounded-md p-2"
            />

            {/* POINTS */}
            <div className="space-y-2">
              {formState.points.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={point}
                    onChange={(e) => handlePointChange(e.target.value, index)}
                    placeholder={`Point ${index + 1}`}
                    className="border p-2 w-full rounded-md"
                  />

                  {formState.points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePoint(index)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button label="Add Point" onClick={addPoint} />

            <div className="flex gap-3">
              <Button label="Save" onClick={() => handleSave(keyName)} />
              <Button label="Cancel" onClick={() => setEditingSection(null)} />
            </div>
          </div>
        ) : (
          /* VIEW MODE */
          <div className="space-y-2">
            <p className="text-gray-700">{section?.description}</p>

            <ul className="list-disc pl-6">
              {section?.points?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  /* ================= UI ================= */

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">CMS Management</h1>
      <Button label={"Close"} onClick={onClose} />

      {renderSection("Terms of Service", "termsOfService")}
      {renderSection("Privacy Policy", "privacyPolicy")}
      {renderSection("How This Site Works", "howThisSiteWork")}
    </div>
  );
};

export default AdminCMS;
