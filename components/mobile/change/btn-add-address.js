import React,{useState,useRef,useEffect} from 'react'
import classNames from 'classnames';
import Changeform from '../change/change-form';
import api from '../../../utils/api';
export default function BtnAddAddress({change,fecthReturnOne,t,show,setShow}) {
    const [btnChenge, setbtnChenge] = useState(false)
    const [modalShow2, setModalShow2] = useState(false)
    const myRef = useRef(null);
  
      const checkRequired = () => {
        
          setModalShow2(true);
      
      }
      const handleSubmit = () => {
        
          var return_id = change.id;
          var form_data = new FormData(myRef.current);
          api.updatePackageReturn(return_id, form_data).then(res => {
            const data = res.data;
            alert('บันทึกข้อมูลสำเร็จ!!!');
            fecthReturnOne();
            setShow(false);
            setModalShow2(false)
          })
          .catch(err => {
            setShow(false);
            console.log(err)
            console.log(err.response);
          })
       
      }
      useEffect(() => {
        setbtnChenge(show)
      }, [show])
    return (
        <>
            <button className="btn btn-outline-stationery py-2 w-100 " onClick={()=>setbtnChenge(true)}>
                <h3 className="m-auto">เพิ่มที่อยู่เปลี่ยนสินค้า</h3>
            </button>
            <div className={classNames("tracking",{"show" : btnChenge})}>
                <div className="cart-nav">
                    <div className=" text-center cart-nav-title">
                        <h4 className="mb-0">ที่อยู่สำหรับการรับเปลี่ยนสินค้า</h4>
                    </div>
                    <a className="btn-close-left" onClick={()=>setbtnChenge(false)}  ></a>
                </div>
                <div className=" bg-white min-vh-100">
                    <div className="h-64px"></div>
                    <div className="container">
                        <h4 className="m-0 py-3 ">หมายเลขการเปลี่ยนสินค้า : #{change.id}</h4>
                        <hr className="use-line my-0"></hr>
                    </div>
                    <div className="container">
                        <form ref={myRef} >
                            <Changeform type={2} t={t} noMail/>
                        </form>  
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
                    <p className="text-black text-center mt-2">{t("mobile_order_detail:confirm_save")}?</p>
                    <div className="btn-modals-confirm-cancel-area">
                        <h4 className="m-auto text-pink" onClick={()=>setModalShow2(false)}>{t("mobile_translations:cancel")}</h4>
                        <div className="btn-line-cancel"></div>
                        <h4 className="m-auto text-pink" onClick={handleSubmit} >{t("mobile_translations:confirm")}</h4>
                    </div>
                </div>
            </div>
        </>
    )
}
