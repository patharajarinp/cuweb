
import { useEffect, useMemo, useState, useContext } from "react";
import api from "../../utils/api";
import AuthService from '../../utils/AuthService';
import { Link, withTranslation } from "../../utils/i18n";
import UserContext from '../../contexts/UserContext';
import ModalEcode from './ModalEcode';
import ModalStock from './ModalStock';
import { useRouter } from 'next/router';

const EcodeMainDesktop = ({ product, book, project, t, show, fetchdataDetail, setShow, user }) => {

    const [chk, setChk] = useState([]);
    const [showLogin, setShowLogin] = useState(false);

    const [dateCheck, setDateCheck] = useState(true);
    const [showModelStock, setShowModelStock] = useState(false);
    const router = useRouter()
    const handleCloseLogin = () => {
        setShowLogin(false);
    };
    var linkPath = project?.url_project;
    const resultBook = book?.rows.length > 0 ? book?.rows.filter(val => val.enable == 1) : []

    const { fetchUser } = useContext(UserContext);
    const handleCheckall = (e) => {

        var checked = e.target.checked;
        var tmp = [...chk];
        if (checked) {
            tmp = resultBook?.filter(item => isStock(item.id) || isPreOrder(item.id)).map(val => val.id);
        } else {
            tmp = [];
        }
        setChk(tmp);

    }
    const isStock = (id) => {
        let all_book = book?.rows.length > 0 && book?.rows ? book?.rows.filter(val => val.enable == 1) : []
        let find = all_book?.find(val => val.id == id && val.stock != 0);
        if (find) {
            return true;
        } else {
            return false;
        }

    }
    const isPreOrder = (id) => {
        let all_book = book?.rows.length > 0 && book?.rows ? book?.rows.filter(val => val.enable == 1) : []
        let find = all_book?.find(val => val.id == id && val.is_preorder == 1);
        if (find) {
            return true;
        } else {
            return false;
        }

    }

    const isCheckAll = () => {
        return chk.length == resultBook?.length;
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
    const setCheckedById = (id) => {
        if (chk.includes(id) && isStock(id)) {
            return true;
        } else if (chk.includes(id) && isPreOrder(id)) {
            return true;
        } else {
            return false;
        }

    }

    const setD = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hours = '' + d.getHours(),
            minutes = '' + d.getMinutes()
        if (day.length < 2)
            day = '0' + day;
        if (month.length < 2)
            month = '0' + month;
        if (hours.length < 2)
            hours = '0' + hours;
        if (minutes.length < 2)
            minutes = '0' + minutes;
        var dataDate = [day, month, year].join('-');
        var dataTime = [hours, minutes].join(':');
        return dataDate + ' ' + dataTime;
    }

    const sum = useMemo(() => {
        let total = 0;
        for (let id of chk) {
            let item = resultBook?.find(val => val.id == id)
            if (item) {
                total += item.price
            }
        }
        return total;
    }, [chk, book])


    const addcart = async (event, id) => {

        let arayProduct = id;
        console.log(arayProduct, 'arayProduct');
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

    /*useEffect(() => {
        if (!book) return
        let default_check = resultBook?.filter(item => isStock(item.id) || isPreOrder(item.id)).map(val => val.id);
        setChk(default_check);
    }, [book])*/

    useEffect(() => {
        if (showLogin) {
            //href={{pathname:'/ecode/login_ecode',query:{name : link}}}
            router.push({ pathname: '/ecode/login_ecode', query: { name: linkPath } })
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

    function getHeaderClassBanner(projectId) {
        switch (projectId) {
          case 'P6700020':
            return 'header-box-shadow-tud';
          case 'P6700019':
            return 'header-box-shadow-tud-onsite';
          default:
            return 'header-box-shadow';
        }
      }


    return (
        <div >


            <div style={{ backgroundColor: '#f2f2f2' }}>
                <div className="container bg-container-ecode">

                    <div className={getHeaderClassBanner(project?.project_id)}>
                        {
                            project?.project_id === 'P6700020' || project?.project_id === 'P6700019' ?  <></> :
                            <div className="b">
                            <h2 className="text-pink">{project?.project_name}</h2>
                            <h3>รหัสวิชา : <span className="text-pink">{project?.subject_id}</span></h3>
                            <h3>หลักสูตร : <span className="text-pink">{project?.course}</span></h3>
                            <div className="t">
                                <h3>อาจารย์ผู้สอน : <span className="text-pink">{project?.teacher}</span></h3>
                                <div>
                                    <h3>ซื้อได้ถึงวันที่ : <span className="text-pink">{project?.end_date ? setD(project?.end_date) : '-'}</span></h3>
                                    <div className="f">
                                        <p>แจ้งปัญหาการซื้อได้ที่ : <span className="text-pink pr-1">{project?.sale_name}</span></p> |
                                        <p className="pl-1"> โทร : <span className="text-pink">{project?.sale_phone}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }

                        <div className="img-header">
                            {
                                project?.project_id === 'P6700020' ? <></> : <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/images/logo_cubook.svg`} width="373" height="240" />
                            }
                        </div>
                    </div>
                    {book?.count > 0 && project.status == 1 ?
                        <table className="table-box-shadow  table-ecode">
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" checked={isCheckAll()} id="chk2" name="chk2" value="all" onChange={handleCheckall} disabled={dateCheck} />

                                    </th>
                                    <th>
                                        หนังสือจำนวน {!dateCheck ? resultBook?.length : 0} ชิ้น
                                    </th>

                                    <th className="text-right">ยอดเงินรวม ฿{!dateCheck ? sum : 0}</th>
                                    <th>{
                                        (sum == 0 || dateCheck == true) ? <button className="btn  mr-3 btn-secondary" disabled="true">{t('add_to_cart')}</button> :
                                            <button className="btn  mr-3 btn-primary" onClick={(event) => { addcart(event, chk) }}>{t('add_to_cart')}</button>
                                    }
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="tbody-ecode">
                                {
                                    resultBook ? resultBook.map((val, index) => (
                                        <tr className="h-200" key={val.id}>
                                            <td ><input type="checkbox" onChange={onChange} value={val.id} checked={setCheckedById(val.id)} disabled={dateCheck} ></input></td>
                                            <td>
                                                <div className="col-12 px-0 border-right">
                                                    <div className="show-book">
                                                        {(val.is_preorder) ? (
                                                            <>
                                                                <img alt={val.name ? val.name : val.name} src={val.picture ? val.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100  no-img mw-100per " />
                                                                <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/pre_order.svg`} className="img-stock-ecode" />
                                                            </>
                                                        ) : (
                                                            <img src={val.picture ? val.picture : '/images/book.png'} className="product-img" />
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td valign="top">
                                                <div className="col-12">
                                                    <p className="main-shop">
                                                        <img alt="ศูนย์หนังสือจุฬาฯ" src={val ? (val.seller_id != 'cu' ? (val.seller_preview ? (val.seller_picture_preview ? val.seller_picture_preview : `${api.frontend_url}/images/no-picture.png`) : val.seller_picture) : `${api.frontend_url}/icon/cu-cook.svg`) : ''} align="middle" className="icon-card mr-2" />
                                                        <span>{val ? (val.seller_id != 'cu' ? val.shop_name : "CHULABOOK") : ''}</span>
                                                    </p>
                                                    <h4 className="text-name">{val.name}</h4>
                                                    <span>ชื่อผู้แต่ง : {val.author}</span>
                                                    <div className="btn-product-group text-left mt-4">
                                                        <button className="btn text-black  btn-outline-primary" data-toggle="modal" onClick={() => fetchdataDetail(val.id)} href="#modal-ecode" disabled={dateCheck}>รายละเอียด</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td valign="top">
                                                <div className=" f line">
                                                    <div className="show-price">
                                                        <div className="f t" >
                                                            <div className="mr-1">ราคาปกติ </div>
                                                            <div><del> {val.cover_price} </del></div>
                                                        </div>
                                                        <div className="f t" >
                                                            <div className="mr-2">ราคาขาย</div>
                                                            <div><p className="text-pink">฿{val.price}</p></div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </td>

                                        </tr>
                                    )
                                    ) : (<tr><td colSpan="7">ไม่พบข้อมูล</td></tr>)
                                }
                            </tbody>


                        </table>
                        :
                        <div>
                            <div style={{ height: '46px' }}>

                            </div>
                            <div className="error-page-const-ecode">
                                <div className='error-page-box-ecode'>
                                    <div className="d-flex">
                                        <img className="img-fluid m-auto w-194px" src="/mobile/image/banner/empty-state.png" />
                                    </div>
                                    <div className="text-center mt-4">
                                        <h3 className="mb-4">ดูเหมือนว่าจะยังไม่มีหนังสือในโครงการนี้โปรดลองดูใหม่ภายหลัง</h3>
                                        <div>
                                            <p>แจ้งปัญหาการซื้อได้ที่ : <span >{project?.sale_name}</span>โทร : <span >{project?.sale_phone}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    }



                </div>

            </div>


            {/* {
                !isMobile ? (
                <MainNews t={t} news={news} activities={activities} procurement={procurement} />
                ) : (
                <MobileMainNews t={t} news={news} activities={activities} procurement={procurement} />
                )
            } */}



            <ModalEcode
                show={show}
                datadetail={product}
                t={t}
                handleClose={() => setShow(false)}
            />
            < ModalStock show={showModelStock}
                t={t}
                handleClose={() => setShowModelStock(false)} />
        </div>
    )
}

export default withTranslation(['product_detail'])(EcodeMainDesktop)