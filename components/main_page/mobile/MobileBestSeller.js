import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Banner from '../../../components/mobile/carousel';
import CardGrid from '../../../components/mobile/widget/Card';
import api from '../../../utils/api';
import { Link, withTranslation } from '../../../utils/i18n';
import Head from 'next/head'

const MobileBestSeller = (props) => {
  const {t, query, loading, setLoading} = props;

  const [productType, setProductType] = useState();
  const [img, setImg] = useState();
  const { text, field } = query;
  const [book, setBook] = useState();
  const [recommend, setRecommend] = useState();
  const router = useRouter();
  const key = 'best-seller';

  const fetchPage = () => {
    var page = key;
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

  const fetchBook = () => {
    api.getRecProductByKey(key).then(res => {
      const data = res.data;
      setBook(data.rows);
     
    })
      .catch(err => {
        console.log(err.response);
      })
  };


  useEffect(() => {
    //fetchRecommend();
    fetchPage();
    fetchBook();
    document.body.style.backgroundColor = "#FFFFFF";
  }, []);

  return (
    <>
      <Head>
        <title>{`${t("mobile_translations:bestseller")} | ศูนย์หนังสือจุฬาฯ`}</title>
      </Head>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("mobile_translations:bestseller")}</h4>
        </div>
        <Link href='/'>
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
       </Link>
      </div>

      
      <div className="bg-light-less-gray min-vh-100 ">
      <div className="h-64px"></div>
      {img && <Banner items={img} />}
          
        <div className="all-card-news mt-3">
          <div className="container d-flex flex-wrap justify-content-between ">
          {
              book && book.map((product, index) => (
                <CardGrid product={product} show={4} _class={"my-2"} key={index} />
              ))
            }
          </div>
        </div>

        <div className="footer-space"></div>
      </div>
    </>
  )
}
export default MobileBestSeller