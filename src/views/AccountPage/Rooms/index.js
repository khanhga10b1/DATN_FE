import React, { useEffect, useState } from "react";

import { Feather, SmallCard } from "../../../components";
import service from "../../../service/service";
import { useSelector } from "react-redux";
import AddRoom from "./AddRoom";
import { CircularProgress } from "@material-ui/core";
import { mappingStatus } from "../../../utils/statusUtil";
import ConfirmModal from "../../../components/ConfirmModal";
import EditRoom from "./EditRoom";
import RoomDetails from "./RoomDetails";

const Rooms = () => {
  const [addRoom, setAddRoom] = useState(false);
  const [editRoom, setEditRoom] = useState(false);
  const [viewRoom, setViewRoom] = useState(false);
  const [deleteRoom, setDeleteRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState({});
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const fetchOwnHotels = () => {
    setLoading(true);
    service
      .get("/hotels", { params: {  accountId: user.id } })
      .then((res) => {
        setHotels(res.data.hotels);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      setLoading(true);
      service
        .get("/rooms", { params: {hotelId: hotels[0].id } })
        .then((res) => {
          setRooms(res.data.rooms);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else setLoading(false);
  }, [hotels]);
  
  useEffect(() => {
    fetchOwnHotels();
    setViewRoom(false)
  }, []);

  const onDeleteRoom = () => {
    console.log(hotels[0].id);
    service
      .delete(`/rooms/${selectedRoom.id}`, {
        params: { hotelId: hotels[0].id },
      })
      .then((res) => {
        setDeleteRoom(false);
        const temp = [...rooms];
        const index = temp.findIndex((r) => r.id === selectedRoom.id);
        if (index === -1) return;
        temp.splice(index, 1);
        setRooms(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if(viewRoom) return <RoomDetails room ={selectedRoom} hotels={hotels} setView = {(v) => setViewRoom(v)}/>

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : hotels.length === 0 ? (
        <div className="row justify-content-center">
          <span className="text-center" style={{ margin: "auto" }}>
          Đầu tiên, hãy tạo khách sạn của bạn
          </span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="row justify-content-center">
          <span className="text-center" style={{ margin: "auto" }}>
Khách sạn của bạn chưa có phòng nào. Hãy tạo phòng            <span className="hover-text" onClick={() => setAddRoom(true)}>
ở đây
            </span>
          </span>
        </div>
      ) : (
        <div className="relative" style={{ padding: "1.5rem" }}>
          <div className="row justify-flex-end">
            <Feather name="PlusCircle" onClick={() => setAddRoom(true)} />
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row">
                {rooms.map((room) => (
                  <div key={room.id} className="hotel__item col-md-3">
                    <img src={room.image[0]} />
                    <div className="bg"/>
                    <div className="hotel__info">
                      <h4 className="row md-3">{room.name}</h4>
                      <div className="hotel__tag">{room.price}$</div>
                      <div className="flex justify-content-between">
                        <SmallCard
                          background={mappingStatus(room.status).bg}
                          color={mappingStatus(room.status).color}
                        >
                          <span className="status-label">{room.status}</span>
                        </SmallCard>
                        <span style={{ fontWeight: "100" }}>
                          {room.area}m<sup>2</sup>
                        </span>
                      </div>
                      <div className="action-room">
                        <Feather name="Eye" 
                        onClick={() => {
                          setSelectedRoom(room);
                          setViewRoom(true);
                        }}
                        />
                        <Feather
                          name="Edit2"
                          onClick={() => {
                            setSelectedRoom(room);
                            setEditRoom(true);
                          }}
                        />
                        <Feather
                          name="Trash"
                          onClick={() => {
                            setSelectedRoom(room);
                            setDeleteRoom(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* filter */}

      <AddRoom
        hotelId={hotels && hotels[0] && hotels[0].id}
        show={addRoom}
        handleClose={() => setAddRoom(false)}
        onAddSuccess={(room) => setRooms([...rooms, room])}
      />
      <EditRoom
        hotelId={hotels && hotels[0] && hotels[0].id}
        show={editRoom}
        room={selectedRoom}
        handleClose={() => setEditRoom(false)}
        onEditSuccess={(room) => {
          const temp =[...rooms]
          const index = temp.findIndex(r => r.id === selectedRoom.id)
          temp[index] = room
          setRooms(temp)
        }}
      />
      <ConfirmModal
        show={deleteRoom}
        handleClose={() => setDeleteRoom(false)}
        msg={"Xác nhận xóa phòng"}
        onConfirm={onDeleteRoom}
      />
    </>
  );
};

export default Rooms;
