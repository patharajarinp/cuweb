import React, { useState, useEffect ,useContext} from 'react'
import Layout from '../../../components/layout'
import api from '../../../utils/api';
import Sidenav from '../../../components/user/sidenav'
import tools from '../../../utils/tools'
import { useRouter } from 'next/router'
import UserContext from '../../../contexts/UserContext'
import MainReturn from '../../../components/order_return/MainReturn'
import Order_Return from '../../../components/order_return/Order_Return'
import FormRequest from '../../../components/order_return/FormRequest'
import { withTranslation, Link, Router, Trans, i18n } from "../../../utils/i18n";
import Loadbutton from '../../../components/widget/Button'


const OrderReturnReport = (props) => {
  // const [user, setUser] = useState();
  const [loading, setLoadding] = useState(false);

  const [pkg, setPackage] = useState();
  const [sidenav, setSidenav] = useState(true);
  const { user } = useContext(UserContext)
  const { t } = props
  const[data,setData] = useState([]);
  const [passData,setPassData] = useState(null)

  const [group, setGroup] = useState(null);
  const [isAccept,setAccept] = useState(false);

  const router = useRouter()
  const pkg_id = router.query.pkg_id;


  const  fetchDetail = () => {
    api.getPackageOne(pkg_id).then(res =>{
        const data = res.data;
        console.log('data', data);
        
        console.log('passData', passData)
        data.package_details = data.package_details.filter(val => passData.items.findIndex(item => item.product_id == val.product_id) != -1 )
        let items = passData.items.map(val => {
          // const product = val.product
          return {product_id : val.product_id,checked:false,subject : '1',detail :'',images : [],error:null}
        })
        console.log('items', items)
        setPackage(data);
        setData(items)

    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  useEffect(() => {
    const package_return = localStorage.getItem('package_return');
    if(!package_return) {
      Router.push('/')
      return;
    }
    try{
      setPassData(JSON.parse(package_return) );
    }
    catch(err){
      alert('JSON parse Error !.')
    }
    

    
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    
  }, []);


  useEffect(()=>{
    if(!passData || !pkg_id) return;
    fetchDetail();
  },[passData,pkg_id])

 

  const sendForm = (e) =>{
    if(!passData) {
      return;
    }
    e.preventDefault();
    var temp = []
    let errors = [];
    let form_data = new FormData(e.target);
    // console.log('data',data)
    data.forEach((val,index)=>{

        if(!val.amount) errors.push({index,product_id : val.product_id,error :'amount'})
        else if(!val.images.length) errors.push({index,product_id : val.product_id,error :'image'})
        
        
        val.images.forEach(img => {
          form_data.append(`img-${val.product_id}`,img.file)
        })
        
        temp.push(val)
      
    })

    // console.log('err',errors)

    if(errors.length){
      let t = [...data];
      errors.forEach(val => {
        t[val.index].error = val.error
      })
      setData(t)
      document.getElementById('section'-errors[0].product_id).scrollIntoView({behavior: 'smooth'});
      return;
    }

    let items = temp.map(val => {
      return {id : val.product_id ,quantity : val.amount ,subject:val.subject,detail:val.detail}
    })
    form_data.append("items",JSON.stringify(items));
    form_data.append("order_id",pkg.order_id);
    form_data.append("pkg_id",pkg_id);

    // console.log(items);
    setLoadding(true);
    api.sendPackageReturn(form_data).then(res =>{
      const data = res.data;
      // setLoadding(false);
      if(passData.type == 1) {
        Router.replace('/user/order_return');
      }else{
        Router.replace('/user/order_change');
      }
    })
    .catch(err =>{
      setLoadding(false);
      console.log(err.response);
    })
  }



  const updateProduct = (obj)=>{
    const {product_id,key,value} = obj;
    if(!product_id) return;
    let index = data.findIndex(val => val.product_id == product_id)
    
    if(index == -1) return;
    let tmp = [...data];
    tmp[index][key] = value;
    setData(tmp);
  }
  const isSomeCheck = ()=>{
    let bool = false;
    data.forEach(val =>{
      if(val.checked) bool = true;
    })
    return bool;
  }

  console.log('pkg', pkg);
  
  return (
    <Layout title="User | Order">
      <Sidenav user={user} menuToggle={sidenav} page="order_return" >
        {
          (pkg) ? (
            <div className="show-profile pb-5" id="show-profile">
            <div className="box-main-account">
              <div className="row mx-0 px-0 justify-content-center">
                <div className="col-12 px-0">
                  <div className="mt-2 mb-4">
                    <h6 className="text-black">
                      {passData && passData.type == 1 ? 'คำขอคืนสินค้า' : 'คำขอเปลี่ยนสินค้า'}
                    </h6>
                  </div>
                  <div className="border-detail">
                    <div className="p-3 d-flex justify-content-between align-items-center header-detail">
                      <div>
                        <p className="font-weight-bold">คำสั่งซื้อ #{pkg.order_id}</p>
                        <p>สั่งซื้อวันที่ {tools.formatDate(pkg.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <MainReturn seller={pkg.seller_id != 'cu' ? pkg.seller : `cu`}>
                    {pkg && pkg.package_details.map((val,index) => (
                      <Order_Return product={{...val,...val.product}} key={val.product_id}
                      updateProduct={updateProduct}
                      data={data[index]}
                      t={t} type={passData && passData.type}
                      />
                    ))}
                  </MainReturn>
                </div>
              </div>

              <form onSubmit={sendForm}>   
                <div className="row mx-0 px-0 justify-content-center">

                    <div className="col-10 px-0 mt-5">  
                      <FormRequest t={t} type={passData && passData.type} payment_type={pkg.order.payment_type} total_price={pkg.total_price} member_discount={pkg.member_discount} />
                    </div>  
                  
                  <div className="col-10 px-0 mt-3">  
                    <div className="pb-3">
                      <div className="form-group">
                        <div className="custom-control custom-checkbox mb-3">
                          <input type="checkbox" className="custom-control-input" id="customCheck" name="information" value="1" onChange={(e) => {setAccept(e.target.checked)}} />
                          <label className="custom-control-label" htmlFor="customCheck">
                            {
                              passData && passData.type == 1 ? (
                                <p>ฉันได้อ่านและยอมรับ <u className="text-green">นโยบายการคืนสินค้า</u> ของศูนย์หนังสือแห่งจุฬาฯ </p>
                              ) : (
                                <p>ฉันได้อ่านและยอมรับ <u className="text-green">นโยบายการเปลี่ยนสินค้า</u> ของศูนย์หนังสือแห่งจุฬาฯ </p>
                              )
                            }
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Loadbutton loading={loading} name={`ส่งฟอร์ม`} 
                        classNmae="btn btn-primary-orange w-auto" 
                        disabled={!isAccept}
                        type="submit" />
                        {/* <button type="submit" className="btn btn-primary-orange" disabled={!isAccept}>ส่งฟอร์ม</button> */}
                    </div>
                  </div>
                </div>
              </form>   
              
            </div>
          </div>
          ) : ''
        }
        
      </Sidenav>
    </Layout>
  )
}

OrderReturnReport.getInitialProps = ({query}) => {
  return {query}; //has to be like an object
}

export default withTranslation(['order_detail'])(OrderReturnReport)