import React, { useState } from "react";
import { Fade } from "reactstrap";
import Card from "../../../../components/mobile/blog/card";
import Comment from "../../../../components/mobile/blog/detail/comment";
import StoryDetaildata from "../../../../components/mobile/blog/detail/storyDetaildata";
import { Link } from "../../../../utils/i18n";

const MobileMainDataDetail = (props) => {
  const { t, blog, preview, inrteres, onLike, bData, blog_id, data_id, dLike, user, dViewe, dComment, fetchComment, limit, all } = props;
  const [dropdownInfo, setdropdownInfo] = useState(false);

  const toggledropdownInfo = () => setdropdownInfo(!dropdownInfo);

  const showCount = () => {
    if (!user || user.cart.length == 0)
      return ''
    return user.cart.length > 9 ? <span>9<span>+</span></span> : <span>{user.cart.length}</span>
  }

  return (
  <>
    <div className="product-book-nav">
      <Link
        href={`/blog/[blogid]?blogid=${blog_id}`}
        as={`/blog/${blog_id}`}
      >
        <a className="btn-back row" style={{flex:' 0 0 auto'}}>
          <img
            className="img-fluid ml-2"
            src={"/mobile/image/icon/icon-back.svg"}
          />
        </a>
      </Link>
      <div className="d-flex justify-content-between ">
        <a className="btn-share mr-3" onClick={()=>handleShare()}>
          <img className="" src={"/mobile/image/icon/icon-share.svg"} />
        </a>
        {user ? (
          <Link href="/user/cart">
            <a className="btn-cart mr-3 img-cart">
              <img className="" src={"/mobile/image/icon/icon-cart.svg"} />{showCount()}
            </a>
          </Link>
        ) : (
          <Link href="/login">
            <a className="btn-cart mr-3" >
              <img className="" src={"/mobile/image/icon/icon-cart.svg"} />
            </a>
          </Link>
        )}
        <a className="btn-info-info" onClick={toggledropdownInfo}>
          <img className="" src={"/mobile/image/icon/icon-info.svg"} />
        </a>
      </div>
      <Fade in={dropdownInfo} className="dropdown-info">
        <Link href='/'>
          <a className="text-default">
            <p className="text-black mb-1">หน้าหลัก</p>
          </a>
        </Link>
        {user && (
          <Link href="/user/favorite">
            <a className="text-default">
              <p className="text-black mb-1">รายการที่ชอบ</p>
            </a>
          </Link>
        )}

        <Link href="/categories">
          <a className="text-default">
            <p className="text-black mb-1">ค้นหา</p>
          </a>
        </Link>
        {user && (
          <Link href="/user/dashboard">
            <a className="text-default">
              <p className="text-black mb-1">บัญชีของฉัน</p>
            </a>
          </Link>
        )}
      </Fade>
    </div>
    <div className="h-64px"></div>
    <div className="bg-light-less-gray">
      <div className="w-100">
        {!!blog && (
          <>
            <StoryDetaildata
            t={t}
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
            />
            <Comment
            t={t}
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
              fetchComment={fetchComment}
              all={all}
              limit={limit}
            />
          </>
        )}
        {inrteres?.length >1 && (
          <div className="all-card-book-none-text-left bg-white my-3">
            <div className="container py-3">
              <div className="d-flex justify-content-between ">
                <div>
                  <h4 className="text-black">{t('data_related')}</h4>
                </div>
              </div>
              <div className="d-flex justify-content-start all-card-book">
                {inrteres.map(
                  (val) =>
                    Number(val.id) != blog_id && (
                      <div
                        key={Math.random()}
                        className="blog-card-show mr-2"
                      >
                        <Card
                          data={val}
                          penname={val.blog_writer.penname1}
                        />
                      </div>
                    )
                )}
                <div className="card-book nonecard mr-2"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="footer-space"></div>
    </div>
      
  </>
  )
};

export default MobileMainDataDetail;
