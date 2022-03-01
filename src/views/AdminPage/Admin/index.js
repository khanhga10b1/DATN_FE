import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  FilterTable,
  Spinner,
  Feather,
  TextField,
  SmallCard,
  Button,
} from "../../../components";
import { getInitialsName } from "../../../utils/mathUtil";
import ConfirmModal from "../../../components/ConfirmModal";
import { NotificationManager } from "react-notifications";

import { TablePagination, Avatar } from "@material-ui/core";
import service from "../../../service/service";
import { mappingStatus } from "../../../utils/statusUtil";
import AddAdmin from "./AddAdminModal";
import EditAdmin from "./EditAdminModal";
const Admins = () => {
  const [admins, set_admins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, set_confirm] = useState(null);
  const [content, setContent] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [add_modal, set_add_modal] = useState(false);
  const [edit_modal, set_edit_modal] = useState(null);
  const [_delete, set_delete] = useState(null);
  const compareBy = (key) => {
    return function (a, b) {
      if (a[key] > b[key]) return -1;
      if (a[key] < b[key]) return 1;
      return 0;
    };
  };

  const sortBy = (key) => {
    let arrayCopy = [...admins];
    arrayCopy.sort(compareBy(key));
    set_admins(arrayCopy);
  };

  useEffect(() => {
    setLoading(true);
    service
      .get("/admins")
      .then((res) => {
        set_admins(res.data);
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
    const tableContent = admins
      .filter((data) => {
        const temp = `${data.name}-${data.email}-${data.role.name}-${data.status}`;
        return temp
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase());
      })
      .slice((page + 1) * rowsPerPage - rowsPerPage, (page + 1) * rowsPerPage)
      .map((_item, index) => (
        <tr
          className="text-center"
          key={index}
          onClick={() => {
            if(_item.role.code === "SUPER_ADMIN") return;
            set_edit_modal(_item)
          }}
        >
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
          <td>{_item.role.name}</td>
          <td>
            <SmallCard
                onClick={(e) => {
                  if(_item.role.code ==="SUPER_ADMIN") return;
                  e.stopPropagation()
                  set_confirm(_item)
                }}
              background={mappingStatus(_item.status ? "Active" : "Blocked").bg}
              color={mappingStatus(_item.status ? "Active" : "Blocked").color}
              margin="auto"
            >
              <div className="status-label">
                {_item.status ? "Active" : "Blocked"}
              </div>
            </SmallCard>
          </td>
          <td>{moment(_item.createdDate).format("DD/MM/YYYY")}</td>
          <td>{moment(_item.updatedDate).format("DD/MM/YYYY")}</td>
          <td>
            {
              _item.role.code !== "SUPER_ADMIN" && <Feather name="Trash" onClick = {(e)=> {
                e.stopPropagation()
                set_delete(_item)
              }}/>
            }
          </td>
        </tr>
      ));
    setContent(tableContent);
  }, [admins, searchText]);

  const onDeleteAdmin = admin => {
    service.delete(`/admins/${admin.id}`).then((res) =>{
      const temp = [...admins]
      const index = temp.findIndex(t => t.id === _delete.id)
      if(index !== -1) temp.splice(index,1)
      set_admins(temp);
      set_delete(null)
      NotificationManager.success(
        "Admin has been removed",
        "Removed",
        2000
      );
    }).catch(e => {
      NotificationManager.error(
        "Có lỗi xảy ra, vui lòng thử lại sau",
        "Có lỗi xảy ra",
        2000
      );
    })
  }
  const onChangeStatus = () => {
    setLoading(true);
    service
      .put(`/admins/${confirm.id}`, {
        status: !confirm.status,
      })
      .then((res) => {
        setLoading(false);
        const temp = [...admins];
        const index = temp.findIndex((acc) => acc.id === confirm.id);
        if (index !== -1) {
          temp[index] = res.data;
        }
        set_confirm(null);
        set_admins(temp);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  return (
    <div className="hotel-reservation">
      <div className="row mb-5">
        <h3 style={{ color: "#0E3F66" }}>Quản lý quản trị viên</h3>
      </div>
      <div className="row">
        <div className="col-12 search-form flex justify-content-between">
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
          <Button
            type="secondary"
            style={{ width: "100px" }}
            onClick={() => set_add_modal(true)}
          >
            Thêm
          </Button>
        </div>
        <div className="col-12">
          <FilterTable
            tableData={content}
            head={[
              "Avatar",
              "Tên",
              "Email",
              "Quyền",
              "Trạng thái",
              "Ngày tạo",
              "Ngày cập nhật",
              ""
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
          count={admins.length}
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
      {

      }
      {confirm && (
        <ConfirmModal
          show={confirm}
          handleClose={() => set_confirm(null)}
          msg={`${
            confirm.status
              ? "This admin will be locked"
              : "This admin will be activated"
          }`}
          onConfirm={onChangeStatus}
        />
      )}
       {_delete && (
        <ConfirmModal
          show={_delete}
          handleClose={() => set_delete(null)}
          msg={"Are you sure to remove this admin?"}
          onConfirm={()=>onDeleteAdmin(_delete)}
        />
      )}
      <AddAdmin
        show={add_modal}
        handleClose={() => set_add_modal(false)}
        onAddSuccess={(new_admin) => set_admins([...admins, new_admin])}
      />
      {edit_modal && (
        <EditAdmin
          admin={edit_modal}
          show={edit_modal}
          handleClose={() => set_edit_modal(false)}
          onEditSuccess={(new_admin) => {
            const temp = [...admins];
            const index = temp.findIndex((t) => t.id === new_admin.id);
            if (index !== -1) temp[index] = new_admin;
            set_admins(temp);
          }}
        />
      )}
    </div>
  );
};

export default Admins;
