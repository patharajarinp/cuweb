import React,{useState,useEffect,useRef} from 'react'
import classNames from 'classnames';
import Changeform from '../change/change-form';
import api from '../../../utils/api';
export default function btnAddBank({change,t,show,fecthReturnOne,setShow}) {
    const myRef = useRef(null);
    const [btnChenge, setbtnChenge] = useState(false)
    const [modalShow2, setModalShow2] = useState(false)

    
      const checkRequired = () => {
     
          setModalShow2(true);
    
      }
      const onSubmit = () => {

       
          var return_id = change.id;
          var form_data = new FormData(myRef.current);
          form_data.append('add_bank', 1);
          api.updatePackageReturn(return_id, form_data).then(res => {
            const data = res.data;
            alert('บันทึกข้อมูลสำเร็จ!!!');
            fecthReturnOne();
            setShow(false);
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
                <h3 className=" m-auto">เพิ่มบัญชีสำหรับคืนเงิน</h3>
            </button>
            <div className={classNames("tracking",{"show" : btnChenge})}>
                <div className="cart-nav">
                    <div className=" text-center cart-nav-title">
                        <h4 className="mb-0">ชื่อบัญชีธนาคารสำหรับคืนเงิน</h4>
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
                    <form ref={myRef} >
                        <Changeform type={1} t={t} noMail/>
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
