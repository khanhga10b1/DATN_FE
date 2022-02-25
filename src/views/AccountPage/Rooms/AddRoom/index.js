import React, { useEffect, useState } from "react";
import ImageUploader from "react-images-upload";
import { cityList } from "../../../../utils/cityUtil";
import { storage } from "../../../../firebase/firebase";
import service from "../../../../service/service";
import {
  Modal,
  Button,
  TextArea,
  TextField,
  Feather,
  Dropdown,
} from "../../../../components";
import DropdownCheckBox from "../../../../components/DropdownCheckBox";

const amenityList = [
  {
    value: "Wifi",
    label: "Wifi",
  },
  {
    value: "Hair Dryer",
    label: "Hair Dryer",
  },
  {
    value: "Air Conditioner",
    label: "Air Conditioner",
  },
  {
    value: "First Aid Box",
    label: "First Aid Box",
  },
  {
    value: "Free Meal",
    label: "Free Meal",
  },
];

const statusList = [
  {
    value: "Available",
    label: "Available",
  },
  {
    value: "Not Ready",
    label: "Not Ready",
  },
];
const AddRoom = ({ show, hotelId, handleClose, onAddSuccess }) => {
  const [picture, setPicture] = useState([]);
  const [name, set_name] = useState("");
  const [description, set_description] = useState("");
  const [price, set_price] = useState("");
  const [area, set_area] = useState("");
  const [status, set_status] = useState("Available");
  const [prepay, set_prepay] = useState(0);
  const [amenities, set_amenities] = useState([]);
  const [rules, set_rules] = useState(["Không hút thuốc"]);
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState("");
  const onDrop = (pic) => {
    setPicture(pic);
  };

  useEffect(() => {
    set_name("");
    set_description("");
    set_price("");
    set_amenities([]);
    set_area("");
    set_prepay(0);
    set_rules(["Không hút thuốc"]);
    setPicture([]);
    set_status("Available");
    setMsg("");
  }, [show]);
  const handleAddRoom = (e) => {
    e.preventDefault();
    setLoading(true);
    handleFireBaseUpload()
      .then((image) => {
        const params = {
          hotelId,
          image,
          amenities: amenities,
          rules: rules.filter((rule) => rule !== ""),
          name,
          description,
          price,
          prepay,
          area,
          status,
        };
        service
          .post("/rooms", params)
          .then((res) => {
            setLoading(false);
            onAddSuccess(res.data);
            handleClose();
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setMsg("Something went wrong when upload image, please try later");
      });
  };

  const handleFireBaseUpload = async () => {
    if (picture.length === 0) {
      setMsg("Please fill all fields");
      return;
    }
    let result = await Promise.all(
      picture.map((el) => {
        const nameUpload = el.name + new Date().getTime();
        return new Promise((resolve, reject) => {
          const uploadTask = storage.ref(`images/${nameUpload}`).put(el);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // console.log("Upload is " + progress + "% done");
            },
            reject,
            () => {
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  let data = { ...picture, imageUrl: [] };
                  data.imageUrl.push({ downloadURL, alt: el.alt });
                  resolve(data);
                });
            }
          );
        });
      })
    );
    return result.map((i) => i.imageUrl[0].downloadURL);
  };
  return (
    <Modal show={show} handleClose={handleClose} maxWidth={1200}>
      <div className="modal__title">
        Tạo phòng mới bằng cách điền đẩy đủ những thông tin dưới đây{" "}
      </div>
      <div className="modal__content">
        <div className="row">
          <span style={{ color: "#de1414cf", fontSize: "15px" }}>{msg}</span>
        </div>
        <form onSubmit={handleAddRoom}>
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Tên phòng</label>
                  <TextField
                    onChange={(e) => set_name(e.target.value)}
                    value={name}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Mô tả</label>
                  <TextArea
                    value={description}
                    onChange={(e) => set_description(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Hình ảnh</label>
                  <ImageUploader
                    withPreview
                    withIcon={true}
                    buttonText="Chọn hình ảnh"
                    onChange={(pic) => onDrop(pic)}
                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                    maxFileSize={5242880}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-4 no-padding">
                  <div className="form-group" style={{ width: "100%" }}>
                    <label>
                      Diện tích (m<sup>2</sup>)
                    </label>
                    <TextField
                      value={area}
                      onChange={(e) => set_area(e.target.value)}
                      type="number"
                      required
                    />
                  </div>
                </div>
                <div className="col-4" style={{ paddingRight: "0" }}>
                  <div className="form-group" style={{ width: "100%" }}>
                    <label>
                      Giá <sup>$/ngày</sup>
                    </label>
                    <TextField
                      value={price}
                      onChange={(e) => set_price(e.target.value)}
                      type="number"
                      required
                    />
                  </div>
                </div>
                <div className="col-4" style={{ paddingRight: "0" }}>
                  <div className="form-group" style={{ width: "100%" }}>
                    <label>Trả trước (%)</label>
                    <TextField
                      value={prepay}
                      onChange={(e) => set_prepay(e.target.value)}
                      type="number"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Trạng thái</label>
                  <Dropdown
                    onChange={(e) => set_status(e.value)}
                    defaultValue={{ value: status, label: status }}
                    options={statusList}
                  />
                </div>

                <div className="form-group" style={{ width: "100%" }}>
                  <label>Tiện ích</label>
                  <DropdownCheckBox
                    options={amenityList}
                    defaultValue={
                      amenities
                        ? amenities.map((amenity) => {
                            return {
                              value: amenity,
                              label: amenity,
                            };
                          })
                        : []
                    }
                    multiple={true}
                    handleChange={(e) => set_amenities(e.map((a) => a.value))}
                  />
                </div>
                <div className="form-group" style={{ width: "100%" }}>
                  <label className="row justify-content-start">
                    <span>Quy tắc trong phòng</span>
                    <Feather
                      name="PlusCircle"
                      style={{ marginLeft: "20px" }}
                      onClick={() => {
                        if (!rules[rules.length - 1]) {
                          set_rules([...rules, ""]);
                          return;
                        }
                        if (!rules[rules.length - 1]) return;
                        set_rules([...rules, ""]);
                      }}
                    />
                  </label>
                  {rules.map((rule, index) => (
                    <div className="row" key={index}>
                      <div className="row justify-flex-end">
                        <Feather
                          name="X"
                          style={{
                            color: "#b3b3b3",
                            width: "18px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const temp = [...rules];
                            temp.splice(index, 1);
                            set_rules(temp);
                          }}
                        />
                      </div>
                      <div className="row">
                        <div className="col-12 no-padding">
                          <TextField
                            value={rule}
                            type="text"
                            onChange={(e) => {
                              const temp = [...rules];
                              temp[index] = e.target.value;
                              set_rules(temp);
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
          <div className="row justify-flex-end">
            <Button
              disabled={loading || !picture.length}
              customClass="btn--block btn--primary"
              style={{ width: "100px" }}
              htmlType="submit"
              type="primary"
            >
              <strong>Thêm</strong>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AddRoom;
