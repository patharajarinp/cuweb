import React, { useState } from "react";
import ImageModalToggler from "./widget/ImageModalToggler";
import ModalImage from "./widget/ModalImage";
import ModalToggler from "./widget/ImageModalToggler";
import DragImage from "./drag/DragImage";

export default function ManageImage({
  setBannerdesk,
  bannerDesk,
  bannerM,
  setBannerM,
  deleted,
  setDeleted,
  onAction,
  max=5,
  editData
}) {
  const [modalShow, setModalShow] = useState(false);
  const [modalProps, setModalProps] = useState({
    id: null,
    type: "desktop",
    idx: null,
    img: null,
    link: "",
  });
  const [sizeUpload, setSizeUpload] = useState()

  const showModal = (bool, type, index) => {
    setModalShow(bool);
    // alert(type)
    if(type == 'desktop') setSizeUpload('(2608 x 848)')
    if(type == 'mobile') setSizeUpload('(750 x 422)')
    const init = type == "desktop" ? bannerDesk : bannerM;
    const data =
      index || index == 0 ? { ...init[index] } : { img: null, link: "" };
    setModalProps({ type, idx: index, ...data });
  };
  const handleModalClose = () => {
    setModalShow(false);
  };

  const MAX = max;

  const onDelete = (index, type, id) => {
    // event.preventDefault()
    // alert('asdasd')
    const init = type == "desktop" ? bannerDesk : bannerM;
    const setter = type == "desktop" ? setBannerdesk : setBannerM;
    let tmp = [...init];
    let tmp_deleted = [...deleted];
    tmp.splice(index, 1);
    tmp_deleted.push({ index, type, id });
    setter(tmp);
    setDeleted(tmp_deleted);
    if (onAction) onAction(true);
  };

  const onModalSubmit = (data) => {
    const { id, type, idx, file, link } = data;
    const init = type == "desktop" ? bannerDesk : bannerM;
    const setter = type == "desktop" ? setBannerdesk : setBannerM;
    // console.log('type',type)
    let tmp = [...init];

    if (idx || idx == 0) {
      tmp[idx] = {
        ...tmp[idx],
        img: file ? URL.createObjectURL(file) : tmp[idx].img,
        file,
        link,
        edited: id ? 1 : 0,
      };
    } else {
      tmp.push({ img: URL.createObjectURL(file), file, link });
    }
    // console.log(tmp)
    setter(tmp);
    if (onAction) onAction(true);
    // console.log('modal submitted',data)
  };

  const handleOrderChange = (data, type) => {
    // const init = type == 'desktop' ? bannerDesk : bannerM
    const setter = type == "desktop" ? setBannerdesk : setBannerM;
    // let tmp = [...init];
    setter(data);
    if (onAction) onAction(true);
  };

  // console.log('desk',bannerDesk)

  return (
    <div>
      <h3>จัดการภาพปก</h3>
      <div className="row mt-4">
        <div className="col-3 text-right">
          <h4>ภาพปกบนเดสก์ท็อป</h4>
        </div>
        <div className="col-9">
          <p className="blog-img-txt">
            ขนาดไฟล์สูงสุด 2.0 MB แต่ละรายการ รูปแบบไฟล์ภาพที่ยอมรับ: JPG, JPEG,
            PNG ขนาดที่แนะนำ: 2608 x 848 พิกเซล
          </p>
          <div className="d-flex">
            <DragImage
              banner={bannerDesk}
              type="desktop"
              handleOrderChange={handleOrderChange}
              showModal={showModal}
              onDelete={onDelete}
            />

            {bannerDesk.length < MAX && (
              <ModalToggler
                onClick={() => showModal(true, "desktop")}
                _text="เพิ่มรูปภาพ"
              />
            )}
          </div>
        </div>
      </div>
        {!editData?
        <div className="row mt-4">
                <div className="col-3 text-right">
                  <h4>ภาพปกบนโมบายไซต์</h4>
                </div>
                <div className="col-9">
                  <p className="blog-img-txt">
                    ขนาดไฟล์สูงสุด 2.0 MB แต่ละรายการ รูปแบบไฟล์ภาพที่ยอมรับ: JPG, JPEG,
                    PNG ขนาดที่แนะนำ: 750 x 422 พิกเซล
                  </p>
                  <div className="d-flex">
                    <DragImage
                      banner={bannerM}
                      type="mobile"
                      handleOrderChange={handleOrderChange}
                      showModal={showModal}
                      onDelete={onDelete}
                    />

                    {bannerM.length < MAX && (
                      <ModalToggler
                        onClick={() => showModal(true, "mobile")}
                        _text="เพิ่มรูปภาพ"
                      />
                    )}
                  </div>
                </div>
              </div>
        
        :null}
           
      <ModalImage
        sizeUpload={sizeUpload}
        show={modalShow}
        onSubmit={onModalSubmit}
        modalProps={modalProps}
        setModalProps={setModalProps}
        size="xl"
        onHide={handleModalClose}
      />
    </div>
  );
}
