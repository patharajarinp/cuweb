import React,{useState} from 'react'
import classNames from 'classnames';
export default function btnCancelChange({change,note, setNote,onSubmit,t}) {
    const [btnChenge, setbtnChenge] = useState(false)
    const [modalShow2, setModalShow2] = useState(false)
  
      const checkRequired = () => {
        setModalShow2(true)
      }

    return (
        <>
            <button className="btn btn-orange py-2 w-100 btn-none-border" onClick={()=>setbtnChenge(true)}>
                <h3 className="text-white m-auto">ยกเลิกคำขอเปลี่ยนสินค้า</h3>
            </button>
            <div className={classNames("tracking",{"show" : btnChenge})}>
                <div className="cart-nav">
                    <div className=" text-center cart-nav-title">
                        <h4 className="mb-0">ยกเลิกคำขอเปลี่ยนสินค้า</h4>
                    </div>
                    <a className="btn-close-left" onClick={()=>setbtnChenge(false)}  ></a>
                </div>
                <div className=" bg-white min-vh-100">
                    <div className="h-64px"></div>
                    <div className="container">
                        <h4 className="m-0 py-3 ">หมายเลขการเปลี่ยนสินค้า : #{change.id}</h4>
                        <hr className="use-line my-0"></hr>
                    </div>
                    <div className="container chacge-check">
                          <div className="info-creditcard-100 mt-5 mb-1">
                            <input className="effect-16" type="text" placeholder="" required name="note" value={note ? note : ''}  onChange={(e) => setNote(e.target.value)}  />
                            <label>ข้อมูลเพิ่มเติม</label>
                            <span className="focus-border"></span>
                          </div>
                        </div>
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
