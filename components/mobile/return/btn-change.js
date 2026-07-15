import React,{useState} from 'react'
import classNames from 'classnames';
export default function btnNotiChange({change,data,setData,onSubmit,t}) {
    const [btnChenge, setbtnChenge] = useState(false)
    const [selected, setSelected] = useState(0);
    const [modalShow2, setModalShow2] = useState(false)

    const handleChange = (e, datatype) => {
      var {name, value,type} = e.target;
      setData({...data, [name] : value});
      setSelected(datatype);
      console.log('object')
    }
  
    const checkRequired = () => {
      event.preventDefault();
      console.log(data);
      if(!data.status) {
        setData({...data, error : true});
      }else{
        setData({...data, error : false});
        // handleClose();
        // setbtnChenge(false)
        setModalShow2(true);
      }
    }
  
    return (
        <>
            <button className="btn btn-orange py-2 w-100 btn-none-border" onClick={()=>setbtnChenge(true)}>
                <h3 className="text-white m-auto">ตรวจสอบสินค้า</h3>
            </button>
            <div className={classNames("tracking",{"show" : btnChenge})}>
            <div className="cart-nav">
                    <div className=" text-center cart-nav-title">
                        <h4 className="mb-0">ยอมรับสินค้าที่เปลี่ยนหรือไม่ ?</h4>
                    </div>
                    <a className="btn-back order-manage-back" onClick={()=>setbtnChenge(false)}><img className="img-fluid my-auto" src="/mobile/image/icon/icon-back.svg" /></a>

                </div>
                <div className="bg-light-less-gray min-vh-100">
                    <div className="h-64px"></div>
                    <div className="container">
                        <h4 className="m-0 py-3">ในกรณีที่ท่านไม่เห็นด้วยกับร้านค้าท่านสามารถปฏิเสธ การเปลี่ยนสินค้าและยื่นข้อพิพาทไปทาง Chulabook</h4>
                    </div>
                    <div className="container chacge-check">
                        <div className="radio-collapse custom-radio custom-control row payment-border">
                            <input  type="radio" id={change.id+"-change"} name="status" value="61" checked={selected == 1} onChange={(e) => handleChange(e, 1)}  className="custom-control-input"  />
                            <label className="custom-control-label" htmlFor={change.id+"-change"} >
                                <span className="ml-5"> ฉันได้ตรวจสอบและยอมรับการเปลี่ยนสินค้า</span>
                            </label>
                        </div>   
                    </div>
                    <div className="container chacge-check">
                        <div className="radio-collapse custom-radio custom-control row payment-border">
                            <input   type="radio" id={change.id+"-change-not"} name="status" value="62" checked={selected == 2} onChange={(e) => handleChange(e, 2)}  className="custom-control-input"  />
                            <label className="custom-control-label" htmlFor={change.id+"-change-not"} >
                                <span className="ml-5"> ฉันไม่ได้รับสินค้า</span>
                            </label>
                        </div>   
                    </div>
                    {
                      selected == 2 ? (
                        <>
                        {/* <input type="hidden" name="dispute4" value="1" onChange={(e) => handleChange(e, 2)} /> */}
                        <div className="container chacge-check">
                          <div className="info-creditcard-100 mt-5 mb-1">
                            <input className="effect-16" type="text" placeholder="" required name="dispute4_note" onChange={(e) => handleChange(e, 2)}  />
                            <label>ข้อมูลเพิ่มเติม <span className="text-orange">*</span></label>
                            <span className="focus-border"></span>
                          </div>
                        </div>
                        </>
                      ) : ''
                    }
                    <div className="product-nav-main">
                        <a className="product-nav-main-btn bg-light-less-gray" style={{backgroundColor:"#eee"}} onClick={()=>setbtnChenge(false)}><h4>ยกเลิก</h4></a>
                        <a className="product-nav-main-btn btn-orange" onClick={checkRequired}><h4 className="text-white">ยืนยัน</h4></a>
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
                        <h4 className="m-auto text-pink" onClick={()=>{setModalShow2(false);setbtnChenge(false)}}>{t("mobile_translations:cancel")}</h4>
                        <div className="btn-line-cancel"></div>
                        <h4 className="m-auto text-pink" onClick={onSubmit} >{t("mobile_translations:confirm")}</h4>
                    </div>
                </div>
            </div>
        </>
    )
}
