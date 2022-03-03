import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "../../../../components";
import ImageUploader from "react-images-upload";
import service from "../../../../service/service";
import { storage } from "../../../../firebase/firebase";
import { loadUser } from "../../../../actions/auth";
import { NotificationManager } from "react-notifications";

const Information = () => {
  const { user } = useSelector((store) => store.auth);
  const [name, set_name] = useState(user?.name);
  const [avatar, set_avatar] = useState(user?.avatar);
  const [new_avatar, set_new_avatar] = useState([]);
  const [phone, set_phone] = useState(user?.phone);
  const [address, set_address] = useState(user?.address);
  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    set_name(user?.name);
    set_avatar(user?.avatar);
    set_address(user?.address);
    set_phone(user?.phone);
  }, [user]);

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
              // console.log("Upload is " + progress + "% done");
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
          address,
          phone
        };
        service
          .put(`/accounts/${user.id}`, params)
          .then((res) => {
            NotificationManager.success(
              "Your account information has been updated successfully",
              "Updated",
              1500
            );
            dispatch(loadUser());
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
                imgExtension={[".jpg", ".gif", ".png", ".gif", ".jpeg"]}
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
              <label>Địa chỉ</label>
              <TextField
                value={address}
                onChange={(e) => set_address(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <label>Email</label>
              <TextField value={user?.email} disabled />
            </div>
            <div className="col-6">
              <label>Số điện thoại</label>
              <TextField
                value={phone}
                onChange={(e) => set_phone(e.target.value)}
              />
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
