import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DivLoad from "./widget/DivLoad";
import api from "../../utils/api";
import EditCate from "./widget/ModalEditCate"
const Loading = (
  <div className="position-relative">
    <DivLoad loading={true} />
  </div>
);
const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => Loading,
});
// const TagInput = dynamic(() => import("reactjs-tag-input"), {
//   ssr: false,
//   loading: () => Loading,
// });
const suggestions = [
  { id: "Thailand", text: "Thailand" },
  { id: "India", text: "India" },
];

export default function ManageData({
  tags1,
  name,
  setname,
  type,
  cate,
  tag,
  typeid,
  onAction,
  onDeleteTags,
  cateSelect
}) {
  const [nameLength, setnameLength] = useState(0);
  const [types, settypes] = useState("");
  const [cates, setcates] = useState();
  const [tags, settags] = useState(tag ? tag : []);
  const [newTags, setnewTags] = useState("");
  const [distags, setdistags] = useState({ display: "none" });
  const [autocom, setautocom] = useState([]);
  const [typeId, settypeId] = useState(0);
  const [itemTags, setitemTags] = useState([
    "นิยาย",
    "นิยายรัก",
    "นิยายโรแมนติก",
    "ดาม่า",
  ]);
const [showCate, setShowCate] = useState(false)

  const fetchTag = () => {
    api
      .getTagsAll()
      .then(async (res) => {
        const data = res.data;
        let tag = [];
        data.forEach((val) => {
          tag.push(val.tag_name);
        });
        setitemTags(tag);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    // console.log('tag', tag)
    // console.log("cate", cate);
    settypes(type);
    // setcates(cate);
    settypeId(typeid);
    const data = name;
    setnameLength(data.length);
    fetchTag();
  }, [name]);
useEffect(() => {
setcates(cate);
  }, [cate]);
  const onAuto = async (value) => {
    var arry = [];
    for (let index = 0; index < itemTags.length; index++) {
      var str = itemTags[index];
      var res = str.search(value);
      if (res > -1) {
        arry.push(itemTags[index]);
      }
    }
    setautocom([...arry]);
    if (arry.length != 0) {
      setdistags({ display: "block" });
    } else {
      setdistags({ display: "none" });
      setautocom([]);
    }
    if (value == "") {
      setdistags({ display: "none" });
      setautocom([]);
    }
  };

  return (
    <div className="blog-manage-data">
      <h3>ข้อมูลทั่วไป</h3>
      <div className="row mt-4">
        <div className="col-3 text-right">
          <h4>เลือกประเภท</h4>
        </div>
        <div className="col-9">
          <p>{type}</p>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-3 text-right">
          <label>
            ชื่อเรื่อง
            <span className="text-pink">*</span>
          </label>
        </div>
        <div className="col-9">
          <div className="input-group">
            <input
              id="name"
              name="name_blog"
              type="text"
              className="blog-manage-data-name form-control"
              maxLength="120"
              defaultValue={name}
              onChange={(e) => {
                const data = e.target.value;
                if (name) setname(data);
                if (onAction) {
                  onAction(true);
                  if (data == "") {
                    onAction(false);
                  }
                }
                setnameLength(data.length);
              }}
              required
            />
            <div className="input-group-append">
              <span className="input-group-text"> {nameLength}/120</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-3 text-right">
          <label>
            หมวดหมู่
            <span className="text-pink">*</span>
          </label>
        </div>
        <div className="col-9">
          {cates&&cates.map((val, index) => (
            <span key={'cate'+Math.random()} className="mr-2 blog-list-status-data-up pt-1 pb-1 pr-2 pl-2 text-black-50">
              {val.name}
            </span>
          ))}
          <span className="cursor-pointer-edit" onClick={()=>setShowCate(true)}>แก้ไข</span>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-3 text-right">
          <label>แท๊ก (TAG)</label>
        </div>
        <div className="col-9">
          <div className="react-tag-input">
            {tags.map((tag, index) => (
              <div className="react-tag-input__tag" key={Math.random()}>
                <div className="react-tag-input__tag__content">{tag}</div>
                <div
                  className="react-tag-input__tag__remove"
                  onClick={() => {
                    var data = [...tags];
                    data.splice(index, 1);
                    settags(data);
                    if (onAction) {
                      onAction(true);
                    }
                    if (tags1) tags1(data);
                   if (onDeleteTags) onDeleteTags(tag);
                    // console.log(data, index);
                  }}
                />
              </div>
            ))}

            <input
              type="text"
              className="react-tag-input__input"
              placeholder="เพิ่มแท๊ก"
              value={newTags}
              onChange={(e) => {
                setnewTags(e.target.value);
                onAuto(e.target.value);
              }}
              // onBlur={(e) => {
              //  if (e.target.value !== "") {
              //    settags([...tags, e.target.value]);
              //     setnewTags("");
              //     if (tags1) tags1([...tags, e.target.value]);
              //     if (onAction) {
              //       onAction(true);
              //     }
              //  }
              // }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  settags([...tags, e.target.value]);
                  setnewTags("");
                  if (tags1) tags1([...tags, e.target.value]);
                  if (onAction) {
                    onAction(true);
                  }
                }
              }}
            />
          </div>
          <div className="autocomplete-suggestions" style={distags}>
            {autocom.map((item) => (
              <div
                key={Math.random()}
                className="autocomplete-suggestion"
                onClick={() => {
                  settags([...tags, item]);
                  setnewTags("");
                  setdistags({ display: "none" });
                  setautocom([]);
                  if (tags1) tags1([...tags, item]);
                  if (onAction) {
                    onAction(true);
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <EditCate  show={showCate} onHide={setShowCate} 
      onConfirm={(data)=>{
        setcates(data);
        if(cateSelect) cateSelect(data)
        if(onAction) onAction(true);
        }} 
        ch_cate={cates} />
    </div>
  );
}
