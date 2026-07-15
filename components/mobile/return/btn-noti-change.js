import React,{useState} from 'react'
import classNames from 'classnames';
export default function btnNotiChange({change,data,setData,onSubmit,t}) {
    const [btnChenge, setbtnChenge] = useState(false)
    const [modalShow2, setModalShow2] = useState(false)
    const handleChange = (e) => {
        var {name, value,type} = e.target;
        if(type == 'file') value = e.target.files[0]
        setData({...data, [name] : value});
      }
    
      const checkRequired = () => {
        event.preventDefault();
        if(!data.shipping_company1 || !data.file_upload1 || !data.tracking_number1) {
          setData({...data, error : true});
        }else{
          setData({...data, error : false});
          setbtnChenge(false)
          setModalShow2(true);
        }
      }
      const handleFile = (event) =>{
        const file = event.target.files[0]
        if(!file ) return;
        let src = URL.createObjectURL(file);
        let tmp ={...data}
        tmp.file_upload1 = file
        tmp.images = src
        setData(tmp)
      }
    return (
        <>
            <button className="btn btn-orange py-2 w-100 btn-none-border" onClick={()=>setbtnChenge(true)}>
                <h3 className="text-white m-auto">แจ้งผลการคืนสินค้า</h3>
            </button>
            <div className={classNames("tracking",{"show" : btnChenge})}>
                <div className="cart-nav">
                    <div className=" text-center cart-nav-title">
                        <h4 className="mb-0">แจ้งผลการคืนสินค้า</h4>
                    </div>
                    <a className="btn-close-left" onClick={()=>setbtnChenge(false)}  ></a>
                </div>
                <div className=" bg-white min-vh-100">
                    <div className="h-64px"></div>
                    <div className="container">
                        <h4 className="m-0 py-3 ">หมายเลขการคืนสินค้า : #{change.id}</h4>
                        <hr className="use-line my-0"></hr>
                    </div>
                    <div className="container">
                        <h4 className="m-0 py-3 font-weight-normal">อัพโหลดรูปหลักฐานการส่งสินค้า (ใบเสร็จเลขพัสดุ)<span className="text-orange">*</span></h4>
                        {data && !data.images &&
                        <div align="left" style={{ height: "72px", width: "72px"  }}>
                            <label htmlFor="upload-button" >
                                <div className="input-image">
                                    <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">รูปภาพ</h5></i>
                                </div>   
                            </label>
                            <input type="file" name="file_upload1" id="upload-button" style={{ display: 'none' }} onChange={handleFile}  />
                            <br />
                        </div>
                        }
                        {data.images &&
                            <div className="img-preview-return mr-1" >
                                <img src={data.images}  alt="preview" className="img-preview-on" />
                            </div>
                        }
                       
                    </div>
                    <div className="container">
                        <div className="w-100 clearfix">
                            <div className="info-creditcard-100 mt-5 mb-1">
                                <input className="effect-16" type="text" name="shipping_company1" placeholder="" required onChange={handleChange} />
                                <label >จัดส่งโดย (ตัวอย่าง : ไปรษณีย์ไทย , kerry , DHL)</label>
                                <span className="focus-border"></span>
                            </div>
                        </div>
                        <div className="w-100 clearfix">
                            <div className="info-creditcard-100 mt-5 mb-1">
                                <input className="effect-16" type="text" name="tracking_number1" placeholder="" required onChange={handleChange} />
                                <label >เลขติดตามสถานะสิ่งของ</label>
                                <span className="focus-border"></span>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-5">
                        <button className="btn btn-orange py-2 w-100 btn-none-border" onClick={checkRequired} >
                            <h3 className="text-white m-auto">ส่ง</h3>
                        </button>
                    </div>
                </div>
            </div>
            <div className={classNames("modals-confirm-cancel-area", { "show": modalShow2 })}>
                <div className="modals-confirm-cancel">
                    <div className="d-flex">
                        <img className="img-fluid m-auto" src="/mobile/image/icon/Attention.svg" />
                    </div>
                    <p className="text-black text-center mt-2">{t("mobile_translations:confirm_save")}?</p>
                    <div className="btn-modals-confirm-cancel-area">
                        <h4 className="m-auto text-pink" onClick={()=>setModalShow2(false)}>{t("mobile_translations:cancel")}</h4>
                        <div className="btn-line-cancel"></div>
                        <h4 className="m-auto text-pink" onClick={onSubmit} >{t("mobile_translations:confirm")}</h4>
                    </div>
                </div>
            </div>
        </>
    )
}
