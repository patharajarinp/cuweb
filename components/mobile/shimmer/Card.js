import Shimmer from '../Shimmer'

const CardPH = (props) =>{
  var {show} = props
  const createTable = (show) => {
    let table = []

    for (let i = 0; i < show; i++) {
      table.push(
        <div className="card-book mr-2" key={i}>
          <div className="d-flex justify-content-between mb-2">
            <div className="d-flex ">
                <Shimmer size={[80,16]}/>
            </div>
          </div>
          <div className="book-image-area mb-2">
            <div className="img-fluid m-auto shadow-book">
              <Shimmer size={[82,120]}/>
            </div>
          </div>
          <h5 className="text-name-of-book"><Shimmer size={[110,18]}/></h5>
          <h6 className="text-author"><Shimmer size={[80,16]}/></h6>
          <h5 className="text-pink font-weight-bold"><Shimmer size={[60,16]}/></h5>
        </div>
      )
    }
    return table
  }
  return (
    <>
      {createTable(show)}
    </>
  )
}

export default CardPH