import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import StarRatings from "react-star-ratings";

import { useDispatch, useSelector } from "react-redux";
import { fetchListHotels } from "../../../redux/reducers/hotels/actions";
import { NavLink, useHistory } from "react-router-dom";
import { Dropdown, Feather, Spinner } from "../../../components";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import service from "../../../service/service";
import { setReservation } from "../../../redux/reducers/reservations/actions";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filtered_hotels, set_filtered_hotels] = useState(null);
  const [loading, set_loading] = useState(false);
  const { hotels } = useSelector((store) => store.hotels);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(fetchListHotels());
  }, []);

  useEffect(() => {
    dispatch(
      setReservation({
        checkIn: startDate,
        checkOut: endDate,
      })
    );
  }, [startDate, endDate]);
  const onGetAvailable = () => {
    set_loading(true);
    service
      .get("/hotels/available", {
        params: {
            checkIn: startDate,
            checkOut: endDate,
        },
      })
      .then((res) => {
        set_loading(false);
        set_filtered_hotels(res.data);
      })
      .catch((err) => {
        set_loading(false);
        console.log(err);
      });
  };

  return (
    <div className="main">
      <div className="homepage">
        <div className="bg"></div>

        {/* welcome  */}
        <div className="welcome">
          <h1 className="row">The K System</h1>
          <div className="row booking-form">
            <div className="welcome__block">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="mui-pickers-date"
                  label="Check In"
                  value={startDate}
                  name="checkInFrom"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="welcome__block">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="mui-pickers-date"
                  label="Check Out"
                  value={endDate}
                  name="checkInFrom"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="welcome__block" style={{ marginTop: "38px" }}>
              <div
                className="book_button cursor_pointer"
                onClick={onGetAvailable}
              >
                <span>Lọc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* hotels */}
      {filtered_hotels ? (
        <div className="filtered-hotels">
          {Object.keys(filtered_hotels).map((available_hotel, index) => {
            const _hotel = hotels.find(h => h.id === +available_hotel);
            return (
              <div className="filtered-hotels__item row" key={index}>
                <div
                  className="hotel row"
                  onClick={() => history.push(`/hotels/${available_hotel}`)}
                >
                  <div className="col-4">
                    <img src={_hotel.image[0]} style={{ maxWidth: "300px" }} />
                  </div>
                  <div className="col-8">
                    <div className="row mb-2">
                      <span
                        style={{
                          color: "#ff8939",
                          fontWeight: "600",
                          fontSize: "25px",
                        }}
                      >
                        {_hotel.name}
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span>{_hotel.address}</span>
                    </div>
                    <div className="row flex mb-2">
                      <Feather name="Mail" className="mr-10" />
                      <span>{_hotel.email}</span>
                    </div>
                    <div className="row flex mb-2">
                      <Feather name="Phone" className="mr-10" />
                      <span>{_hotel.phone}</span>
                    </div>
                    <div className="row">
                      <StarRatings
                        rating={_hotel.rate || 0}
                        starRatedColor="#ff8939"
                        starDimension="22px"
                        starSpacing="3px"
                        numberOfStars={5}
                        name="rating"
                      />{" "}
                    </div>
                  </div>
                </div>
                <div className="rooms row">
                  {filtered_hotels[available_hotel].map((room) => (
                    <div
                      key={room.id}
                      className="room col-md-3 cursor_pointer"
                      onClick={() =>
                        history.push(
                          `/hotels/${available_hotel}/rooms/${room.id}`
                        )
                      }
                    >
                      <img src={room.image[0]} />
                      <div className="room__info">
                        <h4 className="row md-3">{room.name}</h4>
                        <div className="room__tag">{room.price}$</div>
                        <div className="flex justify-content-between">
                          <div></div>
                          <div className="visit_button">
                            <NavLink
                              to={`/hotels/${available_hotel}/rooms/${room.id}`}
                            >
                              Đặt ngay
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="hotels">
          <div className="section text-center">
            <h2>Đặt phòng ngay</h2>
            <span>
              The K mang đến cho các bạn những lựa chọn phù hợp nhất để nghỉ
              ngơi. Hệ thống của chúng tôi tập hợp nhiều khách sạn với đầy đủ
              tiện nghi cũng như đa đạng về mức giá, dịch vụ. Hãy tận hưởng
              những chuyến đi của bạn.
            </span>
            <div className="book_button" style={{ margin: "1rem auto" }}>
              <NavLink to="/hotels">Xem thêm khách sạn</NavLink>
            </div>
          </div>
          <div className="section">
            {hotels && (
              <Slide
                easing="ease"
                // pauseOnHover={true}
                duration={5000}
                // autoplay={false}
              >
                {hotels.map((hotel) => (
                  <div
                    className="each-slide row flex cursor_pointer"
                    key={hotel.id}
                    onClick={() => history.push(`/hotels/${hotel.id}`)}
                  >
                    <div className="col-6">
                      <div
                        style={{
                          backgroundImage: `url(${hotel.image[0]})`,
                          backgroundSize: "cover",
                          height: "500px",
                          padding: "20px",
                        }}
                      ></div>
                    </div>
                    <div className="col-6 hotel__description">
                      <h2
                        style={{
                          padding: "0",
                          color: "#ffa37b",
                          marginBottom: "1rem",
                        }}
                      >
                        {hotel.name}
                      </h2>
                      <div className="row flex justify-content-start mb-3">
                        <Feather
                          name="MapPin"
                          style={{ marginRight: "0.5rem" }}
                        />
                        <span>{hotel.city}</span>
                      </div>
                      <div>
                        <StarRatings
                          rating={hotel.rate || 0}
                          starRatedColor="#ff8939"
                          starDimension="22px"
                          starSpacing="3px"
                          numberOfStars={5}
                          name="rating"
                        />
                      </div>
                      <span>{hotel.description}</span>
                    </div>
                  </div>
                ))}
              </Slide>
            )}
          </div>
        </div>
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default Dashboard;
