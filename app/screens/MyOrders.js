import React, { useState, useEffect } from "react";
import { Button, Card, Modal, Portal, TextInput } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import * as ServerOperations from "../utils/ServerOperations";
import * as Commons from "../utils/Commons";
import * as SecureStore from "expo-secure-store";
import * as Constants from "../utils/Constants";
import * as Localization from "expo-localization";
import Color, { White } from 'react-native-material-color';
import ProgressDialog from "react-native-progress-dialog";
import {
    SafeAreaView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    FlatList,
    Alert,
    Pressable
} from "react-native";
import { WebView } from 'react-native-webview';
import i18n from "../languages/langStrings";
import { loginTheme } from "../../App.style";
import { Ionicons } from "@expo/vector-icons";
import { height, width } from "../utils/Styles";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Checkbox from 'expo-checkbox';

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };
// interface Props {
//   navigation: any
// }

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
);

export const MyOrdersScreen = ({ navigation, route }) => {
    const [progressDialogVisible, setProggressDialogVisible] = useState(false);
    const [ordersList, setOrdersList] = useState([]);
    const [filteredOrdersList, setFilteredOrdersList] = useState([]);
    const [curLang, setCurLang] = useState("");
    const [curUser, setCurUser] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchTextEmp, setSearchTextEmp] = useState("");
    const [searchTextBag, setSearchTextBag] = useState("");
    const [searchTextProd, setSearchTextProd] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [mixWt, setMixWt] = useState("");
    const [qtyToMain, setQtyToMain] = useState("");
    const [showWebView, setShowWebView] = useState(false);
    const [showMixModal, setShowMixModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [htmlData, setHtmlData] = useState("");
    const [selectedOrd, setSelectedOrd] = useState("");
    const [selectedStNo, setSelectedStNo] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [printBags, setPrintBags] = useState(false);
    const [printNamelessBags, setPrintNamelessBags] = useState(false);
    const [printOutsideBags, setPrintOutsideBags] = useState(false);
    const [isNamelessBag, setIsNamelessBag] = useState(false);
    const [isDirect, setIsDirect] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState("");
    const [selectedBag, setSelectedBag] = useState("");
    const [selectedEmpName, setSelectedEmpName] = useState("");
    const [selectedBagName, setSelectedBagName] = useState("");
    const [selectedEmpList, setSelectedEmpList] = useState([]);
    const [selectedBagsList, setSelectedBagsList] = useState([]);
    const [selectedProd, setSelectedProd] = useState("");
    const [selectedProdName, setSelectedProdName] = useState("");
    const [selProdList, setSelProdList] = useState([]);
    const [showSelectEmpModal, setShowSelectEmpModal] = useState(false);
    const [showSelectBagModal, setShowSelectBagModal] = useState(false);
    const [showSelectProdModal, setShowSelectProdModal] = useState(false);
    const [prodList, setProdList] = useState([]);
    const [filteredProdList, setFilteredProdList] = useState([]);
    const [empList, setEmpList] = useState([]);
    const [bagsList, setBagsList] = useState([]);
    const [filteredEmpList, setFilteredEmpList] = useState([]);
    const [filteredBagsList, setFilteredBagsList] = useState([]);
    const [prodQty, setProdQty] = useState("");
    const [showAddProdModal, setShowAddProdModal] = useState(false);
    const [showAddBagsModal, setShowAddBagsModal] = useState(false);


    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            if (isFocused) {
                const user = await Commons.getFromAS("userID");
                setCurUser(user);
                const orders = await ServerOperations.getMyOrders(user, route.params.fromDate, route.params.toDate, route.params.stNo);
                if (orders != "" && orders != null && orders.length > 0) {
                    setOrdersList(orders);
                    setFilteredOrdersList(orders);
                }
            }
        })();
    }, [isFocused, refresh]);

    useEffect(() => {
        (async () => {
            if (isFocused) {
                const curLang = await Commons.getFromAS("lang");
                setCurLang(curLang);
                const user = await Commons.getFromAS("userID");
                setCurUser(user);
                // const orders = await ServerOperations.getMyOrders(user, route.params.fromDate, route.params.toDate, route.params.stNo);
                // if (orders != "" && orders != null && orders.length > 0) {
                //     setOrdersList(orders);
                //     setFilteredOrdersList(orders);
                // }

                const prodList = await ServerOperations.getProdProcesses();
                if (prodList != "" && prodList != null && prodList.length > 0) {
                    setProdList(prodList);
                    setFilteredProdList(prodList);
                }
                const empList = await ServerOperations.getEmployees();
                if (empList != "" && empList != null && empList.length > 0) {
                    setEmpList(empList);
                    setFilteredEmpList(empList);
                }
            }
        })();
    }, [isFocused]);
    const renderAddProdModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowAddProdModal(false);
                }}
                contentContainerStyle={[styles.modalStyle]}
            >
                <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: Constants.appColor, color: "white", fontWeight: "bold", padding: 10, width: "100%" }}>
                    {i18n.t("prodProcesses")}
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <Pressable onPress={() => { setShowSelectEmpModal(true); setShowAddProdModal(false) }} style={{ flex: 0.6, marginRight: 10 }}>
                        <View pointerEvents="none">
                            <TextInput
                                label={i18n.t("emp")}
                                value={selectedEmpName}
                            />
                        </View>
                    </Pressable>
                    <Button mode="contained" style={{ marginTop: 20, flex: 0.4 }} icon="plus"
                        onPress={async () => {
                            addToEmpList(selectedEmp, selectedEmpName);
                            setSelectedEmp("");
                            setSelectedEmpName("");

                        }}>
                        <Text style={styles.text}> {i18n.t("addEmp")} </Text>
                    </Button>
                </View>
                <FlatList
                    keyExtractor={item => (item.id)}
                    data={selectedEmpList}
                    style={{ height: height / 6, backgroundColor: "#ececec" }}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={{
                                    paddingHorizontal: 15,
                                    marginHorizontal: width / 10,
                                    marginTop: 10,
                                    backgroundColor: Color.GREY[50],
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: Color.GREY[500],
                                }}
                            >
                                <View style={{ alignSelf: "center", marginBottom: 10 }}>
                                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                </View>
                                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0 }} onPress={() => {
                                    Commons.confirmAlert(i18n.t("areYouSure"), "", () => {
                                        deleteFromSelEmpList(item.id);
                                    })
                                }}>
                                    <Ionicons name="trash" size={18} color="white" style={{ color: "red", borderRadius: 0, padding: 5 }} />
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
                <View style={{ flexDirection: "row" }}>
                    <Pressable onPress={() => { setShowSelectProdModal(true);; setShowAddProdModal(false) }} style={{ flex: 0.8, marginRight: 10 }}>
                        <View pointerEvents="none">
                            <TextInput
                                label={i18n.t("prodProcess")}
                                value={selectedProdName}
                            />
                        </View>
                    </Pressable>
                    <TextInput
                        label={i18n.t("qty")}
                        value={prodQty}
                        onChangeText={setProdQty}
                        keyboardType="numeric"
                        style={{ flex: 0.2 }}
                    />
                </View>
                <Button mode="contained" style={{ marginTop: 20, marginHorizontal: width / 10 }} icon="plus"
                    onPress={async () => {
                        addToProdList(selectedProd, selectedProdName, prodQty);
                        setSelectedProd("")
                        setSelectedProdName("")
                        setProdQty("")
                    }}>
                    <Text style={styles.text}> {i18n.t("addProd")} </Text>
                </Button>
                <FlatList
                    keyExtractor={item => (item.prod + item.qty)}
                    data={selProdList}
                    style={{ height: height / 5, backgroundColor: "#ececec" }}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={{
                                    paddingHorizontal: 15,
                                    paddingVertical: 25,
                                    marginHorizontal: width / 10,
                                    marginTop: 10,
                                    backgroundColor: Color.GREY[50],
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: Color.GREY[500],
                                }}
                            >
                                <View style={{ alignSelf: "center", marginBottom: 10 }}>
                                    <Text style={{ fontSize: 16 }}>{item.prodName}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: width / 6 }}>
                                    <Text>{i18n.t("qty")}</Text>
                                    <Text>{item.qty}</Text>
                                </View>
                                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0 }} onPress={() => {
                                    Commons.confirmAlert(i18n.t("areYouSure"), "", () => {
                                        deleteFromSelProdList(item.prod + item.qty);
                                    })
                                }}>
                                    <Ionicons name="trash" size={18} color="white" style={{ color: "red", borderRadius: 0, padding: 5 }} />
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
                <Button mode="contained" style={{ marginTop: 10, marginHorizontal: width / 10 }} icon="content-save"
                    onPress={async () => {
                        let emps = ""
                        let prods = ""
                        if (selectedEmpList.length > 0 && selProdList.length > 0) {
                            selectedEmpList.map((emp) => {
                                emps = emps + emp.id + "@@"
                            })
                            selProdList.map((prd) => {
                                prods = prods + prd.prod + ";;" + prd.qty + "@@"
                            })
                            emps = emps.substring(0, emps.length - 2)
                            prods = prods.substring(0, prods.length - 2)
                        } else {
                            Commons.okAlert(i18n.t("emptyFieldsGeneral"))
                            return;
                        }
                        console.log(emps);
                        console.log(prods);
                        console.log(selectedOrd)
                        const resp = await ServerOperations.addToProdOrder(emps, prods, selectedStNo, curUser, selectedOrd);
                        if (resp.res == true) {
                            Commons.okAlert(i18n.t("prodsSaved"));
                        } else {
                            if (resp.res == "notFound") {
                                Commons.okAlert("لا يوجد امر انتاجي معرف للموظف المدخل");
                            } else {
                                Commons.okAlert("لم يتم الارسال, حاول مرة اخرى");
                            }
                        }
                        setSelectedEmpList([]);
                        setSelProdList([]);
                        setShowAddProdModal(false);
                    }}>
                    <Text style={styles.text}> {i18n.t("save")} </Text>
                </Button>
            </Modal>
        )
    }
    const renderAddBagsModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowAddBagsModal(false);
                }}
                contentContainerStyle={[styles.modalStyle]}
            >
                <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: Constants.appColor, color: "white", fontWeight: "bold", padding: 10, width: "100%" }}>
                    {i18n.t("addBags")}
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <Pressable onPress={() => { setShowSelectBagModal(true); setShowAddBagsModal(false) }} style={{ flex: 0.6, marginRight: 10 }}>
                        <View pointerEvents="none">
                            <TextInput
                                label={i18n.t("addBag")}
                                value={selectedBagName}
                            />
                        </View>
                    </Pressable>
                    <Button mode="contained" style={{ marginTop: 20, flex: 0.4 }} icon="plus"
                        onPress={async () => {
                            addToBagList(selectedBag, selectedBagName);
                            setSelectedBag("");
                            setSelectedBagName("");

                        }}>
                        <Text style={styles.text}> {i18n.t("add")} </Text>
                    </Button>
                </View>
                <FlatList
                    keyExtractor={item => (item.ST_NO)}
                    data={selectedBagsList}
                    style={{ height: height / 6, backgroundColor: "#ececec" }}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={{
                                    paddingHorizontal: 15,
                                    marginHorizontal: width / 10,
                                    marginTop: 10,
                                    backgroundColor: Color.GREY[50],
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: Color.GREY[500],
                                }}
                            >
                                <View style={{ alignSelf: "center", marginBottom: 10 }}>
                                    <Text style={{ fontSize: 16 }}>{item.ST_NAME}</Text>
                                </View>
                                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0 }} onPress={() => {
                                    Commons.confirmAlert(i18n.t("areYouSure"), "", () => {
                                        deleteFromSelBagsList(item.ST_NO);
                                    })
                                }}>
                                    <Ionicons name="trash" size={18} color="white" style={{ color: "red", borderRadius: 0, padding: 5 }} />
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />

                <Button mode="contained" style={{ marginTop: 10, marginHorizontal: width / 10 }} icon="content-save"
                    onPress={async () => {
                        let bags = ""
                        if (selectedBagsList.length > 0 && selectedBagsList.length > 0) {
                            selectedBagsList.map((bag) => {
                                bags = bags + bag.ST_NO + "@@"
                            })
                            bags = bags.substring(0, bags.length - 2)
                        }
                        console.log(bags);
                        const resp = await ServerOperations.saveBags(selectedOrd, bags)
                        if (resp.res) {
                            Commons.okAlert("تم الحفظ");
                            setSelectedEmpList([]);
                            setShowAddBagsModal(false);
                            setRefresh(!refresh);
                        } else {
                            Commons.okAlert("لم يتم الحفظ, حاول مرة اخرى");
                        }
                    }}>
                    <Text style={styles.text}> {i18n.t("save")} </Text>
                </Button>
            </Modal>
        )
    }
    const renderPrintModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowPrintModal(false);
                }}
                contentContainerStyle={[styles.modalStyle]}
            >
                <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: Constants.appColor, color: "white", fontWeight: "bold", padding: 10, width: "100%" }}>
                    هل تريد الطباعة ام تحميل الملف
                </Text>
                {/* <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
                    <Text style={{ marginRight: 10 }}>
                        الاكياس
                    </Text>
                    <Checkbox
                        style={{ alignSelf: "center" }}
                        value={printBags}
                        onValueChange={setPrintBags}
                        color={printBags ? Constants.appColor : undefined}
                    />
                </View>
                <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
                    <Text style={{ marginRight: 10 }}>
                        الاكياس بدون اسم
                    </Text>

                    <Checkbox
                        style={{ alignSelf: "center" }}
                        value={printNamelessBags}
                        onValueChange={setPrintNamelessBags}
                        color={printNamelessBags ? Constants.appColor : undefined}
                    />
                </View>
                <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
                    <Text style={{ marginRight: 10 }}>
                        الاكياس الخارجية
                    </Text>
                    <Checkbox
                        style={{ alignSelf: "center" }}
                        value={printOutsideBags}
                        onValueChange={setPrintOutsideBags}
                        color={printOutsideBags ? Constants.appColor : undefined}
                    />
                </View> */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Button mode="contained" style={{ marginTop: 20, flex: 0.4 }}
                        onPress={async () => {
                            let bags = ""
                            if (selectedBagsList.length > 0 && selectedBagsList.length > 0) {
                                selectedBagsList.map((bag) => {
                                    bags = bags + bag.ST_NO + "@@"
                                })
                                bags = bags.substring(0, bags.length - 2)
                            }
                            console.log(bags);
                            const resp = await ServerOperations.sendToPrinter(selectedOrd, bags);
                            console.log(resp);
                            if (resp.res == true) {
                                Commons.okAlert(i18n.t("sent"));
                            }
                            setShowPrintModal(false);
                        }}>
                        <Text style={styles.text}> طباعة </Text>
                    </Button>
                    <Button mode="contained" style={{ marginTop: 20, flex: 0.4 }}
                        onPress={async () => {
                            let bags = ""
                            if (selectedBagsList.length > 0 && selectedBagsList.length > 0) {
                                selectedBagsList.map((bag) => {
                                    bags = bags + bag.ST_NO + "@@"
                                })
                                bags = bags.substring(0, bags.length - 2)
                            }
                            console.log(bags);
                            const res = await ServerOperations.printOrder(selectedOrd, bags);
                            console.log("res: " + res.HTML);
                            setHtmlData(res);
                            //setShowWebView(true);
                            printToFile(res.HTML);
                            setShowPrintModal(false);
                        }}>
                        <Text style={styles.text}> تحميل </Text>
                    </Button>
                </View>
            </Modal>
        )
    }

    const deleteOrder = (idToDelete) => {
        Commons.deleteFromOrderSummary(idToDelete);
        setFilteredOrdersList((prevArray) => prevArray.filter((item) => item.ID !== idToDelete));
        setOrdersList((prevArray) => prevArray.filter((item) => item.ID !== idToDelete));
    }

    const printToFile = async (html) => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({ html });
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };

    const renderOrdersItem = ({ item }) => {
        return (
            <TouchableOpacity style={{}} onPress={async () => {
                setProggressDialogVisible(true);
                const res = await ServerOperations.checkIsOrdPosted(item.ID, item.ST_NO);
                if (res.res) {
                    setSelectedOrd(item.ID);
                    setMixWt("");
                    setQtyToMain("");
                    setSelectedStNo(item.ST_NO);
                    setShowMixModal(true);
                    setSelectedEmpList([]);
                    setSelProdList([])
                } else {
                    if (res.msg) {
                        Commons.okAlert(res.msg);
                    } else {
                        Commons.okAlert("الطلب مرحل");
                    }
                }
                setProggressDialogVisible(false)
            }
            }>
                <View
                    style={{
                        padding: 15,
                        marginBottom: 10,
                        backgroundColor: Color.GREY[50],
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Color.GREY[500],
                    }}
                >
                    <View style={{ paddingTop: 25, flexDirection: "row" }}>
                        <TouchableOpacity style={{ position: "absolute", bottom: 5, right: 0 }} onPress={async () => {
                            //const isEmpty = await ServerOperations.checkIsOrdPosted(item.ID, item.ST_NO);
                            //if (isEmpty.res) {
                            setSelectedOrd(item.ID);
                            setShowPrintModal(true);
                            // } else {
                            //    Commons.okAlert("الطلب مرحل");
                            // }
                        }}>
                            <Ionicons name="print" size={18} color="white" style={{ backgroundColor: Constants.appColor, borderRadius: 0, padding: 8 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ position: "absolute", bottom: 5, left: 0 }} onPress={async () => {
                            const isEmpty = await ServerOperations.checkIsOrdPosted(item.ID, item.ST_NO);
                            if (isEmpty.res) {
                                Alert.alert(
                                    "هل تريد حذف طلب الشراء",
                                    "",
                                    [
                                        {
                                            text: "حذف",
                                            onPress: async () => {
                                                setProggressDialogVisible(true);
                                                const res = await ServerOperations.deletePurOrder(item.ID);
                                                if (res.res) {
                                                    deleteFromOrdList(item.ID);
                                                    Commons.okAlert("تم الحذف")
                                                } else {
                                                    Commons.okAlert("لم يتم الحذف الرجاء المحاولة مرة اخرى")
                                                }
                                                setProggressDialogVisible(false);
                                            },
                                        },
                                    ],
                                    { cancelable: true }
                                );
                            } else {
                                Commons.okAlert("الطلب مرحل")
                            }
                        }}>
                            <Ionicons name="trash" size={18} color="white" style={{ backgroundColor: "red", borderRadius: 0, padding: 8 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginRight: 20, color: "red", alignSelf: "center", marginBottom: 15 }}>
                        {item.ID}
                    </Text>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("dlvDate")}{" "}</Text>
                        <Text>{item.DLV_DATE}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("stNo")}{" "}</Text>
                        <Text>{item.ST_NAME} {"-"} {item.ST_NO} </Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("qty")}{" "}</Text>
                        <Text>{item.REQ_QTY}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("formCnt")}{" "}</Text>
                        <Text>{item.FORM_CNT}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("formSum")}{" "}</Text>
                        <Text>{item.FORM_SUM}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("entryDest")}{" "}</Text>
                        <Text>{item.ENTRY_DEST}</Text>
                    </View>
                    {(curUser.substring(0, 7) == 'MUSTAFA' || curUser.substring(0, 3) == 'GHB') && (<View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
                        {item.IS_SENT_TO_APPROVALS !== 'Y' && (<Button mode="contained" style={{ alignSelf: "center" }} icon="send" onPress={async () => {
                            const resp = await ServerOperations.sendItemToApprovals(item.ID, 'Y');
                            if (resp.res) {
                                setRefresh(!refresh)
                                Commons.okAlert("تم الارسال");
                            } else {
                                Commons.okAlert("لم يتم الارسال, حاول مرة اخرى");
                            }
                        }} >
                            ارسال المادة للموافقات
                        </Button>)}
                    </View>)}
                    {(curUser.substring(0, 4) == 'ORDR' || curUser.substring(0, 7) == 'MUSTAFA' || curUser.substring(0, 3) == 'GHB') && (<Button mode="contained" color={Constants.greenColor} labelStyle={{ color: "white" }} style={{ marginTop: 10, marginHorizontal: width / 10 }} icon="plus"
                        onPress={async () => {
                            //setSelectedProd(item.ID);
                            //setSelectedProdName(item.NAME);
                            setSelectedStNo(item.ST_NO);
                            setSelectedOrd(item.ID);
                            setShowAddProdModal(true);
                        }}>
                        <Text style={styles.text}> {i18n.t("prodProcesses")} </Text>
                    </Button>)}
                    <Button mode="contained" color={Constants.greenColor} labelStyle={{ color: "white" }} style={{ marginTop: 10, marginHorizontal: width / 10 }} icon="plus"
                        onPress={async () => {
                            const res = await ServerOperations.checkIsOrdPosted(item.ID, item.ST_NO);
                            if (res.res) {
                                setSelectedStNo(item.ST_NO);
                                setSelectedOrd(item.ID);
                                setSelectedBagsList([]);
                                setBagsList(res.ITEMS);
                                setFilteredBagsList(res.ITEMS);
                                setShowAddBagsModal(true);
                            } else {
                                Commons.okAlert("الطلب مرحل");
                            }
                        }}>
                        <Text style={styles.text}> {i18n.t("addBags")} </Text>
                    </Button>
                    <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
                        <Text style={{ marginRight: 10 }}>
                            بدون اكياس
                        </Text>

                        <Checkbox
                            style={{ alignSelf: "center" }}
                            value={!item.BAGS}
                            onValueChange={async () => {
                                if (item.BAGS != '') {
                                    setProggressDialogVisible(true)
                                    const resp = await ServerOperations.saveBags(item.ID, '');
                                    setRefresh(!refresh);
                                    setProggressDialogVisible(false)
                                }
                            }}
                            color={!item.BAGS ? Constants.appColor : undefined}
                        />
                    </View>
                </View>
            </TouchableOpacity >
        )
    }

    const addToProdList = (prod, prodName, qty) => {
        console.log(selProdList);
        if (prod == "" || qty == "") {
            Commons.okAlert(i18n.t("emptyFields"))
            return;
        }
        let newArray = [...selProdList];
        if (selProdList.length > 0) {
            const containsQuery = selProdList.some((comp) =>
                comp.prod.includes(prod)
            );
            if (containsQuery) {
                Commons.okAlert(i18n.t("prodExists"))
                return;
            }
            if (newArray[0].prod == undefined || newArray[0].qty == undefined) {
                newArray = newArray.slice(1);
            }
        }
        newArray.push({ prod: prod, prodName: prodName, qty: qty });
        setSelProdList(newArray);
    }
    const addToEmpList = (id, name) => {
        if (id == "" || name == "") {
            Commons.okAlert(i18n.t("emptyFieldsEmp"))
            return;
        }
        let newArray = [...selectedEmpList];
        if (selectedEmpList.length > 0) {
            const containsQuery = selectedEmpList.some((comp) =>
                comp.id.includes(id)
            );
            if (containsQuery) {
                Commons.okAlert(i18n.t("empExists"))
                return;
            }
            if (newArray[0].id == undefined || newArray[0].name == undefined) {
                newArray = newArray.slice(1);
            }
        }
        newArray.push({ id, name });
        setSelectedEmpList(newArray);
    }

    const addToBagList = (ST_NO, ST_NAME) => {
        if (ST_NO == "" || ST_NAME == "") {
            Commons.okAlert(i18n.t("emptyFieldsBags"))
            return;
        }
        let newArray = [...selectedBagsList];
        if (selectedBagsList.length > 0) {
            const containsQuery = selectedBagsList.some((comp) =>
                comp.ST_NO.includes(ST_NO)
            );
            if (containsQuery) {
                Commons.okAlert(i18n.t("bagExists"))
                return;
            }
            if (newArray[0].ST_NO == undefined || newArray[0].ST_NAME == undefined) {
                newArray = newArray.slice(1);
            }
        }
        newArray.push({ ST_NO, ST_NAME });
        setSelectedBagsList(newArray);
        console.log(newArray)
    }

    const renderMixModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowMixModal(false);
                }}
                contentContainerStyle={[styles.modalStyle]}
            >
                <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: Constants.appColor, color: "white", fontWeight: "bold", padding: 10, width: "100%" }}>
                    {i18n.t("inputMixWt")}
                </Text>
                <TextInput
                    label={i18n.t("mixWt")}
                    value={mixWt}
                    onChangeText={setMixWt}
                    keyboardType="numeric"
                    style={{ marginHorizontal: width / 10, marginTop: 10 }}
                />
                <TextInput
                    label={i18n.t("qtyToMain")}
                    value={qtyToMain}
                    onChangeText={setQtyToMain}
                    keyboardType="numeric"
                    style={{ marginHorizontal: width / 10, marginTop: 10 }}
                />
                <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
                    <Text style={{ marginRight: 10 }}>
                        ادخال مباشر للمستودع الرئيسي
                    </Text>

                    <Checkbox
                        style={{ alignSelf: "center" }}
                        value={isDirect}
                        onValueChange={setIsDirect}
                        color={isDirect ? Constants.appColor : undefined}
                    />
                </View>
                {/* <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
                    <Text style={{ marginRight: 10 }}>
                        اكياس بدون اسم
                    </Text>

                    <Checkbox
                        style={{ alignSelf: "center" }}
                        value={isNamelessBag}
                        onValueChange={setIsNamelessBag}
                        color={isNamelessBag ? Constants.appColor : undefined}
                    />
                </View> */}
                <Button mode="contained" style={{ marginTop: 10, marginHorizontal: width / 10 }} icon="content-save"
                    onPress={async () => {
                        const formResp = await ServerOperations.checkOrdFormula(selectedOrd);
                        if (formResp.res == false) {
                            if (formResp.msg) {
                                Commons.okAlert(formResp.msg);
                            } else {
                                Commons.okAlert("المعادلة غير معرفة لهذا الطلب");
                            }
                            return;
                        }
                        const hasProdsResp = await ServerOperations.hasOrdProdProcesses(selectedOrd);
                        if (hasProdsResp.res == false) {
                            Commons.okAlert("لا يوجد عمليات انتاجية لهذا الطلب");
                            return;
                        }

                        const resp = await ServerOperations.saveMixWtAndPost(selectedOrd, mixWt, qtyToMain, curUser, isDirect);
                        if (resp.res == true) {
                            Commons.okAlert(i18n.t("ordSavedAndPosted"));
                            setShowMixModal(false);
                            setMixWt("");
                            setQtyToMain("");
                        } else {
                            Commons.okAlert("لم يتم الارسال, حاول مرة اخرى");
                        }
                    }}>
                    <Text style={styles.text}> {i18n.t("saveAndPost")} </Text>
                </Button>
            </Modal >
        )
    }

    const deleteFromSelProdList = (idToDelete) => {
        setSelProdList((prevArray) => prevArray.filter((item) => item.prod + item.qty !== idToDelete));
    }
    const deleteFromSelEmpList = (idToDelete) => {
        setSelectedEmpList((prevArray) => prevArray.filter((item) => item.id !== idToDelete));
    }
    const deleteFromSelBagsList = (idToDelete) => {
        setSelectedBagsList((prevArray) => prevArray.filter((item) => item.ST_NO !== idToDelete));
    }
    const deleteFromOrdList = (idToDelete) => {
        setFilteredOrdersList((prevArray) => prevArray.filter((item) => item.ID !== idToDelete));
        setOrdersList((prevArray) => prevArray.filter((item) => item.ID !== idToDelete));
    }

    const renderSelectEmpModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowSelectEmpModal(false);
                }}
                contentContainerStyle={styles.modalStyle}
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
                                    setShowAddProdModal(true);
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
            </Modal>
        )
    }

    const renderSelectBagModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowSelectBagModal(false);
                    setShowAddBagsModal(true);
                }}
                contentContainerStyle={styles.modalStyle}
            >
                <TextInput
                    placeholder="Search"
                    clearButtonMode="always"
                    style={styles.searchBox}
                    value={searchTextEmp}
                    onChangeText={(text) => {
                        setSearchTextBag(text);
                        const list = Commons.handleSearch(text, bagsList);
                        setFilteredBagsList(list)
                    }}
                />
                <FlatList
                    keyExtractor={(item) => item.ST_NO}
                    data={filteredBagsList}
                    extraData={filteredBagsList}
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedBag(item.ST_NO);
                                    setSelectedBagName(item.ST_NAME);
                                    setShowSelectBagModal(false);
                                    setShowAddBagsModal(true);
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
                                        {item.ST_NO}
                                    </Text>
                                    <Text>{item.ST_NAME}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </Modal>
        )
    }

    const renderSelectProdModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowSelectProdModal(false);
                    setShowAddProdModal(true);
                }}
                contentContainerStyle={styles.modalStyle}
            >
                <TextInput
                    placeholder="Search"
                    clearButtonMode="always"
                    style={styles.searchBox}
                    value={searchTextProd}
                    onChangeText={(text) => {
                        setSearchTextProd(text);
                        const list = Commons.handleSearch(text, prodList);
                        setFilteredProdList(list);
                    }}
                />
                <FlatList
                    keyExtractor={(item) => item.ID}
                    data={filteredProdList}
                    extraData={filteredProdList}
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedProd(item.ID);
                                    setSelectedProdName(item.NAME);
                                    setShowSelectProdModal(false);
                                    console.log(item.ID);
                                    setShowAddProdModal(true);
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
            </Modal>
        )
    }


    const renderDeleteDialog = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowDeleteDialog(false);
                }}
                contentContainerStyle={styles.modalStyle}
            >
                <Text style={styles.text, { color: Constants.darkBlueColor, alignSelf: "center", padding: 20 }}>{i18n.t("areYouSure")}</Text>
                <View style={{ flexDirection: "row", padding: 20 }}>
                    <Button mode="contained" style={{ padding: 5, flex: 0.5, borderRadius: 0, marginRight: 5 }} onPress={async () => {

                    }}>
                        <Text style={styles.text}>{i18n.t("back")}</Text>
                    </Button>
                    <Button mode="contained" icon="trash-can" color="red" dark={true} style={{ padding: 5, flex: 0.5, borderRadius: 0 }}
                        onPress={async () => {

                        }}>
                        <Text style={styles.text}>{i18n.t("delete")}</Text>
                    </Button>
                </View>

            </Modal>
        )
    }


    if (showWebView) {
        return (
            <Modal visible={true}
                onDismiss={() => {
                    setShowWebView(false);
                }}
                contentContainerStyle={{ height: height / 1.3 }}>
                <WebView
                    style={{ flex: 1 }}
                    source={{ uri: htmlData }}
                />
                <Button mode="contained" style={{ borderRadius: 0 }} onPress={async () => {
                    setShowWebView(false);
                }}>
                    <Text style={styles.text}>{i18n.t("back")}</Text>
                </Button>
            </Modal>
        )
    } else {
        return (
            <View>
                {/* <Portal>{!!showDeleteDialog && renderDeleteDialog()}</Portal> */}
                <ProgressDialog visible={progressDialogVisible} />
                <Portal>{!!showSelectEmpModal && renderSelectEmpModal()}</Portal>
                <Portal>{!!showSelectBagModal && renderSelectBagModal()}</Portal>
                <Portal>{!!showSelectProdModal && renderSelectProdModal()}</Portal>
                <Portal>{!!showMixModal && renderMixModal()}</Portal>
                <Portal>{!!showAddProdModal && renderAddProdModal()}</Portal>
                <Portal>{!!showAddBagsModal && renderAddBagsModal()}</Portal>
                <Portal>{!!showPrintModal && renderPrintModal()}</Portal>
                <TextInput
                    placeholder={i18n.t("search")}
                    clearButtonMode="always"
                    style={styles.searchBox}
                    value={searchText}
                    style={{ margin: 10 }}
                    onChangeText={(text) => {
                        const list = Commons.handleSearch(text, ordersList);
                        setSearchText(text);
                        setFilteredOrdersList(list);
                    }}
                />
                <FlatList
                    keyExtractor={(item) => item.ID}
                    data={filteredOrdersList}
                    style={{ backgroundColor: "white", height: "90%" }}
                    extraData={filteredOrdersList}
                    renderItem={renderOrdersItem}
                />
            </View >
        );
    }
};

const styles = StyleSheet.create({
    viewContainer: {
        width: "80%",
        marginTop: 80,
    },
    text: { color: "white", fontWeight: "bold", fontSize: 16 },
    taskItemView: curLang => ({
        marginBottom: 5,
        flexDirection: curLang == "ar" ? "row-reverse" : "row",
        justifyContent: "space-between",
        marginHorizontal: 20,

    }),
    cardContainer: {
        display: "flex",
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    modalStyle: {
        backgroundColor: "white",
        padding: 20,
    },
    loginButtonStyle: {
        margin: 2,
        marginLeft: 0,
        marginRight: 0,
    },

    loginButtonContainer: {
        margin: 15,
        width: "100%",
        paddingTop: 15,
        alignSelf: "center",
    },
    image: {
        width: 160,
        height: 195,
        margin: 45,
        marginTop: 40,
        alignSelf: "center",
    },
    appButtonContainer: {
        backgroundColor: Constants.appColor,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    cardTitle: {
        color: Constants.appColor,
    },
    appButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
    },
});
