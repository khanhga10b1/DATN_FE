import React from "react";
import { Slide } from "react-slideshow-image";
import { Feather } from "../../../../../components";
import { mappingAmenity } from "../../../../../utils/amenities";
import Pin from "../../../../../assets/icons/pin.svg";

const Details = ({ room, setView = () => {}, ...props }) => {
  return (
    <div className="main" style={{ padding: "20px" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="flex back-link" onClick={() => setView(false)}>
            <Feather name="ArrowLeft" />
            <span>Back</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h4 className="bottom-line mb-5" style={{ padding: "10px 0" }}>
            <span className="mr-20">{room.name}</span>
            <span className="price-tag">
              <span className="price-tag__main">{room.price} $/ngày</span>
            </span>
          </h4>
          {room.image && (
            <div style={{ margin: "auto" }}>
              <Slide  easing="ease" pauseOnHover={true} duration={2000} >
                {room.image.map((img) => (
                  <div
    className="fill"
    key={img}
    style={{backgroundImage: `url(${img})`}}
    />
                ))}
              </Slide>
            </div>
          )}
          <div className="row content__block bottom-line big-padding">
            <label>Mô tả</label>
            <span>{room.description}</span>
          </div>
          <div className="row content__block bottom-line big-padding">
            <label>Tiện ích</label>
            <div className="row amenities">
              {room.amenities.map((amenity, index) => (
                <div className="amenities__item" key={index}>
                  <img src={mappingAmenity(amenity)} alt={amenity} />
                </div>
              ))}
            </div>
          </div>
          <div className="row content__block bottom-line big-padding">
            <div className="col-md-6 no-padding">
              <label>Không gian</label>
              <span>
              Diện tích: {room.area} m <sup>2</sup>
              </span>
            </div>
            <div className="col-md-6 no-padding">
              <label>Quy tắc trong phòng</label>
              <div className="row">
                {room.rules &&
                  room.rules.map((rule, index) => (
                    <div className="col-md-6" key ={index}>
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
        </div>
      </div>
    </div>
  );
};

export default Details;
