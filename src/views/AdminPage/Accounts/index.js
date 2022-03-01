import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  FilterTable,
  Spinner,
  Feather,
  TextField,
  SmallCard,
} from "../../../components";
import { getInitialsName } from "../../../utils/mathUtil";
import ConfirmModal from "../../../components/ConfirmModal";

import { TablePagination, Avatar } from "@material-ui/core";
import service from "../../../service/service";
import { mappingStatus } from "../../../utils/statusUtil";
const Accounts = () => {
  const [accounts, set_accounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, set_confirm] = useState(null);
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
    let arrayCopy = [...accounts];
    arrayCopy.sort(compareBy(key));
    set_accounts(arrayCopy);
  };

  useEffect(() => {
    setLoading(true);
    service
      .get("/accounts")
      .then((res) => {
        set_accounts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event, page) => {
    setPages(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  useEffect(() => {
    const tableContent = accounts
      .filter((data) => {
        const temp = `${data.name}-${data.email}-${data.address}-${data.phone}-${data.status}`;
        return temp
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase());
      })
      .slice((page + 1) * rowsPerPage - rowsPerPage, (page + 1) * rowsPerPage)
      .map((_item, index) => (
        <tr className="text-center" key={index}>
          <td>
            <Avatar
              src={_item?.avatar}
              style={{
                width: "50px",
                height: "50px",
                margin: "auto",
              }}
            >
              {getInitialsName(_item?.name)}
            </Avatar>
          </td>
          <td>{_item.name}</td>
          <td>{_item.email}</td>
          <td>{_item.address}</td>
          <td>{_item.phone}</td>
          <td>{_item.linked ? "Tài khoản Google" : "Tài khoản The K"}</td>
          <td>
            <SmallCard
                onClick={() => set_confirm(_item)}
              background={mappingStatus(_item.status ? "Active" : "Blocked").bg}
              color={mappingStatus(_item.status ? "Active" : "Blocked").color}
              margin="auto"
            >
              <span className="status-label">
                {_item.status ? "Active" : "Blocked"}
              </span>
            </SmallCard>
          </td>
          <td>{moment(_item.createdDate).format("DD/MM/YYYY")}</td>
          <td>{moment(_item.updatedDate).format("DD/MM/YYYY")}</td>
        </tr>
      ));
    setContent(tableContent);
  }, [accounts, searchText]);

  const onChangeStatus = () => {
    setLoading(true);
    service
      .put(`/accounts/changeStatus/${confirm.id}`, {
        status: !confirm.status,
      })
      .then((res) => {
        setLoading(false);
        const temp = [...accounts];
        const index = temp.findIndex((acc) => acc.id === confirm.id);
        if (index !== -1) {
          temp[index] = res.data;
        }
        set_confirm(null);
        set_accounts(temp);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  return (
    <div className="hotel-reservation">
      <div className="row mb-5">
        <h3 style={{ color: "#0E3F66" }}>Quản lý người dùng</h3>
      </div>
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
          <FilterTable
            tableData={content}
            head={[
              "Avatar",
              "Tên",
              "Email",
              "Địa chỉ",
              "SĐT",
              "Loại tài khoản",
              "Trạng thái",
              "Ngày tạo",
              "Ngày cập nhật",
            ]}
          />
        </div>
      </div>
      <div className="row justify-flex-end">
        <TablePagination
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          component="div"
          count={accounts.length}
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
      {confirm && (
        <ConfirmModal
          show={confirm}
          handleClose={() => set_confirm(null)}
          msg={`${
            confirm.status
              ? "Tài khoản này sẽ bị khóa"
              : "Tài khoản này sẽ được kích hoạt"
          }`}
          onConfirm={onChangeStatus}
        />
      )}
    </div>
  );
};

export default Accounts;
