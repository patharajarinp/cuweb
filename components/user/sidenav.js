import classNames from 'classnames';
import React from 'react';
import { Link, withTranslation } from '../../utils/i18n';


const Sidenav = (props) => {
  const { t } = props;

  return (
    <>
      <div className="">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-3 col-12" >
              <div className="row mx-0 px-0">
                <div className="col-12 px-0 mx-0">
                  <div className="bg-profile bg-white">
                    <div className="box-profile">
                      <div className="img">
                        {props.user ? <img src={props.user.picture ? props.user.picture : '/images/no-picture.png'} /> : ''}
                      </div>
                      <div className="name">
                        <div className="mt-3">
                          <p className="mb-0 font-weight-bold">{props.user ? props.user.firstname : ''} {props.user ? props.user.lastname : ''}</p>
                          <Link href={'/user/edit-profile'}>
                            <a>
                              <p className="text-gray">{t('edit_profile')}</p>
                            </a>
                          </Link>
                        </div>
                      </div>
                      <div className="d-block d-xl-none">
                        <div className="position-link-btn-data ">
                          <div className="lable-select-link">{t('choose')} :</div>
                          <button type="button" className="btn dropdown-toggle btn-link-iped-up" data-toggle="dropdown">
                            {
                              props.page == 'dashboard' ? t('manage_my_account') : ''
                                || props.page == 'profile' ? t('my_profile') : ''
                                  || props.page == 'address' ? t('address_book') : ''
                                    || props.page == 'order' ? t('my_orders') : ''
                                      || props.page == 'order_success' ? t('order_success') : ''
                                        || props.page == 'order_return' ? t('my_returns') : ''
                                          || props.page == 'order_change' ? t('my_change') : ''
                                            || props.page == 'order_cancel' ? t('my_cancellations') : ''
                                              || props.page == 'notification' ? t('notifications') : ''
                                                || props.page == 'review' ? t('my_reviews') : ''
                                                  || props.page == 'favorite' ? t('my_wishlist') : ''
                                                    || props.page == 'member' ? t('premium_member') : ''
                                                      || props.page == 'follow' ? t('follow') : ''
                            }
                          </button>
                          <div className="dropdown-menu list-item-link w-220px">
                            {
                              <ul>
                                <li className={classNames(props.page == 'dashboard' ? 'active' : '')}>
                                  <Link href={'/user/dashboard'}>
                                    <a>{t('manage_my_account')}</a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'profile' ? 'active' : '')}>
                                  <Link href={'/user/profile'}>
                                    <a >{t('my_profile')}</a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'address' ? 'active' : '')}>
                                  <Link href={'/user/address'}>
                                    <a >{t('address_book')}</a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'order' ? 'active' : '')}>
                                  <Link href={'/user/order'}>
                                    <a >{t('my_orders')}</a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'order_success' ? 'active' : '')}>
                                  <Link href={'/user/order_success'}>
                                    <a >
                                      {t('order_success')}
                                    </a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'order_change' ? 'active' : '')}>
                                  <Link href={'/user/order_change'}>
                                    <a >
                                      {t('my_change')}
                                    </a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'order_return' ? 'active' : '')}>
                                  <Link href={'/user/order_return'}>
                                    <a >
                                      {t('my_returns')}
                                    </a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'order_cancel' ? 'active' : '')}>
                                  <Link href={'/user/order_cancel'}>
                                    <a >
                                      {t('my_cancellations')}
                                    </a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'notification' ? 'active' : '')}>
                                  <Link href={'/user/notification'}>
                                    <a >
                                      {t('notifications')}
                                    </a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'review' ? 'active' : '')}>
                                  <Link href={'/user/review'}>
                                    <a >{t('my_reviews')}</a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'favorite' ? 'active' : '')}>
                                  <Link href={'/user/favorite'}>
                                    <a >{t('my_wishlist')}</a>
                                  </Link>
                                </li>
                                <li className={classNames(props.page == 'member' ? 'active' : '')}>
                                <Link href={'/user/member'}>
                                  <a >{t('premium_member')}</a>
                                </Link>
                                </li> 
                                {<li className={classNames(props.page == 'follow' ? 'active' : '')}>
                                  <Link href={'/user/follow'}>
                                    <a >{t('follow')}</a>
                                  </Link>
                                </li>}
                              </ul>
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="row mx-0 px-0 d-none d-xl-block">
                <div className="col-12 px-0 mx-0">
                  <div className="bg-account bg-white">
                    <div className="box-account">
                      <div>
                        <div className="img">
                          <img src="/icon/icon-user.svg" />
                        </div>
                        <div className="name">
                          <div className="">
                            <h4 className="">
                              <Link href={'/user/dashboard'}>
                                <a className={classNames(props.page == 'dashboard' ? '' : 'text-black')}>{t('manage_my_account')}</a>
                              </Link>
                            </h4>
                            <p>
                              <Link href={'/user/profile'}>
                                <a className={classNames(props.page == 'profile' ? '' : 'text-black')}>{t('my_profile')}</a>
                              </Link>
                            </p>
                            <p>
                              <Link href={'/user/address'}>
                                <a className={classNames(props.page == 'address' ? '' : 'text-black')}>{t('address_book')}</a>
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt--32">
                        <div className="img">
                          <img src="/icon/icon-bag.svg" />
                        </div>
                        <div className="name">
                          <div className="">
                            <h4 className="">
                              <Link href={'/user/order'}>
                                <a className={classNames(props.page == 'order' ? '' : 'text-black')}>{t('my_orders')}</a>
                              </Link>
                            </h4>
                            <p>
                              <Link href={'/user/order_success'}>
                                <a className={classNames(props.page == 'order_success' ? '' : 'text-black')}>
                                  {t('order_success')}
                                </a>
                              </Link>
                            </p>
                            <p>
                              <Link href={'/user/order_change'}>
                                <a className={classNames(props.page == 'order_change' ? '' : 'text-black')}>
                                  {t('my_change')}
                                </a>
                              </Link>
                            </p>
                            <p>
                              <Link href={'/user/order_return'}>
                                <a className={classNames(props.page == 'order_return' ? '' : 'text-black')}>
                                  {t('my_returns')}
                                </a>
                              </Link>
                            </p>
                            <p>
                              <Link href={'/user/order_cancel'}>
                                <a className={classNames(props.page == 'order_cancel' ? '' : 'text-black')}>
                                  {t('my_cancellations')}
                                </a>
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="main mt--32">
                        <div className="img">
                          <img src="/icon/icon-noti.svg" />
                        </div>
                        <div className="name">
                          <div className="">
                            <h4 className="">
                              <Link href={'/user/notification'}>
                                <a className={classNames(props.page == 'notification' ? '' : 'text-black')}>
                                  {t('notifications')}
                                </a>
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="main">
                        <div className="img">
                          <img src="/icon/icon-star.svg" />
                        </div>
                        <div className="name">
                          <div className="">
                            <h4 className="">
                              <Link href={'/user/review'}>
                                <a className={classNames(props.page == 'review' ? '' : 'text-black')}>{t('my_reviews')}</a>
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="main">
                        <div className="img">
                          <img src="/icon/icon-fav.svg" />
                        </div>
                        <div className="name">
                          <div className="">
                            <h4 className="">
                              <Link href={'/user/favorite'}>
                                <a className={classNames(props.page == 'favorite' ? '' : 'text-black')}>
                                  {t('my_wishlist')}
                                </a>
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </div>
                       <div className="main">
                        <div className="img">
                          <img src="/icon/icon-vip.svg" />
                        </div>
                        <div className="name">
                          <div className="">
                            <h4 className="">
                              <Link href={'/user/member'}>
                                <a className={classNames(props.page == 'member' ? '' : 'text-black')}>{t('premium_member')}</a>
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </div> 
                      <div className="main">
                        <div className="img">
                          <img style={{ width: '25px', marginLeft: '10px' }} src="/icon/icon-follow-writer.svg" />
                        </div>
                        <div className="name">
                          <div className="">
                            <h4 className="">
                              <Link href={'/user/follow'}>
                                <a className={classNames(props.page == 'follow' ? '' : 'text-black')}>{t('follow')}</a>
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-12">
              <div className="box-show-account bg-white">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="end-page"></div>
      {/* <div className="d-block d-xl-none">
            <div className={classNames("box-show-account bg-white" ,menuToggle ? 'd-block' : 'd-none')}>
              {props.children}
            </div>
          </div> */}
    </>
  )
}

export default withTranslation(['sidenav'])(Sidenav)
