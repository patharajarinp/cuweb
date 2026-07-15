import classNames from "classnames";
import React, { useEffect, useState,useRef  } from 'react';
import { CustomInput } from 'reactstrap';
import api from '../../../utils/api';
import { withTranslation, Router } from '../../../utils/i18n';
import ReturnProductList from './product-return-list';
import Changeform from '../change/change-form'
import { BeatLoader } from "react-spinners";
const ReturnProduct = (props) => {
    const { returnP, OpenreturnP, pkg, order_id, t, product , type, order } = props;
  
    const myRef = useRef(null);
    const [confirmcancel, setconfirmcancel] = useState(false);
    const openconfirmcancel = () => setconfirmcancel(true);
    const closeconfirmcancel = () => setconfirmcancel(false);
    const [data,setData] = useState([]);
    const [chk, setChk] = useState(false);
    // const [product, setProduct] = useState();
    const handleChangeRadio = (e) => {
        setChk(e.target.checked)
    }

    const [loading, setloading] = useState(false)

    useEffect(()=>{
        if(!pkg) return;
        let items = pkg.package_details.map(val => {
            const product = val.product
            return {product_id : product.id, amount : 1,checked:false,subject : '1',detail :'',images : [],error:null}
        })
        setData(items)
        
    },[pkg])
    useEffect(()=>{
        console.log(type)
     },[type])
    const updateProduct = (obj)=>{
        const {product_id,key,value} = obj;
        if(!product_id) return;
        let index = data.findIndex(val => val.product_id == product_id)
        
        if(index == -1) return;
        let tmp = [...data];
        tmp[index][key] = value;
        setData(tmp);
        // console.log('index', index ,tmp)
    }
// console.log('data', data)

    const sendForm = () =>{
        var temp = []
        let errors = [];
        let form_data = new FormData(myRef.current);
        data.forEach((val,index)=>{
    
          if(val.checked) {
            if(!val.images.length) errors.push({index,product_id : val.product_id,error :'image'})
            val.images.forEach(img => {
              form_data.append(`img-${val.product_id}`,img.file)
            })
            
            temp.push(val)
          }
        })
    
        if(errors.length){
          let t = [...data];
          errors.forEach(val => {
            t[val.index].error = val.error
          })
          setData(t)
          setconfirmcancel(false);
          return;
        }
    
        let items = temp.map(val => {
          return {id : val.product_id ,quantity : val.amount ,subject:val.subject,detail:val.detail}
        })
      
        form_data.append("items",JSON.stringify(items));
        form_data.append("order_id",pkg.order_id);
        form_data.append("pkg_id",pkg.pkg_id);
        setloading(true)
        api.sendPackageReturn(form_data).then(res =>{
          const data = res.data;
          if(type == 1) {
            Router.push('/user/order_return');
          }else{
            Router.push('/user/order_change');
          }
        })
        .catch(err =>{
            setloading(false)
          console.log(err.response);
        })
      }
    

    const onSubmit = () => {
        //sendForm();
        // window.scrollTo(0, 0);
        setconfirmcancel(true);
    }
    const saveReturn = () => {
        //setconfirmcancel(true);
        closeconfirmcancel()
        sendForm();
    }
    const isSomeCheck = ()=>{
        let bool = false;
        data.forEach(val =>{
          if(val.checked) bool = true;
        })
        return bool;
    }

    // console.log('pkg', pkg);
    //const handleClick = () => setChecked(!checked);
    return (<>
        <div className={classNames("return", { "show": !returnP })}>
            <div className="order-manage-nav">
                <div className="text-center m-auto">
                    <h3 className="mb-0">
                    {type && type == 1 ? 'คำขอคืนสินค้า' : 'คำขอเปลี่ยนสินค้า'}</h3>
                </div>
                <a className="btn-close-left" onClick={OpenreturnP}></a>
            </div>
            <div className="h-56px"></div>
            <form className="bg-white min-vh-100" ref={myRef} >

                {
                    pkg && pkg.package_details.map((val, index) => (
                        
                         <div className="bg-light-less-gray" key={val.product_id}>
                            <div className="container border-bottom">
                                <ReturnProductList val={val} 
                                updateProduct={updateProduct}
                                data={data[index]}
                                type={type}
                                />
                            </div>
                        </div>
                    ))
                }
                
                {
                    pkg && (<>
                        <div className="container mt-2 ">
                            <Changeform 
                            pkg={pkg}
                            type={type} t={t} payment_type={order?.payment_type} 
                            member_discour={pkg.member_discour} total_price={pkg.total_price} />
                        </div>
                    
                        <div className="container d-flex mt-3">
                            <CustomInput type="checkbox" name={`acc`} id={`acc-`+pkg.pkg_id} className="my-auto" checked={chk}  onChange={handleChangeRadio}  />
                            <p className="p-12 my-auto">{t("mobile_translations:read_understood")} {t("mobile_translations:privacy_policy")}</p>
                           
                        </div>
                    </>)
                }
               

                <div className="container">
                    <button type="button" className="btn btn-pink-submit mt-3 h-40px" onClick={onSubmit} disabled={!isSomeCheck() || !chk || loading }>
                        <h4 className="text-white m-auto">
                        {loading ? <BeatLoader size={10} color={"#FFF"} loading={loading} /> : t("mobile_translations:send_form")}</h4>
                    </button>
                </div>
                <div className="footer-space"></div>
           </form>
            
             
        </div>
        <div className={classNames("modals-confirm-cancel-area", { "show": confirmcancel })}>
                <div className="modals-confirm-cancel">
                    <div className="d-flex">
                        <img className="img-fluid m-auto" src="/mobile/image/icon/Attention.svg" />
                    </div>
                    <p className="text-black text-center mt-2">{type==1?t("mobile_order_detail:want_return_product"):t("mobile_order_detail:want_change_product")}?</p>
                    <div className="btn-modals-confirm-cancel-area">
                        <h4 className="m-auto text-pink" onClick={closeconfirmcancel}>{t("mobile_translations:cancel")}</h4>
                        <div className="btn-line-cancel"></div>
                        <h4 className="m-auto text-pink" onClick={saveReturn} >{t("mobile_translations:confirm")}</h4>
                    </div>
                </div>
            </div>
    </>);
}

export default withTranslation('order_detail')(ReturnProduct);