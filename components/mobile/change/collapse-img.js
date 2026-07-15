import React,{useState,useEffect} from 'react'
import { Collapse } from 'reactstrap';
export default function Collapseimg({val}) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [images, setimages] = useState()
    useEffect(() => {
        if(!val) return false
       let tmp = val.images.split(",")
       if (tmp.length) {
           setimages(tmp)
       }
    }, [val])
    return (
        <>
            <div className="order-manage-address" onClick={toggle}>
                <p className="text-black my-auto">ภาพที่แนบมา</p>
                <i className={isOpen ? "text-orange my-auto fas fa-chevron-up" : "text-orange my-auto fas fa-chevron-down"}></i>
            </div>
            <Collapse isOpen={isOpen} >
                <div className="py-3">
                    <div className="info-address-detail w-100 d-flex overflow-auto">
                        {images&&images.map((val,index)=>(
                         <div key={Math.random()} className="w-100 pl-1 pr-1">
                            <div className="product-in-cart-pic ">
                                <img className="img-fluid" src={val} />
                            </div>
                        </div>   
                        ))}
                        
                        
                        

                    </div>
                    
                </div>
            </Collapse>
        </>
    )
}
