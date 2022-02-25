import React from "react";
import Information from "./Infomation";
import Password from "./Password";
import TabComponent from "../../../components/Tabs";
const Profile = () => {

  return (
    <div className="content" style={{ padding: "20px" }}>
      <TabComponent tabs={["Thông tin", "Mật khẩu"]}>
        <Information />
        <Password />
      </TabComponent>
    </div>
  );
};

export default Profile;
