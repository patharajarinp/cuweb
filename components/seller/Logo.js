import { useEffect ,memo} from 'react'
import Rating from 'react-rating';

const Logo = memo(({seller, preview = 0}) => {

  // console.log('seller', seller);
  // console.log('preview', preview);
  if(!seller) {
    return;
  }
	return (
		<>
      <div className="row detail-vender mb-3 mx-0">
        <div className="col-9 d-flex align-items-center">
          <img src={preview ? seller.picture_preview : seller.picture} />
          <div className="ml-4">
            <p>ชื่อร้านค้า</p>
            <p className="vender-name">{seller.shop_name}</p>
            <p className="mb-0">{preview ? seller.description_preview : seller.description}</p>
          </div>
        </div>
        <div className="col-3 text-right">
          <h4>คะแนนร้านค้า</h4>
          <Rating
            emptySymbol="far fa-star font-star"
            fullSymbol="fas fa-star font-star"
            fractions={10}
            initialRating={seller.seller_rate}
            readonly="true"
          />
          <p className="mb-0 mt-1">{!seller.seller_total_review ? 'ยังไม่มีคะแนนรีวิว' : `คะแนนที่ได้ ${seller.seller_rate} เต็ม 5`}</p>
        </div>
      </div>
		</>
	)
})

export default Logo