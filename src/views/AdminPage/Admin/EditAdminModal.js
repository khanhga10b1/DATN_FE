import React, { useEffect, useState } from "react";
import ImageUploader from "react-images-upload";
import { storage } from "../../../firebase/firebase";
import service from "../../../service/service";
import { Modal, Button, TextField } from "../../../components";
import {NotificationManager} from "react-notifications";
const EditAdmin = ({ show, admin, handleClose, onEditSuccess }) => {
  const [picture, setPicture] = useState([]);
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, set_images] = useState("");

  const [msg, setMsg] = useState("");
  const onDrop = (pic) => {
    setPicture(pic);
  };

  useEffect(() => {
    set_name(admin.name);
    set_email(admin.email);
    set_images(admin.avatar);
    setPicture([]);
    setMsg("");
    setLoading(false);
  }, [show]);

  const handleEditAdmin = (e) => {
    e.preventDefault();
    setLoading(true);
    handleFireBaseUpload()
      .then((image) => {
        const params = {
          avatar: image ? image[0] : images,
          name,
          email,
        };
        service
          .put(`/admins/${admin.id}`, params)
          .then((res) => {
            onEditSuccess(res.data);
            NotificationManager.success(
              "Admin information have been updated",
              "Updated",
              2000
            );
            handleClose();
            setLoading(false);
          })
          .catch((err) => {
            setMsg(err.response.data.errors[0].default_message);
            setLoading(false);
          });
      })
      .catch((err) => {
        setMsg(err.response.data.errors[0].default_message);
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
        <form onSubmit={handleEditAdmin}>
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Avatar</label>
                  {images ? (
                    <div className="uploadPictureContainer" style={{margin: "auto", width: "75%"}}>
                      <div
                        className="deleteImage"
                        onClick={() => set_images(null)}
                      >
                        X
                      </div>
                      <img
                        className="uploadPicture"
                        alt="preview"
                        src={images}
                      />
                    </div>
                  ) : (
                    <ImageUploader
                      withPreview
                      withIcon={true}
                      buttonText="Chọn hình ảnh"
                      onChange={(pic) => onDrop(pic)}
                      imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                      maxFileSize={5242880}
                      singleImage={true}
                    />
                  )}
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
                  <TextField disabled
                    onChange={(e) => set_email(e.target.value)}
                    value={email}
                    type="text"
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
              <strong>Lưu</strong>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default EditAdmin;
