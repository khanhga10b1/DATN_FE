import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  FilterTable,
  Modal,
  Button,
  Spinner,
  Feather,
  TextField,
  SmallCard,
} from "../../../components";

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
import InforModal from "./InforModal";
const MyReservations = () => {
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [checkInFrom, setCheckinFrom] = useState(null);
  const [checkOutFrom, setCheckOutFrom] = useState(null);
  const [checkInTo, setCheckinTo] = useState(null);
  const [checkOutTo, setCheckOutTo] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [content, setContent] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPages] = useState(0);
  const [searchText, setSearchText] = useState("");

  useEffect(()=>{
        service
        .get("/hotels")
        .then((res) => {
          setHotel(res.data.hotels);
        })
        .catch((err) => {
          console.log(err);
        });
  },[])
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

  useEffect(() => {
      setLoading(true);
      service
        .get("/rooms")
        .then((res) => {
          setRooms(res.data.rooms);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

        onSearchRequestHandler();
  }, []);

  const onSearchRequestHandler = async () => {
    setLoading(true);
    await service
      .get("reservations/filter", {
        params: {
            customerId : user.id, 
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
          <td>{hotel.find((r) => r.id === _item.hotelId)?.name}</td>
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
          <td>{moment(_item.created).format("DD/MM/YYYY")}</td>
        </tr>
      ));
    setContent(tableContent);
  }, [tableData, searchText, rooms, hotel]);

  let modal = null;
  
  return (
    <div className="hotel-reservation">
      {modal}
      <form onSubmit={onSubmitSearch}>
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
          <FilterTable tableData={content} head={["Code", "Khách sạn"
          , "Phòng", "Email", "Check in", "Check out","Tổng ngày",
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
      <InforModal
      show = {showModal}
      handleClose = {() => setShowModal(false)}
      selectedRow = {selectedRow}
      rooms = {rooms}
      />
    </div>
  );
};

export default MyReservations;
