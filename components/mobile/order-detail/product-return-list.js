import React, { useState } from 'react';
// import Link from 'next/link';
// import { Collapse, CustomInput } from 'reactstrap';
// import classNames from "classnames";
// import api from '../../utils/api';
// import Router, { useRouter } from 'next/router'

import { withTranslation } from '../../../utils/i18n';
const ReturnProductList = (props) => {
    const { t, val,data,updateProduct ,type} = props;
    const [checked, setChecked] = useState(false);

    //const [error, setError] = useState(0);
    
    const handleClick = () => setChecked(!checked);
    const minusAmonut = () =>{
        const minus = data.amount - 1;
        if(minus > 0){
            updateProduct({product_id : data.product_id ,key :'amount',value: minus})
        }
    }
    const plusAmonut = () =>{
        const plus = data.amount + 1;
        if(plus <= val.quantity){
            updateProduct({product_id : data.product_id ,key :'amount',value: plus})
            //setAmount_val(val.quantity);
        }
    }
    const handleChange = (e)=>{

        if(!updateProduct) return;
        
        let {name,checked,value} = e.target;
        //console.log(name , value , data.checked)
        updateProduct({product_id : data.product_id ,key :name,value: name=='checked' ? checked : value})
      }
    
      const handleFile = (event) =>{
          console.log('data', data)
        const file = event.target.files[0]
        if(!file || data.images.length == 5) return;
        let src = URL.createObjectURL(file);
        let value = [...data.images]
        value.push({src ,file})
        updateProduct({product_id : data.product_id ,key :'images',value})
        event.target.value = '';
       
      }
    

    var amount_list = [];
    if (val) {
        for (let i = 1; i <= val.quantity; i++) {
            amount_list.push(i)
        }
    }
    let options_val = [];
    for (let i = 1; i <= 5; i++) {
        options_val.push(<option value={i} key={'reason' + i}>{t('mobile_order_detail:reason_return' + i)}</option>)
    }
    //console.log(checked)
    if(!data) return null;
    return (<>

        <div className="product-in-cart ">
            <div className="mt-1 mr-2">
                <div className="custom-control custom-checkbox mt-4">
                    <input type="checkbox" className="custom-control-input" id={val.product.id} name="checked" checked={data.checked} onChange={handleChange} />
                    <label className="custom-control-label" htmlFor={val.product.id}>

                    </label>
                </div>
            </div>
            <div className="product-in-cart-pic-area">
                <div className="product-in-cart-pic bg-white">
                    <img className="img-fluid" src={val.product.picture ? val.product.picture : '/mobile/image/product/book.png'} />
                </div>
            </div>
            <div className="product-in-cart-content">
                <h4 className="text-black two-line">{val.product.name}</h4>
                <h4 className="text-black font-weight-bold my-auto"><span className="font-weight-normal text-grey p-14">{t("mobile_order_detail:quantity")} :</span> {val.quantity}</h4>
            </div>
        </div>
        {
            data.checked ?  <div className="bg-white row " >
            <div className="col-12 py-3">
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h3 className="text-black ">{t("mobile_order_detail:return_product_amount")}</h3>
                    <div className="input-group new-btn-cart justify-content-end">
                        <input type="button" className="btn-minus" defaultValue="-" disabled={data.amount == 1} onClick={minusAmonut}/>
                        <input type="text" className="text-number mb-0" maxLength="3" value={data.amount } pattern="[0-9]*" name="quantity" />
                        <input type="button" className="btn-plus" defaultValue="+" disabled={data.amount >= val.quantity} onClick={plusAmonut}/>
                    </div>
                </div>
                <div className="clearfix">
                    <div className="info-creditcard-100 mt-3 ">
                        <select className="w-100" id="subject" name="subject" value={data.subject} onChange={handleChange}>
                            <option value="" disabled selected hidden>{t("mobile_order_detail:choose_reason")}*</option>
                            {options_val}
                        </select>
                    </div>
                </div>
                <div className="clearfix">
                    <div className="info-creditcard-100 mt-5 mb-1">
                        <input className="effect-16" type="text" id="detail" maxLength="255" minLength="0" name="detail" value={data.detail} onChange={handleChange} />
                        <label>{t("mobile_order_detail:more_info")} ({t("mobile_order_detail:if_have")})</label>
                        <span className="focus-border"></span>
                    </div>
                    <p className="p-12 text-right text-black-50 ">{data.detail.length}/255</p>
                </div>

                <div className="pb-3">
                    <p className="text-black mb-0">{t("mobile_order_detail:upload_photo")} ({t("mobile_order_detail:at_least_image")})<span className="text-red">*</span></p>
                    <p className="p-12 mb-0">{t("mobile_order_detail:seller_decision")}</p>
                    <div className="d-flex  pt-3">

                        {data.images.map((val,index) => (
                            <div className="img-preview-return mr-1" key={'img-'+data.product_id+'-'+index}>
                                <img src={val.src}  alt="preview" className="img-preview-on" />
                            </div>
                        ))}
                        {
                            data.images.length < 4 &&(
                                <div align="left" className="mr-1" style={{ height: "68px", width: "68px" }}>
                            <label htmlFor="upload-button" >
                                <div className="input-image-return">
                                    <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">{t("mobile_order_detail:photo")}</h5></i>
                                </div>
                            </label>
                            <input type="file" name={`img-${val.product.product_id}`} id="upload-button" style={{ display: 'none' }} onChange={handleFile} accept="image/*" />
                                <br />
                            </div>
                            )
                        }
                        

                        



                    </div>
                    {data.error ? <div className="text-danger font-14 mt-3">กรุณาเพิ่มรูปภาพ</div> : null}
                   
                </div>
            </div>
        </div> : null
        }
    </>)
}
export default withTranslation('order_detail')(ReturnProductList);