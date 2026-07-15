import React,{useEffect,useState} from 'react'
import myData from '../../../public/json/raw_database.json';
export default function Changeform({type,t}) {
    const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();

  useEffect(() => {
    getOptionAddress(myData);
  },[]);

  const getOptionAddress = (obj , __prov = 'กรุงเทพมหานคร',__amp = 0, __dis = 0)=>{
    var prov = groupBy(obj,'province');
    var amp = groupBy(prov[__prov],'amphoe')
    var dis = groupBy(amp[Object.keys(amp)[__amp == 0 ? 0 : Object.keys(amp).findIndex((a) => a == __amp) ]],'district')
    setProvince(prov)
    setAmphoe(amp)
    setDistrict(dis)
    setZipcode(groupBy(dis[Object.keys(dis)[__dis == 0 ? 0 : Object.keys(dis).findIndex((a) => a == __dis) ]],'zipcode'))
  }

  const onChangeProv = (e) => {
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
            type == 1 ?<div className="w-100 clearfix change-form">
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
        </div>
     :

            <div className="w-100 clearfix change-form">
                    <h3 className="mt-4">ที่อยู่สำหรับการรับเปลี่ยนสินค้า</h3>
                    <div className="info-creditcard-50 mt-50px mr-for-50">
                        <input className="effect-16" type="text" name="firstname" placeholder="" required />
                        <label>ชื่อ <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-50 mt-50px">
                        <input className="effect-16" type="text" name="lastname" placeholder="" required />
                        <label>สกุล <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-100 mt-5 mb-1">
                        <input className="effect-16" type="text" placeholder="" required name="address" />
                        <label>ที่อยู่ <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-50 mt-50px mr-for-50">
                        <select className="w-100" name="province" id="" onChange={onChangeProv} required>
                            {
                                province ? Object.keys(province).map((prov,index)=>(
                                <option value={prov} key={prov}>{prov}</option>
                                )) : ''
                            }
                        </select>
                    </div> 
                    <div className="info-creditcard-50 mt-50px">
                        <select className="w-100" name="ampher" id="" onChange={onChangeAmphoe} required>
                        {
                            amphoe ? Object.keys(amphoe).map((amp,index)=>(
                            <option value={amp} key={amp}>{amp}</option>
                            )) : ''
                        }
                        </select>
                    </div> 
                    <div className="info-creditcard-50 mt-50px mr-for-50">
                        <select className="w-100" name="district" id="" onChange={onChangeDistrict} required>
                        {
                            district ? Object.keys(district).map((dis,index)=>(
                            <option value={dis} key={dis}>{dis}</option>
                            )) : ''
                        }
                        </select>
                    </div> 
                    <div className="info-creditcard-50 mt-50px">
                        <select className="w-100" name="post" id="" required>
                        {
                            zipcode ? Object.keys(zipcode).map((zip)=>(
                            <option value={zip} key={zip}>{zip}</option>
                            )) : ''
                        }
                        </select>
                    </div> 
                    <div className="info-creditcard-100 mt-5 mb-1">
                        <input className="effect-16"  name="phone"  type="text" placeholder="" required />
                        <label>เบอร์โทรศัพท์ <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-100 mt-5 mb-1">
                        <input className="effect-16" type="text" name="email" placeholder="" required />
                        <label>อีเมล <span className="text-orange">*</span></label>
                        <span className="focus-border"></span>
                    </div>
                </div>
             

        }
                
        </div>
    )
}
