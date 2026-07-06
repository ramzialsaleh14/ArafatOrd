import { Platform } from "react-native";
import * as Constants from "./Constants";
import * as Commons from "./Commons";

const httpTimeout = (ms, promise) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });

export const httpRequest = async (url) => {
  /* Send request */
  const TIMEOUT = 20000;

  const response = await httpTimeout(
    TIMEOUT,
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).catch((error) => {
      console.error(error);
      return Constants.networkError_code;
    })
  ).catch((error) => {
    return Constants.networkError_code;
  });
  const json = await response.json();
  return json;
};

export const ping = async (url, timeout) => {
  const response = await httpTimeout(
    timeout,
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "action=",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("HTTP response status not code 200 as expected.");
        }
      })
      .catch((error) => {
        console.error(error);
        return Constants.networkError_code;
      })
  ).catch((error) => {
    console.log(error);
    return Constants.networkError_code;
  });
  return response;
};

export const pickHttpRequest = async (params) => {
  /* Send request */
  params = params
    .replace(/١/g, 1)
    .replace(/٢/g, 2)
    .replace(/٣/g, 3)
    .replace(/٤/g, 4)
    .replace(/٥/g, 5)
    .replace(/٦/g, 6)
    .replace(/٧/g, 7)
    .replace(/٨/g, 8)
    .replace(/٩/g, 9)
    .replace(/٠/g, 0);
  const TIMEOUT = 20000;
  const user = await Commons.getFromAS("userID");
  const url = Constants.pickServerUrl + params + "&currentuser=" + user;

  console.log(url);

  const response = await httpTimeout(
    TIMEOUT,
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    }).catch((error) => {
      console.error(error);
      return Constants.networkError_code;
    })
  ).catch((error) => {
    return Constants.networkError_code;
  });

  return response;
};

export const checkLogin = async (userID, password) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.CHECK_LOGIN}`;
  params += `&USER=${userID}`;
  params += `&PASSWORD=${password}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const printOrder = async (order, bags) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.PRINT_ORDER}`;
  params += `&ORDER=${order}`;
  params += `&BAGS=${bags}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const sendToPrinter = async (ord, bags) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.SEND_TO_PRINTER}`;
  params += `&ORDER=${ord}`;
  params += `&BAGS=${bags}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const itemsToBeManuReport = async (user, print) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.ITEMS_TO_BE_MAN_REPORT}`;
  params += `&USER=${user}`;
  params += `&PRINTDATA=${print}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const checkIsOrdPosted = async (ordID, stNo) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.CHECK_IS_ORD_POSTED}`;
  params += `&ORD.ID=${ordID}`;
  params += `&ST.NO=${stNo}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const saveMixWtAndPost = async (ordID, mixWt, qtyToMain, user, isDirect, bags) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.SAVE_MIXWT_AND_POST}`;
  params += `&ORD.ID=${ordID}`;
  params += `&MIX.WT=${mixWt}`;
  params += `&QTY.TO.MAIN=${qtyToMain}`;
  params += `&USER=${user}`;
  params += `&IS.DIRECT=${isDirect}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }
  return null;
};
export const saveBags = async (ordID, bags) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.SAVE_BAGS}`;
  params += `&ORD.ID=${ordID}`;
  params += `&BAGS=${bags}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }
  return null;
};
export const addToProdOrder = async (emp, prod, stNo, user, selectedOrd) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.ADD_TO_PROD_ORDER}`;
  params += `&USER=${user}`;
  params += `&EMP=${emp}`;
  params += `&PROD=${prod}`;
  params += `&ST.NO=${stNo}`;
  params += `&ORD=${selectedOrd}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const sendUserToken = async (user, token) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.SEND_USER_TOKEN}`;
  params += `&USER=${user}`;
  params += `&TOKEN=${token}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const getItemWeights = async (itemID) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_ITEM_WEIGHTS}`;
  params += `&ITEM.ID=${itemID}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};



export const getMyOrders = async (userID, fromDate, toDate, stNo) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_MY_ORDERS}`;
  params += `&USER=${userID}`;
  params += `&FROM.DATE=${fromDate}`;
  params += `&TO.DATE=${toDate}`;
  params += `&ST.NO=${stNo}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const getMinusQtyItems = async (userID) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_MINUS_QTY_ITEMS}`;
  params += `&USER=${userID}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const getProdProcesses = async () => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_PROD_PROCESSES}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const checkOrdFormula = async (ord) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.CHECK_ORD_FORMULA}`;
  params += `&ORD.ID=${ord}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const postProdOrder = async (ord) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.POST_PROD_ORDER}`;
  params += `&ORD=${ord}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const getProdOrders = async (fromDate, toDate, emp) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_PROD_ORDERS}`;
  params += `&FROM.DATE=${fromDate}`;
  params += `&TO.DATE=${toDate}`;
  params += `&EMP=${emp}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const addNewProdOrder = async (emp) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.ADD_NEW_PROD_ORDER}`;
  params += `&EMP=${emp}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const getEmployees = async () => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_EMPLOYESS}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const hasOrdProdProcesses = async (ord) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.HAS_ORD_PROD_PROCESSES}`;
  params += `&ORD=${ord}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const getOrdersReport = async (date, status) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_ORDERS_REPORT}`;
  params += `&DATE=${date}`;
  params += `&ORD.STATUS=${status}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const saveInvDone = async (invNo) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.SAVE_INV_DONE}`;
  params += `&INV=${invNo}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const deletePurOrder = async (ord) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.DELETE_PUR_ORDER}`;
  params += `&ORD=${ord}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

export const sendItemToApprovals = async (ord, status) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.SEND_ITEM_TO_APPROVALS}`;
  params += `&ORD=${ord}`;
  params += `&ISTATUS=${status}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const getWorkshopItems = async () => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_WORKSHOP_ITEMS}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const getItemsToBeApproved = async () => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_ITEMS_TO_BE_APPROVED}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};


export const savePurOrd = async (ordID, dlvDate, stNo, formSum, reqQty, formCnt, user, selItemWt, entryDest) => {
  /* Request params */
  let params = "";
  params += `action=${Constants.SAVE_PUR_ORD}`;
  params += `&ORD.ID=${ordID}`;
  params += `&NEW.DLV.DATE=${dlvDate}`;
  params += `&NEW.ST.NO=${stNo}`;
  params += `&NEW.FORM.SUM=${formSum}`;
  params += `&NEW.REQ.QTY=${reqQty}`;
  params += `&NEW.FORM.MULTI=${formCnt}`;
  params += `&USER=${user}`;
  params += `&SEL.ITEM.WT=${selItemWt}`;
  params += `&ENTRY.DEST=${entryDest}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const getStockItems = async () => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_STOCK_ITEMS}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};
export const getCurOrdSerial = async () => {
  /* Request params */
  let params = "";
  params += `action=${Constants.GET_CUR_ORD_SERIAL}`;

  /* Send request */
  const response = await pickHttpRequest(params);

  /* Check response */
  if (response === Constants.networkError_code) {
    return null;
  }
  if (response.ok) {
    return await response.json();
  }

  return null;
};

