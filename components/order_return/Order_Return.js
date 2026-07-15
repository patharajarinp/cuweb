import {useEffect, useState} from 'react'
import Image from './Image'

const MAX = 5;

const Order_Return = ({product : val,data,updateProduct, t, type}) => {
  //console.log(data)
  if(!val && data) {
    return;
  }

  const [amount, setAmount] = useState('');
  
  const handleChange = (e)=>{

    if(!updateProduct) return;
    
    let {name,checked,value} = e.target;
    if(name =='amount' && value > val.quantity) {
      value = val.quantity;
      return alert('จำนวนที่กรอก เกินจำนวนที่กำหนด');
    }
    
    
    if(name =='amount' && value == 0 ) value = 1;
    // console.log(value);
    if(name =='amount') setAmount(value);
    
    updateProduct({product_id : data.product_id ,key :name,value})
  }

  const handleFile = (event) =>{
    const file = event.target.files[0]
    if(!file || data.images.length == 5) return;
    let src = URL.createObjectURL(file);
    let value = [...data.images]
    value.push({src ,file})
    updateProduct({product_id : data.product_id ,key :'images',value})
    event.target.value = '';
  }

  const handleDeleteFile = (index) =>{
    let value = [...data.images]
    value.splice(index,1)
    updateProduct({product_id : data.product_id ,key :'images',value})
  }

  // console.log('data', data);

  return (
   <>
   {
    (val && data) ? (
      <>
        <div className="row px-3 mt-3 pb-3 set-border-bottom mr-5" id={'section'-val.id} >
          <div className="col-3">
            <div className="d-flex align-items-center">
              <div className="img-detail ml-4">
                <img className="mh-100" src={val.picture ? val.picture : "/images/book.png"} />
              </div>
            </div>
          </div>
          <div className="col-9 px-0 d-flex justify-content-between align-items-start">
            <div className="mb-3">
              <div className="d-flex">
                <div>
                  <a><p className="text-dark font-weight-bold mb-0">{val.name}</p></a>
                  <p>ผู้แต่ง : {val.author}</p>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <p className="text-dark font-weight-bold mr-3">จำนวน : {val.quantity}</p>
            </div>
          </div>
        </div>


        <div className={`row justify-content-center px-3`}>
          <div className="col-10 px-0">
            <div>
              <div className="form-group">
                <p className="mb-2">
                  {type == 1 ? 'จำนวนที่ต้องการคืน' : 'จำนวนที่ต้องการเปลี่ยน'}
                  <span className="text-pink">*</span>
                </p>
                <input type="number" className="w-10 form-control mr-0 d-inline-block" 
                id={val.id+'-amount'}
                min="1" name="amount" value={amount} onChange={handleChange} max={val.quantity} />
                <span className="d-inline-block">&nbsp; / {val.quantity}</span>
                {
                  data.error && data.error === 'amount' && 
                  <div  className="text-danger font-14">กรุณากรอกจำนวน </div>
                }
              </div>
            </div>
            <div className="form-fill mb-4 mt-2">
              <div className="row">
                <div className="col-8 mb-3">
                  <div className="styleSelect ">
                    <label for="reason">
                      {type == 1 ? 'เหตุผลการคืนสินค้า' : 'เหตุผลการเปลี่ยนสินค้า'}<span className="text-pink">*</span>
                    </label>
                    <div className="d-block position-relative">
                      <select className="form-control" id="reason" name="subject" value={data.subject} onChange={handleChange}>
                        <option value="1">{t('reason_return1')}</option>
                        <option value="2">{t('reason_return2')}</option>
                        <option value="3">{t('reason_return3')}</option>
                        <option value="4">{t('reason_return4')}</option>
                        <option value="5">{t('reason_return5')}</option>
                      </select>  
                      <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label >ข้อมูลเพิ่มเติม (ถ้ามี)</label>
              <div className="form-group mb-0">
                <textarea type="text" className="form-control" name="detail" value={data.detail} onChange={handleChange} placeholder="แจ้งให้เราทราบเกี่ยวกับการคืนเงินของคุณ" />
              </div>
            </div>
            <div className="mt-5">
              <label > อัปโหลดรูปภาพ (อย่างน้อย 1 ภาพ) เพื่อช่วยสนับสนุนการตัดสินใจของผู้ขาย<span className="text-pink">*</span></label>
              <div className="d-flex">
                <Image data={data} handleDeleteFile={handleDeleteFile} handleFile={handleFile} MAX={MAX} returns={true} />
              </div>
            </div>
          </div>
        </div>
      </>
    ) : null
  }
    
   </>
  )
}

export default Order_Return