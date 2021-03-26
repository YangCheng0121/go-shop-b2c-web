const routes = [
  // Index
  {
    path: '/',
    name: 'Index',
    keepAlive: true,
    component: () => import('@/views/index/Index')
  },
  // Category
  {
    path: '/category',
    name: 'Category',
    keepAlive: true,
    component: () => import('@/views/category/Category')
  },
  // ShopCart
  {
    path: '/shopcart',
    name: 'ShopCart',
    keepAlive: true,
    component: () => import('@/views/shopcart/ShopCart')
  },
  // Mine
  {
    path: '/mine',
    name: 'Mine',
    keepAlive: true,
    component: () => import('@/views/mine/Mine')
  },
  // ProductDetail
  {
    path: '/product-detail/:sn',
    name: 'ProductDetail',
    keepAlive: false,
    component: () => import('@/views/product-detail/ProductDetail')
  },
  // Search
  {
    path: '/search',
    name: 'Search',
    keepAlive: false,
    component: () => import('@/views/search/Search')
  },
  // Order
  {
    path: '/order',
    name: 'Order',
    keepAlive: false,
    component: () => import('@/views/order/Order')
  },
  // OrderDetail
  {
    path: '/order-detail/:sn',
    name: 'OrderDetail',
    keepAlive: true,
    component: () => import('@/views/order-detail/OrderDetail')
  },
  // ConfirmOrder
  {
    path: '/confirm-order',
    name: 'ConfirmOrder',
    keepAlive: true,
    component: () => import('@/views/confirm-order/ConfirmOrder')
  },
  // AddressList
  {
    path: '/address-list',
    name: 'AddressList',
    keepAlive: true,
    component: () => import('@/views/address-list/AddressList')
  },
  // AddressEdit
  {
    path: '/address/edit/:id',
    name: 'AddressEdit',
    keepAlive: true,
    component: () => import('@/views/address/AddressEdit')
  },
  // AddressAdd
  {
    path: '/address/add',
    name: 'AddressAdd',
    keepAlive: true,
    component: () => import('@/views/address/AddressAdd')
  },
  // Payment
  {
    path: '/payment/:sn',
    name: 'Payment',
    keepAlive: true,
    component: () => import('@/views/payment/Payment')
  },
  // Refund
  {
    path: '/refund',
    name: 'Refund',
    keepAlive: true,
    component: () => import('@/views/refund/Refund')
  },
  // Coupon
  {
    path: '/coupon',
    name: 'Coupon',
    keepAlive: true,
    component: () => import('@/views/coupon/Coupon')
  },
  // Setting
  {
    path: '/setting',
    name: 'Setting',
    keepAlive: true,
    component: () => import('@/views/setting/Setting')
  },
  // Login
  {
    path: '/login',
    name: 'Login',
    keepAlive: true,
    component: () => import('@/views/login/Login')
  },
  // TestLogin
  {
    path: '/test-login',
    name: 'TestLogin',
    keepAlive: true,
    component: () => import('@/views/test-login/TestLogin')
  }
]

export default routes
