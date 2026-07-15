import axios from 'axios'
import AuthService from './AuthService'
const BASE_LOCAL = 'https://te-api.chulabook.com';
// const BASE_LOCAL = 'http://192.168.1.111:8080';
const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.api_url || process.env.API_URL || BASE_LOCAL;
const frontend_url = process.env.frontend_url || 'https://www.chulabook.com'
const seller_url = process.env.seller_url || 'https://seller.chulabook.com'
const course_url = process.env.course_url || 'https://www.chulabookcourse.com'
const mode = process.env.MODE || 'dev';
// const BASE= 'http://172.20.10.8:8080'
//const BASE = 'http://localhost:8080'
// const BASE = 'http://161.200.139.234/api'
//const BASE = 'https://api.chulabook.com'

axios.interceptors.request.use(function (config) {
  if (typeof window == 'undefined') {
    // console.log('asda')
    return config;
  }
  const token = AuthService.getToken();
  //If logged in
  if (token && !config.headers.access_token) {

    config.headers.Authorization = 'bearer ' + token;

  }
  config.headers.Pragma = 'no-cache'

  return config;
});

export default {
  //Payment
  baseUrl: BASE,
  frontend_url,
  seller_url,
  course_url,
  mode,
  paymentData: (data) => axios.post(BASE + '/order/payment/credit', data),
  payment2c2p: data => axios.post('https://demo2.2c2p.com/2C2PFrontEnd/SecurePayment/PaymentAuth.aspx', data),
  getQRCode: (data) => axios.post(`${BASE}/order/payment/qr`, data),
  getNewQR: (data) => axios.post(`${BASE}/order/payment/new-qr`, data),
  updatePaymentType: (order_id, data) => axios.put(`${BASE}/order/${order_id}`, data),
  uploadSlip: (data) => axios.post(`${BASE}/order/slips`, data),
  // updateOrderStatus : (order_id, data) => axios.put(`${BASE}/order/${order_id}`, data),

  // Noti
  readAll: (id) => axios.get(`${BASE}/user/${id}/read-noti`),
  readAny: (user_id, noti_id) => axios.get(`${BASE}/user/${user_id}/read-noti/${noti_id}`),

  //logitic
  shippingAlpha: (data) => axios.post('http://localhost:3000/api/alpha', data),


  //Authentication
  login: data => axios.post(BASE + '/auth', data),
  loginFacebok: token => axios.post(BASE + '/auth/facebook', null, { headers: { access_token: token } }),
  loginGoogle: token => axios.post(BASE + '/auth/google', null, { headers: { access_token: token } }),
  loginLine: code => axios.post(BASE + '/auth/line', { code }),
  checkCode: data => axios.post(BASE + '/auth/verify', data),
  sendEmailCode: data => axios.post(BASE + '/auth/genEmailCode', data),
  getLineToken: data => axios.post('https://api.line.me/oauth2/v2.1/token', data),

  testApi: data => { ; return axios.post(BASE + '/auth', data) },
  //Users
  register: data => axios.post(BASE + '/user/register', data),
  getProfile: () => axios.get(BASE + '/user/profile'),
  updateUser: (id, data) => axios.put(`${BASE}/user/${id}`, data),
  updatePassword: (id, data) => axios.put(`${BASE}/user/${id}/password`, data),
  forgotPassword: (data) => axios.post(`${BASE}/user/forgot-password`, data),
  changePassword: (data) => axios.post(`${BASE}/user/change-password`, data),
  //Address
  insertAddress: (id, data) => axios.post(`${BASE}/user/${id}/addresses`, data),
  getAddress: (id, address_id) => axios.get(`${BASE}/user/${id}/addresses/${address_id}`),
  updateAddress: (id, address_id, data) => axios.put(`${BASE}/user/${id}/addresses/${address_id}`, data),
  updatedeleteAddress: (id, address_id) => axios.delete(`${BASE}/user/${id}/addresses/${address_id}`),
  changeDefault: (id, data) => axios.put(`${BASE}/user/${id}/addresses/default`, data),
  changeTax: (id, data) => axios.put(`${BASE}/user/${id}/addresses/tax`, data),
  //Member
  checkPhome: (id, data) => axios.post(`${BASE}/user/${id}/member/activate`, data),
  registerMember: (id, data) => axios.post(`${BASE}/user/${id}/member/register`, data),
  activateMember: (id, data) => axios.post(`${BASE}/user/${id}/member/confirm`, data),
  getMemberOne: (id) => axios.get(`${BASE}/order/member/${id}`),
  renewMember: (id) => axios.post(`${BASE}/user/${id}/member/renew`),

  addOrdeleteFav: (id, data) => axios.post(`${BASE}/user/${id}/favorite`, data),
  getFavorite: (id) => axios.get(`${BASE}/user/${id}/favorite`),

  //products  เกี่ยวหับหนังสือ
  getProducts: (params) => axios.get(`${BASE}/products`, { params }),
  getProductOne: (id, params) => axios.get(`${BASE}/products/${id}`, { params }),
  getProductImg: (id) => axios.get(`${BASE}/products/${id}/images`, { id }),
  getCate: (params) => axios.get(`${BASE}/products/category`, { params }),
  getCateByType: (params) => axios.get(`${BASE}/products/category`, { params }),
  getOneCate: (cate_id) => axios.get(`${BASE}/products/category/${cate_id}`),
  getSubCate: (cate_id) => axios.get(`${BASE}/products/category/${cate_id}/sub`),
  getSubCateItem: (cate_id) => axios.get(`${BASE}/products/category-item/${cate_id}`),
  getShelfCate: (params) => axios.get(`${BASE}/products/recommend/list`, { params }),
  getAlsoProduct: (id, params) => axios.get(`${BASE}/products/${id}/also-bought`, { params }),
  getRelatedProduct: (params) => axios.get(`${BASE}/products/related`, { params }),


  //Main-Products
  getBanner: (page, vendor) => axios.get(`${BASE}/cms/banner?page=${page}&vendor=${vendor}`),

  //Cart
  getCart: () => axios.get(`${BASE}/user/cart`),
  addCart: (data) => axios.post(`${BASE}/user/cart`, data),
  updateNumcard: (id, quantity) => axios.put(`${BASE}/user/cart/${id}`, quantity),
  delCart: (id) => axios.delete(`${BASE}/user/cart/${id}`),

  //Cart sum
  getSelectCart: (cart_id) => axios.get(`${BASE}/user/cart/${cart_id}`),

  //Promotion Code
  getPromotion: (promotion_code) => axios.get(`${BASE}/promotion/${promotion_code}`),
  getPromotionAll: (params) => axios.get(`${BASE}/promotion`, { params }),
  getPromotionByProduct: (params) => axios.get(`${BASE}/promotion/get-by-product`, { params }),

  //Order
  getUserOrder: (id, params) => axios.get(`${BASE}/user/${id}/order`, { params }),
  getOrderDetail: (id) => axios.get(`${BASE}/order/${id}`),
  updateOrderStatus: (order_id, data) => axios.put(`${BASE}/order/${order_id}`, data),
  confirmPackage: (data) => axios.post(`${BASE}/order/package/confirm`, data),
  countOrder: (user_id) => axios.get(`${BASE}/user/${user_id}/order/count`),
  createShopeePay: (data) => axios.post(`${BASE}/order/payment/shopee-pay/create`, data),


  //Review
  insertReview: (data) => axios.post(`${BASE}/reviews`, data),
  getOrderReview: (params) => axios.get(`${BASE}/reviews`, { params }),
  getOrderReviewOne: (review_id) => axios.get(`${BASE}/reviews/${review_id}`),
  getProductReview: (id, params) => axios.get(`${BASE}/products/${id}/reviews`, { params }),

  getBadword: (id) => axios.get(`${BASE}/reviews/badword/${id}`),

  //Setting
  getSetting: (id) => axios.get(`${BASE}/cms/settings/${id}`),

  //Static Page
  getOnepage: (key) => axios.get(`${BASE}/cms/pages/${key}`),
  getCustompage: (key) => axios.get(`${BASE}/cms/pages/main/${key}`),
  getAllContent: (params) => axios.get(`${BASE}/cms/page_content`, { params }),
  getCustompageOne: (path) => axios.get(`${BASE}/cms/pages/main_one/${path}`),
  //get Contact
  getContact: (id) => axios.get(`${BASE}/cms/page_content/${id}`),

  //Product Recommend
  getRecommend: (params) => axios.get(`${BASE}/products/recommend/cate`, { params }),
  getRecByKey: (key) => axios.get(`${BASE}/products/recommend/${key}`),
  getRecProductByKey: (key, params) => axios.get(`${BASE}/products/recommend/${key}/products`, { params }),
  getProductsWithCookie: (params) => axios.get(`${BASE}/products/suggest`, { params }),

  //News
  getNews: (params) => axios.get(`${BASE}/news`, { params }),
  getOneNews: (id) => axios.get(`${BASE}/news/${id}`),
  getNewsByID: (id, params) => axios.get(`${BASE}/news/${id}/products`, { params }),
  getProductPromotion: (id, params) => axios.get(`${BASE}/news/${id}/promotion/products`, { params }),
  getNewsWithProduct: (params) => axios.get(`${BASE}/news/promotion/product`, { params }),

  //Promotion Voucher
  getVoucher: (params) => axios.get(`${BASE}/promotion/voucher`, { params }),

  //Contact 
  sendContact: (data) => axios.post(`${BASE}/contact`, data),
  sendContactEbook: (data) => axios.post(`${BASE}/contact_ebook`, data),

  //Cover page
  getCoverPage: (id) => axios.get(`${BASE}/cms/cover_page/${id}`),

  //Alliances
  getAlliances: () => axios.get(`${BASE}/cms/alliances`),

  //Subscribe
  insertSubcribe: (data) => axios.post(`${BASE}/subscribe`, data),
  delSubcribe: (data) => axios.post(`${BASE}/subscribe/delete`, data),

  //web statistics
  sendPageStat: (path) => axios.post(`${BASE}/backend/page-stats`, { path }),
  sendReturn: (data) => axios.post(`${BASE}/products/return`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  getPackageReturn: (params) => axios.get(`${BASE}/package-return`, { params }),
  getPackageReturnOne: (id) => axios.get(`${BASE}/package-return/${id}`),
  updatePackageReturn: (id, data) => axios.put(`${BASE}/package-return/${id}`, data),
  sendPackageReturn: (data) => axios.post(`${BASE}/package-return`, data),

  //Position
  getPosition: (params) => axios.get(`${BASE}/cms/job/position`, { params }),
  insertJob: (data) => axios.post(`${BASE}/cms/job/application`, data),

  //shipping
  getShipmentInfo: (params) => axios.get(`${BASE}/seller/shipping-info`, { params }),
  getShippingInfoCU: (params) => axios.get(`${BASE}/backend/shipping-data`, { params }),

  getPreOrder: () => axios.get(`${BASE}/products/pre_order`),
  getPackage: (params) => axios.get(`${BASE}/user/package/`, { params }),
  getPackageOne: (pkg_id, params) => axios.get(`${BASE}/order/package/${pkg_id}`, { params }),


  //Seller
  getSeller: (params) => axios.get(`${BASE}/seller/basic`, { params }),
  getSellerBanner: (name, params) => axios.get(`${BASE}/seller/${name}/banner`, { params }),

  //Delcard
  deleteCard: (id) => axios.delete(`${BASE}/user/card/${id}`),

  getShippingCom: (params) => axios.get(`${BASE}/backend/shipping/company`, { params }),


  //blog
  postWriter: (data) => axios.post(`${BASE}/blog/blogWriter`, data),
  getBlogCategory: () => axios.get(`${BASE}/blog/blogCategory`),
  ceateBlog: (data) => axios.post(`${BASE}/blog/blogCeateblog`, data),
  getBlog: (id, params) => axios.get(`${BASE}/blog/blogget/${id}`, { params }),
  getBlogOne: (id) => axios.get(`${BASE}/blog/bloggetOne/${id}`),
  ceateData: (data) => axios.post(`${BASE}/blog/blogCeatedata`, data),
  getData: (id) => axios.get(`${BASE}/blog/blogData/${id}`),
  getDataOne: (id) => axios.get(`${BASE}/blog/blogDataOne/${id}`),
  getTagsAll: () => axios.get(`${BASE}/blog/blogTagsAll`),
  updateBlog: (data) => axios.put(`${BASE}/blog/blogUpdateblog`, data),
  updateData: (data) => axios.put(`${BASE}/blog/blogDataUpdate`, data),
  blogDataFont: (data) => axios.post(`${BASE}/blog/blogDataFont`, data),
  updateWriterBanner: (data) => axios.post(`${BASE}/blog/createWriterBanner`, data),
  getBannerwriter: (id) => axios.get(`${BASE}/blog/getBannerwriter/${id}`),
  getBannerwriterFont: (data) => axios.post(`${BASE}/blog/getBannerwriterFont`, data),
  updateStatusBlog: (data) => axios.post(`${BASE}/blog/updateStatusBlog`, data),
  deleteData: (data) => axios.post(`${BASE}/blog/deleteData`, data),
  getBlogPage: (id) => axios.get(`${BASE}/blog/getBlogPage/${id}`),
  getBlogDataPage: (id, params) => axios.get(`${BASE}/blog/getBlogDataPage/${id}`, { params }),
  getDataLike: (id, params) => axios.get(`${BASE}/blog/getDataLike/${id}`, { params }),
  getdataViewed: (id) => axios.get(`${BASE}/blog/getdataViewed/${id}`),
  dataLiked: (data) => axios.post(`${BASE}/blog/dataLiked`, data),
  dataViewed: (data) => axios.post(`${BASE}/blog/dataViewed`, data),
  getComments: (id, params) => axios.get(`${BASE}/blog/getComments/${id}`, { params }),
  postComments: (data) => axios.post(`${BASE}/blog/postComments`, data),
  getVotes: (id, params) => axios.get(`${BASE}/blog/getVotes/${id}`, { params }),
  postVotes: (data) => axios.post(`${BASE}/blog/postVotes`, data),
  getFollowed: (id, params) => axios.get(`${BASE}/blog/getFollowed/${id}`, { params }),
  postFollowed: (data) => axios.post(`${BASE}/blog/postFollowed`, data),
  getBlogGroupNew: () => axios.get(`${BASE}/blog/getBlogGroupNew`),
  getBlogGroupLiked: () => axios.get(`${BASE}/blog/getBlogGroupLiked`),
  getBlogGroupNewHot: () => axios.get(`${BASE}/blog/getBlogGroupNewHot`),
  getWriterPage: () => axios.get(`${BASE}/blog/getWriterPage`),
  getBlogGroupLikedPage: (params) => axios.get(`${BASE}/blog/getBlogGroupLikedPage`, { params }),
  getBlogGroupNewHotPage: (params) => axios.get(`${BASE}/blog/getBlogGroupNewHotPage`, { params }),
  getBlogGroupNewPage: (params) => axios.get(`${BASE}/blog/getBlogGroupNewPage`, { params }),
  getFillter: (params) => axios.get(`${BASE}/blog/getFillter`, { params }),
  getBlogGroupFillter: (params) => axios.get(`${BASE}/blog/getBlogGroupFillter`, { params }),
  getFollowedAll: (id) => axios.get(`${BASE}/blog/getFollowedAll/${id}`),
  getBlogGroupInterested: (id) => axios.get(`${BASE}/blog/getBlogGroupInterested/${id}`),
  postIssue: (data) => axios.post(`${BASE}/blog/postIssue`, data),
  blogProductGet: (id, key, params) => axios.get(`${BASE}/blog/blogProduct/${id}/${key}`, { params }),
  getRecommedAllFont: () => axios.get(`${BASE}/blog/getRecommedAllFont`),
  getRecommedAll: (key, params) => axios.get(`${BASE}/blog/getRecommedAll/${key}`, { params }),
  getRecommedCateOne: (key) => axios.get(`${BASE}/blog/getRecommedCateOne/${key}`),
  getBlogProductwriter: (id) => axios.get(`${BASE}/blog/getBlogProductwriter/${id}`),
  upddatePdfData: (data) => axios.post(`${BASE}/blog/upddatePdfData`, data),
  updatePennameWriter: (id, data) => axios.put(`${BASE}/blog/updatePennameWriter/${id}`, data),
  blogImage: (data) => axios.post(`${BASE}/blog/Image`, data),
  getFollowFont: (id) => axios.get(`${BASE}/blog/follow/font/${id}`),

  getShop: () => axios.get(`${BASE}/shop-slides`),

  //Cate Url Name
  getCateByURL: (url, params) => axios.get(`${BASE}/products/category/urls/${url}`, { params }),
  getSubCateByURL: (url) => axios.get(`${BASE}/products/category/sub/urls/${url}`),
  getCateItemByURL: (url) => axios.get(`${BASE}/products/category/cate/urls/${url}`),

  getMainCateByID: (main_category) => axios.get(`${BASE}/products/category/${main_category}`),
  getSubCateByID: (main_category, sub_category) => axios.get(`${BASE}/products/category/${main_category}/sub/${sub_category}`),
  getCateByID: (main_category, sub_category, category) => axios.get(`${BASE}/products/category/${main_category}/sub/${sub_category}/cat/${category}`),


  getOneEcodeProject: (project_id) => axios.get(`${BASE}/ecodeproject/project/${project_id}`),
  getBooklistEcode: (params) => axios.get(`${BASE}/ecodeproject/booklist/${params}`),
  getOneDataDetail: (book_id, params) => axios.get(`${BASE}/products/${book_id}`, { params }),
  getOrderEcode: (id) => axios.get(`${BASE}/order/e-code/${id}`),
}