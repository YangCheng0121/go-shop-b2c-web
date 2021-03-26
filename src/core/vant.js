import Vue from 'vue'
import {
  // Basic
  CellGroup,
  Cell,
  Col,
  Row,
  Icon,
  Popup,
  Image as VanImage,
  // Display
  Swipe,
  SwipeItem,
  Divider,
  Tag,
  Empty,
  // From
  Form,
  Search,
  Stepper,
  Checkbox,
  CheckboxGroup,
  Button,
  Rate,
  RadioGroup,
  Radio,
  Field,
  Switch,
  // Nav
  Tabbar,
  TabbarItem,
  Sidebar,
  SidebarItem,
  NavBar,
  Tab,
  Tabs,
  // Action
  SwipeCell,
  DropdownMenu,
  DropdownItem,
  Overlay,
  Dialog,
  ActionSheet,
  Loading,
  // Other
  Card,
  SubmitBar,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku,
  Lazyload,
  AddressList,
  ContactCard,
  CouponList,
  CouponCell,
  Area
} from 'vant'

// Basic
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Col)
Vue.use(Row)
Vue.use(Icon)
Vue.use(Popup)
Vue.use(VanImage)

// Display
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Empty)

// From
Vue.use(Form)
Vue.use(Search)
Vue.use(Stepper)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Button)
Vue.use(Rate)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Field)
Vue.use(Switch)

// Nav
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Sidebar)
Vue.use(SidebarItem)
Vue.use(NavBar)
Vue.use(Tab)
Vue.use(Tabs)

// Action
Vue.use(SwipeCell)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Overlay)
Vue.use(Dialog)
Vue.use(ActionSheet)
Vue.use(Loading)

// Other
Vue.use(Card)
Vue.use(SubmitBar)
Vue.use(GoodsAction)
Vue.use(GoodsActionButton)
Vue.use(GoodsActionIcon)
Vue.use(Sku)
Vue.use(Lazyload, {
  error: require('./error.jpg')
})
Vue.use(AddressList)
Vue.use(ContactCard)
Vue.use(CouponList)
Vue.use(CouponCell)
Vue.use(Area)
