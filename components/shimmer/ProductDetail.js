import Shimmer from '../Shimmer'

const ProductDetailPH = () =>{
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <p></p>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row mx-0 justify-content-center">
          <div className="col-10 px-0">
            <div className="row">
              <div className="col-5">
              
                <div className={"detail-img book-shadow text-center"}>
                  <div className="c-img h-100">
                    <Shimmer size={[268,370]}/>
                  </div>
                </div>
              </div>
              <div className="col-1"></div>
              <div className="col-6">
                <div className="detail-name">
                  <h2><Shimmer size={[416,30]}/></h2>
                  <h2><Shimmer size={[528,30]}/></h2>
                  <p className="detail-author"><Shimmer size={[192,16]}/></p>
                  <div className="detail-vote">
                      <Shimmer size={[416,16]}/>
                  </div>
                  <p className="mt-4 font-weight-bold"><Shimmer size={[112,16]}/></p>
                  <div className="pb-2">
                    <p><Shimmer size={[304,30]}/></p>
                    <p><Shimmer size={[192,30]}/></p>
                  </div>
                  <div className="mt-3 pb-3">
                    <p className="mr-3" disabled><Shimmer size={[336,30]}/></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-lg-center mx-0 mt-4">
          <div className="col-10 px-0">
            <div className="bg-white br-8">
              <div className="row">
                <div className="col-4">
                  <div className="detail-des">
                    <h5 className="pb-3"><Shimmer size={[160,16]}/></h5>
                    <p><Shimmer size={[220,16]}/></p>
                    <p><Shimmer size={[170,16]}/></p>
                    <p><Shimmer size={[156,16]}/></p>
                    <p><Shimmer size={[180,16]}/></p>
                    <p><Shimmer size={[130,16]}/></p>
                    <p><Shimmer size={[140,16]}/></p>
                  </div>
                </div>
                <div className="col-8">
                  <div className="detail-des">
                    <h5 className="pb-3"><Shimmer size={[542,16]}/></h5>

                    <p className="mb-2"><Shimmer size={[370,16]}/></p>
                    <p className="mb-2"><Shimmer size={[390,16]}/></p>
                    <p className="mb-2"><Shimmer size={[280,16]}/></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailPH