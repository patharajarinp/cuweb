import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import api from '../../utils/api';

const ModalSuccess = ({ show, setshowS, order_id }) => {
    const [settings, setSetting] = useState();
    const handleClose = () => setshowS(false);

    const fetchSetting = () => {
        api.getSetting(1)
        .then(res=>{
            const data = res.data;
            ;
            setSetting(data);
        })
        .catch(err => {
            console.log(err.response);
        })
    }

    useEffect(() => {
        fetchSetting();
      },[]);

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Body>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-10">
                            <div className="bg-white br-8 p-4">
                                <div className="text-center py-4">
                                    <div>
                                        <img src="/images/success-order.png" alt="" className="" />
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-pink">การสั่งซื้อสำเร็จ ขอบคุณที่ใช้บริการ</h3>
                                    </div>
                                    <div className="mt-4">
                                        <p>หมายเลขคำสั่งซื้อ {order_id} ของท่าน</p>
                                    </div>
                                    <div className="mt-2">
                                        <p>
                                            สำหรับท่านที่เลือกการชำระเงินภายหลัง <br></br>
                                            กรุณาแจ้งชำระเงินภายใน {settings ? settings.setting_order : '48'} ชั่วโมง <br></br>
                                            หากเกินกำหนด คำสั่งซื้อจะถูกยกเลิกทันที
                                        </p>
                                    </div>
                                    <div className="mt-5">
                                        <Link href={`/user/order-detail/[order_id]?order_id=${order_id}`} as={`/user/order-detail/${order_id}`}>
                                            <a>
                                                <button type="button" className="btn btn-outline-primary mr-3">ดูคำสั่งซื้อ</button>
                                            </a>
                                        </Link>
                                        <Link href='/' as={'/'}>
                                            <a>
                                                <button type="button" className="btn btn-primary">ช้อปต่อ</button>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        </>
    );
}
ModalSuccess.getInitialProps = ({query}) => {
    return {query}; //has to be like an object
  }
export default ModalSuccess