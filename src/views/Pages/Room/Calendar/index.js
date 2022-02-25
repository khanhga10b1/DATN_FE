import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import service from '../../../../service/service';

const RoomCalendar = ({room}) => {
  const localizer = momentLocalizer(moment);
  const [room_reservation, set_room_reservation] = useState([]);

  useEffect(() => {
    if(room.id) {
      service
      .get("reservations/filter", {
        params: {
            room: room.id,
            status: ["waiting", "confirmed"],
        },
      })
      .then((response) => {
        set_room_reservation(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [room]);
  return (
    <div className="content" style={{ padding: "20px" }}>
      <Calendar
        events={room_reservation.map((r) => {
          const _out = new Date(r.checkOut)
          _out.setDate(_out.getDate() +1)
          return {
            id: r.id,
            // title: `Code : ${r.code}`,
            start: `${r.checkIn}`,
            end: `${_out}`,
          };
        })}
        views={["month"]}
        step={60}
        showMultiDayTimes
        defaultDate={new Date()}
        components={{
          timeSlotWrapper: ColoredDateCellWrapper,
        }}
        localizer={localizer}
        eventPropGetter={(event, start, end, isSelected) => {
          let newStyle = {
            backgroundColor: "#aeaeae `",
            height : "50px",
            color: "white",
            border: "none",
          };
          return {
            className: "rbc-block",
            style: newStyle,
          };
        }}
      />
    </div>
  );
};

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "#000",
    },
  });

export default RoomCalendar;
