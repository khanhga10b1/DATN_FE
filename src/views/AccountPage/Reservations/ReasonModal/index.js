import React, { useState } from "react";
import { TextArea, Modal, Button } from "../../../../components";

const ReasonModal = ({updating, show, handleClose, onConfirm }) => {
  const [reason, set_reason] = useState("");
  return (
    <Modal show={show} handleClose={handleClose} maxWidth={500}>
      <div className="modal__title">Hủy đơn</div>
      <div className="modal__content">
        <div className="row justify-content-center mb-5">
          <span style={{ fontSize: "15px", textAlign: "center" }}>
            Một email sẽ được gửi đến khách hàng của bạn thông báo rằng đơn của họ đã bị hủy bỏ. Vui lòng điền lý do bên dưới
          </span>
        </div>
        <TextArea
          defaultValue={reason}
          onChange={(e) => set_reason(e.target.value)}
        />
        <div
          className="row justify-content-center"
          style={{ marginTop: "20px" }}
        >
          <Button
            customClass="btn--block btn--primary"
            style={{ width: "150px" }}
            disabled={updating}
            type="primary"
            onClick={() => onConfirm(reason)}
          >
            <strong>Lưu</strong>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default ReasonModal;
