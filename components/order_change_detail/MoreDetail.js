import React from 'react';
const ManageButton = ({data, btnName, selectModal}) => {
  
 

  return (
    <>
      <div className="row my-4">
        <div className="col-12">
          <p className="p-medium">ข้อมูลเพิ่มเติม</p>
        </div>
        <div className="col-12 mt-1">
        {
          (data.cancel_note && data.status == '00') && (
            <p className="mb-0"><span className="p-medium">เหตุผลในการยกเลิก : </span> <span>{data.cancel_note}</span></p>
          )
        }
        {
          (data.cancel_note && data.status == '02') && (
            <p className="mb-0"><span className="p-medium">ข้อพิพาท ร้านค้าไม่รับเปลี่ยนสินค้า : </span> <span>{data.cancel_note}</span></p>
          )
        }
        {
          (data.cancel_note && data.status == '01') && (
            <p className="mb-0"><span className="p-medium">ร้านค้าไม่รับเปลี่ยนสินค้า : </span> <span>{data.cancel_note}</span></p>
          )
        }
        {
          (data.change_type_note) && (
            <p className="mb-0"><span className="p-medium">ข้อมูลเพิ่มเติม ไม่รับเปลี่ยนให้คืนสินค้า : </span> <span>{data.change_type_note}</span></p>
          )
        }
        {
          (data.dispute2_note) && (
            <p className="mb-0"><span className="p-medium">ข้อพิพาท ได้รับสินค้าแล้วแต่สินค้ามีปัญหา : </span> <span>{data.dispute2_note}</span></p>
          )
        }
        {
          (data.dispute3_note) && (
            <p className="mb-0"><span className="p-medium">ข้อพิพาท ร้านค้ายังไม่ได้รับสินค้าจากผู้ซื้อ : </span> <span>{data.dispute3_note}</span></p>
          )
        }
        {
          (data.dispute4_note) && (
            <p className="mb-0"><span className="p-medium">ข้อพิพาท ผู้ซื้อยังไม่ได้รับสินค้าจากผู้ขาย : </span> <span>{data.dispute4_note}</span></p>
          )
        }
        {
          (data.receipt_note) && (
            <p className="mb-0"><span className="p-medium">เหตุผลที่ CHULABOOK แก้ไขยอดเงิน : </span> <span>{data.receipt_note}</span></p>
          )
        }
        {
          (data.slip_note) && (
            <p className="mb-0"><span className="p-medium">ข้อมูลเพิ่มเติม หลักฐานการโอน : </span> <span>{data.slip_note}</span></p>
          )
        }
        </div>
      </div>
    </>
  )
}

export default ManageButton