import Rating from 'react-rating';

const HeaderSeller = (props) => {
  const {seller} = props;
  return (
    <>
      <div className="product-background-area pb-3">  
        <div className="container bg-white  py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="">
              <div className="d-flex align-items-center">
                <img src={seller.seller_picture ? seller.seller_picture : `/icon/cu-icon.svg`} alt="icon seller" className="icon-seller" />
                <div>
                  <p className="p-medium mb-0 ml-4">
                    {seller.shop_name}
                  </p>
                  <div className="star-rank ml-4 magin-top-4">
                    <Rating
                      emptySymbol="far fa-star font-star"
                      fullSymbol="fas fa-star font-star"
                      fractions={10}
                      initialRating={seller.seller_rate}
                      readonly="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <p className="mb-0 font-14 text-grey">{seller.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default HeaderSeller