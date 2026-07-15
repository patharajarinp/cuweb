import React, { useState, useEffect, useContext } from 'react'
import { Link, withTranslation, Router } from '../../../utils/i18n'
import api from '../../../utils/api';
import Sidenav from '../../../components/user/sidenav'
import AuthService from '../../../utils/AuthService'
import UserContext from '../../../contexts/UserContext';

const MainFollow = (props) => {
  const { t } = props;

  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const [ref_id, setRef_id] = useState();
  const { user } = useContext(UserContext);
  const [order, setOrder] = useState();
  const [check, setReview] = useState();
  const [sidenav, setSidenav] = useState(true);
  const [fav, setFav] = useState();

  const fetchFollow = () => {
    const id = AuthService.getProfile().id;
    api.getFollowFont(id).then(res => {
      const data = res.data;
      setFav(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  };

  useEffect(() => {
    fetchFollow();
  }, []);
  const profile = (val)=>{
    var de =  val.blog_writer_banners.filter((val1) => val1.mimetype == "profile" && val1.status == 1).map((val1) => {
      return val1.picture 
    });
    return de[0]||"/icon/blog-icon-user.svg";
  }
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  return ( 
    <>
      <Sidenav user={user} menuToggle={sidenav} page="follow" >
        <div className="show-profile h-100" id="show-profile">
          <div className="box-main-account">
            <div className="row mx-0 px-0">
              <div className="col-12 pl-0">
                <div className="mt-2 mb-4">
                  <h6 className="text-black">{t('title_follow')}</h6>
                  <hr/>
                </div>
              </div>
            </div>
            <div className="row mx-0 px-0">
               {fav ?
                    fav.map((val)=> ( 
                    <div className="col-6 px-0">
                      <Link href={`/blog/writer/[idwriter]?idwriter=${val.id}`} as={`/blog/writer/${val.id}`} >
                      <a>
                        <div className="d-flex align-items-center">
                          <div className="blog-image-cropper follow mr-3">
                            <img width="100%" height="100%" src={profile(val)} className="blog-rounded" />
                          </div>
                          <h3 className="m-0 text-black">{val.penname1}</h3> 
                        </div> 
                      </a>         
                      </Link>
                    </div>
                  ))
                :null}        
            </div>
          </div>
        </div>
      </Sidenav>
    </>
  )
}

export default MainFollow