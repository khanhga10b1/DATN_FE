import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import service from "../../../service/service";
import { Feather, Spinner } from "../../../components";
import { NavLink, useHistory } from "react-router-dom";
import { fetchListRooms } from "../../../redux/reducers/rooms/actions";
import { mappingAmenity } from "../../../utils/amenities";
import { getInitialsName } from "../../../utils/mathUtil";
import StarRatings from "react-star-ratings";
import { Avatar, Button } from "@material-ui/core";

const Rooms = (props) => {
  const { rooms, sending } = useSelector((store) => store.rooms);
  const [hotel, setHotel] = useState({});
  const { hotelId } = props.match.params;
  const [limit, set_limit] = useState(6);
  const dispatch = useDispatch();
  const history = useHistory();
  const [reviews, set_reviews] = useState([]);
  useEffect(() => {
    fetchHotel();
    dispatch(
      fetchListRooms({
        hotelId,
          limit,
          offset: 0,
      })
    );
    fetchReviews();
  }, []);

  const fetchHotel = () => {
    service
      .get(`/hotels/${hotelId}`)
      .then((res) => setHotel(res.data))
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchReviews = () => {
    service
      .get(`/rating`, { params:{ hotelId } })
      .then((res) => set_reviews(res.data))
      .then((e) => console.log(e));
  };
  return (
    <div className="main">
      {/* filter */}
      <div className="homepage">
        <div
          className="bg"
          style={
            hotel.image ? { backgroundImage: `url(${hotel.image[0]})` } : {}
          }
        ></div>

        {/* welcome  */}
        <div className="welcome">
          <h1 className="row" style ={{textAlign : "center"}}>{hotel.name}</h1>
          <div className="row">
            <span style = {{margin : "auto", color : "#ff8939", fontWeight: "bold", fontSize : "25px"}}>{Math.round(hotel.rate*10)/10}</span>
          </div>
          <div className="row">
            <StarRatings
              rating={hotel.rate || 0}
              starRatedColor="#ff8939"
              starDimension="30px"
              starSpacing="5px"
              numberOfStars={5}
              name="rating"
            />
          </div>
          <div className="row">
            <div className="row hotel__infor">
              <div className="row amenities">
                {hotel.amenities?.map((amenity) => (
                  <div className="amenities__item" key={amenity}>
                    <img src={mappingAmenity(amenity)} />
                  </div>
                ))}
              </div>
              <div className="row" style={{ padding: "2rem 8rem" }}>
                <div className="row hotel__infor__item">
                  <span>{hotel.description}</span>
                </div>
                <div className="col-6" style={{ padding: "2rem" }}>
                  <div className="row hotel__infor__item">
                    <Feather name="Mail" />
                    <span>{hotel.email}</span>
                  </div>

                  <div className="row hotel__infor__item">
                    <Feather name="Phone" />
                    <span>{hotel.phone}</span>
                  </div>

                  <div className="row hotel__infor__item">
                    <Feather name="Anchor" />
                    <span>{hotel.address}</span>
                  </div>

                  <div className="row hotel__infor__item">
                    <Feather name="MapPin" />
                    <span>{hotel.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="hotel__item col-md-3 cursor_pointer"
                  onClick={() =>
                    history.push(`/hotels/${hotelId}/rooms/${room.id}`)
                  }
                >
                  <img src={room.image[0]} />
                  <div className="hotel__info">
                    <h4 className="row md-3">{room.name}</h4>
                    <div className="hotel__tag">{room.price}$</div>
                    <div className="flex justify-content-between">
                      <div></div>
                      <div className="visit_button">
                        <NavLink to={`/hotels/${hotelId}/rooms/${room.id}`}>
                        Đặt ngay
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {hotel.rooms > rooms.length && (
          <div className="row">
            <Button
              customClass="btn--primary"
              style={{ width: "150px", margin: "auto" }}
              type="primary"
              onClick={() =>
                dispatch(
                  fetchListRooms(
                    {
                        hotelId,
                        limit,
                        offset: rooms.length
                    },
                    rooms
                  )
                )
              }
            >
              <strong>Xem thêm</strong>
            </Button>
          </div>
        )}
      </div>
      <div className="section" style={{ maxWidth: "1300px" }}>
        <div className="row">
          <div className="col-md-12" style={{ color: "black" }}>
            <h3 className="mb-5">Đánh giá</h3>
            {reviews.length == 0 ? (
              <span>Chưa có đánh giá</span>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="mb-5">
                  <div className="row">
                    <div>
                      <Avatar
                        src={review?.avatar}
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "10px",
                        }}
                      >
                        {getInitialsName(review?.name)}
                      </Avatar>
                    </div>
                    <div>
                      <div className="row">{review.name}</div>
                      <div className="row">
                        <StarRatings
                          rating={review.rate || 0}
                          starRatedColor="#ff8939"
                          starDimension="22px"
                          starSpacing="3px"
                          numberOfStars={5}
                          name="rating"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <span>{review.text}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {sending && <Spinner />}
    </div>
  );
};

export default Rooms;
