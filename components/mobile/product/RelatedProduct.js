import {useState,useEffect,memo} from 'react'
import CardGrid from '../widget/Card';
import withLoadOnVisible from '../../../utils/withLoadOnVisible'
import api from '../../../utils/api'
import BeatLoader from "react-spinners/BeatLoader";
// import {CardPH}  from '../components/widget/card';
const RelatedProduct = memo((props) =>{
  const {t,visible,author,sub_id,product_id,data} = props
  // const [state,setState] = useState({
  //   data : null,
  //   loading : false,
  //   done : false,
  //   error : false
  // })
  // const {data,done,error,loading} = state
  // useEffect(() => {
  //   // console.log('visible',visible)
  //   if(visible && !done){
  //     fetch();
  //   }
  // },[visible])
  

  // const fetch = () =>{
  //   setState({...state,loading:true})
  //   api.getRelatedProduct({limit : 12,author,sub_id,product_id})
  //   .then(res => {
  //     setState({...state,done:true,loading:false,data : res.data})
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     setState({...state,done:true,loading:false,error : true})
  //   })
  // }

  // if(error) return null;

  return (
    <>
      <div className="container">
        <hr className=" product-content-line my-2"></hr>
      </div>
      <div className="all-card-book-none-text-left  bg-white">
        <div className="container py-3">
          <div className="d-flex">
            <h2 className="text-h2 font-size-16px">{t("mobile_translations:other_related")}</h2>
          </div>
          <div className="d-flex justify-content-start all-card-book">
            {
              data ? data.map((product, index) => <CardGrid product={product} key={index} />)  
              : <div className="text-center mt-3"><BeatLoader color={"#EE5294"} loading={loading} /></div>
            }
            <CardGrid freespace={true} />
          </div>
        </div>
      </div>
    </>
  )
})


export default withLoadOnVisible(RelatedProduct)