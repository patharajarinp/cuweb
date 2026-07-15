import {useState,useEffect} from 'react'
import { CardGrid} from '../widget/card';
import CardPH from '../shimmer/Card'
import Slick from "react-slick";
import withLoadOnVisible from '../../utils/withLoadOnVisible'
import api from '../../utils/api'
// import {CardPH}  from '../components/widget/card';
const ProductAlsoBuy = (props) =>{
  const {t,settingscard,settingscardmin,product_id,visible,data} = props
  // const [state,setState] = useState({
  //   data : null,
  //   loading : false,
  //   done : false,
  //   error : false
  // })
  // const {data,done,error} = state
  // useEffect(() => {
  //   if(visible && !done){
  //     fetch();
  //   }
  // },[visible])
  

  // const fetch = () =>{
  //   setState({...state,loading:true})
  //   api.getAlsoProduct(product_id, {limit : 12})
  //   .then(res => {
  //     setState({...state,done:true,loading:false,data : res.data})
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     setState({...state,done:true,loading:false,error : true})
  //   })
  // }

  // if(error) return null;

  // if(data && !data.length || !done) return null

  return (
    <div className="container pb-5">
      {
        !!data?.length &&
        (
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h2>{t('by_products')}</h2>
              </div>
            </div>
          </div>
        )
      }
      
      <div className="d-none d-xl-block">
        <div className="row mt-5">
          {
            data ? <div className="col-12 "><Slick {...settingscard} className="slickcard">
              {
                data ? (data.length > 0 ? data.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={4} />) : '') : ''
              }
            </Slick> </div> : <CardPH show={4} grid={4} new_padding={true} classes={'p-2'} />
          }
          {/* {
            (also) ? also.slice(0, 12).map((val) => <CardGrid product={val} key={val.id} classes={"pb-5"} show={4} />) : ''
          } */}
        </div>
      </div>
      <div className="d-block d-xl-none">
        <div className="row mt-5">
          {
            data ? <div className="col-12 "><Slick {...settingscardmin} className="slickcard">
              {
                data ? (data.length > 0 ? data.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={3} />) : '') : ''
              }
            </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} classes={'p-2'} />
          }
          {/* {
            (also) ? also.slice(0, 12).map((val) => <CardGrid product={val} key={val.id} classes={"pb-5"} show={3} />) : ''
          } */}
        </div>
      </div>
    </div>
  )
}


export default withLoadOnVisible(ProductAlsoBuy)