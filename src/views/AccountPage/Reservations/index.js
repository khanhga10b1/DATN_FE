import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  FilterTable,
  Modal,
  Input,
  Button,
  Spinner,
  Feather,
  TextField,
  SmallCard,
} from "../../../components";
import ReasonModal from "./ReasonModal";

import { TablePagination, Grid } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import service from "../../../service/service";
import DateFnsUtils from "@date-io/date-fns";
import { diffDays } from "../../../utils/dateUtil";
import { useSelector } from "react-redux";
import { mappingStatus } from "../../../utils/statusUtil";
const Reservations = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [filterByRoom, setFilterByRoom] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [checkInFrom, setCheckinFrom] = useState(null);
  const [checkOutFrom, setCheckOutFrom] = useState(null);
  const [checkInTo, setCheckinTo] = useState(null);
  const [checkOutTo, setCheckOutTo] = useState(null);
  const [filterRoom, setFilterRoom] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [content, setContent] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const compareBy = (key) => {
    return function (a, b) {
      if (a[key] > b[key]) return -1;
      if (a[key] < b[key]) return 1;
      return 0;
    };
  };

  const sortBy = (key) => {
    let arrayCopy = [...tableData];
    arrayCopy.sort(compareBy(key));
    setTableData(arrayCopy);
  };

  const fetchOwnHotels = () => {
    setLoading(true);
    service
      .get("/hotels", { params: {  accountId: user.id } })
      .then((res) => {
        setHotels(res.data.hotels);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      setLoading(true);
      service
        .get("/rooms", { params: { hotelId: hotels[0].id } })
        .then((res) => {
          setRooms(res.data.rooms);
          setFilterByRoom(res.data.rooms);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      onSearchRequestHandler(hotels[0].id);
    } else setLoading(false);
  }, [hotels]);

  useEffect(() => {
    fetchOwnHotels();
  }, []);

  const onSearchRequestHandler = async () => {
    setLoading(true);

    await service
      .get("/reservations/filter", {
        params: {
            hotelId: hotels[0].id,
            status: filterStatus,
            roomIds: filterRoom?.map(room => room.id).join(","),
            checkInFrom: checkInFrom,
            checkInTo: checkInTo,
            checkOutFrom: checkOutFrom,
            checkOutTo: checkOutTo,
        },
      })
      .then((response) => {
        setTableData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    // sortBy("created");
  };
  const onSubmitSearch = (event) => {
    event.preventDefault();
    onSearchRequestHandler();
  };

  const toggleShowModal = (event, selectedRow, show) => {
    event.preventDefault();
    setShowModal(show);
    setSelectedRow(selectedRow);
  };
  const handleChangePage = (event, page) => {
    setPages(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  useEffect(() => {
    const tableContent = tableData
      .filter((data) => {
        const temp = `${rooms.find((r) => r.id === data.roomId)?.name}-${
          data.code
        }-${data.checkIn}-${data.checkOut}-${data.email}-${data.phone}-${
          data.status
        }`;
        return temp
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase());
      })
      .slice((page + 1) * rowsPerPage - rowsPerPage, (page + 1) * rowsPerPage)
      .map((_item, index) => (
        <tr
          className="text-center"
          key={index}
          onClick={(event) => toggleShowModal(event, _item, true)}
        >
          <td>{_item.code}</td>
          <td>{rooms.find((r) => r.id === _item.roomId)?.name}</td>
          <td>{_item.email}</td>
          <td>{moment(_item.checkIn).format("DD/MM/YYYY")}</td>
          <td>{moment(_item.checkOut).format("DD/MM/YYYY")}</td>
          <td>{diffDays(moment(_item.checkIn), moment(_item.checkOut))}</td>
          <td>
           {
           _item.status==='canceled' && 
           <SmallCard
              background={mappingStatus(_item.status).bg}
              color={mappingStatus(_item.status).color}
              style ={{margin: "auto"}}
            >
              <span className="status-label">{_item.status}</span>
            </SmallCard>}
          </td>
          <td>{moment(_item.createdDate).format("DD/MM/YYYY")}</td>
        </tr>
      ));
    setContent(tableContent);
  }, [tableData, searchText]);

  const filter1 = [
    { value: "confirmed", label: "Confirmed" },
    { value: "canceled", label: "Canceled" },
  ];
  const filter2 =
    filterByRoom.map((suggestion) => ({
      value: suggestion.id,
      label: suggestion.name,
    })) || [];
  const [confirmModal, setConfirmModal] = useState(false);
  let modal = null;
  if (selectedRow) {
    const selectedRoom = rooms.find((r) => r.id === selectedRow.roomId);
    const diff_days = diffDays(
      moment(selectedRow.checkIn),
      moment(selectedRow.checkOut)
    );
    modal = (
      <Modal
        show={showModal}
        handleClose={() => setShowModal(false)}
        maxWidth={1200}
      >
        <div className="reservation" style={{ boxShadow: "none" }}>
          <>
            <div className="row">
              <div className="col-7">
                <div className="bottom-line" style={{ paddingBottom: "20px" }}>
                  <div className="row">
                    <span className="reservation__code">
                      code : {selectedRow.code}
                    </span>
                  </div>
                </div>
                <div
                  className="row bottom-line"
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}
                >
                  <label style={{ marginRight: "20px" }}>Phòng</label>
                  <span>{selectedRoom.name}</span>
                </div>
                <div
                  className="row bottom-line"
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}
                >
                  <div className="col-4 no-padding">
                    <div className="row justify-flex-start">
                      <label>Check In</label>
                    </div>
                    <div className="row justify-flex-start">
                      <span>
                        {moment(selectedRow.checkIn).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="col-4 no-padding">
                    <div className="row justify-content-center">
                      <Feather
                        name="Clock"
                        style={{ marginBottom: "11.5px" }}
                      />
                    </div>
                    <div className="row justify-content-center">
                      <span>
                        {diff_days} {diff_days > 1 ? "days" : "day"}
                      </span>
                    </div>
                  </div>
                  <div className="col-4 no-padding">
                    <div className="row justify-flex-end">
                      <label>Check Out</label>
                    </div>
                    <div className="row justify-flex-end">
                      <span>
                        {moment(selectedRow.checkOut).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ paddingTop: "20px" }}>
                  <div className="col-6 no-padding">
                    <label style={{ marginRight: "20px" }}>Chi phí</label>
                    <span style={{ color: "#f52200" }}>
                      ${selectedRow.cost}
                    </span>
                  </div>
                  <div className="col-6 no-padding justify-flex-end">
                    <label style={{ marginRight: "20px" }}>Khách</label>
                    <span>
                      {selectedRow.adult}{" "} người lớn -{" "}
 -{" "}
                      {selectedRow.children} trẻ em
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-5"
                style={{ borderLeft: "1px solid #E0E7FF", paddingLeft: "40px" }}
              >
                <div className="row">
                  <label
                    style={{
                      margin: "0 0 20px 0",
                      width: "100%",
                      paddingBottom: "20px",
                      color: "#216ba5",
                    }}
                    className="bottom-line"
                  >
                    Thông tin khách
                  </label>
                  <div className="row">
                    <div className="row">
                      <label style={{ marginRight: "10px" }}>Tên: </label>
                      <span>{selectedRow.name}</span>
                    </div>
                    <div className="row">
                      <label style={{ marginRight: "10px" }}>Email: </label>
                      <span>{selectedRow.email}</span>
                    </div>
                    <div className="row">
                      <label style={{ marginRight: "10px" }}>Địa chỉ: </label>
                      <span>{selectedRow.address}</span>
                    </div>
                    <div className="row">
                      <label style={{ marginRight: "10px" }}>Số điện thoại: </label>
                      <span>{selectedRow.phone}</span>
                    </div>
                    <div className="row">
                      <label style={{ marginRight: "10px" }}>Ghi chú: </label>
                      <span>{selectedRow.note}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
        {selectedRow.status === "confirmed" && (
          <div
            className="row justify-content-center"
            style={{ margin: "20px 0" }}
          >
            <Button
              customClass="btn--block btn--light mr-20"
              style={{ width: "150px" }}
              onClick={() => {
                setShowModal(false);
                setConfirmModal(true);
              }}
            >
              <strong>Hủy bỏ </strong>
            </Button>
          </div>
        )}
      </Modal>
    );
  }

  const handleUpdateReservation = (params) => {
    setLoading(true);
    service
      .put(`/reservations/${selectedRow.id}`, {
        ...selectedRow,
        status: params.status,
        cancelReason: params.reason,
      })
      .then((res) => {
        console.log(res);
        const temp = [...tableData];
        const index = temp.findIndex((r) => r.id === selectedRow.id);
        if (index !== -1) {
          temp[index] = res.data;
          setTableData(temp);
        }
        setConfirmModal(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <div className="hotel-reservation">
      {modal}
      <form onSubmit={onSubmitSearch}>
        <div className="row">
          <Input
            suggestions={filter1}
            name="filterStatus"
            label="Lọc theo trạng thái"
            getOptions={(value, name) => {
              const options = [];
              if (value) value.map((_item) => options.push(_item.value));
              setFilterStatus(options);
            }}
          />
          <Input
            suggestions={filter2}
            name="filterRoom"
            label="Lọc theo phòng"
            getOptions={(value, name) => {
              const options = [];
              if (value) value.map((_item) => options.push(_item.value));
              setFilterRoom(options);
            }}
          />
        </div>
        <div className="row">
          <Grid item className="col1">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item sm={12} className="col1">
                <KeyboardDatePicker
                  margin="normal"
                  id="mui-pickers-date"
                  label="Check In từ ngày"
                  value={checkInFrom}
                  name="checkInFrom"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setCheckinFrom(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
              <Grid item sm={12} className="col1">
                <KeyboardDatePicker
                  margin="normal"
                  id="mui-pickers-date"
                  label="Check In đến ngày"
                  value={checkInTo}
                  name="checkInTo"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setCheckinTo(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item className="col1">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item sm={12} className="col1">
                <KeyboardDatePicker
                  margin="normal"
                  id="mui-pickers-date"
                  label="Check Out từ ngày"
                  value={checkOutFrom}
                  name="checkOutFrom"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setCheckOutFrom(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
              <Grid item sm={12} className="col1">
                <KeyboardDatePicker
                  margin="normal"
                  id="mui-pickers-date"
                  label="Check Out đến ngày"
                  value={checkOutTo}
                  name="checkOutTo"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setCheckOutTo(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </div>
        <div className="row">
          <Button
            htmlType="submit"
            style={{ width: "70px", margin: "2rem auto" }}
          >
            Lọc
          </Button>
        </div>
      </form>
      <div className="row">
        <div className="col-12 search-form">
          <TextField
            label="Some "
            type={"text"}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              endAdornment: (
                <div className="toggle-password">
                  <Feather name="Search" />
                </div>
              ),
            }}
            required
          />
        </div>
        <div className="col-12">
        <FilterTable tableData={content} head={["Code", "Phòng", "Email", "Check in", "Check out","Tổng ngày",
        " Trạng thái ", "Ngày tạo"]} />
        </div>
      </div>
      <div className="row justify-flex-end">
        <TablePagination
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          component="div"
          count={tableData.length}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>
      {loading && <Spinner />}

      <ReasonModal
        show={confirmModal}
        handleClose={() => setConfirmModal(false)}
        msg={"Xác nhận hủy đơn này?"}
        onConfirm={(reason) =>
          handleUpdateReservation({
            status: "canceled",
            reason,
          })
        }
      />
    </div>
  );
};

export default Reservations;
