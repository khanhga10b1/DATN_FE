import React, { useEffect, useState } from "react";
import TabComponent from "../../../../components/Tabs";
import { useDispatch, useSelector } from "react-redux";
import Details from "./Details";
import service from "../../../../service/service";
import Calendar from "./Calendar";
import { Button, Feather, Modal, Spinner } from "../../../../components";
import { diffDays } from "../../../../utils/dateUtil";
import moment from "moment";
import ReasonModal from "../../Reservations/ReasonModal";
import { setModal } from "../../../../redux/reducers/reservations/actions";
import { useOnClickOutside } from "../../../../utils/onClickOutside";

const RoomDetails = ({ hotels, room, setView = () => {}, ...props }) => {
  const { modal } = useSelector((store) => store.reservations);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();
  const [room_reservation, set_room_reservation] = useState([]);
  const [updating, set_updating] = useState(false);

  const handleUpdateReservation = (params) => {
    set_updating(true);
    service
      .put(`/reservations/${modal.id}`, {
        ...modal,
        checkIn: moment(modal.checkIn).format('DD/MM/yyyy'),
        checkOut: moment(modal.checkOut).format('DD/MM/yyyy'),
        status: params.status,
        cancelReason: params.reason,
      })
      .then((res) => {
        const temp = [...room_reservation];
        const index = temp.findIndex((r) => r.id === modal.id);
        if (index !== -1) {
          if(res.data.status !== "canceled")
          temp[index] =  res.data;
          else temp.splice(index,1)
          set_room_reservation(temp);
        }
        dispatch(setModal(null));
        setConfirmModal(false);
        set_updating(false);
      })
      .catch((err) => {
        set_updating(false);
        console.log(err);
      });
  };
  const _ref = React.createRef();
  useOnClickOutside(_ref, () => dispatch(setModal(null)));

  useEffect(() => {
    set_loading(true);
    service
      .get("/reservations/filter", {
        params: {
            roomIds: room.id,
            status: "waiting,confirmed",
        },
      })
      .then((response) => {
        set_room_reservation(response.data);
        set_loading(false);
      })
      .catch((error) => {
        console.log(error);
        set_loading(false);
      });
  }, []);

  return (
    <div className="content" style={{ padding: "20px" }}>
      <TabComponent tabs={["Information", "Calendar"]}>
        <Details room={room} setView={setView} />
        <Calendar room_reservation={room_reservation} />
      </TabComponent>
      {modal && (
        <Modal
          show={modal}
          handleClose={() => dispatch(setModal(null))}
          maxWidth={1200}
        >
          <div ref={_ref}>
            <div className="reservation" style={{ boxShadow: "none" }}>
              <>
                <div className="row">
                  <div className="col-7">
                    <div
                      className="bottom-line"
                      style={{ paddingBottom: "20px" }}
                    >
                      <div className="row">
                        <span className="reservation__code">
                          code : {modal.code}
                        </span>
                      </div>
                    </div>
                    <div
                      className="row bottom-line"
                      style={{ paddingTop: "20px", paddingBottom: "20px" }}
                    >
                      <label style={{ marginRight: "20px" }}>Phòng</label>
                      <span>{room.name}</span>
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
                            {moment(modal.checkIn).format("DD/MM/YYYY")}
                          </span>
                        </div>
                      </div>
                      <div className="col-4 no-padding">
                        <div className="row justify-content-center">
                          <Feather
                            name="Clock"
                            style={{ marginBottom: "11.5px" }}
                          />
                        </div>
                        <div className="row justify-content-center">
                          <span>
                            {diffDays(
                              moment(modal.checkIn),
                              moment(modal.checkOut)
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
                            {moment(modal.checkOut).format("DD/MM/YYYY")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ paddingTop: "20px" }}>
                      <div className="col-6 no-padding">
                        <label style={{ marginRight: "20px" }}>Chi phí</label>
                        <span style={{ color: "#f52200" }}>${modal.cost}</span>
                      </div>
                      <div className="col-6 no-padding justify-flex-end">
                        <label style={{ marginRight: "20px" }}>Khách</label>
                        <span>
                          {modal.adult}{" "}người lớn {" "}-{" "}
                          {modal.children} trẻ em
                          </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-5"
                    style={{
                      borderLeft: "1px solid #E0E7FF",
                      paddingLeft: "40px",
                    }}
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
                        Thông tin khách
                      </label>
                      <div className="row">
                        <div className="row">
                          <label style={{ marginRight: "10px" }}>Tên: </label>
                          <span>{modal.name}</span>
                        </div>
                        <div className="row">
                          <label style={{ marginRight: "10px" }}>Email: </label>
                          <span>{modal.email}</span>
                        </div>
                        <div className="row">
                          <label style={{ marginRight: "10px" }}>
                          Địa chỉ:{" "}
                          </label>
                          <span>{modal.address}</span>
                        </div>
                        <div className="row">
                          <label style={{ marginRight: "10px" }}>Số điện thoại: </label>
                          <span>{modal.phone}</span>
                        </div>
                        <div className="row">
                          <label style={{ marginRight: "10px" }}>Ghi chú: </label>
                          <span>{modal.note}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
            {modal.status === "waiting" && (
              <div
                className="row justify-content-center"
                style={{ margin: "20px 0" }}
              >
                <Button
                  customClass="btn--block btn--light mr-20"
                  style={{ width: "150px" }}
                  onClick={() => {
                    setConfirmModal(true);
                  }}
                >
                  <strong>Hủy bỏ</strong>
                </Button>
              </div>
            )}
            <ReasonModal
              show={confirmModal}
              updating= {updating}
              handleClose={() => setConfirmModal(false)}
              msg={"Xác nhận hủy đơn?"}
              onConfirm={(reason) =>
                handleUpdateReservation({
                  status: "canceled",
                  reason,
                })
              }
            />
          </div>
        </Modal>
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default RoomDetails;
