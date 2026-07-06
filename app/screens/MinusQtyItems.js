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

export const MinusQtyItemsScreen = ({ navigation, route }) => {
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
                const orders = await ServerOperations.getMinusQtyItems(user);
                console.log(orders)
                if (orders != "" && orders != null && orders.length > 0) {
                    setOrdersList(orders);
                    setFilteredOrdersList(orders);
                }
            }
        })();
    }, [isFocused]);
    const renderOrdersItem = ({ item }) => {
        return (
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
                    {item.ST_NO}
                </Text>
                <View style={[styles.taskItemView(curLang), { alignSelf: "center" }]}>
                    <Text>{item.ST_NAME}  </Text>
                </View>
                <View style={styles.taskItemView(curLang)}>
                    <Text>{" "}{i18n.t("qty")}{" "}</Text>
                    <Text>{item.QTY}</Text>
                </View>
                <View style={styles.taskItemView(curLang)}>
                    <Text>{" "}{i18n.t("qtyToBeManu")}{" "}</Text>
                    <Text>{item.ORD_QTY}</Text>
                </View>
            </View>
        )
    }


    return (
        <View>
            {/* <Portal>{!!showDeleteDialog && renderDeleteDialog()}</Portal> */}
            <ProgressDialog visible={progressDialogVisible} />
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
                keyExtractor={(item) => item.ST_NO}
                data={filteredOrdersList}
                style={{ backgroundColor: "white", height: "90%" }}
                extraData={filteredOrdersList}
                renderItem={renderOrdersItem}
            />
        </View>
    );
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
