import classnames from "classnames";
import React from "react";
import { withTranslation } from '../../utils/i18n';
class NavbarProductDetail extends React.Component {

  constructor(props) {
    super(props);
    this.handleNav = this.handleNav.bind(this); 
    
  }
  state = {
    activeSlideNav: 'tab1',
    visible: false,

  }
  
  // Adds an event listener when the component is mount.
  componentDidMount() {

    window.addEventListener("scroll", this.handleScroll);
    document.getElementById("product-"+this.state.activeSlideNav).focus();
  }

  // Remove the event listener when the component is unmount.
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
   
  }


  handleNav(name) {
    this.setState({ activeSlideNav: name });
 
  }

  // Hide or show the menu.
  handleScroll = () => {
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    

    const visible = prevScrollpos > 500;
    
    this.setState({
      prevScrollpos: currentScrollPos,
      visible
    });
  };

  render() {
    let ActiveClasses = (this.state.activeSlideNav === 'tab2' ? ' active' : '');
    const {t} =this.props;
    return (
      <div className={classnames("product-detail-nav", {
        "product-detail-nav-hidden": !this.state.visible
      })}>
        <div className="product-detail-nav-area">
          <a id="product-tab1" href="#show_product" className={`product-detail-nav-list > h4 ${this.state.activeSlideNav === 'tab1' ? ' active' : ''}`}  onClick={() => this.handleNav('tab1')} >
            <h4>{t("mobile_translations:items")}</h4>
          </a>
          <a id="product-tab2" href="#detail_product" className={`product-detail-nav-list > h4  ${this.state.activeSlideNav === 'tab2' ? ' active' : ''}`}  onClick={() => this.handleNav('tab2')}>
            <h4>{t("mobile_translations:product_details")}</h4>
          </a>
          <a id="product-tab3" href="#review_product" className={`product-detail-nav-list > h4 ${this.state.activeSlideNav === 'tab3' ? ' active' : ''}`} onClick={() => this.handleNav('tab3')}>
            <h4>{t("mobile_translations:reviews")}</h4>
          </a>
          <a id="product-tab4" href="#recommend_product" className={`product-detail-nav-list > h4 ${this.state.activeSlideNav === 'tab4' ? ' active' : ''}`} onClick={() => this.handleNav('tab4')}>
            <h4>{t("mobile_translations:recommended_products")}</h4>
          </a>
          <a id="product-tab5" href="#list_news"className={`product-detail-nav-list > h4 ${this.state.activeSlideNav === 'tab5' ? ' active' : ''}`} onClick={() => this.handleNav('tab5')}>
            <h4>{t("mobile_translations:news_activities")}</h4>
          </a>
        </div>
      </div>
    );
  }
}
export default withTranslation('translations')(NavbarProductDetail);