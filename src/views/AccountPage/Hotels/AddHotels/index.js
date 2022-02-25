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
  Dropdown,
} from "../../../../components";
import { useSelector } from "react-redux";
import DropdownCheckBox from "../../../../components/DropdownCheckBox";

const amenityList = [
  {
    value: "Wifi",
    label: "Wifi",
  },
  {
    value: "Elevator",
    label: "Elevator",
  },
  {
    value: "Parking",
    label: "Parking",
  },
  {
    value: "Pool",
    label: "Pool",
  },
  {
    value: "Free Meal",
    label: "Free Meal",
  },
];

const AddHotel = ({ show, handleClose, onAddSuccess }) => {
  const [picture, setPicture] = useState([]);
  const [city, setCity] = useState("");
  const [name, set_name] = useState("");
  const [description, set_description] = useState("");
  const [email, set_email] = useState("");
  const [phone, set_phone] = useState("");
  const [address, set_address] = useState("");
  const [amenities, set_amenities] = useState([]);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPicture([]);
    setCity("");
    set_name("");
    set_description("");
    set_email("");
    set_phone("");
    set_address("");
    set_amenities([]);
    setMsg("");
  }, [show]);
  const [msg, setMsg] = useState("");
  const onDrop = (pic) => {
    setPicture(pic);
  };

  const handleAddHotel = (e) => {
    e.preventDefault();

    if (city === "") {
      setMsg("Please fill all fields");
      return;
    }
    setLoading(true);
    handleFireBaseUpload()
      .then((image) => {
        const params = {
          accountId: user.id,
          image,
          name,
          amenities,
          address,
          city,
          email,
          phone,
          description,
        };
        console.log(params);
        service
          .post("/hotels", params)
          .then((res) => {
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
        setMsg("Something went wrong when upload image, please try later");
      });
  };

  const handleFireBaseUpload = async () => {
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
      Tạo khách sạn của bạn bằng cách điền đầy đủ thông tin dưới đây
      </div>
      <div className="modal__content">
        <div className="row">
          <span style={{ color: "#de1414cf", fontSize: "15px" }}>{msg}</span>
        </div>
        <form onSubmit={handleAddHotel}>
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Tên </label>
                  <TextField
                    onChange={(e) => set_name(e.target.value)}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label> Mô tả </label>
                  <TextArea
                    onChange={(e) => set_description(e.target.value)}
                    type="text"
                    required
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
                    imgExtension={[".jpg", ".gif", ".png", ".gif", ".jpeg"]}
                    maxFileSize={5242880}
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Tiện ích </label>
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
              </div>
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Email</label>
                  <TextField
                    onChange={(e) => set_email(e.target.value)}
                    type="email"
                    required
                  />
                </div>

                <div className="form-group" style={{ width: "100%" }}>
                  <label>Số điện thoại </label>
                  <TextField
                    onChange={(e) => set_phone(e.target.value)}
                    type="text"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-6 no-padding">
                    <div className="form-group" style={{ width: "100%" }}>
                      <label>Địa chỉ</label>
                      <TextField
                        onChange={(e) => set_address(e.target.value)}
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-6" style={{ paddingRight: "0" }}>
                    <div className="form-group" style={{ width: "100%" }}>
                      <label> Thành phố</label>
                      <Dropdown
                        onChange={(e) => setCity(e.value)}
                        defaultValue={{ value: city, label: city }}
                        options={cityList.map((c) => {
                          return {
                            value: c,
                            label: c,
                          };
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-flex-end">
            <Button
              customClass="btn--block btn--primary"
              style={{ width: "100px" }}
              htmlType="submit"
              disabled={loading || !picture.length}
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
export default AddHotel;
