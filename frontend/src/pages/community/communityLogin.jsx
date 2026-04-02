import { FetchData } from "../../utils/FetchFromApi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { addUser, clearUser } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const CommunityLogin = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        "communities/community/auth/login",
        "post",
        formData,
      );

      console.log(response);
      formRef.current.reset();
      navigate("/dashboard/community");
      alert(response.data.message);
      if (response.data.success) {
        const { community, tokens } = response.data.data;
        console.log(community);

        localStorage.setItem("AccessToken", tokens.AccessToken);
        localStorage.setItem("RefreshToken", tokens.RefreshToken);
        localStorage.setItem("role", "Community");

        dispatch(clearUser());
        dispatch(addUser(community));
      }
    } catch (err) {
      console.log(err);
      parseErrorMessage(err.response.data);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <h1>This is community login</h1>
      <form
        ref={formRef}
        onSubmit={handleLogin}
        className="w-full md:w-96 shadow p-5 rounded-md"
      >
        <InputBox
          LabelName="Personal Email Id"
          Name="email"
          Placeholder="Personal email"
          Type="email"
        />
        <InputBox
          LabelName="Password"
          Name="password"
          Placeholder="Password"
          Type="password"
        />
        <div className="flex flex-col justify-center w-full gap-5">
          <Button label={"Login"} type={"submit"} />
          <Button
            label={"Back to home"}
            onClick={() => {
              navigate("/");
              formRef.current.reset();
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default CommunityLogin;
