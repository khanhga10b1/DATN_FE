import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepProgressBar from "react-step-progress";
import { PaypalBtn, Feather, Button, Spinner } from "../../../components";
import service from "../../../service/service";
import { Tick } from "react-crude-animated-tick";
import { resetReservation } from "../../../redux/reducers/reservations/actions";
import { useHistory } from "react-router-dom";

const Reservation = () => {
  const { reservation } = useSelector((store) => store.reservations);
  const dispatch = useDispatch();
  const history = useHistory();
  const onNext = () => {
    document
      .querySelector("#root > div > div > div._3uApM > a._2pGos._hsN1w")
      .click();
  };

  const onPrevious = () => {
    document
      .querySelector("#root > div > div > div._3uApM > a._2pGos._3CDiP")
      .click();
  };

  const onSubmitProgress = () => {
    dispatch(resetReservation());
    history.push("/");
  };

  return (
    <div className="main">
      {reservation && (
        <StepProgressBar
          startingStep={0}
          steps={[
            {
              label: "Xác nhận đơn",
              name: "Bước 1",
              content: (
                <ReservationData reservation={reservation} onNext={onNext} />
              ),
            },
            {
              label: "Thanh toán",
              name: "Bước 2",
              content: (
                <Payment
                  onPrevious={onPrevious}
                  onNext={onNext}
                  reservation={reservation}
                />
              ),
            },
            {
              label: "Hoàn thành",
              name: "Bước 3",
              content: (
                <CompleteReservation onSubmitProgress={onSubmitProgress} />
              ),
              // validator: step3Validator
            },
          ]}
        />
      )}
    </div>
  );
};

const ReservationData = ({ reservation, onNext }) => {
  return (
    <>
      <div className="reservation">
        <>
          <div className="row">
            <div className="col-5">
              <img src={reservation.room.image[0]} />
            </div>
            <div className="col-7">
              <div className="bottom-line" style={{ paddingBottom: "20px" }}>
                <div className="row reservation__hotel-name">
                  {reservation.hotel.name}
                </div>
                <div className="row justify-content-between ">
                  <div className="flex reservation__hotel-location">
                    <Feather
                      name="MapPin"
                      style={{ marginRight: "5px" }}
                      width="20px"
                      height="20px"
                    />
                    <span>{reservation.hotel.city}</span>
                  </div>
                  <span className="reservation__code">
                    code : {reservation.code}
                  </span>
                </div>
                <div className="row" style={{ marginLeft: "25px" }}>
                  {reservation.hotel.address}
                </div>
              </div>
              <div
                className="row bottom-line"
                style={{ paddingTop: "20px", paddingBottom: "20px" }}
              >
                <label style={{ marginRight: "20px" }}>Phòng</label>
                <span>{reservation.room.name}</span>
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
                    <span>{reservation.checkIn}</span>
                  </div>
                </div>
                <div className="col-4 no-padding">
                  <div className="row justify-content-center">
                    <Feather name="Clock" style={{ marginBottom: "11.5px" }} />
                  </div>
                  <div className="row justify-content-center">
                    <span>{reservation.diffDays} ngày</span>
                  </div>
                </div>
                <div className="col-4 no-padding">
                  <div className="row justify-flex-end">
                    <label>Check Out</label>
                  </div>
                  <div className="row justify-flex-end">
                    <span>{reservation.checkOut}</span>
                  </div>
                </div>
              </div>
              <div className="row" style={{ paddingTop: "20px" }}>
                <div className="col-6 no-padding">
                  <label style={{ marginRight: "20px" }}>Chi phí </label>
                  <span style={{ color: "#f52200" }}>${reservation.cost}</span>
                </div>
                <div className="col-6 no-padding justify-flex-end">
                  <label style={{ marginRight: "20px" }}>Bao gồm </label>
                  <span>
                    {reservation.adult} Người lớn -{" "}
                    {reservation.children} Trẻ em
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <label
              style={{
                margin: "40px 0 20px 15px",
                width: "100%",
                paddingBottom: "20px",
              }}
              className="bottom-line"
            >
              Thông tin của bạn
            </label>
            <div className="row">
              <div className="col-6">
                <div className="row">
                  <label style={{ marginRight: "10px" }}>Tên: </label>
                  <span>{reservation.name}</span>
                </div>
                <div className="row">
                  <label style={{ marginRight: "10px" }}>Email: </label>
                  <span>{reservation.email}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="row">
                  <label style={{ marginRight: "10px" }}>Địa chỉ: </label>
                  <span>{reservation.address}</span>
                </div>
                <div className="row">
                  <label style={{ marginRight: "10px" }}>Số điện thoại: </label>
                  <span>{reservation.phone}</span>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginLeft: "18px" }}>
              <label style={{ marginRight: "10px" }}>Ghi chú: </label>
              <span>{reservation.note}</span>
            </div>
          </div>
        </>
      </div>
      <div
        className="row justify-flex-end"
        style={{ maxWidth: "1300px", margin: "20px auto" }}
      >
        <Button onClick={onNext} style={{ width: "100px" }}>
          Tiếp theo
        </Button>
      </div>
    </>
  );
};

const Payment = ({ reservation, onPrevious, onNext }) => {
  const [loading, setLoading] = useState(false);
  const paymentHandler = (details, data) => {
    setLoading(true);
    const requestData = Object.assign({roomId: reservation.room.id, hotelId: reservation.hotel.id}, reservation);
    delete  requestData.hotel;
    delete  requestData.room;
    service
      .post("/reservations", requestData)
      .then((res) => {
        setLoading(false);
        service
          .post("/reservations/mail", requestData)
          .then((res) => res)
          .catch((e) => console.log(e));
        onNext();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <span>
          Phòng bạn muốn đặt có mức phí trả trước là{" "}
          <strong>{reservation.room.prepay || 0}%</strong>.
        </span>
        <span>
          Bạn cần trả trước{" "}
          <strong>
            {(reservation.cost * (reservation.room.prepay || 0)) / 100}$
          </strong>
        </span>
      </div>
      {reservation.room.prepay === 0 || !reservation.room.prepay ? (
        <Button onClick={paymentHandler} style={{ width: "100px" }}>
          Tạo đơn
        </Button>
      ) : (
        <div className="payment">
          <PaypalBtn
            amount={(reservation.cost * (reservation.room.prepay || 0)) / 100}
            currency={"USD"}
            onSuccess={paymentHandler}
            paypalId={reservation.hotel.paypalId}
          />
        </div>
      )}
      <div
        className="row justify-flex-start"
        style={{ maxWidth: "1300px", margin: "20px 0px" }}
      >
        <Button onClick={onPrevious} style={{ width: "100px" }}>
          Trở về
        </Button>
      </div>
    </>
  );
};

const CompleteReservation = ({ onSubmitProgress }) => {
  return (
    <>
      <div className="complete_reservation">
        <div className="row">
          <span style={{ margin: "auto" }}>
            Cảm ơn đã sử dụng dịch vụ của chúng tôi. Đơn của bạn đã được gửi đến
            khách sạn. Chúng tôi sẽ liên hệ với bạn để xác nhận việc đặt phòng,
            xin hãy kiểm tra email thường xuyên.
          </span>
        </div>
        <div className="row">
          <Tick size={200} />
        </div>
      </div>
      <div
        className="row justify-content-center"
        style={{ maxWidth: "1300px", margin: "20px auto" }}
      >
        <Button
          onClick={onSubmitProgress}
          type={"secondary"}
          style={{ width: "100px" }}
        >
          Trang chủ
        </Button>
      </div>
    </>
  );
};

export default Reservation;
