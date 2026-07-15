import React, { useState } from 'react';
import { CustomInput } from 'reactstrap';
import Add_Tax from '../../../components/mobile/summary/choose-tax';
import { withTranslation } from '../../../utils/i18n';
const TaxFill = ({ setRequire_tax, require_tax, user, show2, toggle2, selectedTax, setSelectedTax, t }) => {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [taxnumber, setTaxnumber] = useState("");
  const [taxname, setTaxname] = useState("");
  const [chkTax, setChkTax] = useState(false);

  const deleteNumber = (e) => setNumber(e.target.value);
  const deleteEmail = (e) => setEmail(e.target.value);
  const deleteTaxnumber = (e) => setTaxnumber(e.target.value);
  const deleteTaxname = (e) => setTaxname(e.target.value);


  const handleChange = (e) => {
    var checked = e.target.checked;
    if (checked) {
      setChkTax(true);
      setRequire_tax(1);
    } else {
      setChkTax(false);
      setRequire_tax(0);
    }
  }

  var isOnlyTax = true;
  // console.log('cartDetail',cartDetail)
  if (user) {
    for (let i = 0; i < user.addresses.length; i++) {
      if (user.addresses[i].at == 'tax') {
        isOnlyTax = false
        break;
      }
    }
  }


  return (
    <>
      <div className="edit-info-shipping">
        <CustomInput type="checkbox" name="tax-bill" id="tax-bill" checked={chkTax} label={t('mobile_summary:request_nvoice')} className="text-black" onChange={handleChange} />
        {
          chkTax && (
            <>
              <div className="edit-info-shipping-title justify-content-between mt-2 align-items-center">
                <div className="d-flex  w-100 align-items-center">
                  <img className="img-fluid mr-2 mb-auto" src="/mobile/image/icon/icon-doc.svg" />

                  <h4 className="text-black mb-0">{t("mobile_address:billingaddress")}</h4>
                </div>
                {
                  (user && user.addresses.length) > 0 && user.addresses[selectedTax] && user.addresses[selectedTax].firstname ?


                    <a onClick={toggle2}><p className="text-pink mb-0">{t("mobile_summary:change")}</p></a>
                    :
                    <a onClick={toggle2}><p className="text-pink mb-0">{t("mobile_add_address:add_address")}</p></a>

                }

              </div>
              <div className="">
                {
                  !isOnlyTax ? (
                    <>
                      {
                        (user && user.addresses.length) > 0 ?
                          <>

                            <div className="info-address-detail w-100">
                              <div className="d-flex justify-content-between align-items-center">
                                {
                                  user.addresses[selectedTax].at == 'tax' ?
                                    <div className="btn-address-tax-add-list mr-2">
                                      <p className="p-14">{t("mobile_address:tax")}</p>
                                    </div> : ''
                                }

                              </div>
                              <p className="text-black mb-0 mt-1">{user.addresses[selectedTax].firstname} {user.addresses[selectedTax].lastname}</p>

                              <p className="p-12 text-black two-line mb-0">{user.addresses[selectedTax].full_address}
                              </p>
                              <p className="p-12 text-black mb-1">{user.addresses[selectedTax].phone}</p>
                            </div>
                            {/* <Add_address show={show} user={user} toggle={toggle} selected={selected} setSelectedAddress={setSelectedAddress} />
                        <TaxFill user={user} setRequire_tax={setRequire_tax} require_tax={require_tax} show2={show2} toggle2={toggle2} selectedTax={selectedTax} setSelectedTax={setSelectedTax} />    */}
                          </> :
                          <Link href="/user/add-address">
                            <a className="add-address container">
                              <h4 className="text-pink my-auto"><img className="img-fluid mr-8px" src={"/mobile/image/icon/icon-location.svg"} />{t("mobile_address:add_new_address")}</h4>
                              <i className="fas fa-chevron-right text-pink my-auto"></i>
                            </a>
                          </Link>
                      }
                    </>
                  ) : ''
                }

              </div>
              {/* <div className="edit-info-shipping-title">
              <img className="img-fluid mr-2 mb-auto" src="/mobile/image/icon/icon-call.svg" />
              <div className="input-for-edit">
                <input type="text" className="input_mobile" value={number} onChange={deleteNumber} required placeholder="{t("mobile_summary:phone_number")}" />
                <button onClick={deleteNumber} className="delete-input"></button>
                <button className="submit-input">{t(mobile_summary:save)}</button>
                <span className="input-border"></span>
              </div>
            </div>
            <div className="edit-info-shipping-title">
              <img className="img-fluid mr-2 mb-auto" src="/mobile/image/icon/icon-mail.svg" />
              <div className="input-for-edit">
                <input type="email" className="input_mobile" value={email} onChange={deleteEmail} required placeholder="{t("mobile_summary:email")}" />
                <button onClick={deleteEmail} className="delete-input"></button>
                <button className="submit-input">{t(mobile_summary:save)}</button>
                <span className="input-border"></span>
              </div>
            </div>
            <div className="edit-info-shipping-title">
              <img className="img-fluid mr-2 mb-auto" src="/mobile/image/icon/icon-tax.svg" />
              <div className="input-for-edit">
                <input type="text" className="input_mobile" value={taxnumber} onChange={deleteTaxnumber} required placeholder="{t("mobile_summary:tax_id")}" />
                <button onClick={deleteTaxnumber} className="delete-input"></button>
                <button className="submit-input">{t(mobile_summary:save)}</button>
                <span className="input-border"></span>
              </div>
            </div>
            <div className="edit-info-shipping-title">
              <img className="img-fluid mr-2 mb-auto" src="/mobile/image/icon/icon-office.svg" />
              <div className="input-for-edit">
                <input type="text" className="input_mobile" value={taxname} onChange={deleteTaxname} required placeholder="{t("mobile_summary:head_office")}" />
                <button onClick={deleteTaxname} className="delete-input"></button>
                <button className="submit-input">{t(mobile_summary:save)}</button>
                <span className="input-border"></span>
              </div>
            </div> */}
              <Add_Tax show2={show2} user={user} toggle2={toggle2} selectedTax={selectedTax} setSelectedTax={setSelectedTax} />
            </>
          )
        }
      </div>
    </>
  )
}
export default withTranslation('summary')(TaxFill);