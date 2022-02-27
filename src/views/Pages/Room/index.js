import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import DatePicker from "react-datepicker";
import moment from "moment";

import service from "../../../service/service";
import { Spinner, TextArea, TextField } from "../../../components";
import {dateWithOutTime, diffDays} from "../../../utils/dateUtil";
import { useDispatch, useSelector } from "react-redux";
import { setReservation } from "../../../redux/reducers/reservations/actions";
import { useHistory } from "react-router-dom";
import { mappingAmenity } from "../../../utils/amenities";
import Pin from "../../../assets/icons/pin.svg";
import { randomString } from "../../../utils/mathUtil";
import NotificationManager from "react-notifications/lib/NotificationManager";
import Calendar from "./Calendar";

const Room = (props) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const { reservation } = useSelector((store) => store.reservations);
  const [hotel, setHotel] = useState({});
  const [room, setRoom] = useState({});
  const { hotelId, roomId } = props.match.params;
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    reservation ? reservation.checkIn : new Date()
  );
  const [endDate, setEndDate] = useState(
    reservation ? reservation.checkOut : new Date()
  );
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const { user } = useSelector((store) => store.auth);
  const [note, setNote] = useState("");
  useEffect(() => {
    fetchHotel();
    fetchRoom();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAddress(user.address);
      setPhone(user.phone);
    }
  }, [user]);
  const fetchHotel = () => {
    setLoading(true);
    service
      .get(`/hotels/${hotelId}`)
      .then((res) => {
        setHotel(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const fetchRoom = () => {
    setLoading(true);
    service
      .get(`/rooms/${roomId}`)
      .then((res) => {
        setRoom(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setReservation({
        name,
        address,
        email,
        phone,
        customerId: user?.id,
        code: randomString(15),
        checkIn: moment(startDate).format("DD/MM/YYYY"),
        checkOut: moment(endDate).format("DD/MM/YYYY"),
        cost: room.price * diffDays(startDate, endDate),
        hotel: hotel,
        room: room,
        note: note || "No Note",
        diffDays: diffDays(startDate, endDate),
          adult,
          children
      })
    );
    service
      .post("/reservations/checkdate", {
        roomId: roomId,
        checkIn: startDate,
        checkOut: endDate,
      })
      .then((res) => history.push("/reservation"))
      .catch((err) => {
        NotificationManager.warning(
          "Ngày bạn chọn không còn trống, xin hãy chọn ngày khác",
          "Ngày đã được đặt",
          3000
        );
      });
  };
  return (
    <div className="main">
      {/* filter */}
      {/* <div className="homepage">
        <div
          className="bg"
          style={
            hotel.image ? { backgroundImage: `url(${hotel.image[0]})` } : {}
          }
        ></div>

        <div className="welcome">
          <h1 className="row">{hotel.name}</h1>
        </div>
      </div> */}

      <div className="section">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-7">
                <h4 className="bottom-line mb-5" style={{ padding: "10px 0" }}>
                  <span className="mr-20">{room.name}</span>
                  <span className="price-tag">
                    <span className="price-tag__main">{room.price} $/ngày</span>
                  </span>
                </h4>
                {room.image && (
                  <Slide easing="ease" pauseOnHover={true} duration={3000}>
                    {room.image.map((img) => (
                      <div
                        className="fill"
                        key={img}
                        style={{ backgroundImage: `url(${img})` }}
                      ></div>
                    ))}
                  </Slide>
                )}
                <div className="row content__block bottom-line">
                  <label>Mô tả</label>
                  <span>{room.description}</span>
                </div>
                <div className="row content__block bottom-line">
                  <label>Tiện ích</label>
                  <div className="row amenities">
                    {room.amenities?.map((amenity, index) => (
                      <div className="amenities__item" key={index}>
                        <img src={mappingAmenity(amenity)} alt={amenity} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="row content__block bottom-line">
                  <div className="col-md-6 no-padding">
                    <label>Không gian</label>
                    <span>
                      Diện tích: {room.area} m <sup>2</sup>
                    </span>
                  </div>
                  <div className="col-md-6 no-padding">
                    <label>Lưu ý</label>
                    {room.rules &&
                      room.rules.map((rule, index) => (
                        <div className="row" key={index}>
                          <img
                            src={Pin}
                            width="20px"
                            height="20px"
                            style={{ marginRight: "1rem" }}
                          />
                          <span key={index}>{rule}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="col-md-5">
                <Calendar room={room} />
                <form className="booking-form" onSubmit={handleSubmit}>
                  <div className="booking-form__head">Tạo đơn đặt phòng</div>
                  <div className="booking-form__main">
                    <label className="row">Tên</label>
                    <TextField
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <label className="row">Địa chỉ</label>
                    <TextField
                      defaultValue={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />

                    <label className="row">Email</label>
                    <TextField
                      defaultValue={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                    <label className="row">Số điện thoại</label>
                    <TextField
                      defaultValue={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />

                    <div className="row">
                      <div className="col-6" style={{ paddingLeft: "0" }}>
                        <label className="row">Check in</label>
                        <DatePicker
                            minDate={new Date()}
                            disablePast={true}
                          selected={startDate}
                          onChange={(date) => {
                            if(dateWithOutTime(date) > dateWithOutTime(endDate)){
                              setEndDate(date)
                            }
                            setStartDate(date);
                          }}
                        />
                      </div>

                      <div className="col-6 no-padding">
                        <label className="row">Check out</label>
                        <DatePicker
                            minDate={startDate}
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6" style={{ paddingLeft: "0" }}>
                        <label className="row">Người lớn</label>
                        <TextField
                          type="number"
                          defaultValue={adult}
                          onChange={(e) => setAdult(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6 no-padding">
                        <label className="row">Trẻ em </label>
                        <TextField
                          type="number"
                          defaultValue={children}
                          onChange={(e) => setChildren(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <label className="row">Ghi chú</label>
                      <TextArea
                        defaultValue={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    <div className="row mt-3">
                      <label className="row">Giá</label>
                      <div className="row justify-content-between">
                        <div>
                          <span className="price-tag">
                            <span className="price-tag__main">
                              {room.price} $
                            </span>
                          </span>{" "}
                          x {diffDays(startDate, endDate)} ngày
                        </div>
                        <div>
                          = {room.price * diffDays(startDate, endDate)} $
                        </div>
                      </div>
                    </div>

                    <div className="row justify-flex-end">
                      <button
                        className="book_button cursor_pointer"
                        type="submit"
                      >
                        Đặt phòng
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default Room;
