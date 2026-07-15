import React,{useState,useEffect} from "react";
import TableContents from "../blog/detail/tableContents";
import {Link} from "../../utils/i18n";
import ModalDrag from '../../components/backend_blog/widget/ModalDrag'
export default function ManageEP({ blog_id,setdataindex,blog_name,data1,onAction ,type,onDelete,updatePdf}) {
  const [modalShow, setModalShow] = useState(false);
  const [data11, setdata11] = useState([])
  const handleCateChange= (value)=>{
    setdataindex( value)
setdata11(value)
onAction(true)
  }
  useEffect(() => {
    setdata11(data1)
  }, [data1])
  return (
    <div className="blog-manage-ep">
      <div className="row">
        <div className="col-4">
          <h3>จัดการตอน</h3>
        </div>
        <div className="col-8 text-right">
         
          {type == 1?<>
          {
            data1.length >1&&
            <button
            type="button"
            className="blog-detail-story-detail-card-btn-b btn  mr-3"
            onClick={()=>setModalShow(true)}
          >
            จัดเรียงตอน
          </button>
          }
            
          <Link href={`/blog/manage/[blog_id]/EP/new?blog_id=${blog_id}`} as={`/blog/manage/${blog_id}/EP/new`}>
            <a>
              <button
                type="button"
                className="blog-detail-story-detail-card-btn-b btn mr-0 "
                onClick={()=>{
                  localStorage.setItem('EPcreate',JSON.stringify({ blog_id,blog_name }))
                }}
              >
                {data1.length == 0 &&'เขียนตอนแรก'}
                {data1.length > 0 &&'เขียนตอนต่อไป'}
              </button>
            </a>
          </Link>
         </> :''}
          {type == 0&& data1.length == 0?<>
           {/* <button
           type="button"
           className="blog-detail-story-detail-card-btn-b btn  mr-3" onClick={()=>setModalShow(true)}
         >
           จัดเรียงตอน
         </button> */}
          <Link href={`/blog/manage/[blog_id]/EP/new?blog_id=${blog_id}`} as={`/blog/manage/${blog_id}/EP/new`}>
            <a>
              <button
                type="button"
                className="blog-detail-story-detail-card-btn-b btn mr-0"
                onClick={()=>{
                  localStorage.setItem('EPcreate',JSON.stringify({ blog_id,blog_name }))
                }}
              >
                เขียนตอนแรก
              </button>
            </a>
          </Link>
        </>  :''}
          
        </div>
      </div>
      {data1 ?
         <div className="row mt-4">
        <div className="col-12">
          <TableContents data1={data1} head={false} blogid={blog_id} onDelete={onDelete} updatePdf={updatePdf} />
        </div>
        <ModalDrag
            show={modalShow}
            size="md"
            cate={data1}
            handleCateChange={handleCateChange}
            onHide={() => setModalShow(false)}
          />
      </div>
      : ""}
       
    </div>
  );
}
