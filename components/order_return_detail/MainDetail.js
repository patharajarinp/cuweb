import React, { useState,useEffect } from 'react'
import { withTranslation, Link, Router} from "../../utils/i18n";
import tools from "../../utils/tools";
import api from "../../utils/api";
import classNames from 'classnames';
import PackageHeader from '../order_return_detail/PackageHeader'
import TrackingDetail from '../order_return_detail/TrackingDetail'
import ProductList from '../order_return_detail/ProductList'

const MainDetail = ({t, returns}) =>{


	return (
		<div className="package mb-3">
      <div className="border-bottom"></div>
			<div className="p-3">
				
				<PackageHeader returns={returns} t={t} />
				
			
        <TrackingDetail returns={returns} t={t}/>
				<div className="my-5 mx-4">
					{
						returns ? returns.detail.map((val, index) => (
							<ProductList key={val.product.id} returns={val} t={t} />
						)) : ''
					}
				</div>
	    </div>
    </div>
	)
}
export default withTranslation(['order_detail'])(MainDetail)