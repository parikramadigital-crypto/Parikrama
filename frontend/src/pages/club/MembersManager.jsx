// MembersManager.jsx

import React, { useState } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import { FiTrash2 } from "react-icons/fi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const MembersManager = ({ club, setClub }) => {
  const [popup, setPopup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      const response = await FetchData(
        `clubs/club/${club._id}/member`,
        "post",
        form,
      );

      setClub({
        ...club,
        members: response.data.data,
      });

      setPopup(false);
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    }
  };

  const removeMember = async (memberId) => {
    try {
      await FetchData(`clubs/club/${club._id}/member/${memberId}`, "delete");

      setClub({
        ...club,
        members: club.members.filter((m) => m._id !== memberId),
      });
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Members</h2>

        <Button label="Add Member" onClick={() => setPopup(true)} />
      </div>

      <div className="mt-5 space-y-3">
        {club?.members?.map((member) => (
          <div
            key={member._id}
            className="border rounded-2xl p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{member.name}</h3>

              <p className="text-sm text-gray-500">{member.email}</p>
            </div>

            <button onClick={() => removeMember(member._id)}>
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {popup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            onSubmit={handleAddMember}
            className="bg-white rounded-3xl p-6 w-[500px]"
          >
            <h2 className="text-2xl font-bold mb-5">Add Member</h2>

            <InputBox
              LabelName="Name"
              Value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <InputBox
              LabelName="Email"
              Value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <InputBox
              LabelName="Contact"
              Value={form.contactNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  contactNumber: e.target.value,
                })
              }
            />

            <InputBox
              LabelName="Address"
              Value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />

            <div className="flex gap-4 mt-5">
              <Button type="submit" label="Save" />

              <Button
                type="button"
                label="Cancel"
                normal={false}
                onClick={() => setPopup(false)}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MembersManager;
