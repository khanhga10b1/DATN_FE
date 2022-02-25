import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setModal } from "../../../../../redux/reducers/reservations/actions";

const RoomCalendar = ({room_reservation}) => {
  const localizer = momentLocalizer(moment);
  const dispatch = useDispatch()
  
  return (
    <div className="content" style={{ padding: "20px" }}>
      <Calendar
        events={room_reservation.map((r) => {
          console.log(typeof r.checkIn, r.checkIn);
          return {
            id: r.id,
            title: `Code : ${r.code}`,
            start: `${r.checkIn.substring(0,10)}T00:00:00.000Z`,
            end: `${r.checkOut.substring(0,10)}T00:00:00.000Z`,
            status: r.status,
            reservation: r,
          };
        })}
        views={["month", "week", "agenda"]}
        step={60}
        onSelectEvent={(ev) => {
          dispatch(setModal(ev.reservation))
        }}
        showMultiDayTimes
        defaultDate={new Date()}
        components={{
          timeSlotWrapper: ColoredDateCellWrapper,
        }}
        localizer={localizer}
        eventPropGetter={(event, start, end, isSelected) => {
          let newStyle = {
            backgroundColor: "#216ba5",
            color: "white",
            border: "none",
          };
          return {
            className: "",
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
