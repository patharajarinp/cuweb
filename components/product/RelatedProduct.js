import {useState,useEffect} from 'react'
import { CardGrid} from '../widget/card';
import CardPH from '../shimmer/Card'
import Slick from "react-slick";
import withLoadOnVisible from '../../utils/withLoadOnVisible'
import api from '../../utils/api'
// import {CardPH}  from '../components/widget/card';
const RelatedProduct = (props) =>{
  const {t,settingscard,settingscardmin,visible,author,sub_id,product_id,data} = props
  // const [state,setState] = useState({
  //   data : null,
  //   loading : false,
  //   done : false,
  //   error : false
  // })
  // const {data,done,error} = state
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
    <div className="container pb-5">
      <div className="row">
        <div className="col-12 mt-5">
          <div className="text-center">
            <h2>{t('related_products')}</h2>
          </div>
        </div>
      </div>
      <div className="d-none d-xl-block">
        <div className="row mt-5">
          {
            data ? <div className="col-12 "><Slick {...settingscard} className="slickcard">
              {
                 data.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={4} />)
              }
            </Slick> </div> : <CardPH show={4} grid={4} new_padding={true} classes={'p-2'} />
          }
          {/* {
            (product && product.recommend_products) ? product.recommend_products.map((product) => <CardGrid product={product} key={product.id} classes={"pb-5"} show={4} />) : ''
          } */}
        </div>
      </div>
      <div className="d-block d-xl-none">
        <div className="row mt-5">
          {
            data ? <div className="col-12 "><Slick {...settingscardmin} className="slickcard">
              {
                data.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={3} />) 
              }
            </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} classes={'p-2'} />
          }
          {/* {
            (product && product.recommend_products) ? product.recommend_products.slice(0, 3).map((product) => <CardGrid product={product} key={product.id} classes={"pb-5"} show={3} />) : ''
          } */}
        </div>
      </div>
    </div>
  )
}


export default withLoadOnVisible(RelatedProduct)