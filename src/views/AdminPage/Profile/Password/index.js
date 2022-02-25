import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "../../../../components";
import service from "../../../../service/service";
import { loadAdmin } from "../../../../actions/auth";
import { NotificationManager } from "react-notifications";

const Password = () => {
  const { admin } = useSelector((store) => store.auth);
  const [old_pass, set_old_pass] = useState("");
  const [new_pass, set_new_pass] = useState("");
  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();
  const onSave = (e) => {
    e.preventDefault();
    set_loading(true);
    service
      .put(`/admins/changePass/${admin.id}`, { old_pass, new_pass })
      .then((res) => {
        NotificationManager.success(
          "Your account password has been updated successfully",
          "Updated",
          1500
        );
        dispatch(loadAdmin());
        set_loading(false);
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error(
          "Có lỗi xảy ra, vui lòng thử lại sau",
          "Có lỗi xảy ra",
          2000
        );
        set_loading(false);
      });
  };
  return (
    <div className="tab-component">
      <div className="tab__content">
        <form className="card profile_card" onSubmit={onSave}>
          <div className="row">
            <label>Mật khẩu cũ</label>
            <TextField
              value={old_pass}
              type="password"
              onChange={(e) => set_old_pass(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <label>Mật khẩu mới</label>
            <TextField
              value={new_pass}
              type="password"
              onChange={(e) => set_new_pass(e.target.value)}
              required
            />
          </div>
          <div className="row justify-flex-end">
            <Button
              customClass="btn--block btn--primary"
              style={{ width: "100px" }}
              htmlType="submit"
              disabled={loading}
              type="primary"
            >
              <strong>Lưu</strong>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password;
