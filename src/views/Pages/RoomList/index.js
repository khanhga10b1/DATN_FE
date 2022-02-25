import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  Feather,
  Spinner,
  TextField,
} from "../../../components";
import { NavLink, useHistory } from "react-router-dom";
import service from "../../../service/service";

const RoomList = () => {
  const [rooms, set_rooms] = useState([]);
  const [count, set_count] = useState(0);
  const [limit, set_limit] = useState(6);
  const [loading, set_loading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, set_sort] = useState({updatedDate : -1})
  const [selected, set_selected] = useState(0)
  const history = useHistory();
  useEffect(() => {
    getRooms();
  }, [sort]);

  const getRooms = () => {
    set_loading(true);
    service
      .get("/rooms", {
        params: {
            limit,
            offset: 0,
            columnSort: Object.keys(sort)[0],
            typeSort: Object.values(sort)[0] === 1 ? "ASC": "DESC",
            name: search?.trim()
        },
      })
      .then((res) => {
        set_loading(false);
        set_rooms(res.data.rooms);
        set_count(res.data.count);
      })
      .then((err) => {
        console.log(err);
        set_loading(false);
      });
  };

  return (
    <div className="main">
      <div className="section" style={{ padding: "20px" }}>
        <div className="welcome__block flex">
          <div className="col-12 search-form">
            <TextField
              value={search}
              placeholder="Tìm kiếm"
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <div className="toggle-password" onClick={getRooms}>
                    <Feather name="Search" />
                  </div>
                ),
              }}
            />
          </div>
        </div>
        <div className="welcome__block flex sort">
        <Button
            customClass={`btn--block btn--primary ${selected === 0 ? 'btn--selected' : ''}`}
            style={{ width: "150px" }}
            type="primary"
            onClick={()=>{
              set_sort({updatedDate : -1});
              set_selected(0)
            }}
          >
            <strong>Mới nhất</strong>
          </Button>
          <Button
            customClass={`btn--block btn--primary ${selected === 1 ? 'btn--selected' : ''}`}
            style={{ width: "150px" }}
            type="primary"
            onClick={()=>{
              set_selected(1)
              set_sort({updatedDate : 1})}}
          >
            <strong>Cũ nhất</strong>
          </Button>
          <Button
            customClass={`btn--block btn--primary ${selected === 2 ? 'btn--selected' : ''}`}
            style={{ width: "150px" }}
            type="primary"
            onClick={()=>{
              set_selected(2)
              set_sort({price : 1})}}
          >
            <strong>Giá tăng dần</strong>
          </Button>
          <Button
            customClass={`btn--block btn--primary ${selected === 3 ? 'btn--selected' : ''}`}
            style={{ width: "150px" }}
            type="primary"
            onClick={()=>{
              set_selected(3)
              set_sort({price : -1})}}
          >
            <strong>Giá giảm dần</strong>
          </Button>
        </div>
      </div>
      <div className="section">
        <div className="row">
          <div className="col-md-12">
            <div className="rooms row">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="room col-md-3 cursor_pointer"
                  onClick={() =>
                    history.push(`/hotels/${room.hotelId}/rooms/${room.id}`)
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
                          to={`/hotels/${room.hotelId}/rooms/${room.id}`}
                        >
                          Đặt ngay
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {count > rooms.length && (
              <div className="row">
                <Button
                  customClass="btn--primary"
                  style={{ width: "150px", margin: "auto" }}
                  type="primary"
                  onClick={() =>
                   {
                    set_loading(true);
                    service
                      .get("/rooms", {
                        params: {
                            limit,
                            offset: rooms.length,
                            columnSort: Object.keys(sort)[0],
                            typeSort: Object.values(sort)[0] === 1 ? "ASC": "DESC",
                            name: search?.trim()
                        },
                      })
                      .then((res) => {
                        set_loading(false);
                        set_rooms(rooms.concat(res.data.rooms));
                        set_count(res.data.count);
                      })
                      .then((err) => {
                        console.log(err);
                        set_loading(false);
                      });
                   }
                  }
                >
                  <strong>Xem thêm</strong>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default RoomList;
