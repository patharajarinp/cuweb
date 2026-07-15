import { useEffect, useMemo, useState, useContext } from "react";
import api from "../../utils/api";
import classnames from "classnames";
import AuthService from '../../utils/AuthService';
import { Link, withTranslation } from "../../utils/i18n";
import UserContext from '../../contexts/UserContext';
import ModalEcodeMobile from './ModalEcodeMobile';
import ModalStock from './ModalStock';
import { useRouter } from 'next/router';

const EcodeMainMobile = ({ product, book, project, t, show, fetchdataDetail, setShow, user }) => {
    const [chk, setChk] = useState([]);
    const [dateCheck, setDateCheck] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [showModelStock, setShowModelStock] = useState(false);
    const router = useRouter()
    const handleCloseLogin = () => {
        setShowLogin(false);
    };
    const resultBook = book?.rows.length > 0 ? book?.rows.filter(val => val.enable == 1) : []
    const { handleCart, fetchUser, local, setUser } = useContext(UserContext);
    const handleCheckall = (e) => {

        var checked = e.target.checked;
        var tmp = [...chk];
        if (checked) {
            tmp = resultBook.filter(item => isStock(item.id) || isPreOrder(item.id)).map(val => val.id);
        } else {
            tmp = [];
        }
        setChk(tmp);
    }
    const isStock = (id) => {
        let all_book = resultBook.length > 0 ? resultBook.filter(val => val.enable == 1) : []
        let find = all_book?.find(val => val.id == id && val.stock != 0);
        if (find) {
            return true;
        } else {
            return false;
        }

    }
    const isPreOrder = (id) => {
        let all_book = resultBook.length > 0 ? resultBook.filter(val => val.enable == 1) : []
        let find = all_book?.find(val => val.id == id && val.is_preorder == 1);
        if (find) {
            return true;
        } else {
            return false;
        }

    }

    const isCheckAll = () => {
        return chk.length == resultBook.length
    }

    const onChange = (e) => {
        var checked = e.target.checked;
        var id = e.target.value;
        var tmp = [...chk];

        var index = tmp.findIndex((item) => item == id);
        if (index == -1) {
            if (isStock(id) || isPreOrder(id)) {
                tmp.push(id)
            } else {
                setShowModelStock(true);
            }


        } else {
            tmp.splice(index, 1)
        }

        setChk(tmp);
    }

    const sum = useMemo(() => {
        let total = 0;
        for (let id of chk) {
            let item = resultBook.find(val => val.id == id)
            if (item) {
                total += item.price
            }
        }
        return total;
    }, [chk, book])

    const setCheckedById = (id) => {
        if (chk.includes(id) && isStock(id)) {
            return true;
        } else if (chk.includes(id) && isPreOrder(id)) {
            return true;
        } else {
            return false;
        }

    }


    const addcart = async (event, id) => {

        let arayProduct = id;
        console.log(arayProduct);
        //.log(id)
        //return;

        event.persist();
        if (AuthService.isLoggin()) {

            // console.log(user);
            if (!user) return;
            let task = []
            arayProduct.forEach((value => {
                task.push(api.addCart({ product_id: value, quantity: 1, type: 1 }))
            }))
            try {
                await Promise.all(task)
                    .then(res => {
                        var node = document.createElement('span');

                        let top = "top:" + event.pageY + 'px;'
                        let left = "left:" + event.pageX + 'px;'

                        var cart = document.getElementsByClassName('icon-cart');

                        var bodyRect = document.body.getBoundingClientRect(),
                            elemRect = cart[0].getBoundingClientRect(),
                            offset_top = elemRect.top - bodyRect.top,
                            offset_left = elemRect.left - bodyRect.left;

                        node.style.cssText = "--top:" + offset_top + "px; --left:" + offset_left + "px; transition: all .6s ease; width:30px; height:30px; background-color:#EE5294; border-radius:50%; display: block; position:absolute; z-index:100001; " + top + " " + left;
                        document.body.appendChild(node)
                        setTimeout(function () {
                            node.classList.add('animate')
                            setTimeout(function () {
                                document.body.removeChild(node)
                            }, 800);
                        }, 100);

                        const data = res.data;
                        fetchUser();
                    })
            } catch (e) {
                alert('จำนวนสินค้าไม่เพียงพอ')
            }




        } else {
            setShowLogin(true);
        }
    }



    const currencyFormatDE = (num) => {
        num = parseFloat(num);
        return (
            num
                .toFixed(2) // always two decimal digits
                .replace(',', '.') // replace decimal point character with ,
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        ) // use . as a separator
    }

    /*useEffect(() => {
        if (!book) return

        let list_default = resultBook.filter(item => isStock(item.id) || isPreOrder(item.id)).map(val => val.id);
        setChk(list_default)
    }, [book])*/

    useEffect(() => {
        if (showLogin) {
            router.push('/ecode/login_ecode')
        }
    }, [showLogin])

    useEffect(() => {
        if (isCurrentDateWithinRange(project.start_date, project.end_date)) {
            console.log("The current date is within the range.");
            setDateCheck(false);
        } else {
            console.log("The current date is not within the range.");
            setDateCheck(true);
        }

    }, [project])


    function isCurrentDateWithinRange(startDate, endDate) {
        if (startDate && endDate) {
            const currentDate = new Date();
            // Parse the provided dates
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Check if the current date is within the range
            return currentDate >= start && currentDate <= end;
        } else {
            // Check if the current date is within the range
            return true;
        }
    }

    return (
        <div style={{ marginTop: '63px' }}>

            <div style={{ backgroundColor: '#f2f2f2', paddingBottom: '100%' }}>

                <div className={project?.project_id === 'P6700020' ? 'banner-mobile' : 'header-box-shadow-mobile'}>
                    {
                        project?.project_id === 'P6700020' ?  <></> :
                        <div className="b">
                        <p className="text-pink headder-text">{project?.project_name}</p>
                        <div className="f">
                            <p className="p-headder-text">รหัสวิชา : <span className="text-pink">{project?.subject_id}</span></p>
                            <p className="p-headder-text">หลักสูตร : <span className="text-pink">{project?.course}</span></p>
                        </div>
                        <p className="p-headder-text">อาจารย์ผู้สอน : <span className="text-pink">{project?.teacher}</span></p>
                        <p className="p-headder-text">ซื้อได้ถึงวันที่ : <span className="text-pink">{project?.end_date}</span></p>
                        <div className="f">
                            <p className="p-headder-text text-disable">แจ้งปัญหาการซื้อได้ที่ : <span className="text-default">{project?.sale_name}</span></p>
                            <p className="p-headder-text text-disable">โทร : <span className="text-default">{project?.sale_phone}</span></p>
                        </div>
                    </div>
                    }
                    <div className="img-header">
                        <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/images/logo_cubook.svg`} width="373" height="240" />
                    </div>
                </div>

                <div className="container d-flex flex-wrap justify-content-between ">
                    {resultBook.map((val, index) => (
                        <div key={`card-e_${index}}`} className="card-book px-2 my-2">

                            <div className="d-flex justify-content-between mb-2 align-items-center">
                                <div className="d-flex align-items-center">
                                    <img alt="ศูนย์หนังสือจุฬาฯ" src={val ? (val.seller_id != 'cu' ? val.seller_picture : `/mobile/image/icon/icon-cu.svg`) : ''} className="icon-card-seller" />
                                    <p className="text-publisher m-0 ml-2">{val ? (val.seller_id != 'cu' ? val.shop_name : "CHULABOOK") : ''}</p>
                                </div>
                                <div className="d-flex">

                                    <input type="checkbox" onChange={onChange} value={val.id} checked={setCheckedById(val.id)} disabled={dateCheck} ></input>

                                </div>
                            </div>
                            <div onClick={() => fetchdataDetail(val.id)}  >
                                <div className={classnames("book-image-area mb-2 card-img-mobile",
                                    val?.is_preorder ? '' : (((val.stock && val.stock > val.reserve_stock) || val.type == "ebook" || val.type == 'course') ? '' : 'set-stock'))}>
                                    <div className={classnames("area-book", { "p-0": (val.picture && val.type == "non_book") })}>
                                        {
                                            (val.video_type == 0 || val.video_type == null) && (
                                                <>
                                                    {
                                                        val.is_preorder ? (
                                                            <>
                                                                <img className="shadow-book" src={val.picture ? val.picture : '/mobile/image/product/book.png'} alt={val.name} />
                                                                <img src='/mobile/image/pre_order.svg' className="img-stock" alt={val.name} />
                                                            </>
                                                        ) : (
                                                            val.type == "non_book" ? (
                                                                <img src={val.picture ? val.picture : '/mobile/image/product/book.png'} className="mh-100 mw-100" alt={val.name} />
                                                            ) : (
                                                                <>
                                                                    <img className="shadow-book" src={val.picture ? val.picture : '/mobile/image/product/book.png'} alt={val.name} />
                                                                    {
                                                                        val.type == 'ebook' && (
                                                                            <img src='/mobile/image/ebook.svg' className="img-stock" alt={val.name} />
                                                                        )
                                                                    }
                                                                    {
                                                                        val.type == 'course' && (
                                                                            <img src='/mobile/image/course.svg' className="img-stock" alt={val.name} />
                                                                        )
                                                                    }
                                                                    {
                                                                        val.type == 'course_ecode' && (
                                                                            <img src='/mobile/image/badge-course-ecode-small.svg' className="img-stock img-w-e-code" alt={val.name} />
                                                                        )
                                                                    }
                                                                </>
                                                            )
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                        {
                                            val.video_type == 1 && (
                                                <>
                                                    <video controls className="w-100 video" >
                                                        <source src={val.picture ? val.picture : '/mobile/image/product/book.png'} type="video/mp4" />
                                                        <source src={val.picture ? val.picture : '/mobile/image/product/book.png'} type="video/ogg" />
                                                    </video>
                                                    {
                                                        val.preorder && (
                                                            <img src='/mobile/image/pre_order.svg' className="img-stock" alt="ศูนย์หนังสือจุฬาฯ" />
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                        {
                                            val.video_type == 2 && (
                                                <>
                                                    <iframe className="mh-100 w-100 video" src={youtube}
                                                        frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                    >
                                                    </iframe>
                                                    {
                                                        val.preorder && (
                                                            <img src='/mobile/image/pre_order.svg' className="img-stock" alt="ศูนย์หนังสือจุฬาฯ" />
                                                        )
                                                    }
                                                </>
                                            )
                                        }

                                        {
                                            val.comming === 'Y' ? (
                                                <div className="text-stock">{t('comming')}</div>
                                            ) : val.is_preorder ? (
                                                <>
                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        ((val.stock && val.stock > val.reserve_stock) || val.type == "ebook" || val.type == 'course') ?
                                                            '' : <div className="text-stock">{t('out_stock')}</div>
                                                    }
                                                </>
                                            )

                                        }
                                    </div>
                                    {
                                        (val.promotion_active || val.promotion_product_active) ? (
                                            <div className="badge-pro"><img src={`/mobile/icon/promotion.svg`} /></div>
                                        ) : null
                                    }
                                </div>
                                <h3 className="text-name-of-book h-40px text-h3">{val.name}</h3>
                                <p className="text-author text-h6-p ">{(val.type == 'book' || val.type == 'ebook') ? (`${t("author")} : ${val.author}`) : ''}</p>
                                <p className={classnames("text-pink font-weight-bold text-h5-p", { "text-ebook": (val.type == "ebook"), "text-stationery": (val.type == "non_book"), "text-course": (val.type == "course") })}>{val.price ? '฿ ' + currencyFormatDE(val.price) : ''}</p>
                                {
                                    val.cover_price > val.price ? (
                                        <p className="text-disable font-weight-bold mr-2 text-h5-p"><s><span>฿</span> {currencyFormatDE(val.cover_price)}</s></p>
                                    ) : (
                                        <p className="text-disable font-weight-bold mr-2 text-h5-p"><span>฿</span> {currencyFormatDE(val.cover_price)}</p>
                                    )
                                }
                            </div>
                        </div>

                    ))}
                </div>
            </div>



            <div className="cart-nav-to-payment wbank" style={{ width: '390' }}>
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
                                    disabled={dateCheck}
                                />
                                <label className="custom-control-label" htmlFor="chk2">
                                    <p className="mb-0">{t("mobile_translations:all")}</p>
                                </label>
                            </div>
                        </div>
                        <div className="my-auto text-right">
                            <p className="m-0 font-weight-bold">
                                ยอดรวม
                            </p>
                            <h4 className="text-pink m-0 font-weight-bold">
                                ฿ {sum}
                            </h4>
                        </div>
                    </div>

                </div>
                {
                    sum > 0 && !dateCheck ?
                        <button className="btn-cart-to-payment-has-address" onClick={(event) => { addcart(event, chk) }}>
                            <h5 className="text-white m-auto">
                                {t('add_to_cart')}
                            </h5>
                        </button> :
                        <button className="btn-cart-to-payment" onClick={(event) => { addcart(event, chk) }} disabled>
                            <h5 className="text-white m-auto">
                                {t('add_to_cart')}
                            </h5>
                        </button>

                }

            </div>

            <ModalEcodeMobile
                show={show}
                datadetail={product}
                t={t}
                handleClose={() => setShow(false)}
            />
            < ModalStock show={showModelStock}
                t={t}
                handleClose={() => setShowModelStock(false)} />
        </div >
    )
}

export default withTranslation(['product_detail'])(EcodeMainMobile)