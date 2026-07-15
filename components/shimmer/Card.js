import Shimmer from '../Shimmer'
import {memo} from 'react'
const CardPH = memo(props =>{
  var {show,grid=3} = props
  const CreateTable = (props) => {
    const {show} = props
    let table = []

    for (let i = 0; i < show; i++) {
      table.push(
        <div key={Math.random()} className={"pb-5 col-"+(12/grid)}>
          <div className="product-main-grid">
            <div className="product-card" style={{background:"#fff"}}>
              <div className="show-logo">
                <Shimmer size={[80,16]}/>
              </div>
              <div className="show-book">
                <Shimmer classes="shimmwer-card"  size={[160,220]}/>
              </div>
              <div className="product-detail">
                <h3 className="book-name"><Shimmer size={[260,16]}/></h3>
                <p className="book-author"><Shimmer size={[200,16]}/></p>
                <p className="book-price"><Shimmer size={[80,16]}/></p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return table
  }
  return (
    <>
      <CreateTable show={show}/>
    </>
  )
})

export default CardPH