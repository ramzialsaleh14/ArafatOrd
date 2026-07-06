import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Dropdown } from "react-native-element-dropdown";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Image,
  Pressable,
  FlatList,
  I18nManager,
  BackHandler,
  Dimensions,
  ScrollView,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Constants2 from "../utils/Constants";
import * as Notifications from "expo-notifications";
import * as ServerOperations from "../utils/ServerOperations";
import * as Commons from "../utils/Commons";
import i18n from "../languages/langStrings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import moment from "moment";
import ProgressDialog from "react-native-progress-dialog";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import * as MediaLibrary from "expo-media-library";
import * as actions from "../actions/main";
import Color, { White } from 'react-native-material-color';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { width, height } from "../utils/Styles";

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function MainScreen({ navigation, route }) {
  const [curUser, setCurUser] = useState("");
  const [progressDialogVisible, setProggressDialogVisible] = useState(false);
  const [showSelectCustomerModal, setShowSelectCustomerModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showOrdFiltersModal, setShowOrdFiltersModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [fitleredCustomersList, setFilteredCustomersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [curLang, setCurLang] = useState("");
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [dateType, setDateType] = useState("");
  const [searchTextItem, setSearchTextItem] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [filteredItemsList, setFilteredItemsList] = useState([]);
  const [showSelectItemModal, setShowSelectItemModal] = useState(false);
  const [stNo, setStNo] = useState("");
  const [stName, setStName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("جاهزة");
  const [statusList, setStatusList] = useState([{ label: "جاهزة", value: "جاهزة" }, { label: "غير جاهزة", value: "غير جاهزة" }]);
  const [isFocusStatus, setIsFocusStatus] = useState(false);
  const [showOnlyOrdRep, setShowOnlyOrdRep] = useState(false);
  const [showInvDone, setShowInvDone] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [showSelectEmpModal, setShowSelectEmpModal] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [filteredEmpList, setFilteredEmpList] = useState([]);
  const [searchTextEmp, setSearchTextEmp] = useState("");
  const [selectedEmp, setSelectedEmp] = useState("");
  const [selectedEmpName, setSelectedEmpName] = useState("");
  const [showProdOrdersFiltersModal, setShowProdOrdersFiltersModal] = useState(false);
  const [showProdOrdersModal, setShowProdOrdersModal] = useState(false);
  const [prodOrdersList, setProdOrdersList] = useState([]);

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "@ramzialsaleh18/ArafatOrd",
        projectId: "c26b9c03-d6bf-4966-8f12-6fb9fa577ace"
      })
    ).data;
    console.log("token: " + token);
    console.log("projectID: " + Constants.expoConfig.extra.eas.projectId);

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  const registerUserToken = async () => {
    const userID = await Commons.getFromAS("userID");
    setProggressDialogVisible(true);
    registerForPushNotificationsAsync().then((token) => {
      console.log(token);
      callSendUserToken(userID, token);
    });
    setProggressDialogVisible(false);
  };

  const callSendUserToken = async (userID, token) => {
    setProggressDialogVisible(true);
    const resp = await ServerOperations.sendUserToken(userID, token);
    setProggressDialogVisible(false);
  };


  const showDatePicker = () => {
    setShowDatePickerModal(true);
    Platform.OS === "ios" ? onChangeDate(event, selectedDate) : null;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePickerModal(Platform.OS === "ios");
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    switch (dateType) {
      case 'fromDate':
        setFromDate(fDate);
        break;
      case 'toDate':
        setToDate(fDate);
        break;
    };
  }

  const renderSelectEmpModal = () => {
    return (
      <Modal
        visible={true}
        onDismiss={() => {
          setShowSelectEmpModal(false);
        }}
        contentContainerStyle={[styles.modalStyle, { height: "90%" }]}
      >
        <TextInput
          placeholder="Search"
          clearButtonMode="always"
          style={styles.searchBox}
          value={searchTextEmp}
          onChangeText={(text) => {
            setSearchTextEmp(text);
            const list = Commons.handleSearch(text, empList);
            setFilteredEmpList(list)
          }}
        />
        <FlatList
          keyExtractor={(item) => item.ID}
          data={filteredEmpList}
          extraData={filteredEmpList}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedEmp(item.ID);
                  setSelectedEmpName(item.NAME);
                  setShowSelectEmpModal(false);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 15,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ marginRight: 20, color: "red" }}>
                    {item.ID}
                  </Text>
                  <Text>{item.NAME}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
        <Button
          mode="contained"
          style={{ borderRadius: 0 }}
          onPress={() => {
            setShowSelectEmpModal(false);
          }}>
          <Text style={styles.text}>{i18n.t("back")}</Text>
        </Button>
      </Modal>
    )
  }

  const renderAddProcessModal = () => {
    return (
      <Modal
        visible={true}
        onDismiss={() => {
          setShowAddProcessModal(false);
          setSelectedEmp("");
          setSelectedEmpName("");
        }}
        contentContainerStyle={styles.modalStyle}
      >
        <TouchableOpacity
          onPress={() => setShowSelectEmpModal(true)}
          style={{ flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth }}
        >
          <TextInput
            label={i18n.t("selectEmp")}
            value={selectedEmpName}
            disabled={true}
            style={{ flex: 1, marginTop: 10 }}
          />
          <Ionicons
            name="search"
            size={22}
            style={{ position: "absolute", right: 10, bottom: 10 }}
            color={Constants2.appColor}
          />
        </TouchableOpacity>

        <Button
          style={styles.appButton}
          mode="contained"
          icon={"plus"}
          onPress={async () => {
            if (selectedEmp == "" || selectedEmp == null) {
              Commons.okAlert(i18n.t("emptyFieldsEmp"));
              return;
            }
            setProggressDialogVisible(true);
            const resp = await ServerOperations.addNewProdOrder(selectedEmp);
            if (resp.res == false) {
              Commons.okAlert(i18n.t("prodExistsForEmp"));
              setProggressDialogVisible(false);
              return;
            }
            if (resp.res == true) {
              Commons.okAlert(i18n.t("prodAdded"));
            }
            setShowAddProcessModal(false);
            setSelectedEmp("");
            setSelectedEmpName("");
            setProggressDialogVisible(false);
          }}
        >
          <Text style={styles.text}>
            {i18n.t("add")}
          </Text>
        </Button>
      </Modal>
    )
  }

  const renderStItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={async () => {
            setShowSelectItemModal(false);
            setStNo(item.ID);
            setStName(item.NAME);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 15,
              borderWidth: 0.5,
              borderRadius: 5,
              marginBottom: 5

            }}
          >
            <Text style={{ marginRight: 20, color: "red" }}>
              {item.ID}
            </Text>
            <Text>{item.NAME}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )

  }

  const renderProdOrdersFiltersModal = () => {
    return (
      <Modal
        visible={true}
        onDismiss={() => {
          setShowProdOrdersFiltersModal(false);
          setSelectedEmp("");
          setSelectedEmpName("");
        }}
        contentContainerStyle={styles.modalStyle}
      >
        <View>
          <Button
            mode="outlined"
            style={styles.dateTimeButtons}
            onPress={() => { setDateType("fromDate"); showDatePicker() }}
          >
            {i18n.t("fromDate")}
          </Button>
          <Text style={styles.dateTimeTexts}>{fromDate}</Text>
          <Button
            mode="outlined"
            style={styles.dateTimeButtons}
            onPress={() => { setDateType("toDate"); showDatePicker() }}
          >
            {i18n.t("toDate")}
          </Button>
          <Text style={styles.dateTimeTexts}>{toDate}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowSelectEmpModal(true)}
          style={{ flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth }}
        >
          <TextInput
            label={i18n.t("selectEmp")}
            value={selectedEmpName}
            disabled={true}
            style={{ flex: 1, marginTop: 10 }}
          />
          <Ionicons
            name="search"
            size={22}
            style={{ position: "absolute", right: 10, bottom: 10 }}
            color={Constants2.appColor}
          />
        </TouchableOpacity>

        <Button
          style={styles.appButton}
          mode="contained"
          onPress={async () => {
            setProggressDialogVisible(true);
            const orders = await ServerOperations.getProdOrders(fromDate, toDate, selectedEmp);
            setProdOrdersList(orders);
            setProggressDialogVisible(false);
            setShowProdOrdersFiltersModal(false);
            setShowProdOrdersModal(true);
          }}
        >
          <Text style={styles.text}>
            {i18n.t("view")}
          </Text>
        </Button>
      </Modal>
    )
  }
  const renderProdOrdersModal = () => {
    return (
      <Modal
        visible={true}
        onDismiss={() => setShowProdOrdersModal(false)}
        contentContainerStyle={[styles.modalStyle, { height: "90%" }]}
      >
        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: Constants2.appColor, color: "white", fontWeight: "bold", padding: 10, width: "100%" }}>
          {i18n.t("prodOrders")}
        </Text>

        <FlatList
          data={prodOrdersList}
          keyExtractor={(item) => item.ID}
          renderItem={({ item }) => (
            <TouchableOpacity style={{
              padding: 10,
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 5
            }} onPress={
              async () => {

                Alert.alert(
                  "هل تريد ترحيل هذا الامر؟",
                  "",
                  [
                    {
                      text: "نعم",
                      onPress: async () => {
                        setProggressDialogVisible(true);
                        const resp = await ServerOperations.postProdOrder(item.ID);
                        if (resp.res == true) {
                          Commons.okAlert("تم الترحيل بنجاح");
                        } else {
                          Commons.okAlert("لم يتم الترحيل");
                        }
                        setProggressDialogVisible(false);
                        setShowProdOrdersModal(false);
                      },
                    }

                  ],
                  { cancelable: true }
                )
              }
            }>
              <Text style={{ fontSize: 16, color: "red", textAlign: "center" }}>
                {item.ID}
              </Text>
              <Text style={{ marginVertical: 10, fontSize: 16, textAlign: "center" }}>
                {item.DATE}
              </Text>
              <Text style={{ fontSize: 16, textAlign: "center" }}>
                {item.EMP_NAME}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Button
          mode="contained"
          style={{ borderRadius: 0 }}
          onPress={() => setShowProdOrdersModal(false)}
        >
          <Text style={styles.text}>{i18n.t("back")}</Text>
        </Button>
      </Modal>
    )
  }

  const renderSelectItemModal = () => {
    return (
      <Modal
        visible={true}
        onDismiss={() => {
          setShowSelectItemModal(false);
        }}
        contentContainerStyle={[styles.modalStyle, { height: "90%" }]}
      >
        <TextInput
          placeholder={i18n.t("search")}
          clearButtonMode="always"
          style={styles.searchBox}
          value={searchTextItem}
          onChangeText={(text) => {
            setSearchTextItem(text);
            const list = Commons.handleSearch(text, itemsList);
            filteredItemsList(list);
          }}
        />
        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: Constants2.appColor, color: "white", fontWeight: "bold", padding: 10, width: "100%" }}>
          {i18n.t("items")}
        </Text>
        <FlatList
          keyExtractor={(item) => item.ID}
          data={filteredItemsList}
          extraData={filteredItemsList}
          renderItem={renderStItem}
        />
        <Button mode="contained" style={{ borderRadius: 0 }} onPress={async () => {
          setShowSelectItemModal(false);
        }}>
          <Text style={styles.text}>{i18n.t("back")}</Text>
        </Button>
      </Modal>
    )
  }


  useEffect(() => {
    registerUserToken();
    (async () => {
      setProggressDialogVisible(true);
      const list = await ServerOperations.getStockItems();
      setItemsList(list);
      setFilteredItemsList(list);
      let tempDate = new Date();
      let fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
      setFromDate(fDate);
      setToDate(fDate);

      const currentUser = await Commons.getFromAS("userID");
      setCurUser(currentUser);
      console.log(currentUser.substring(0, 7))
      if (currentUser.substring(0, 7) == 'IBRAHIM') {
        setShowOnlyOrdRep(true)
      }
      if (currentUser.substring(0, 4) == 'ORDR' || currentUser.substring(0, 7) == 'MUSTAFA' || currentUser.substring(0, 3) == 'GHB') {
        setShowInvDone(true)
      }
      const empList = await ServerOperations.getEmployees();
      if (empList != "" && empList != null && empList.length > 0) {
        setEmpList(empList);
        setFilteredEmpList(empList);
      }

      setProggressDialogVisible(false);
    })();
  }, []);

  useEffect(() => {
    let tempDate = new Date();
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setFromDate(fDate);
    setToDate(fDate);
  }, [showFiltersModal, showOrdFiltersModal]);

  const clearStorage = async () => {
    await Commons.removeFromAS("userID");
    await Commons.removeFromAS("password");
    const user = await Commons.getFromAS("userID");
    console.log(user);
    navigation.navigate("Login");
    // BackHandler.exitApp();
  };

  const printToFile = async (html) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };


  const getCurUser = async () => {
    const currentUser = await Commons.getFromAS("userID");
    console.log("user = " + currentUser)
    if (currentUser == null) {
      clearStorage();
      Commons.okAlert("User Not Logged in");
    }
    setCurUser(currentUser);
  };

  const renderFiltersModal = () => {
    return (
      <Modal
        visible={true}
        onDismiss={() => { setShowFiltersModal(false); setStNo(""); setStName(""); }}
        contentContainerStyle={styles.modalStyle}
      >
        <View>
          <Button
            mode="outlined"
            style={styles.dateTimeButtons}
            onPress={() => { setDateType("fromDate"); showDatePicker() }}
          >
            {i18n.t("fromDate")}
          </Button>
          <Text style={styles.dateTimeTexts}>{fromDate}</Text>
          <Button
            mode="outlined"
            style={styles.dateTimeButtons}
            onPress={() => { setDateType("toDate"); showDatePicker() }}
          >
            {i18n.t("toDate")}
          </Button>
          <Text style={styles.dateTimeTexts}>{toDate}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSelectItemModal(true)} style={{ flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth }}>
          <TextInput
            label={i18n.t("stNo")}
            value={stName + " - " + stNo}
            disabled={true}
            style={{ flex: 1, marginTop: 10 }}
          />
          <Ionicons name="search" size={22} style={{ position: "absolute", right: 10, bottom: 10 }} color={Constants.appColor} />
        </TouchableOpacity>
        <Button
          style={styles.appButton}
          mode="contained"
          onPress={() => {
            setShowFiltersModal(false);
            setStNo(""); setStName("");
            navigation.navigate("MyOrders", {
              fromDate: fromDate,
              toDate: toDate,
              stNo: stNo,
            });
          }}
        >
          <Text style={styles.text}>
            {i18n.t("show")}
          </Text>
        </Button>
      </Modal>
    )
  }
  const renderOrdFiltersModal = () => {
    return (
      <Modal
        visible={true}
        onDismiss={() => { setShowOrdFiltersModal(false); }}
        contentContainerStyle={styles.modalStyle}
      >
        <View>
          <Button
            mode="outlined"
            style={styles.dateTimeButtons}
            onPress={() => { setDateType("fromDate"); showDatePicker() }}
          >
            {i18n.t("date")}
          </Button>
          <Text style={styles.dateTimeTexts}>{fromDate}</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: width / 10, marginTop: 20 }}>
          <Text style={{ fontSize: 16, alignSelf: "center" }}>
            {i18n.t("status")}
          </Text>
          <Dropdown
            data={statusList}
            value={selectedStatus}
            maxHeight={200}
            onChange={(item) => {
              setSelectedStatus(item.value);
              setIsFocusStatus(false);
            }}
            labelField="label"
            valueField="value"
            style={[styles.dropdown, isFocusStatus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            placeholder={selectedStatus}
          />
        </View>
        <Button
          style={styles.appButton}
          mode="contained"
          onPress={() => {
            setShowOrdFiltersModal(false);
            navigation.navigate("OrdersReport", {
              fromDate: fromDate,
              status: selectedStatus
            });
          }}
        >
          <Text style={styles.text}>
            {i18n.t("show")}
          </Text>
        </Button>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={styles.view} >
      <ProgressDialog visible={progressDialogVisible} />
      <Portal>
        {!!showDatePickerModal && (
          <Modal
            visible={true}
            onDismiss={() => setShowDatePickerModal(false)}
            contentContainerStyle={styles.modalStyle}
          >
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode={"date"}
              display="default"
              onChange={onChangeDate}
              style={styles.datetimepickerstyle}
            />
          </Modal>
        )}
      </Portal>
      <Portal>{!!showFiltersModal && renderFiltersModal()}</Portal>
      <Portal>{!!showOrdFiltersModal && renderOrdFiltersModal()}</Portal>
      <Portal>{!!showSelectItemModal && renderSelectItemModal()}</Portal>
      <Portal>{!!showAddProcessModal && renderAddProcessModal()}</Portal>
      <Portal>{!!showProdOrdersFiltersModal && renderProdOrdersFiltersModal()}</Portal>
      <Portal>{!!showProdOrdersModal && renderProdOrdersModal()}</Portal>
      <Portal>{!!showSelectEmpModal && renderSelectEmpModal()}</Portal>
      <ProgressDialog visible={progressDialogVisible} />
      {/* <Image style={styles.image} source={require("../../assets/logo.png")} /> */}
      <ScrollView contentContainerStyle={styles.container}>
        {!showOnlyOrdRep && (
          <View style={{ width: '100%' }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NewOrder");
              }}
              style={styles.appButtonContainer(curLang)}
            >
              <Text style={styles.text2}>
                {i18n.t("newOrd")}
              </Text>
              <Ionicons name="add-circle" style={{ marginHorizontal: 12 }} size={26} color={Constants2.appColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.appButtonContainer(curLang)}
              onPress={() => {
                //navigation.navigate("MyOrders");
                setShowFiltersModal(true);
              }}
            >
              <Text style={styles.text2}>
                {i18n.t("myOrders")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.appButtonContainer(curLang)}
              onPress={async () => {

                Alert.alert(
                  "هل تريد الطباعة ام تحميل الملف",
                  "",
                  [
                    {
                      text: "طباعة",
                      onPress: async () => {
                        const currentUser = await Commons.getFromAS("userID");
                        setProggressDialogVisible(true);
                        const resp = await ServerOperations.itemsToBeManuReport(currentUser, "Y");
                        if (resp.res == true) {
                          Commons.okAlert(i18n.t("sent"))
                        } else {
                          Commons.okAlert(i18n.t("notSent"))
                        }
                        setProggressDialogVisible(false);
                      },
                    },
                    {
                      text: "تحميل",
                      onPress: async () => {
                        const currentUser = await Commons.getFromAS("userID");
                        setProggressDialogVisible(true);
                        const resp = await ServerOperations.itemsToBeManuReport(currentUser, 'N');
                        if (resp.res == true) {
                          printToFile(resp.HTML);
                        } else {
                          Commons.okAlert(i18n.t("notSent"))
                        }
                        setProggressDialogVisible(false);
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
            >
              <Text style={styles.text2}>
                {i18n.t("itemsToBeManu")}
              </Text>
            </TouchableOpacity>
          </View>)}
        {showOnlyOrdRep && (<TouchableOpacity
          style={styles.appButtonContainer(curLang)}
          onPress={() => { setShowOrdFiltersModal(true); }}
        >
          <Text style={styles.text2}>
            {i18n.t("ordersReport")}
          </Text>
        </TouchableOpacity>)}
        {showInvDone && (
          <TouchableOpacity
            style={styles.appButtonContainer(curLang)}
            onPress={() => {
              navigation.navigate("WorkshopItems");
            }}
          >
            <Text style={styles.text2}>
              {i18n.t("workshopItems")}
            </Text>
          </TouchableOpacity>
        )}
        {(curUser.substring(0, 7) == 'MUSTAFA' || curUser.substring(0, 3) == 'GHB') && (
          <TouchableOpacity
            style={styles.appButtonContainer(curLang)}
            onPress={() => {
              navigation.navigate("ItemsToBeApproved");
            }}
          >
            <Text style={styles.text2}>
              {i18n.t("itemsToBeApproved")}
            </Text>
          </TouchableOpacity>
        )}
        {showInvDone && (
          <TouchableOpacity
            style={styles.appButtonContainer(curLang)}
            onPress={() => {
              navigation.navigate("MinusQtyItems");
            }}
          >
            <Text style={styles.text2}>
              {i18n.t("minusQtyItems")}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.appButtonContainer(curLang)}
          onPress={() => setShowAddProcessModal(true)}
        >
          <Text style={styles.text2}>
            {i18n.t("addNewProcess")}
          </Text>
          <Ionicons name="add-circle" style={{ marginHorizontal: 12 }} size={26} color={Constants2.appColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.appButtonContainer(curLang)}
          onPress={() => { setShowProdOrdersFiltersModal(true); setSelectedEmp(""); setSelectedEmpName(""); }}
        >
          <Text style={styles.text2}>
            {i18n.t("viewProdOrders")}
          </Text>
          <Ionicons name="list" style={{ marginHorizontal: 12 }} size={26} color={Constants2.appColor} />
        </TouchableOpacity>
      </ScrollView>
      <View style={{ backgroundColor: Constants2.appColor, width: "100%", height: height / 10, flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={clearStorage}
          style={{
            flexDirection: curLang == "ar" ? "row-reverse" : "row",
            padding: 10,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: Color.WHITE,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", marginHorizontal: 5 }}>
            {i18n.t("logout")}
          </Text>
          <Ionicons color="white" size={24} name="log-out" />
        </TouchableOpacity>
        <Text style={{ alignSelf: "center", color: "white" }}>
          {Constants2.appVersion}
        </Text>
        <TouchableOpacity
          onPress={() => {
            actions.switchLanguage(i18n.t("changeLang"));
            Updates.reloadAsync();
          }}
          style={{
            flexDirection: curLang == "ar" ? "row-reverse" : "row",
            padding: 10,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: Color.WHITE,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", marginHorizontal: 5 }}>
            {i18n.t("changeLang")}
          </Text>
          <Ionicons color="white" size={24} name="language" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  datetimepickerstyle: {
    alignSelf: "center",
    width: 100,
    padding: 15,
  },
  mainPicker: {
    height: Platform.OS === "ios" ? 150 : 50,
    marginTop: Platform.OS === "ios" ? -75 : 0,
    width: 160,
    marginRight: Platform.OS === "ios" ? "70%" : "30%",
  },
  locPicker: {
    height: Platform.OS === "ios" ? 150 : 50,
    marginTop: Platform.OS === "ios" ? -95 : -15,
    margin: 25,
    flex: 2,
    width: 300,
    marginRight: "10%",
  },
  typePicker: {
    height: Platform.OS === "ios" ? 150 : 50,
    marginTop: Platform.OS === "ios" ? -50 : -15,
    marginBottom: Platform.OS === "ios" ? 40 : 25,
    margin: 25,
    flex: 2,
    width: 300,
    marginRight: "10%",
  },
  typePicker2: {
    height: Platform.OS === "ios" ? 150 : 50,
    marginTop: Platform.OS === "ios" ? -55 : -15,
    marginBottom: Platform.OS === "ios" ? 40 : 25,
    alignSelf: "center",
    margin: 25,
    width: 300,
    marginRight: "10%",
  },
  searchBox: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "center"
  },
  dateTimeTexts: {
    fontSize: 18,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  dateTimeButtons: {
    borderColor: "rgb(1,135,134)",
  },
  modalStyle: {
    backgroundColor: "white",
    padding: 20,
    zIndex: 1
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  appButtonContainer: curLang => ({
    width: '85%',
    margin: 2,
    marginBottom: 12,
    backgroundColor: Color.GREY[50],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.GREY[500],
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: White,
    flexDirection: curLang == "ar" ? "row-reverse" : "row",
    alignSelf: 'center',
  }),
  container: {
    backgroundColor: Color.GREY[100],
    alignItems: 'center',
    paddingTop: 80,
    minHeight: height - height / 10
  },
  text: {
    fontSize: 16, color: "white", fontWeight: "bold"
  },
  text2: {
    fontSize: 18, marginHorizontal: 4
  },
  appButton: {
    margin: 20,
  },
  image: {
    width: 150,
    height: 155,
    marginBottom: 20,
    alignSelf: "center",
    marginTop: -75,
  },
  image2: {
    width: 350,
    height: 285,
    alignSelf: "center",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 10,
    flex: 0.8
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

//export default MainScreen;
