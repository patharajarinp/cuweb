import { Modal } from 'react-bootstrap';
import { withTranslation } from '../utils/i18n';

const Dialog = (props) => {
  const { t } = props;

  const handleConfirm = e =>{
    if(props.onHide){
      props.onHide();
    }
    if(props.onConfirm){
      props.onConfirm(props.ref_id ? props.ref_id : null);
    }
  }

  return (
    <Modal className="modal-alert" centered show={props.show} onHide={props.onHide} size={props.size}>
      <Modal.Body>
        <form>
          <div className="row mt-4 justify-content-center">
            <div className="col-12">
              <div className="text-center">
                <img src="/icon/Attention.svg" />
              </div>
            </div>
            <div className="col-12 my-4">
              <div className="text-center">
                <h3>{props.text}</h3>
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="text-center">
                {
                  props.cancel_btn == true && (
                     <button type="button" className="btn btn-outline-primary mr-4" onClick={props.onHide}>{t('cancel')}</button>
                  )
                }
                <button type="button" className="btn btn-primary" onClick={handleConfirm}>{t('save')}</button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>  
  )
}

export default withTranslation('ConfirmDialog')(Dialog)