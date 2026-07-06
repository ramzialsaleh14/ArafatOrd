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
    Alert
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

export const OrdersReportScreen = ({ navigation, route }) => {
    const [progressDialogVisible, setProggressDialogVisible] = useState(false);
    const [ordersList, setOrdersList] = useState([]);
    const [filteredOrdersList, setFilteredOrdersList] = useState([]);
    const [curLang, setCurLang] = useState("");
    const [curUser, setCurUser] = useState("");
    const [searchText, setSearchText] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [mixWt, setMixWt] = useState("");
    const [qtyToMain, setQtyToMain] = useState("");
    const [showWebView, setShowWebView] = useState(false);
    const [showMixModal, setShowMixModal] = useState(false);
    const [htmlData, setHtmlData] = useState("");
    const [selectedOrd, setSelectedOrd] = useState("");
    const [isDirect, setIsDirect] = useState(false);

    const isFocused = useIsFocused();



    useEffect(() => {
        (async () => {
            if (isFocused) {
                const curLang = await Commons.getFromAS("lang");
                setCurLang(curLang);
                const user = await Commons.getFromAS("userID");
                setCurUser(user);
                const orders = await ServerOperations.getOrdersReport(route.params.fromDate, route.params.status);
                if (orders != "" && orders != null && orders.length > 0) {
                    setOrdersList(orders);
                    setFilteredOrdersList(orders);
                }
            }
        })();
    }, [isFocused]);

    const renderOrdersItem = ({ item }) => {
        return (
            <TouchableOpacity style={{}} onPress={async () => {
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
                    <Text style={{ marginRight: 20, color: "red", alignSelf: "center", marginBottom: 15 }}>
                        {item.ID}
                    </Text>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("inDate")}{" "}</Text>
                        <Text>{item.IN_DATE}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("dlvDate")}{" "}</Text>
                        <Text>{item.DLV_DATE}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("customer")}{" "}</Text>
                        <Text> {item.CUSTOMER} </Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("salesman")}{" "}</Text>
                        <Text>{item.SALESMAN}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("notes")}{" "}</Text>
                        <Text>{item.NOTES}</Text>
                    </View>
                    <View style={styles.taskItemView(curLang)}>
                        <Text>{" "}{i18n.t("prodDate")}{" "}</Text>
                        <Text>{item.PROD_DATE}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }

    const renderMixModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowMixModal(false);
                }}
                contentContainerStyle={styles.modalStyle}
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


                <Button mode="contained" style={{ marginTop: 50, marginHorizontal: width / 10 }} icon="content-save"
                    onPress={async () => {
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
                <Portal>{!!showMixModal && renderMixModal()}</Portal>
                <TextInput
                    placeholder={i18n.t("search")}
                    clearButtonMode="always"
                    style={styles.searchBox}
                    value={searchText}
                    style={{ margin: 10 }}
                    onChangeText={(text) => {
                        setSearchText(text);
                        const list = Commons.handleSearch(text, ordersList);
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
            </View>
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
