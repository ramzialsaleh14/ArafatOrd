import { Platform } from "react-native";
// Urls
export const appVersion = "v1.5.0";
export const serverBaseUrl = "https://arafatmills.puresoftjo.com";
//export const serverBaseUrl = "http://192.168.1.231:8080";
export const serverPublicBaseUrl = "https://arafatmills.puresoftjo.com";
//export const serverPublicBaseUrl = "http://192.168.1.231:8080";
export const pickServerUrl =
  serverBaseUrl +
  "/pick/faces/redirect?item_id=ORDAPPSERVICE&input_id=1&service=y&";
export const pickPublicServerUrl =
  serverPublicBaseUrl +
  "/pick/faces/redirect?item_id=ORDAPPSERVICE&input_id=1&service=y&";
export const CURRENT_SERVER = "CURRENT_SERVER";
export const CURRENT_SERVER_IP = "CURRENT_SERVER_IP";

// User
export const cur_user = "cur.user";
//colors
export const appColor = "#386280";
export const darkBlueColor = "#AB9F87";
export const greenColor = "#6BA561";

// Codes
export const networkError_code = 100;

// Actions
export const CHECK_LOGIN = "CHECK.LOGIN";
export const GET_STOCK_ITEMS = "GET.STOCK.ITEMS";
export const GET_CUR_ORD_SERIAL = "GET.CUR.ORD.SERIAL";
export const SAVE_PUR_ORD = "SAVE.PUR.ORD";
export const GET_MY_ORDERS = "GET.MY.ORDERS";
export const GET_ORDERS_REPORT = "GET.ORDERS.REPORT";
export const PRINT_ORDER = "PRINT.ORDER";
export const SEND_TO_PRINTER = "SEND.TO.PRINTER";
export const CHECK_IS_ORD_POSTED = "CHECK.IS.ORD.POSTED";
export const SAVE_MIXWT_AND_POST = "SAVE.MIXWT.AND.POST";
export const ITEMS_TO_BE_MAN_REPORT = "ITEMS.TO.BE.MAN.REPORT";
export const GET_ITEM_WEIGHTS = "GET.ITEM.WEIGHTS";
export const GET_WORKSHOP_ITEMS = "GET.WORKSHOP.ITEMS";
export const SAVE_INV_DONE = "SAVE.INV.DONE";
export const SEND_USER_TOKEN = "SEND.USER.TOKEN";
export const GET_MINUS_QTY_ITEMS = "GET.MINUS.QTY.ITEMS";
export const GET_PROD_PROCESSES = "GET.PROD.PROCESSES";
export const GET_EMPLOYESS = "GET.EMPLOYEES";
export const ADD_TO_PROD_ORDER = "ADD.TO.PROD.ORDER";
export const DELETE_PUR_ORDER = "DELETE.PUR.ORD";
export const SEND_ITEM_TO_APPROVALS = "SEND.ITEM.TO.APPROVALS";
export const GET_ITEMS_TO_BE_APPROVED = "GET.ITEMS.TO.BE.APPROVED";
export const SAVE_BAGS = "SAVE.BAGS";
export const CHECK_ORD_FORMULA = "CHECK.ORD.FORMULA";
export const HAS_ORD_PROD_PROCESSES = "HAS.ORD.PROD.PROCESSES";
export const ADD_NEW_PROD_ORDER = "ADD.NEW.PROD.ORDER";
export const GET_PROD_ORDERS = "GET.PROD.ORDERS";
export const POST_PROD_ORDER = "POST.PROD.ORDER";