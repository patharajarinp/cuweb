import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../../contexts/UserContext";
import api from "../../../../utils/api";
import { Link, Router, withTranslation } from "../../../../utils/i18n";
import { useMergeState } from ".../.././../utils/state_tools";
import tools from "../../../../utils/tools";
import Auth from "../../../../utils/AuthService";
import Add_address from "../../../../components/mobile/chose-address";
import classnames from "classnames";
import { CustomInput } from "reactstrap";
import Banner from '../../../../components/mobile/carousel';

const MoblieMainCart = (props) => {
  const { t } = props;
  const { currencyFormatDE } = tools;
  const { user, setUser, handleCart, test } = useContext(UserContext);
  const [address, setAddress] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [shippingInfoCu, setShippingInfoCu] = useState(null);

  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);

  const [packages, setPackages] = useState([]);

  const [cartDetail, setCartDetail] = useMergeState({
    address_id: 0,
    shipping_type: 1,
    cart_id: [],
  });

  const [calDetail, setCalDetail] = useMergeState({});

  const [haveDisable, setHaveDisable] = useState(false);

  const [selected, setSelectedAddress] = useState(null);
  const toggle = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (!user || !cartDetail || !shippingInfo || !shippingInfoCu) {
      return;
    }
    if (!user.cart.length) return;
    setHaveDisable(user.cart.some(item => Number(item.enable) === 0));

    tools
      .calAllSeller(user, cartDetail, shippingInfo, null, shippingInfoCu)
      .then((data) => {
        setCalDetail(data);
      });
  }, [cartDetail, shippingInfo, shippingInfoCu]);

  useEffect(() => {
    if (!user || !cartDetail || !shippingInfo) {
      return;
    }
    let tmp = [...shippingInfo];
    const { cart_id } = cartDetail;

    let seller_cart = tools.groupBy(user.cart, "seller_id");
    cartDetail.seller &&
      Object.keys(cartDetail.seller).forEach((s) => {
        if (seller_cart[s]) {
          let filtered_cart = seller_cart[s].filter((val) =>
            cart_id.includes(val.id)
          );
          let isAllEbook = true;
          filtered_cart.forEach((val) => {
            if (val.item_code) isAllEbook = false;
          });
          let index = tmp.findIndex((val) => val.id == s);
          if (index != -1) tmp[index].isAllEbook = isAllEbook;
        }
      });

    setShippingInfo(tmp);
  }, [cartDetail]);

  const [check, setCheck] = useState([]);
  const [defaultType, setDefaultType] = useState(1);
  const [defaultArea, setDefaultArea] = useState(0);
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.cart.length == 0) {
      Router.push("/user/no-cart");
      return;
    }

    let dataCheck = [];
    if (check.length) {
      dataCheck = check;
    } else {
      for (var i = 0; i < user.cart.length; i++) {
        dataCheck.push(user.cart[i].id);
      }
    }
    setCheck(dataCheck);

    if (!user.addresses.length) {
      return;
    }
    var getarea;
    // let address_index = 0;
    user.addresses.forEach((item, index) => {
      if (item.default == 1) {
        getarea = item.province_code;
        // setLocalAddress(item.id);
        // address_index=index
        setSelectedAddress(index);
      }
    });
    var setarea = ["10", "11", "12", "13"];
    var area;
    if (setarea.includes(getarea)) {
      area = 1;
    } else {
      area = 0;
    }

    // setCountcheck(user.cart.length);

    // var dataCheck = [];
    // for(var i = 0; i < user.cart.length; i ++){
    //   dataCheck.push(user.cart[i].id);
    // }
    // setCheck(dataCheck);

    setDefaultArea(area);
    showDiscount();
    // tools.calAll(user, user.addresses[selected || 0].id, defaultType, false, check).then(data => {
    //   setCalDetail(data)
    // })
  }, [user]);
  const showDiscount = async () => {
    tools.calShelfPromotion(user.cart).then((data) => {
      setDiscount(data);
    });
  };

  useEffect(() => {
    // document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    if (!user) return;

    if (!user.cart.length) {
      Router.push("/user/no-cart");
      return;
    }
    let dataCheck = [];
    if (cartDetail.cart_id.length) {
      dataCheck = cartDetail.cart_id;
    } else {
      for (var i = 0; i < user.cart.length; i++) {
        dataCheck.push(user.cart[i].id);
      }
    }
    // for(var i = 0; i < user.cart.length; i ++){
    //   dataCheck.push(user.cart[i].id);
    // }

    // console.log(user.cart)
    let address_id;
    if (cartDetail.address_id) {
      address_id = cartDetail.address_id;
    } else {
      address_id = user.addresses.find((a) => a.default == 1)
        ? user.addresses.find((a) => a.default == 1).id
        : null;
    }

    let obj = tools.groupBy(user.cart, "seller_id");
    let count = Object.keys(obj).length;
    if (count == 0) {
      Router.push("/user/no-cart");
    }

    if (!shippingInfo || count != shippingInfo.length) {
      api
        .getShipmentInfo({ seller_id: Object.keys(obj) })
        .then((res) => {
          let data = [];
          // console.log(obj)
          if (obj["cu"] && obj["cu"].length > 0) {
            data.push({ id: "cu" });
          }
          data.push(...res.data);
          setShippingInfo(data);

          let tmp = cartDetail;
          tmp.address_id = address_id;
          tmp.cart_id = dataCheck;

          tmp.shipping_type = 1;
          tmp.seller = {};

          data.forEach((data) => {
            tmp.seller[data.id] = {};
            tmp.seller[data.id].shipping_type = 1;
          });
          setCartDetail(tmp);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCartDetail({ address_id, cart_id: dataCheck });
    }
  }, [user]);

  useEffect(() => {
    if (cartDetail.address_id == 0) return;

    // console.log('address changed!')
    let address = user.addresses.find((ad) => ad.id == cartDetail.address_id);

    if (!address) return;

    // console.log('asdad')
    api
      .getShippingInfoCU({ province_code: address.province_code })
      .then((res) => setShippingInfoCu(res.data))
      .catch((err) => {
        setShippingInfoCu(-1);
        console.log(err);
        console.log(err.response);
      });
  }, [cartDetail.address_id]);

  const [ref_id, setRef_id] = useState();
  const [thisQuantity, setThisQuantity] = useState();
  const [totalQuantity, setTotalQuantity] = useState();

  const [confirmcancel, setconfirmcancel] = useState(false);
  const openconfirmcancel = () => setconfirmcancel(true);
  const closeconfirmcancel = () => setconfirmcancel(false);

  const delCart = (product_id, thisnum, totalnum) => {
    setThisQuantity(thisnum);
    setTotalQuantity(totalnum);
    setRef_id(product_id);
    setconfirmcancel(true);
  };

  const onConfirm = (ref_id) => {
    if (thisQuantity == totalQuantity) {
      delPorductIncart(ref_id);
      closeconfirmcancel();
    } else {
      updatePorductIncart(ref_id, totalQuantity, thisQuantity);
    }
  };

  const delPorductIncart = (ref_id) => {
    api
      .delCart(ref_id)
      .then(() => {
        let tmp = { ...user };
        tmp.cart = tmp.cart.filter((cart) => cart.id != ref_id);

        let info_tmp = [...shippingInfo];
        let cartDetail_tmp = { ...cartDetail };
        let { cart_id } = cartDetail_tmp;
        let idx1 = cart_id.findIndex((val) => val == ref_id);

        const obj = tools.groupBy(tmp.cart, "seller_id");
        let index;
        for (let i = 0; i < info_tmp.length; i++) {
          if (!obj[info_tmp[i].id]) {
            index = i;
          }
        }
        if (index || index == 0) {
          info_tmp.splice(index, 1);

          setShippingInfo(info_tmp);
        }
        setUser(tmp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updatePorductIncart = (ref_id, totalnum, thisnum) => {
    var amount = totalnum - thisnum;
    // alert(ref_id + ' : ' + amount);
    api
      .updateNumcard(ref_id, { quantity: amount })
      .then((res) => {
        const data = res.data;
        // console.log(data);
        let tmp = { ...user };
        var index = tmp.cart.findIndex((cart) => cart.id == ref_id);
        if (index != -1) {
          tmp.cart[index].quantity = amount;
        }
        setUser(tmp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isCuAllEbook = () => {
    if (!shippingInfo) return false;
    let cu = shippingInfo.find((val) => val.id == "cu");
    if (cu) return cu.isAllEbook;
    else return false;
  };

  const [checkall, setCheckall] = useState(true);

  const handleCheckall = (e) => {
    var checked = e.target.checked;
    var val = e.target.value;
    if (checked) {
      if (!user) {
        return;
      }
      // setCheckall(true);
      var dataCheck = [];
      for (var i = 0; i < user.cart.length; i++) {
        dataCheck.push(user.cart[i].id);
      }
      setCartDetail({ cart_id: dataCheck });
    } else {
      setCartDetail({ cart_id: [] });
      // setCheckall(false);
    }
  };
  const isCheckAll = () => {
    if (!user) return;

    let bool = true;

    for (let i = 0; i < user.cart.length; i++) {
      if (!cartDetail.cart_id.includes(user.cart[i].id)) {
        bool = false;
        break;
      }
    }

    return bool;
  };

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [changePackage, setHandleChangePackage] = useState(null);
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const isCheck = (id) => {
    if (cartDetail.cart_id.includes(id)) {
      return true;
    }
    return false;
  };

  const handleCheck = (e) => {
    var checked = e.target.checked;
    var id = e.target.value;
    var tmp = { ...cartDetail };

    if (checked) {
      tmp.cart_id.push(id);
    } else {
      var index = tmp.cart_id.findIndex((cart) => cart == id);
      tmp.cart_id.splice(index, 1);
    }
    setCartDetail(tmp);
    if (tmp.cart_id.length == user.cart.length) setCheckall(true);

    if (tmp.cart_id.length != user.cart.length) setCheckall(false);

    return tmp;
  };
  const [showM, setShowM] = useState(false);
  const toggleM = () => {
    setShowM(!showM);
  };
  const [ebookCheck, setEbookCheck] = useState(false);

  const [modalebook, setModalebook] = useState(false);
  const passSummary = () => {
    var selected_item = user.cart.filter((val) =>
      cartDetail.cart_id.includes(val.id)
    );
    let haveItemEbook = false;
    for (let i = 0; i < selected_item.length; i++) {
      let item = selected_item[i];
      if (item.type == "ebook") {
        haveItemEbook = true;
        break;
      }
    }

    localStorage.setItem("pass", JSON.stringify(cartDetail));

    if (haveItemEbook) {
      //setShowM(true);
      Router.push("/user/summary");
    } else {
      Router.push("/user/summary");
    }
  };

  const [img, setImg] = useState();
  const fetchPage = () => {
    var page = 'cart';
    var vendor = 'cu';
    api.getBanner(page, vendor).then(res => {
      const data = res.data;
      var items = [];
      data.banner_images.forEach((item) => {
        if (item.index != 5)
          return true;
        let temp = {
          src: item.image,
          key: 'banner' + Math.random(),
          href: item.link
        }

        items.push(temp)
      });
      setImg(items)
    })
      .catch(err => {
        console.log(err.response);
      })
  }

  useEffect(() => {
    fetchPage();
  }, []);

  const goToSummary = () => {
    Router.push("/user/summary");
  };
  const Product = ({ product, handleCheck, quantity, total_price }) => {
    let val = { ...product };
    var total_discount = val.cover_price * val.quantity - total_price;
    // val.price = percent != -1 ? parseFloat(val.cover_price) * (1 - percent) :val.price
    return (
      <>
        <div className="product-in-cart d-block">
          <div className="w-100 d-flex ">
            <div className="mt-1">
              <div className="custom-control custom-checkbox mt-4">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`item${val.id}`}
                  checked={isCheck(val.id)}
                  name="infor[]"
                  value={val.id}
                  required
                  onChange={handleCheck}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`item${val.id}`}
                ></label>
              </div>
            </div>
            <div className="product-in-cart-pic-area">
              <div className="product-in-cart-pic ">
                {(val.video_type == 0 || val.video_type == null) && (
                  <>
                    {val.preorder ? (
                      <>
                        <img
                          className="img-fluid"
                          src={
                            val.picture
                              ? val.picture
                              : "/mobile/image/product/book.png"
                          }
                        />
                        <img src="/mobile/image/pre_order.svg" className="img-stock" />
                      </>
                    ) : (
                      <img
                        className="img-fluid"
                        src={
                          val.picture ? val.picture : "/mobile/image/product/book.png"
                        }
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="product-in-cart-content">
              <h4 className="text-black two-line">{val.name}</h4>
              {
                (val.enable == 0 ? <p className='cart-text-amount text-danger'>สินค้ารายการนี้ไม่ได้มีวางจำหน่ายแล้ว</p> : <p></p>)
              }
              <div className="d-flex align-items-center">
                <div
                  className={classnames("tag-cat ", {
                    "tag-book":
                      val.item_code == 10000 || val.item_code == 20000,
                    "tag-stationary": val.item_code == 30000,
                    "tag-ebook": val.item_code == null,
                    "tag-course": val.type == "course",
                  })}
                >
                  {val.item_code == 10000 || val.item_code == 20000
                    ? t("mobile_header:book_menu")
                    : val.item_code == 30000
                      ? t("mobile_header:stationary")
                      : val.item_code == null
                        ? t("mobile_header:e_book")
                        : val.type == "course"
                          ? t("mobile_header:online_course")
                          : null}
                </div>
                {!!val.is_preorder && (
                  <div
                    className="tag-cat px-3"
                    style={{ backgroundColor: "#DE5C6E" }}
                  >
                    Preorder
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-100 d-flex align-items-center">
            <div className="product-in-cart-content m-0 mt-3">
              <div className="d-flex justify-content-between align-items-center w-100 flex-wrap mb-3">
                <div>
                  <p className="text-gray font-12 mb-0  lineh-1 d-flex align-items-center justify-content-between">
                    {t("mobile_shippingInfo:unit_price")}{" "}
                  </p>
                  {val.cover_price == 0 ? (
                    <h4 className=" text-black mb-0 font-weight-bold">
                      {t("mobile_shippingInfo:free")}
                    </h4>
                  ) : (
                    <h4 className=" text-black mb-0 font-weight-bold">
                      ฿ {currencyFormatDE(val.cover_price)}
                    </h4>
                  )}
                </div>
                <div className="input-group new-btn-cart btn-addon-cart">
                  <input
                    type="button"
                    defaultValue="-"
                    className="btn-minus"
                    data-id={val.id}
                    data-field="quantity"
                    disabled={val.quantity == 1}
                    onClick={() => {
                      handleCart({ cart: val, amount: parseInt(quantity) - 1 });
                    }}
                  />
                  <input
                    type="number"
                    step="1"
                    max=""
                    min="0"
                    pattern="[0-9]*"
                    value={val.quantity}
                    name="quantity"
                    data-field="quantity"
                    data-id={val.id}
                    className="text-number mb-0"
                    onChange={(e) =>
                      handleCart({ cart: val, amount: e.target.value })
                    }
                  />
                  <input
                    type="button"
                    defaultValue="+"
                    className="btn-plus"
                    data-id={val.id}
                    data-field="quantity"
                    disabled={
                      val.quantity >=
                      (!!val.is_preorder
                        ? val.stock
                        : val.stock - val.reserve_stock)
                    }
                    onClick={() =>
                      handleCart({ cart: val, amount: parseInt(quantity) + 1 })
                    }
                  />
                </div>
              </div>
              {total_price ? (
                <>
                  <p className="text-gray font-12 mb-1  lineh-1 d-flex align-items-center justify-content-between">
                    {t("mobile_shippingInfo:total_prices")}{" "}
                    <span className="font-14 text-pink mb-0 font-weight-bold">
                      ฿ {currencyFormatDE(total_price)}
                    </span>
                  </p>
                  {!!total_discount && (
                    <p className="text-gray font-12 mb-0  lineh-1 d-flex align-items-center justify-content-between">
                      {t("mobile_shippingInfo:save")}{" "}
                      <span className="font-12 text-green mb-0 font-weight-bold">
                        ฿ {currencyFormatDE(total_discount)}
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray font-12 mb-1  lineh-1 d-flex align-items-center justify-content-between">
                  {t("mobile_shippingInfo:total_prices")}{" "}
                  <span className="font-14 text-pink mb-0 font-weight-bold">
                    {t("mobile_shippingInfo:free")}
                  </span>
                </p>
              )}

              <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="col-cart">
                  {calDetail.discount_shelf &&
                    calDetail.discount_shelf.cart_promotion &&
                    calDetail.discount_shelf.cart_promotion.find(
                      (c) => c.id == val.product_id
                    ) ? (
                    <p className="font-12 text-grey mt-0 border-promotion mb-0">
                      {
                        calDetail.discount_shelf.cart_promotion.find(
                          (c) => c.id == val.product_id
                        ).promotion
                      }
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="d-flex justify-content-end w-100">
                  <a
                    className="item-remove  d-flex align-self-center btn-remove-cart "
                    onClick={() => {
                      delCart(val.id, val.quantity, quantity);
                    }}
                  >
                    <i className="fas fa-trash fa-lg text-trash font-16"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Seller = ({ list, seller_id, data }) => {
    const Footbar = () => {
      const handleChangeSeller = (type) => {
        let tmp = cartDetail;
        if (seller_id == "cu") tmp.shipping_type = type;
        tmp.seller[seller_id].shipping_type = type;
        setCartDetail(tmp);
        setShow2(false);
      };
      const [type, setType] = useState(
        (cartDetail &&
          cartDetail.seller &&
          cartDetail.seller[seller_id] &&
          cartDetail.seller[seller_id].shipping_type) ||
        1
      );

      const showSelector = () => {
        setHandleChangePackage({
          handle: handleChangeSeller,
          seller: shippingInfo.find((info) => info.id == seller_id),
          shippingCost: calDetail.shipping_list.find(
            (val) => val.seller_id == seller_id
          ),
          list:
            seller_id != "cu"
              ? shippingInfo.find((info) => info.id == seller_id)
                .seller_shippings
              : [{ shipping_type: 1 }, { shipping_type: 2 }],
          type: type || 1,
        });
        handleShow2();
      };

      let calShipping =
        calDetail && calDetail.shipping_list
          ? calDetail.shipping_list.find((sl) => sl.seller_id == seller_id)
            .total
          : 0;
      return (
        <tr className="bg-change">
          <td colSpan="6">
            <div className="d-flex justify-content-between">
              <p className="p-medium">{t("mobile_translations:shipping_options")} </p>

              {!data.isAllEbook ? (
                type == 1 ? (
                  <p className="text-pink">
                    {t("mobile_translations:standard_delivery_m")}
                  </p>
                ) : (
                  <p className="text-pink">
                    {t("mobile_translations:express_delivery_m")}
                  </p>
                )
              ) : null}
              {!data.isAllEbook ? (
                calShipping == 0 || calShipping == "0.00" ? (
                  <p className="text-num">{t("mobile_translations:free_shipping")}</p>
                ) : (
                  <p className="text-num">฿ {currencyFormatDE(calShipping)}</p>
                )
              ) : null}
              {!data.isAllEbook ? (
                <p className="change-track font-weight-bold ">
                  <a
                    onClick={showSelector}
                    className="change-shipping-s text-white"
                  >
                    {t("mobile_shippingInfo:change")}
                  </a>
                </p>
              ) : null}
            </div>
          </td>
        </tr>
      );
    };

    const [check, setCheck] = useState(
      list.filter((cart) => cartDetail.cart_id.includes(cart.id)).length ==
      list.length
    );
    const handleCheckallSeller = (e) => {
      var checked = e.target.checked;
      var val = e.target.value;
      let cart_id = [];
      if (checked) {
        setCheck(true);
        var dataCheck = [...cartDetail.cart_id];
        for (var i = 0; i < list.length; i++) {
          dataCheck.push(list[i].id);
        }
        cart_id = [...new Set(dataCheck)];
        setCartDetail({ cart_id });
      } else {
        cart_id = cartDetail.cart_id.filter(
          (cart) => list.findIndex((l) => l.id == cart) == -1
        );
        setCartDetail({ cart_id });
        setCheck(false);
      }
      setCheckall(cart_id.length == user.cart.length);
    };

    const handleCheckSeller = (e) => {
      var tmp = handleCheck(e);
      setCheck(
        list.filter((cart) => tmp.cart_id.includes(cart.id)).length ==
        list.length
      );
    };

    return (
      <>
        <div className="py-2"></div>
        <div className="bg-white br-8 pt-3">
          <div className="row mx-0">
            <div className="col-12 pb-3 border-bottom">
              <div className="form-group mb-0">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    checked={check}
                    id={"seller_" + seller_id}
                    name={"seller_" + seller_id}
                    value="all"
                    onChange={handleCheckallSeller}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={"seller_" + seller_id}
                  >
                    <p className="mb-0">
                      {seller_id == "cu"
                        ? "CHULABOOK"
                        : shippingInfo.find((info) => info.id == seller_id)
                          .shop_name}{" "}
                      <i className="fas fa-chevron-right text-pink ml-2"></i>
                    </p>
                  </label>
                </div>
              </div>
              {seller_id == "cu" && (
                <p className="p-12 m-0 mt-1 one-line">
                  {t("mobile_shippingInfo:free_shipping_s")} ฿700.00
                </p>
              )}
            </div>
            <div className="col-12">
              <table className="table table-cart">
                <tbody>
                  {list.map((val, index) => {
                    // let percent = (calDetail && calDetail.discount_shelf && calDetail.discount_shelf.cart_per) ? calDetail.discount_shelf.cart_per.filter((per)=>per.id == val.product_id) :null
                    //let isDiscount = (calDetail && calDetail.discount_shelf && calDetail.discount_shelf.cart_promotion) ? !!calDetail.discount_shelf.cart_promotion.find(item => item.id == val.product_id)  : false
                    let total_price = val.cover_price * val.quantity;

                    if (calDetail && calDetail.discount_shelf) {
                      console.log("calDetail", calDetail);
                      let { discount_list } = calDetail.discount_shelf;
                      let item = discount_list.find(
                        (d) => d.product_id == val.product_id
                      );
                      if (item) {
                        total_price -= item.total_discount + item.discount_web;
                      }
                    }

                    return (
                      <Product
                        key={index}
                        handleCheck={handleCheckSeller}
                        product={val}
                        total_price={total_price}
                        quantity={val.quantity}
                      />
                    );
                  })}

                  {/* <Footbar/> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {img &&
          <div className="py-3">
            <Banner items={img} />
          </div>
        }
      </>
    );
  };

  const calTotalWithSeller = (cart, seller_id) => {
    let price = cart
      .filter((c) => c.seller_id == seller_id)
      .reduce((price, product) => {
        price = product.price * product.quantity;
        return price;
      }, 0);
    return price;
  };

  var total_price_cu = 0;
  if (calDetail) {
    // const {discount,dis_for_web_cu} = calDetail.discount_shelf
    total_price_cu = calDetail.total_price_cu;
  }

  const addressIndex = selected || 0;
  return (
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h3 className="text-black m-0">
            {t("mobile_translations:cart")} ({user && user.cart.length})
          </h3>
        </div>
        <Link href='/'>
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={"/mobile/image/icon/icon-back.svg"} />
          </a>
        </Link>
      </div>
      <div className="bg-light-less-gray">
        <div className="padding-top-for-box-cart"></div>
        {user && user.addresses.length > 0 ? (
          <>
            <div className="bg-white container">
              <div className="info-address">
                <img
                  className="img-fluid mr-2 mb-auto"
                  src="/mobile/image/icon/icon-location.svg"
                />

                <div className="info-address-detail w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    {user.addresses[addressIndex].at == "home" ? (
                      <div className="btn-address-home-add-list mr-2">
                        <p className="p-14">{t("mobile_address:home")}</p>
                      </div>
                    ) : (
                      <div className="btn-address-work-add-list mr-2">
                        <p className="p-14">{t("mobile_address:office")}</p>
                      </div>
                    )}
                    <div className='d-flex'>
                      <a onClick={toggle}>
                        <p className="text-pink mb-0">{t("mobile_shippingInfo:changeAddress")}</p>
                      </a>
                      <Link href="/user/address" as="/user/address">
                        <a >
                          <p className="text-grey ml-3 mb-0">{t('mobile_address:address_book')}</p>
                        </a>
                      </Link>

                    </div>

                  </div>
                  <p className="text-black mb-0 mt-1">
                    {user.addresses[addressIndex].firstname}{" "}
                    {user.addresses[addressIndex].lastname}
                  </p>

                  <p className="p-12 text-black two-line mb-0">
                    {user.addresses[addressIndex].full_address}
                  </p>
                  <p className="p-12 text-black mb-1">
                    {user.addresses[addressIndex].phone}
                  </p>
                </div>
              </div>
            </div>
            <Add_address
              show={show}
              user={user}
              toggle={toggle}
              selected={selected}
              setSelectedAddress={setSelectedAddress}
              addresschoose={"delivery"}
            />
          </>
        ) : (
          <Link href="/user/add-address">
            <a className="add-address container">
              <h4 className="text-pink my-auto">
                <img
                  className="img-fluid mr-8px"
                  src={"/mobile/image/icon/icon-location.svg"}
                />
                {t("mobile_translations:add_new_address")}
              </h4>
              <i className="fas fa-chevron-right text-pink my-auto"></i>
            </a>
          </Link>
        )}
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-12 mb-2 mb-xl-0 px-0">
            <div className="row mx-0">
              <div className="col-12 px-0">
                <div className="bg-light-less-gray">
                  {shippingInfo && user.cart.length
                    ? shippingInfo.map((seller, index) => {
                      let list = user.cart.filter(
                        (c) => c.seller_id == seller.id
                      );
                      return (
                        <Seller
                          list={list}
                          data={seller}
                          seller_id={seller.id}
                          key={"st" + seller.id}
                        />
                      );
                    })
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cart-nav-to-payment">
        <div className="container d-flex">
          <div className="check-all-product">
            <div className="form-group mb-0 my-auto">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={isCheckAll()}
                  id="chk2"
                  name="chk2"
                  value="all"
                  required
                  onChange={handleCheckall}
                />
                <label className="custom-control-label" htmlFor="chk2">
                  <p className="mb-0">{t("mobile_translations:all")}</p>
                </label>
              </div>
            </div>
            <div className="my-auto text-right">
              {calDetail && (
                <h4 className="text-pink m-0 font-weight-bold">
                  ฿ {tools.currencyFormatDE(calDetail.total_discount)}
                </h4>
              )}
              <p className="p-12 mb-0">{t("mobile_shippingInfo:include_shipping")}</p>
            </div>
          </div>
          {!check.length ? (
            <a className="btn-cart-to-payment">
              <h4 className="text-white m-auto">{t("mobile_shippingInfo:select_products")}</h4>
            </a>
          ) : !selected && selected != 0 ? (
            <Link href="/user/add-address">
              <a className="btn-cart-to-payment-has-address">
                <h5 className="text-white m-auto">
                  {t("mobile_translations:add_new_address")}
                </h5>
              </a>
            </Link>
          ) : haveDisable == false ? (
            <a className="btn-cart-to-payment-has-address" >
              <h4 className="text-white m-auto" onClick={passSummary}>
                {t("mobile_shippingInfo:payment")}
              </h4>
            </a>
          ) : ((
            <a className="btn-cart-to-payment" >
              <h4 className="text-white m-auto" >
                {t("mobile_shippingInfo:payment")}
              </h4>
            </a>
          ))}
        </div>
      </div>
      <div className="padding-bottom-for-box-cart"></div>

      <div
        className={classnames("modals-confirm-cancel-area", {
          show: confirmcancel,
        })}
      >
        <div className="modals-confirm-cancel">
          <div className="d-flex">
            <img className="img-fluid m-auto" src="/mobile/image/icon/Attention.svg" />
          </div>
          <p className="text-black text-center mt-2">
            {t("mobile_translations:want_del")}
          </p>
          <div className="btn-modals-confirm-cancel-area">
            <h4 className="m-auto text-pink" onClick={closeconfirmcancel}>
              {t("mobile_translations:cancel")}
            </h4>
            <div className="btn-line-cancel"></div>
            <h4 className="m-auto text-pink" onClick={() => onConfirm(ref_id)}>
              {t("mobile_translations:confirm")}
            </h4>
          </div>
        </div>
      </div>

      <div className={classnames("categories-dropedown sp", { show: showM })}>
        <div className="cart-nav">
          <div className=" text-center cart-nav-title"></div>

          <a className="btn-back cart-nav-back" onClick={toggleM}>
            <img className="img-fluid" src={"/mobile/image/icon/icon-back.svg"} />
          </a>
        </div>
        <div className="container  onscroll">
          <div className="h-64px"></div>
          <div className="me-area ">
            <div>
              <div className="title-me text-ebook pt-3">
                {t("mobile_shippingInfo:modal_ebook1")}
              </div>
              <div className=" text-center pt-3">
                {t("mobile_shippingInfo:modal_ebook2")} {t("mobile_shippingInfo:modal_ebook3")}
              </div>
              <div className="d-flex justify-content-center align-items-center pt-4">
                <img className="img-fluid" src={"/mobile/image/logo/g.png"} />
              </div>
              <div className="d-flex justify-content-center align-items-center pt-3">
                <img className="img-fluid" src={"/mobile/image/logo/a.png"} />
              </div>
              <div className="text-red text-center pt-4">
                {t("mobile_shippingInfo:modal_ebook4")} {t("mobile_shippingInfo:modal_ebook5")}
              </div>
              <div className="d-flex justify-content-center align-items-center pt-3">
                <CustomInput
                  type="checkbox"
                  id="check-ebook"
                  label={t("mobile_shippingInfo:modal_ebook6")}
                  checked={ebookCheck}
                  onChange={() => setEbookCheck(!ebookCheck)}
                  className="my-auto"
                />
              </div>
            </div>
          </div>
          <div className="footer-space"></div>
        </div>
        <div className="product-nav-main onneedEbook">
          <a
            className="btn-add-cart product-nav-main-btn product-book ebook nonecart"
            onClick={toggleM}
          >
            <h4> {t("mobile_shippingInfo:modal_ebook7")}</h4>
          </a>
          <a
            className={`btn-buy product-nav-main-btn product-book ebook ${!ebookCheck && "disable"
              }`}
            onClick={ebookCheck ? goToSummary : null}
          >
            <h4>{t("mobile_shippingInfo:modal_ebook8")}</h4>
          </a>
        </div>
      </div>

    </>
  )
}

export default MoblieMainCart