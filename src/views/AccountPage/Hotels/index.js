import React, { useEffect, useState } from "react";

import { Feather, Spinner } from "../../../components";
import AddHotel from "./AddHotels";
import service from "../../../service/service";
import { useSelector } from "react-redux";
import ConfirmModal from "../../../components/ConfirmModal";
import { mappingAmenity } from "../../../utils/amenities";
import { CircularProgress } from "@material-ui/core";
import EditHotel from "./EditHotels";
import StarRatings from "react-star-ratings"
const Hotel = () => {
  const [addHotel, setAddHotel] = useState(false);
  const [deleteHotel, setDeleteHotel] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [hotels, setHotels] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const fetchOwnHotels = () => {
    setLoading(true);
    if (!user) return;
    service
      .get("/hotels", { params: {  accountId: user.id } })
      .then((res) => {
        setLoading(false);
        setHotels(res.data.hotels);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOwnHotels();
  }, []);

  const onDeleteHotel = () => {
    service
      .delete(`/hotels/${hotels[0].id}`, { params : {hotelId: hotels[0].id} })
      .then((res) => {
        setHotels([]);
        setDeleteHotel(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : hotels.length === 0 ? (
        <div className="row justify-content-center">
          <span className="text-center" style={{ margin: "auto" }}>
          Tạo khách sạn của bạn{" "}
            <span className="hover-text" onClick={() => setAddHotel(true)}>
            tại đây
            </span>
          </span>
        </div>
      ) : (
        <div className="relative">
          <div className="action">
            <Feather name="Edit2"  onClick={() => {
                setEditHotel(hotels[0]);
              }}/>
            <Feather
              name="Trash"
              onClick={() => {
                setDeleteHotel(true);
              }}
            />
          </div>
          <div className="main">
            <div className="homepage">
              <div
                className="bg"
                style={
                  hotels[0].image
                    ? { backgroundImage: `url(${hotels[0].image[0]})` }
                    : {}
                }
              ></div>

              {/* welcome  */}
              <div className="welcome">
                <h1 className="row" style ={{textAlign : "center"}}>{hotels[0].name}</h1>
                <div className="row">
            <span style = {{margin : "auto", color : "#ff8939", fontWeight: "bold", fontSize : "25px"}}>{Math.round(hotels[0].rate*10)/10}</span>
          </div>
          <div className="row">
            <StarRatings
              rating={hotels[0].rate || 0}
              starRatedColor="#ff8939"
              starDimension="30px"
              starSpacing="5px"
              numberOfStars={5}
              name="rating"
            />
          </div>
            <div className="row hotel__infor">
              <div className="row amenities">
                {hotels[0].amenities.map((amenity, index) => (
                  <div className="amenities__item" key={index}>
                    <img src={mappingAmenity(amenity)} alt={amenity}/>
                  </div>
                ))}
              </div>
              <div className="row hotel__infor__item">
                <span>{hotels[0].description}</span>
              </div>
              <div className="col-6" style={{ padding: "2rem" }}>
                <div className="row hotel__infor__item">
                  <Feather name="Mail" />
                  <span>{hotels[0].email}</span>
                </div>

                <div className="row hotel__infor__item">
                  <Feather name="Phone" />
                  <span>{hotels[0].phone}</span>
                </div>

                <div className="row hotel__infor__item">
                  <Feather name="Anchor" />
                  <span>{hotels[0].address}</span>
                </div>

                <div className="row hotel__infor__item">
                  <Feather name="MapPin" />
                  <span>{hotels[0].city}</span>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* filter */}

      <AddHotel
        show={addHotel}
        handleClose={() => setAddHotel(false)}
        onAddSuccess={(hotel) => setHotels([hotel])}
      />
      {editHotel &&  <EditHotel
        show={editHotel}
        handleClose={() => setEditHotel(false)}
        hotel = {editHotel}
        onAddSuccess={(hotel) => setHotels([hotel])}
      />}
      <ConfirmModal
        show={deleteHotel}
        handleClose={() => setDeleteHotel(false)}
        msg={"Xác nhận xóa khách sạn?"}
        onConfirm={onDeleteHotel}
      />
    </>
  );
};

export default Hotel;
