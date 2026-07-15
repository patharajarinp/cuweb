import classnames from "classnames";
import React from "react";
import Slider from "react-slick";
import ReactPlayer from 'react-player'
let slickitem = 0;

class ProductSlick extends React.Component {

    state = {
        activeSlide: 0,

    };
    constructor(props) {
        super(props)
        this.state = { youtube: '' }
        /*  this.something =ProductSlick.$(slickitem)++; */
    }

    componentDidMount() {
        if (this.props.product) {
            var namepath = this.props.product.picture;
            if (namepath) {
                var [path, link] = namepath.split("watch?v=");
                if (link) {
                    this.setState({
                        youtube: 'https://www.youtube.com/embed/' + link
                    })
                }
            }
        }
    }





    render() {

        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            beforeChange: (current, next) => this.setState({ activeSlide: next }),
        };

        return (
            <>
                {
                    this.props.product && (
                        <div className={classnames("product-show",
                            this.props.product.preorder ? (this.props.checkDate(this.props.product) != 4 ? 'set-stock' : '') : (((this.props.product.stock && this.props.product.stock > this.props.product.reserve_stock) || this.props.product.type == "ebook" || this.props.product.type == "course") ? '' : 'set-stock'))}>
                            <div className="product-show-index">
                                <strong>{this.state.activeSlide + 1 || '1'} </strong> / {this.props.bookimg && this.props.bookimg.length + 1}  {this.slickitem}{/* not count all product show */}
                            </div>
                            <Slider {...settings} >
                                <div className="product-book-list " id={this.something}>



                                    {
                                        this.props.product.preorder ? (
                                            <>
                                                <img className="img-fluid m-auto slick-book shadow-book " alt="ศูนย์หนังสือจุฬาฯ" src={this.props.product.picture ? this.props.product.picture : '/mobile/image/product/book.png'} />
                                                <img src='/mobile/image/pre_order2.svg' className="img-stock" alt="ศูนย์หนังสือจุฬาฯ" />
                                            </>
                                        ) : (
                                            <>
                                                <img className="img-fluid m-auto slick-book shadow-book " alt="ศูนย์หนังสือจุฬาฯ" src={this.props.product.picture ? this.props.product.picture : '/mobile/image/product/book.png'} />
                                                {
                                                    this.props.product.type == 'ebook' && (
                                                        <img src='/mobile/image/ebook2.svg' className="img-stock m-size" alt="ศูนย์หนังสือจุฬาฯ" />
                                                    )
                                                }
                                                {
                                                    this.props.product.type == 'course' && (
                                                        <img src='/mobile/image/course2.svg' className="img-stock m-size" alt="ศูนย์หนังสือจุฬาฯ" />
                                                    )
                                                }
                                                {
                                                    this.props.product.type == 'course_ecode' && (
                                                        <img src='/mobile/image/badge-course-ecode-small.svg' className="img-stock m-size" alt="ศูนย์หนังสือจุฬาฯ" />
                                                    )
                                                }
                                            </>
                                        )
                                    }





                                    {
                                        this.props.product.comming === 'Y' ? (
                                            <div className="text-stock">{this.props.t('mobile_product_detail:comming')}</div>
                                        ) : this.props.product.preorder ? (
                                            <>
                                                {
                                                    (this.props.checkDate(this.props.product) != 4) ? this.props.showText(this.props.checkDate(this.props.product)) : ''
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {
                                                    ((this.props.product.stock && this.props.product.stock > this.props.product.reserve_stock) || this.props.product.type == "ebook" || this.props.product.type == 'course') ?
                                                        '' : <div className="text-stock">{this.props.t('mobile_product_detail:out_stock')}</div>
                                                }
                                            </>
                                        )

                                    }


                                </div>
                                {
                                    this.props.bookimg && this.props.bookimg.map((val, index) => (
                                        <div className={`product-book-list ${val.type != 'image' ? 'video-bg' : ''}`} id={this.something} key={index}>
                                            {
                                                val.type == 'image' ? (
                                                    <img src={val.image ? val.image : '/mobile/image/product/book-2.png'} className="img-fluid m-auto slick-book shadow-book" />
                                                ) : (
                                                    <ReactPlayer url={val.urlyoutube} />
                                                )
                                            }
                                            {
                                                this.props.product.preorder ? (
                                                    <img src='/mobile/image/pre_order2.svg' className="img-stock" />
                                                ) : (
                                                    this.props.product.type == 'ebook' && (
                                                        <img src='/mobile/image/ebook2.svg' className="img-stock" />
                                                    )
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </Slider>
                        </div>
                    )
                }
            </>
        );
    }
}
export default ProductSlick;