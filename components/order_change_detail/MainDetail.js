import React, { useState,useEffect } from 'react'
import { withTranslation, Link, Router} from "../../utils/i18n";
import tools from "../../utils/tools";
import api from "../../utils/api";
import classNames from 'classnames';
import PackageHeader from '../order_change_detail/PackageHeader'
import TrackingDetail from '../order_change_detail/TrackingDetail'
import ProductList from '../order_change_detail/ProductList'

const MainDetail = ({t, changes}) =>{


	return (
		<div className="package mb-3">
      <div className="border-bottom"></div>
			<div className="p-3">
				
				<PackageHeader changes={changes} t={t} />
				
			
        <TrackingDetail changes={changes} t={t}/>
				<div className="my-5 mx-4">
					{
						changes ? changes.detail.map((val, index) => (
							<ProductList key={val.product.id} changes={val} t={t} />
						)) : ''
					}
				</div>
	    </div>
    </div>
	)
}
export default withTranslation(['order_detail'])(MainDetail)