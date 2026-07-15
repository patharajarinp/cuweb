import React from "react";
import Slick from "react-slick";
import Card from "../../../components/blog/card";
import Comment from "../../../components/blog/detail/comment";
import StoryDetail from "../../../components/blog/detail/storyDetail";
import { Link } from "../../../utils/i18n";


const MainDataDetail = (props) => {
  const { t, blog, preview, inrteres, onLike, bData, blog_id, data_id, dLike, user, dViewe, dComment, fetchComment, limit, all } = props;
  
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
    ],
  };

  return (
    <>
       {!!blog ? (
          <>
            <div className="container">
              {!preview ? (
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
                        
                        <li className="breadcrumb-item">
                          <Link
                            href={`/blog/[blogid]?blogid=${blog.blog_group.id}`}
                            as={`/blog/${blog ? blog.blog_group.id : ""}`}
                          >
                            <a>{blog ? blog.blog_group.title : ""}</a>
                          </Link>
                        </li>
                        <li className="breadcrumb-item active">
                          <a>
                            {blog
                              ? t('ep')+" " + blog.index + " : " + blog.title
                              : ""}
                          </a>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="w-100">
              {!!blog && (
                <StoryDetail
                  data={blog}
                  bData={bData}
                  blog_id={blog_id}
                  isPreview={preview}
                  data_id={data_id}
                  like={dLike}
                  onAction={onLike}
                  user={user}
                  viewe={dViewe}
                  path={`/blog/${blog_id}/${data_id}`}
                  t={t}
                />
              )}
            </div>

            {!preview ? (
              <>
                <div className="container">
                  <div className="row pr-xl-5 pl-xl-5 pb-3">
                    <div className="col-12 pr-xl-5 pl-xl-5">
                      <Comment
                        user={user}
                        data1={dComment}
                        group_id={blog_id}
                        data_id={data_id}
                        member_id={user ? user.id : null}
                        blog={blog}
                        onAction={() => {
                          fetchComment(limit);
                        }}
                        onMore={() => {
                          fetchComment(limit + 2);
                          limit += 2;
                        }}
                        all={all}
                        limit={limit}
                        fetchComment={fetchComment}
                        t={t}
                      />
                    </div>
                  </div>
                </div>
               
                {inrteres&&inrteres.length != 0 && (
                   <div className="mt-5">
                     <div className="blog-blogid-blog pt-4">
                    <div className="container">
                      <div className="row">
                        <div className="col-12 text-center">
                          <h3 className="mb-5 mt-4">{t('data_related')}</h3>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 blog-w-sw">
                      <Slick {...settings}>
                        {inrteres.map((val) =>  (
                          <div key={Math.random()} className="pl-2 pr-2">
                            <Card data={val} penname={val.blog_writer.penname1}  />
                          </div>
                        ))}
                        </Slick>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                )}
              </>
            ) : null}
          </>
        ) : null
      }
    </>
  )
}
export default MainDataDetail;