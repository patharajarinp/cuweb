import React,{useState,useEffect} from "react";
import Layout from "../../components/layout";
import { Link, withTranslation } from "../../utils/i18n";
import Card from "../../components/blog/card";
import Paginate from "react-paginate";
import { useRouter } from "next/router";
import CardPH from "../../components/shimmer/Card";
import api from "../../utils/api";


function popular({t}) {
  const router = useRouter();
  const title = router.query.n;
  const [blog, setblog] = useState([]);
  // const [all, setall] = useState(0);
  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);
  const [amount, setamount] = useState(0)
  const LIMIT = 20;
  const fetchLike = async (params) => {
    params.page=params.page||1
    api
      .getBlogGroupLikedPage({...params})
      .then(async (res) => {
        let data = res.data
        setblog(data.data);
        setPageCount(Math.ceil(data.countBlog / LIMIT))
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchHot = async (params) => {
    params.page=params.page||1
    api
      .getBlogGroupNewHotPage({...params})
      .then(async (res) => {
        let data = res.data
        setblog(data.data);
        setPageCount(Math.ceil(data.countBlog / LIMIT))
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchNew = async (params) => {
    params.page=params.page||1
    api
      .getBlogGroupNewPage({...params})
      .then(async (res) => {
        let data = res.data
        setblog(data.data);
        setPageCount(Math.ceil(data.countBlog / LIMIT))
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const handlePageClick = async data=>{
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    // fetchLike({page:selected+1});
    if (title == "blog_popula") await fetchLike({page:selected+1});
    if (title == "blog_new_hot") await fetchHot({page:selected+1})
    if (title == "blog_new") await fetchNew({page:selected+1})
  }
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F8F9FA";
    }
   
    if (title == "blog_popula") fetchLike({})
    if (title == "blog_new_hot") fetchHot({})
    if (title == "blog_new") fetchNew({})
  }, []);
  return (
    <div>
      <Layout title={title}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href='/' as={'/'}>
                      <a>{t('home')}</a>
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/blog" as={`/blog`}>
                      <a>{t('blog')}</a>
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">
                    <a>{t(`${title}`)}</a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h2>{t(`${title}`)}</h2>
              </div>
            </div>
          </div>

          <div className="row mt-5 pb-4">
            {/* <CardPH show={20} grid={4} /> */}
            {blog.length != 0 ? (
              blog.map((val) => (
                <div key={Math.random()} className=" col-lg-3 col-4">
                  <Card data={val} penname={val.blog_writer.penname1} />
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="row d-none d-lg-flex">
                   <CardPH show={20} grid={4} />
                </div>
                <div className="row d-none d-lg-none d-md-flex">
                   <CardPH show={20} grid={3} />
                </div>
              </div>
             
            )}
          </div>
          
          {pageCount > 1&&
          <div className="blog-pop d-flex justify-content-end">
            <Paginate
              previousLabel={t('back')}
              nextLabel={t('next')}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              forcePage={pageNumber}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </div>
          }
          
        </div>
      </Layout>
    </div>
  );
}
export default withTranslation("blog_index")(popular);
