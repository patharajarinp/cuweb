import React, { useState,useEffect,useContext,useRef } from 'react'
import Router from 'next/router'
import {Button, Modal} from 'react-bootstrap';
import api from '../../../utils/api';

const EditCate = ({show, onHide, onConfirm ,ch_cate}) => {
const [cate, setcate] = useState()
const [cateSelect, setcateSelect] = useState([])
  const handleConfirm = e =>{
    if(onHide){
      onHide();
    }
    if(onConfirm){
      onConfirm(cateSelect);
    }
  }
//   
  const getCate = () => {
    api
      .getBlogCategory()
      .then((res) => {
        setcate(res.data);
        
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    getCate();
  }, []);
   useEffect(() => {
    if(!ch_cate) return

    setcateSelect(ch_cate)
    console.log('ch_cate', ch_cate)
    
  }, [ch_cate]);
  const handelCate = (val)=>{

    let tmp = [...cateSelect]
    let check = tmp.findIndex((vall)=> vall.id == val.id)
    // console.log(check)
    if(check == -1) {
      tmp.push({
        id: val.id,
        name: val.name_th,
      })
      // console.log(tmp)
      setcateSelect(tmp);
    }else{
      tmp.splice(check, 1);
      setcateSelect(tmp);
    }
    
  }
  const checkCate = (val)=>{
     
    let tmp = [...cateSelect]
  
    let inc =   tmp.findIndex(vall=> vall.id == Number(val.id))
   
    if (inc == -1) {
      return false
    } else {
      return true
    }

  }
  return (
    <Modal  centered show={show} onHide={onHide} size="xl">
      <Modal.Body>
          <div>
                <h4 className="mr-3 text">เลือกหมวดหมู่</h4>
                </div>
        <div className="row mt-4">
            <div className="col-12 d-flex">
                
                {cate && (
                    <div>
                        {cate.map((cat, index) => (
                            <button
                                key={Math.random()}
                                className={`blog-create-btn ${
                                checkCate(cat) ? " active":""
                                }`}
                                type="button"
                                onClick={() => {
                                handelCate(cat)
                                }}
                            >
                                {cat.name_th} 
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="text-right">
       
        <button type="button" className="blog-detail-story-detail-card-btn-b" onClick={()=>onHide(false)}>ยกเลิก</button>
                 
         <button type="button" className="blog-detail-story-detail-card-btn-n" onClick={handleConfirm}>บันทึก</button>
        </div>
      </Modal.Body>
    </Modal>  
  )
}

export default EditCate