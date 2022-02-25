import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "../../../../components";
import ImageUploader from "react-images-upload";
import service from "../../../../service/service";
import { storage } from "../../../../firebase/firebase";
import { loadAdmin } from "../../../../actions/auth";
import { NotificationManager } from "react-notifications";

const Information = () => {
  const { admin } = useSelector((store) => store.auth);
  const [name, set_name] = useState(admin?.name);
  const [avatar, set_avatar] = useState(admin?.avatar);
  const [new_avatar, set_new_avatar] = useState([]);
  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    set_name(admin?.name);
    set_avatar(admin?.avatar);
  }, [admin]);

  const onDrop = (pic) => {
    set_new_avatar(pic);
  };

  const handleFireBaseUpload = async () => {
    let result = await Promise.all(
      new_avatar.map((el) => {
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
                  let data = { ...new_avatar, imageUrl: [] };
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

  const onSave = (e) => {
    e.preventDefault();
    set_loading(true);
    handleFireBaseUpload()
      .then((image) => {
        const params = {
          avatar: image[0] || avatar,
          name,
        };
        service
          .put(`/admins/${admin.id}`, params)
          .then((res) => {
            NotificationManager.success(
              "Thông tin tài khoản của bạn đã được cập nhật",
              "Đã cập nhật",
              1500
            );
            dispatch(loadAdmin());
            set_loading(false);
          })
          .catch((err) => {
            console.log(err);
            NotificationManager.error(
              "Có lỗi xảy ra, vui lòng thử lại sau",
              "Có lỗi xảy ra",
              2000
            );
            set_loading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error(
          "Có lỗi xảy ra, vui lòng thử lại sau",
          "Có lỗi xảy ra",
          2000
        );
      });
  };
  return (
    <div className="tab-component">
      <div className="tab__content">
        <form className="card profile_card" onSubmit={onSave}>
          <div className="row">
            {avatar ? (
              <div className="uploadPictureContainer">
                <div className="deleteImage" onClick={() => set_avatar(null)}>
                  X
                </div>
                <img className="uploadPicture" alt="preview" src={avatar} />
              </div>
            ) : (
              <ImageUploader
                withPreview
                singleImage={true}
                withIcon={true}
                buttonText="Chọn hình ảnh"
                onChange={(pic) => onDrop(pic)}
                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                maxFileSize={5242880}
              />
            )}
          </div>
          <div className="row">
            <div className="col-6">
              <label>Tên</label>
              <TextField
                value={name}
                onChange={(e) => set_name(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label>Email</label>
              <TextField value={admin?.email} disabled />
            </div>
          </div>
          <div className="row justify-flex-end">
            <Button
              customClass="btn--block btn--primary"
              style={{ width: "100px" }}
              htmlType="submit"
              disabled={loading}
              type="primary"
            >
              <strong>Lưu</strong>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Information;
