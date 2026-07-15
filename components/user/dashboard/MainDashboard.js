import React, { useContext, useEffect, useState } from 'react';
import Noti from '../noti';
import Sidenav from '../sidenav';
import { Link, withTranslation } from '../../../utils/i18n'
import withAuth from '../../../utils/withAuth'
import api from '../../../utils/api';
import tools from '../../../utils/tools';
import Router from 'next/router'
import AuthService from '../../../utils/AuthService'
import { ProgressBar, Button, Modal } from 'react-bootstrap';
import UserContext from '../../../contexts/UserContext';
 
const MainDashboard = (props) => {
  const { t } = props;
  const {user, fetchUser} = useContext(UserContext);

  const [show, setShow] = useState(false); 
  const [order, setOrder] = useState();

  const handleClose = () => {
    setShow(false);
  };

  const fetchOrder = () => {
    const id = AuthService.getProfile().id;
    var limit = 5;
    api.getUserOrder(id, { limit, type: 'product' }).then(res => {
      const data = res.data;
      setOrder(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  };

  useEffect(() => {
    fetchOrder();
  },[]);

  const handleInsert = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    api.insertSubcribe(data)
    .then(res => {
      const data = res.data;
      if(user) {
        fetchUser();
        setShow(false);
      }else{
        setShow(false);
      }
        
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  const handleDel = () => {
    const data = new FormData(event.target)
    event.preventDefault()
    api.delSubcribe(data)
    .then(res => {
      const data = res.data;
      fetchUser();
      setShow(false);
    })
    .catch(err => {
      console.log(err.response);
    })

  }

  const renderDefault = () => {
    if (user) {
      if (user.addresses.length > 0) {
        for (var i = 0; i < user.addresses.length; i++) {
          if (user.addresses[i].default == 1) {
            return (
              <>
                <p className="p-medium mt-3 mb-0">{t('default_address')}</p>
                <p className="mb-0 mt-3 ">{user.addresses[i].firstname} {user.addresses[i].lastname} {user.addresses[i].phone}</p>
                <p>{user.addresses[i].full_address}</p>

              </>
            )
          }
        }
      }
    }
  }

  const renderTax = () => {
    if (user) {
      if (user.addresses.length > 0) {
        for (var i = 0; i < user.addresses.length; i++) {
          if (user.addresses[i].tax == 1) {
            return (
              <>
                <p className="p-medium mt-3 mb-0">{t('default_billing_address')}</p>
                <p className="mb-0 mt-3">{user.addresses[i].firstname} {user.addresses[i].lastname} {user.addresses[i].phone}</p>
                <p>{user.addresses[i].full_address}</p>

              </>
            )
          }
        }
      }
    }
  }


  const handleSave = () => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    api.updateUser(id, jsonData)
      .then(res => {
        const data = res.data;
        fetchUser();
        setShow(false);
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  return ( 
    <>
      <Sidenav user={user} page="dashboard" >
        <div className="box-main-account">
          <div className="row mx-0 px-0">
            <div className="col-12 pl-0">
              <div className="mt-2 mb-4">
                <h6 className="text-black">{t('manage_my_account')}</h6>
              </div>
            </div>
          </div>
          <div className="row mx-0 px-0">
            <div className="col-lg-4 col-12 d-flex pl-0 pr-lg-2 pr-0">
              <div className="border-r bg-white p-3">
                <div className="manage-account">
                  <div>
                    <p className="p-medium mb-0">{t('my_profile')}
                    <font className="pl-3">
                      <Link href={'/user/edit-profile'} as={`/user/edit-profile`}>
                        <a>{t('edit')}</a>
                      </Link>
                    </font>
                  </p>
                  { 
                    user ? (
                      <>
                        <p className="mb-0 mt-3">{user ? user.firstname : ''} {user ? user.lastname : ''}</p>
                        <p className="overflow-hidden text-transform-none">{user ? user.email : ''}</p>
                        <p className="p-medium mb-0 mt-3">
                        {
                          (user.email_subscribe) ? (
                            <a className="text-gray" onClick={() => setShow(true)}>{t('un_subscribe')}</a>
                          ) : (
                            <a className="text-success" onClick={() => setShow(true)}>{t('subscribe')}</a>
                          )
                        }
                        </p>
                      </>  
                    ) : ''
                  }
                </div>
              </div>
            </div>
            
          </div>
          <div className="col-lg-8 col-12 d-flex pr-0 pl-lg-2 pl-0 mt-lg-0 mt-4">
              <div className="border-r bg-white p-3">
                <div className="row px-0 mx-0">
                  <div className="col-12 pl-0">
                    <div className="manage-account pr-3 ">
                      <div>
                        <p className="p-medium mb-0">{t('address_book')}
                        <font className="pl-3">
                            <Link href={'/user/address'} as={`/user/address`}>
                              <a>
                                {
                                  user && user.addresses.length > 0 ? t('edit') : t('add')
                                }
                              </a>
                            </Link>
                          </font>
                        </p>
                        {renderDefault()}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <hr className="use-line "></hr>
                  </div>

                  <div className=" col-12 px-0">
                    <div className="manage-account">
                      <div>

                        {renderTax()}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="box-main-order mt-3">
          <div className="border-r bg-white">
            <div className="row mx-0 px-0">
              <div className="col-12 px-0">
                <div className="p-3">
                  <p className="p-medium mb-0">{t('recent_orders')}</p>
                </div>
                <div className="table-responsive">
                  <table className="table table-order">
                    <thead>
                      <tr>
                        <th>{t('order')}</th>
                        <th>{t('placed_on')}</th>
                        <th>{t('items')}</th>
                        <th>{t('total')}</th>
                        <th>{t('status')}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        order ? order.rows.map((val, index) => (
                          <tr key={val.order_id}>
                            <td>
                              <Link href={`/user/order-detail/[order_id]?order_id=${val.order_id}`} as={`/user/order-detail/${val.order_id}`}>
                                <a className="p-medium text-pink">
                                  {val.order_id}
                                </a>
                              </Link>
                          </td>
                            <td>{tools.formatDate(val.createdAt)}</td>
                            <td className="dashboard">
                              <div className="img-detail-td">
                                {
                                  (val.detail && val.detail.length) && (
                                    <>
                                      {
                                        (val.detail[0].product.video_type == 0 || val.detail[0].product.video_type == null) && (
                                          <img src={val.detail[0].product.picture ? val.detail[0].product.picture : '/images/book.png'} className="mh-100" />
                                        )
                                      }
                                      {
                                        (val.detail[0].product.video_type == 1 || val.detail[0].product.video_type == 2) && (
                                          <img src={'/images/video.svg'} className="mh-100 video" />
                                        )
                                      }
                                    </>
                                  )
                                }

                                {/* {
                                (val.video_type == 1 || val.video_type == 2) && (
                                  <img src={'/images/video.svg'} className="mh-100 video" />
                                )
                              } */}
                                {/* <img src={val.detail ? val.detail[0].product.picture : '/images/book.png'} className="mh-100" /> */}
                              </div>
                            </td>
                            <td className="font-weight-bold">฿ {tools.currencyFormatDE(val.total_price)}</td>
                            {/* <td>
                            {val.status == 0 && <span className="text-cancel">{t('status')} : {t('cancel')}</span>}
                            {val.status == 1 && '{t('pending')}'}
                            {(val.status == 2 || val.status == 3) && <span className="text-cancel">{t('status')} : {t('prepare_delivery')}</span>}
                            {val.status == 4 && <span className="text-cancel">{t('status')} : {t('in_transit')}</span>}
                            {val.status == 5 && <span className="text-success">{t('status')} : {t('success')}</span>}
                          </td> */}
                            <td className="p-medium">
                              <Link href={`/user/order-detail/[order_id]?order_id=${val.order_id}`} as={`/user/order-detail/${val.order_id}`}>
                                <a>
                                  {val.packages[0].status == 0 && t('status0')}
                                  {(val.packages[0].status == 1 && val.slips.length == 0) && t('status1')}
                                  {(val.packages[0].status == 1 && val.slips.length != 0) && t('Order:confirm_slip')}
                                  {val.packages[0].status == 2 && t('status2')}
                                  {val.packages[0].status == 3 && t('status3')}
                                  {val.packages[0].status == 4 && t('status4')}
                                  {val.packages[0].status >= 5 && t('status5')}
                                  {/* {val.packages[0].status == 6 && t('status6')}
                                  {val.packages[0].status == 7 && t('status7')}
                                  {val.packages[0].status == 8 && t('status8')} */}
                                </a>
                              </Link>
                            </td>
                          </tr>
                        )) : (<tr><td colSpan="5"></td></tr>)
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </Sidenav>
    

    <Modal className="modal-cart" centered show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <div>
        <Modal.Title className="d-flex"></Modal.Title> 
        </div>
      </Modal.Header>
      <Modal.Body>
        <form id="promo-form" onSubmit={handleSave} encType="multipart/form-data">
          {
            user && (
              <>
              {
                (user.email_subscribe) ? (
                    <form id="promo-form" onSubmit={handleDel} encType="multipart/form-data">
                        <div className="row mw-100">
                            <div className="col-12">
                                <div className="text-center pt-5">
                                    <div>
                                        <img src="/icon/sub_scribe.svg" alt="" className="img-fluid" style={{'width' : '40%'}} />
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-pink">{t('un_subscribe')}</h4>
                                    </div>
                                    <div className="mt-4">
                                        <p>{t('read_understood')} 
                                          <Link href={'/privacy_policy/condition'} as={`/privacy_policy/condition`}>
                                            <a className="text-success" target="_blank"><u>{t('privacy_policy')}</u></a>
                                          </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" name="email" defaultValue={user.email} />
                            <div className="col-12 my-4">
                                <div className="text-center">
                                    <button className="btn btn-outline-primary mr-3" type="button" onClick={handleClose}>{t('cancel')}</button>
                                    <button className="btn btn-primary" type="submit">{t('un_subscribe')}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form id="promo-form" onSubmit={handleInsert} encType="multipart/form-data">
                        <div className="row mw-100 mx-0">
                            <div className="col-12">
                                <div className="text-center pt-5">
                                    <div>
                                        <img src="/icon/sub_scribe.svg" alt="" className="img-fluid" style={{'width' : '40%'}} />
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-pink">{t('subscribe')}</h4>
                                    </div>
                                    <div className="mt-4">
                                        <p>{t('read_understood')} 
                                          <Link href={'/privacy_policy/condition'} as={`/privacy_policy/condition`}>
                                            <a className="text-success" target="_blank"><u>{t('privacy_policy')}</u></a>
                                          </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" name="email" defaultValue={user.email} />
                            <div className="col-12 my-4">
                                <div className="text-center">
                                    <button className="btn btn-outline-primary mr-3" type="button" onClick={handleClose}>{t('cancel')}</button>
                                    <button className="btn btn-primary" type="submit">{t('subscribe')}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                )
              }
              </>
            )
          }
        </form> 
      </Modal.Body>
    </Modal>
      
    </>
  )
}

export default MainDashboard