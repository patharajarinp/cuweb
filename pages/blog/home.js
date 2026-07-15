import React, { useState, useContext } from "react";
import Layout from "../../components/layout";
import LoginLayout from "../../components/layout/login_layout";

import { Modal } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import { withTranslation, Link, Router, i18n, Trans } from "../../utils/i18n";
function Home(props) {
  const { user } = useContext(UserContext);
  const { t } = props;
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  return (
    <div className="blog-home">
      <Layout title="Home:blog" isBanner={true}>
        <div className="blog-home-banner">
          <div className="container mt-68px">
            <div className="row ">
              <div className="col-6 ml-5 mt-5">
                <h2 className="text-yellow">สมัครบัญชีนักเขียนกับ</h2>
                <h2>ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย</h2>
                <p>
                  รับสมัครนักเขียนหน้าใหม่ไฟแรง สามารถเขียนได้เป็นงานอดิเรก
                  ไม่มีการบังคับในเรื่องการทำงานใดๆทั้งสิ้น
                </p>
                {!user ? (
                  <button
                    className="blog-banner-btn"
                    type="button"
                    onClick={() => setShowLogin(true)}
                  >
                    สมัครเป็นนักเขียน
                  </button>
                ) : (
                  <Link href="/blog/writer/register">
                    <a>
                      <button className="blog-banner-btn" type="button">
                        สมัครเป็นนักเขียน
                      </button>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <img className="w-100" src="/images/blog-banner.jpg" />
        <Modal
          className="modal-cart"
          centered
          show={showLogin}
          onHide={handleCloseLogin}
          size="xl"
        >
          <Modal.Header closeButton>
            <div>
              <Modal.Title className="d-flex">{t("system_login")}</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true}  />
          </Modal.Body>
        </Modal>
      </Layout>
    </div>
  );
}
export default withTranslation('header')(Home)