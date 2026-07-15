import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import Link from 'next/link';
import tools from '../../utils/tools'

const Summary = ({order, address, tax, sum, amount, t}) => {
  console.log('order', order);

  var total_price = 0,discount = 0,shipping_cost = 0,summary = 0;
  if(order){
    order.packages.filter((v) => (v.status != 0 || order.status == 0)).map((val, index) => {
      
      shipping_cost += val.shipping_cost;
      discount += val.discount;

      val.package_details.map((val2) => {
        total_price += (val2.item_cover_price * val2.quantity);
      })
    })
  }

  console.log('order', order);

  return (
   <>
   {
    (address && order) && (
      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col-12">
              <div className="border-detail mt-3">
                <div className="p-3">
                  <h5>{t('shipment_address')}</h5>
                  <p className="mt-3 font-weight-bold">{`${address.firstname} ${address.lastname}`}</p>
                  <p>
                    {
                      address.at == "home" ? (
                        <span className="btn-success span-address p-1 mb-2 mr-3 span-blue">{t('at_home')}</span>
                      ) : (
                        <span className="btn-success span-address p-1 mb-2 mr-3 span-green">{t('at_workplace')}</span>
                      )
                        
                    }
                    {`${address.address} ${address.ampher} ${address.province} ${address.post}`}
                  </p>
                  <p>{`PHONE : ${address.phone}`}</p>
                </div>
              </div>
            </div>
          </div>
          {
            (order.require_tax == 1 ? (
              <div className="row">
                <div className="col-12">
                  <div className="border-detail mt-3">
                    <div className="p-3">
                      <h5>{t('tax_address')}</h5>
                      <p className="mt-3 font-weight-bold">{tax ? `${tax.firstname} ${tax.lastname}` : ''}</p>
                      <p>
                        <span className="btn-success span-address p-1 mb-2 mr-3 span-red">{t('tax')}</span>
                        {tax ? `${tax.address} ${tax.ampher} ${tax.province} ${tax.post}` : ''}
                      </p>
                      <p>{tax ? `PHONE : ${tax.phone}` : ''}</p>
                      <p>{tax ? `TAX : ${tax.tax_id}` : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : '') 
          }
        </div>
        <div className="col-6">
          <div className="border-detail mt-3">
            <div className="p-3">
              <h5>{t('summary')}</h5>
              <div className="mt-3 sum-price d-flex justify-content-between">
                <p>{t('default_price')}</p>
                <p className="text-num">฿ {tools.currencyFormatDE(total_price)}</p>
              </div>
              <div className="sum-price d-flex justify-content-between">
                <p>{t("price_save")}</p>
                <p className="text-num text-danger">{discount ? `฿ ${tools.currencyFormatDE(discount - order.promotion_discount - order.member_discount)}` : '฿ 0.00'}</p>
              </div>
             
              <div className="sum-price d-flex justify-content-between">
                <p>{t("promotion_discount")}</p>
                <p className="text-num text-danger">- {discount ? `${tools.currencyFormatDE(order.promotion_discount)}` : '0.00'}</p>
              </div>
              <div className="sum-price d-flex justify-content-between">
                <p>{t("total_price")}</p>
                <p className="text-num">{total_price ? `฿ ${tools.currencyFormatDE(total_price - discount + order.member_discount)}` : '฿ 0.00'}</p>
              </div>
              <div className="sum-price d-flex justify-content-between">
                <p>{t('shipping_cost')}</p>
                <p className="text-num">{shipping_cost ? `฿ ${tools.currencyFormatDE(shipping_cost)}` : `${t("translations:free_shipping")}`}</p>
              </div>
              {
                order.member_discount ? (
                  <div className="sum-price d-flex justify-content-between">
                    <p>{t("member_discount")}</p>
                    <p className="text-num text-danger">- {discount ? `${tools.currencyFormatDE(order.member_discount)}` : '0.00'}</p>
                  </div>
                ) : null
              }
              <div className="my-3 border-bottom"></div>
              <div className="mt-3 sum-price d-flex justify-content-between">
                <h5>{t('net_price')}</h5>
                <p className="text-sum">฿ {order ? tools.currencyFormatDE(order.total_price) : ''}</p>
              </div>
              <p className="mb-0">
                {t('payment_type')}
                {order.payment_type == 1 ? ` ${t('credit')}` : ''}
                {order.payment_type == 2 ? ` ${t('bank_transfer')}` : ''}
                {order.payment_type == 3 ? ` ${t('qr_code')}` : ''}
                {order.payment_type == 4 ? ` ${t('cod')}` : ''}
                {order.payment_type == 5 ? ` ${t('shopee_pay')}` : ''}
                {(order.total_price == 0 && (order.member_discount == 0 && order.promotion_discount == 0)) ? ` ${t('free_of_charge')}` : ''}
                {(order.total_price == 0 && (order.member_discount != 0 || order.promotion_discount != 0)) ? ` ${t('pay_with_code')}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
   }
    
   </>
  )
}

export default Summary