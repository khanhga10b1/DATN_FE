import React from "react";
import moment from 'moment'
import { Modal, Feather, Spinner } from "../../../components";
import { diffDays } from "../../../utils/dateUtil";
const InforModal = ({ selectedRow, show, handleClose, rooms }) => {
  return (
    <Modal show={show} handleClose={handleClose} maxWidth={1200}>
      {
        selectedRow && <div className="reservation" style={{ boxShadow: "none" }}>
        <>
          <div className="row">
            <div className="col-7">
              <div className="bottom-line" style={{ paddingBottom: "20px" }}>
                <div className="row">
                  <span className="reservation__code">
                    code : {selectedRow.code}
                  </span>
                </div>
              </div>
              <div
                className="row bottom-line"
                style={{ paddingTop: "20px", paddingBottom: "20px" }}
              >
                <div className="col-6 no-padding">
                  <label style={{ marginRight: "20px" }}>Phòng</label>
                  <span>
                    {rooms.find((r) => r.id === selectedRow.roomId)?.name}
                  </span>
                </div>
                <div className="col-6 no-padding">
                  <a style={{ marginRight: "20px" , color : "#216ba5" }} href = {`/hotels/${selectedRow.hotelId}`}> Xem khách sạn</a>
                </div>
              </div>
              <div
                className="row bottom-line"
                style={{ paddingTop: "20px", paddingBottom: "20px" }}
              >
                <div className="col-4 no-padding">
                  <div className="row justify-flex-start">
                    <label>Check In</label>
                  </div>
                  <div className="row justify-flex-start">
                    <span>
                      {moment(selectedRow.checkIn).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
                <div className="col-4 no-padding">
                  <div className="row justify-content-center">
                    <Feather name="Clock" style={{ marginBottom: "11.5px" }} />
                  </div>
                  <div className="row justify-content-center">
                    <span>
                      {diffDays(
                        moment(selectedRow.checkIn),
                        moment(selectedRow.checkOut)
                      )}{" "}ngày
                    </span>
                  </div>
                </div>
                <div className="col-4 no-padding">
                  <div className="row justify-flex-end">
                    <label>Check Out</label>
                  </div>
                  <div className="row justify-flex-end">
                    <span>
                      {moment(selectedRow.checkOut).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row" style={{ paddingTop: "20px" }}>
                <div className="col-6 no-padding">
                  <label style={{ marginRight: "20px" }}>Chi phí</label>
                  <span style={{ color: "#f52200" }}>${selectedRow.cost}</span>
                </div>
                <div className="col-6 no-padding justify-flex-end">
                  <label style={{ marginRight: "20px" }}>Khách</label>
                  <span>
                    {selectedRow.adult}{" "}
                    người lớn-{" "}
                    {selectedRow.children} trẻ em
                  </span>
                </div>
              </div>
            </div>
            <div
              className="col-5"
              style={{ borderLeft: "1px solid #E0E7FF", paddingLeft: "40px" }}
            >
              <div className="row">
                <label
                  style={{
                    margin: "0 0 20px 0",
                    width: "100%",
                    paddingBottom: "20px",
                    color: "#216ba5",
                  }}
                  className="bottom-line"
                >
                  Thông tin
                </label>
                <div className="row">
                  <div className="row">
                    <label style={{ marginRight: "10px" }}>Tên: </label>
                    <span>{selectedRow.name}</span>
                  </div>
                  <div className="row">
                    <label style={{ marginRight: "10px" }}>Email: </label>
                    <span>{selectedRow.email}</span>
                  </div>
                  <div className="row">
                    <label style={{ marginRight: "10px" }}>Địa chỉ: </label>
                    <span>{selectedRow.address}</span>
                  </div>
                  <div className="row">
                    <label style={{ marginRight: "10px" }}>Số điện thoại: </label>
                    <span>{selectedRow.phone}</span>
                  </div>
                  <div className="row">
                    <label style={{ marginRight: "10px" }}>Ghi chú: </label>
                    <span>{selectedRow.note}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
      }
    </Modal>
  );
};

export default InforModal;
