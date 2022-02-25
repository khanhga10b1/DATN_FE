import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";

import service from "../../../service/service";
import {
  Feather,
  SmallCard,
  Spinner,
  TextArea,
  TextField,
} from "../../../components";
import { mappingAmenity } from "../../../utils/amenities";
import { useHistory } from "react-router-dom";

const Rooms = (props) => {
  const [hotel, setHotel] = useState(null);
  const { hotelId, code } = props.match.params;
  const [sending, set_sending] = useState(false);
  const [rate, set_rate] = useState(5);
  const [name, set_name] = useState("");
  const [text, set_text] = useState("");
  const [msg, set_msg] = useState("");
  const history = useHistory();
  useEffect(() => {
    fetchHotel();
    service
      .get("/reservations", { params: {  code } })
      .then((res) => {
        if (res.data.length === 0) {
          set_msg("home");
        } else {
          service
            .get("/rating", { params: { code } })
            .then((res) => {
              if (res.data.length !== 0) set_msg("rated");
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchHotel = () => {
    set_sending(true);
    service
      .get(`/hotels/${hotelId}`)
      .then((res) => {
        setHotel(res.data);
        set_sending(false);
      })
      .catch((err) => {
        console.log(err);
        set_sending(false);
      });
  };

  const onReview = () => {
    if (name === "") return;
    service
      .post("/rating", {
        hotelId: hotelId,
        rate,
        code,
        name,
        text,
      })
      .then((res) => history.push(`/hotels/${hotelId}`))
      .catch((e) => console.log(e));
  };
  if (msg ==='home' || msg==='rated') history.push('/')
  return (
    <div className="main">
      {/* filter */}
      {hotel && (
        <>
          <div className="row" style={{ padding: "2rem 10rem" }}>
            <div className="col-md-6">
              <img src={hotel.image ? hotel.image[0] : ""} />
            </div>
            <div className="col-md-6">
              <div className="row">
                <h2>{hotel.name}</h2>
              </div>
              <div className="row">
                <StarRatings
                  rating={rate}
                  starRatedColor="#ff8939"
                  starDimension="25px"
                  starSpacing="3px"
                  changeRating={(r) => set_rate(r)}
                  numberOfStars={5}
                  name="rating"
                />
              </div>
              <div className="row">
                <label className="row">Your name</label>
                <TextField
                  defaultValue={name}
                  onChange={(e) => set_name(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <label className="row">Your review</label>
                <TextArea
                  defaultValue={text}
                  onChange={(e) => set_text(e.target.value)}
                />
              </div>
              <div className="row">
                <SmallCard
                  background={"rgb(255, 163, 123)"}
                  color={"#fff"}
                  onClick={onReview}
                >
                  <span className="status-label">Lưu</span>
                </SmallCard>
              </div>
            </div>
          </div>
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
        </>
      )}
      {sending && <Spinner />}
    </div>
  );
};

export default Rooms;
