import React, { useEffect, useState } from "react";
import ImageUploader from "react-images-upload";
import { storage } from "../../../firebase/firebase";
import service from "../../../service/service";
import { Modal, Button, TextField } from "../../../components";
import {NotificationManager} from "react-notifications"
const AddAdmin = ({ show, handleClose, onAddSuccess }) => {
  const [picture, setPicture] = useState([]);
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState("");
  const onDrop = (pic) => {
    setPicture(pic);
  };

  useEffect(() => {
    console.log("reset");
    set_name("");
    set_email("");
    set_password("");
    setPicture([]);
    setMsg("");
    setLoading(false)
  }, [show]);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    setLoading(true);
    handleFireBaseUpload()
      .then((image) => {
        const params = {
          avatar: image?image[0]: null,
          name,
          email,
          password,
          roleCode: "ADMIN"
        };
        service
          .post("/admins", params)
          .then((res) => {
            onAddSuccess(res.data);
            NotificationManager.success(
              "New admin have been added",
              "Success",
              2000
            );
            handleClose();
            setLoading(false)
          })
          .catch((err) => {
            setMsg(err.response.data.errors[0].default_message) 
            setLoading(false);
          });
      })
      .catch((err) => {
        setMsg(err.response.data.errors[0].default_message)
        setLoading(false);
        setMsg("Something went wrong when upload image, please try later");
      });
  };

  const handleFireBaseUpload = async () => {
    if (picture.length === 0) {
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
    <Modal show={show} handleClose={handleClose} maxWidth={800}>
      <div className="modal__content">
        <div className="row">
          <span style={{ color: "#de1414cf", fontSize: "15px" }}>{msg}</span>
        </div>
        <form onSubmit={handleAddAdmin}>
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Avatar</label>
                  <ImageUploader
                    withPreview
                    withIcon={true}
                    buttonText="Chọn hình ảnh"
                    onChange={(pic) => onDrop(pic)}
                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                    maxFileSize={5242880}
                    singleImage={true}
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>name</label>
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
                  <label>email</label>
                  <TextField
                    onChange={(e) => set_email(e.target.value)}
                    value={email}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>password</label>
                  <TextField
                    onChange={(e) => set_password(e.target.value)}
                    value={password}
                    type="password"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-flex-end">
            <Button
              disabled={loading}
              customClass="btn--block btn--primary"
              style={{ width: "100px" }}
              htmlType="submit"
              type="primary"
            >
              <strong>Add</strong>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AddAdmin;
