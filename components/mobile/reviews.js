import React, { useState } from 'react';
import Rating from 'react-rating';
import { withTranslation } from '../../utils/i18n';

const Allreview = ({ user, show2, toggle2,review,avg ,formatDate,product,t}) => {
    const [work, setwork] = useState(false);

    const togglework = () => setwork(true);
    const togglehome = () => setwork(false)
    return show2 ? (
        <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: "400", backgroundColor: "#fff" }}>
            <div className="cart-nav">
                <div className=" text-center cart-nav-title">
                    <h4 className="text-black mb-0 w-194px">{product.name ? product.name : product.name}</h4>
                </div>
                <a className="btn-back cart-nav-back" onClick={toggle2}>
                    <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
                </a>
            </div>
            <div className="bg-light-less-gray ">
                <div className="padding-bottom-for-box-cart"></div>
                <div className="product-background-area pt-0">
                    <div className="container bg-white  py-3" id="review_product">
                        <a className="d-flex justify-content-between">
                            <div className="mb-3">
                                <h4>{t("mobile_translations:review_score")} ({review ? review.count : '0'})</h4>
                                <div className="d-flex">
                                    <h2 className="my-auto mt-auto text-black mr-1">{avg ? avg : '0'}</h2>
                                    <p className=" my-auto mr-1">/ 5</p>
                                    <div className="star-rank-review my-auto ml-1">
                                        <Rating
                                            emptySymbol="far fa-star font-star"
                                            fullSymbol="fas fa-star font-star"
                                            fractions={10}
                                            initialRating={avg ? avg : '0'}
                                            readonly="true"
                                        />
                                    </div>
                                </div>
                            </div>
                           
                        </a>
                        {
                            review ? review.rows.map((val, index) => (
                                <>
                                    <hr className="mt-0 product-content-line" key={val.id}></hr>
                                    <div className="review-list">
                                        <div className="review-list-info">
                                            <div className="review-list-user">
                                                <img src={val.user.picture ? val.user.picture : "/mobile/image/icon/icon-user.svg"} className="img-circle img-fluid  mr-2" />
                                                <div className="my-auto">
                                                    <p className="text-truncate mb-0">{val.user.firstname}</p>
                                                    <div className="star-rank">
                                                        <Rating
                                                            emptySymbol="far fa-star font-star"
                                                            fullSymbol="fas fa-star font-star"
                                                            fractions={1}
                                                            initialRating={val.rating}
                                                            readonly="true"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="review-date">
                                                <p>{formatDate(val.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="review-content my-3">
                                            <p className="m-0">{val.review_text}</p>
                                            {
                                                val.image && (
                                                    <div className="position-relative">
                                                        <div className="review-img-upload">
                                                            <img src={val.image} className="img-middle" />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            )) : ''
                        }
                    </div>
                </div>
            </div>
           
        </div>

    ) : <></>
}

export default withTranslation('mobile_product_detail') (Allreview);