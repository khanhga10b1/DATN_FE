import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "../../../../components";
import service from "../../../../service/service";
import { loadUser } from "../../../../actions/auth";
import { NotificationManager } from "react-notifications";

const Setup = () => {
  const { user } = useSelector((store) => store.auth);
  const [paypal_id, set_paypal_id] = useState(user.paypalId);
  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();
  const onSave = (e) => {
    e.preventDefault();
    set_loading(true);
    service
      .put(`/accounts/${user.id}`, { paypalId: paypal_id })
      .then((res) => {
        NotificationManager.success(
          "Your account information has been updated successfully",
          "Updated",
          1500
        );
        dispatch(loadUser());
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
            <label>Paypal ID</label>
            <TextField
              style = {{width : "500px"}}
              value={paypal_id}
              onChange={(e) => set_paypal_id(e.target.value)}
              required
              disabled={true}
            />
          </div>
          <div className="row justify-flex-end">
            <Button
              customClass="btn--block btn--primary"
              style={{ width: "100px" }}
              htmlType="submit"
              disabled={true}
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

export default Setup;
