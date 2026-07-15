import React,{useEffect,useState,useContext} from 'react'
import myData from '../../../public/json/raw_database.json';
import { CustomInput } from 'reactstrap';
import UserContext from '../../../contexts/UserContext';
export default function Changeform({type,t,noMail,payment_type,total_price,member_discour,pkg}) {
  const {user, handleCart, fetchUser} = useContext(UserContext)
    const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();
  const [address, setAddress] = useState({});

  var checked = true;

  if(user) {
    checked = !!user.addresses.find((val) => val.default == 1);
  }
  



  const handleChange = (event) => {
    if(!user) return;
    var checked = event.target.checked;
    if(checked) {
      var addr = user.addresses.find((val) => val.default == 1);
      if(addr) {
        setAddress(addr);
      }
    }else{
      setAddress({});
    }
  }


  useEffect(() => {
    getOptionAddress(myData, address.province, address.ampher, address.district, address.district,address.post);
  },[address]);

  const getOptionAddress = (obj , __prov = 'กรุงเทพมหานคร',__amp = 0, __dis = 0)=>{
    try {
      var prov = groupBy(obj,'province');
      var amp = groupBy(prov[__prov],'amphoe')
      var dis = groupBy(amp[Object.keys(amp)[__amp == 0 ? 0 : Object.keys(amp).findIndex((a) => a == __amp) ]],'district')
      setProvince(prov)
      setAmphoe(amp)
      setDistrict(dis)
      setZipcode(groupBy(dis[Object.keys(dis)[__dis == 0 ? 0 : Object.keys(dis).findIndex((a) => a == __dis) ]],'zipcode'))
    }catch (err) {
      address.ampher = ''
      address.post = ''
      address.province = ''
      address.district = ''
      getOptionAddress(myData,'กรุงเทพมหานคร');
      setTimeout(() => {
        alert('ข้อมูลที่อยู่ไม่ถูกต้อง กรุณาตั้งค่าที่อยู่ใหม่');
      }, 500)
      
    }
    
  }

  const onChangeProv = (e) => {
    resetAddress()
    getOptionAddress(myData,e.target.options[e.target.selectedIndex].text)
  }

  const getOptionAmphoe = (index = 0)=>{
    var district = groupBy(amphoe[index],'district')
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]],'zipcode'))
    
  }

  const onChangeAmphoe = (e) => {
    getOptionAmphoe(e.target.options[e.target.selectedIndex].text)
  }

  const getOptionDistrict = (index = 0)=>{
    setZipcode(groupBy(district[index],'zipcode'))
  }

  const onChangeDistrict = (e) => {
    getOptionDistrict(e.target.options[e.target.selectedIndex].text)
  }

  const resetAddress = () => {
    address.ampher = ''
    address.post = ''
    address.province = ''
  }

  const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

    return (
        <div>
         <input type="hidden" className="form-control" name="type" defaultValue={type} />
        {
            type == 1 ? <>
            {payment_type !== 1 || ( total_price == 0 && member_discour !== 0 ) &&
            <div className="w-100 clearfix change-form">
            <h3 className="mt-4">ชื่อบัญชีธนาคารสำหรับคืนเงิน</h3>
            <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" type="text" name="bank_bookname" placeholder="" required />
                <label>ชื่อบัญชี <span className="text-orange">*</span></label>
                <span className="focus-border"></span>
            </div>
            
            
            <div className="info-creditcard-100 mt-5 mb-1">
                <select className="w-100" name="bank_name" id="" required>
                <option value="" className="selected">{t("select_bank")}</option>
                  <option data-index="0">{t("scb")}</option><option data-index="1" className="selected">{t("kasikorn")}</option><option data-index="2">{t("krungthai")}</option><option data-index="3">{t("bangkok_bank")}</option><option data-index="4">{t("krungsri")}</option><option data-index="5">{t("thanachart")}</option><option data-index="6">{t("tmb")}</option><option data-index="7">{t("gsb")}</option><option data-index="8">{t("baac")}</option><option data-index="9">{t("kiatnakin")}</option><option data-index="10">{t("sc")}</option><option data-index="11">{t("uob")}</option><option data-index="12">{t("tisco")}</option><option data-index="13">{t("cimb")}</option><option data-index="14">{t("icbc")}</option>

                </select>
            </div> 

            <div className="info-creditcard-50 mt-50px mr-for-50">
                <input className="effect-16" type="text" name="bank_number" placeholder="" required />
                <label>เลขที่บัญชี <span className="text-orange">*</span></label>
                <span className="focus-border"></span>
            </div>
            <div className="info-creditcard-50 mt-50px">
                <input className="effect-16" type="text" name="branch" placeholder="" required />
                <label>สาขา <span className="text-orange">*</span></label>
                <span className="focus-border"></span>
            </div>
            {!noMail &&<>
            <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" type="text" name="phone" placeholder="" required />
                <label>เบอร์โทรศัพท์ <span className="text-orange">*</span></label>
                <span className="focus-border"></span>
            </div>
            
            <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" type="text" name="email" placeholder="" required />
                <label>อีเมล <span className="text-orange">*</span></label>
                <span className="focus-border"></span>
            </div>
           </> }
        </div>
    }</> :

            <div className="w-100 clearfix change-form">
                    <h3 className="mt-4">ที่อยู่สำหรับการรับเปลี่ยนสินค้า</h3>

                    <div className="d-flex mt-3">
                            <CustomInput type="checkbox" id={`use_address`+pkg.pkg_id} name="use_address" className="my-auto" value="1" disabled={!checked} onChange={(e) => handleChange(e)}  />
                            <p className="p-12 my-auto">{t('use_address')}</p>
                           
                        </div>
                    <div className="info-creditcard-50 mt-50px mr-for-50">
                        <input className="effect-16" type="text" name="firstname" placeholder="" required defaultValue={address?.firstname} />
                        <label>ชื่อ <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-50 mt-50px">
                        <input className="effect-16" type="text" name="lastname" placeholder="" required defaultValue={address?.lastname} />
                        <label>สกุล <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-100 mt-5 mb-1">
                        <input className="effect-16" type="text" placeholder="" required name="address" defaultValue={address?.address} />
                        <label>ที่อยู่ <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-50 mt-50px mr-for-50">
                        <select className="w-100" name="province" id="" onChange={onChangeProv} required>
                            {
                                province ? Object.keys(province).map((prov,index)=>(
                                <option value={province[prov][0].province_code} selected={prov == address.province} key={prov}>{prov}</option>
                                )) : ''
                            }
                        </select>
                    </div> 
                    <div className="info-creditcard-50 mt-50px">
                        <select className="w-100" name="ampher" id="" onChange={onChangeAmphoe} required>
                        {
                            amphoe ? Object.keys(amphoe).map((amp,index)=>(
                            <option value={amp} selected={address.ampher == amp} key={amp}>{amp}</option>
                            )) : ''
                        }
                        </select>
                    </div> 
                    <div className="info-creditcard-50 mt-50px mr-for-50">
                        <select className="w-100" name="district" id="" onChange={onChangeDistrict} required>
                        {
                            district ? Object.keys(district).map((dis,index)=>(
                            <option value={dis} selected={address.district == dis} key={dis}>{dis}</option>
                            )) : ''
                        }
                        </select>
                    </div> 
                    <div className="info-creditcard-50 mt-50px">
                        <select className="w-100" name="post" id="" required>
                        {
                            zipcode ? Object.keys(zipcode).map((zip)=>(
                            <option value={zip} selected={address.post == zip} key={zip}>{zip}</option>
                            )) : ''
                        }
                        </select>
                    </div> 
                    {!noMail &&<>
                    <div className="info-creditcard-100 mt-5 mb-1">
                        <input className="effect-16"  name="phone"  type="text" placeholder="" required defaultValue={address?.phone} />
                        <label>เบอร์โทรศัพท์ <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-100 mt-5 mb-1">
                        <input className="effect-16" type="text" name="email" placeholder="" required />
                        <label>อีเมล <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div> 
                    </>}
                </div>
            

        }
                
        </div>
    )
}
