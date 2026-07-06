import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
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
    ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { Picker } from "@react-native-picker/picker";
import * as Constants from "../utils/Constants";
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
import { width, height } from "../utils/Styles";

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default function NewOrderScreen({ navigation, route }) {
    const [progressDialogVisible, setProggressDialogVisible] = useState(false);
    const [curUser, setCurUser] = useState("");
    const [curLang, setCurLang] = useState("");
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dlvDate, setDlvDate] = useState("");
    const [ordNo, setOrdNo] = useState("");
    const [stNo, setStNo] = useState("");
    const [stName, setStName] = useState("");
    const [formSum, setFormSum] = useState("");
    const [qty, setQty] = useState("");
    const [formCnt, setFormCnt] = useState("");
    const [searchText, setSearchText] = useState("");
    const [itemsList, setItemsList] = useState([]);
    const [filteredItemsList, setFilteredItemsList] = useState([]);
    const [showSelectItemModal, setShowSelectItemModal] = useState(false);
    const [selectedWeight, setSelectedWeight] = useState("");
    const [weightList, setWeightList] = useState([]);
    const [isFocusWeight, setIsFocusWeight] = useState(false);
    const [showItemWeight, setShowItemWeight] = useState(false);
    const [selectedDest, setSelectedDest] = useState("");
    const [destList, setDistList] = useState([{ label: "مشغل", value: "مشغل" }, { label: "رئيسي", value: "رئيسي" }, { label: "رئيسي مع تصنيع", value: "رئيسي مع تصنيع" }]);
    const [isFocusStatus, setIsFocusStatus] = useState(false);



    const showDatePicker = () => {
        setShowDatePickerModal(true);
        Platform.OS === "ios" ? onChangeDate() : null;
    };

    const fillItemWeights = async (itemID) => {
        const resp = await ServerOperations.getItemWeights(itemID);
        setWeightList(resp);
        if (resp.length > 1 && resp != "") {
            setSelectedWeight(resp[0].value);
            setShowItemWeight(true)
        } else {
            setShowItemWeight(false)
        }
        if (resp == 1) setWeightList([]);
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
        setDlvDate(fDate);
    };

    useEffect(() => {
        (async () => {
            setProggressDialogVisible(true);
            const list = await ServerOperations.getStockItems();
            setItemsList(list);
            setFilteredItemsList(list);
            const ordRes = await ServerOperations.getCurOrdSerial();
            setOrdNo(ordRes.ID);
            let tempDate = new Date();
            let fDate =
                tempDate.getDate() +
                "/" +
                (tempDate.getMonth() + 1) +
                "/" +
                tempDate.getFullYear();
            setDlvDate(fDate);
            setProggressDialogVisible(false);
        })();
    }, []);

    const renderStItem = ({ item }) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={async () => {
                        setShowSelectItemModal(false);
                        setStNo(item.ID);
                        fillItemWeights(item.ID);
                        setStName(item.NAME);
                        setFormSum(item.FORM_SUM);
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

    const renderSelectItemModal = () => {
        return (
            <Modal
                visible={true}
                onDismiss={() => {
                    setShowSelectItemModal(false);
                }}
                contentContainerStyle={styles.modalStyle}
            >
                <TextInput
                    placeholder={i18n.t("search")}
                    clearButtonMode="always"
                    style={styles.searchBox}
                    value={searchText}
                    onChangeText={(text) => {
                        setSearchText(text);
                        const list = Commons.handleSearch(text, itemsList);
                        setFilteredItemsList(list);
                    }}
                />
                <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: Constants.appColor, color: "white", fontWeight: "bold", padding: 10, width: "100%" }}>
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

    return (
        <View style={styles.view}>
            <ScrollView>
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
                <Portal>{!!showSelectItemModal && renderSelectItemModal()}</Portal>
                <Text style={{ textAlign: "center", fontSize: 18, backgroundColor: Constants.appColor, color: "white", fontWeight: "bold", padding: 10, marginBottom: 20, width: "100%" }}>
                    {ordNo}
                </Text>
                <Button
                    mode="outlined"
                    style={{ borderColor: "rgb(1,135,134)" }}
                    onPress={showDatePicker}
                >
                    {i18n.t("dlvDate")}
                </Button>
                <Text style={{
                    fontSize: 18,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}>{dlvDate}</Text>
                <TouchableOpacity onPress={() => setShowSelectItemModal(true)} style={{ flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth }}>
                    <TextInput
                        label={i18n.t("stNo")}
                        value={stName + " - " + stNo}
                        disabled={true}
                        style={{ flex: 1 }}
                    />
                    <Ionicons name="search" size={22} style={{ position: "absolute", right: 10, bottom: 10 }} color={Constants.appColor} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row-reverse", marginTop: 5, marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 16, alignSelf: 'center' }}>{i18n.t("entryDest")}</Text>
                    <Dropdown
                        data={destList}
                        value={selectedDest}
                        maxHeight={200}
                        onChange={(item) => {
                            setSelectedDest(item.value);
                            setIsFocusStatus(false);
                        }}
                        labelField="label"
                        valueField="value"
                        style={[styles.dropdown, isFocusStatus && { borderColor: "blue" }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        placeholder={selectedDest}
                    />
                </View>
                <TextInput
                    label={i18n.t("formSum")}
                    value={formSum}
                    disabled={true}
                    style={{ marginHorizontal: width / 5, marginTop: 10 }}
                />
                <TextInput
                    label={i18n.t("qty")}
                    value={qty}
                    onChangeText={setQty}
                    style={{ marginHorizontal: width / 5 }}
                />
                <TextInput
                    label={i18n.t("formCnt")}
                    value={formCnt}
                    onChangeText={setFormCnt}
                    style={{ marginHorizontal: width / 5, marginTop: 10 }}
                />
                {!!showItemWeight && (<View style={{ flexDirection: "row", marginLeft: width / 10, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, alignSelf: "center" }}>
                        {i18n.t("itemWeight")}
                    </Text>
                    <Dropdown
                        data={weightList}
                        value={selectedWeight}
                        maxHeight={200}
                        onChange={(item) => {
                            setSelectedWeight(item.value);
                            setIsFocusWeight(false);
                        }}
                        labelField="label"
                        valueField="value"
                        style={[styles.dropdown, isFocusWeight && { borderColor: "blue" }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        placeholder={selectedWeight}
                    />
                </View>)}
            </ScrollView>
            <Button mode="contained" style={{ padding: 10, width: "100%", marginTop: 50 }} icon="content-save"
                onPress={async () => {
                    if (dlvDate == "" || stNo == "") {
                        Commons.okAlert(i18n.t("emptyStOrDate"));
                    } else {
                        const user = await Commons.getFromAS("userID");
                        const res = await ServerOperations.savePurOrd(ordNo, dlvDate, stNo, formSum, qty, formCnt, user, selectedWeight, selectedDest);
                        if (res.res) {
                            Commons.okAlert(i18n.t("ordSaved"));
                        } else {
                            Commons.okAlert("الطلب محفوظ")
                        }
                    }
                }}>
                <Text style={styles.text}> {i18n.t("save")} </Text>
            </Button>
        </View>
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
        height: height - 20,
        zIndex: 1
    },
    view: {
        flex: 1,
        padding: 20
    },
    appButtonContainer: curLang => ({
        width: '80%',
        margin: 2,
        marginBottom: 12,
        backgroundColor: Color.GREY[50],
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Color.GREY[500],
        borderRadius: 4,
        padding: 15,
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
    appButtonText: {
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
    dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        margin: 10,
        flex: 0.8
    },
});

//export default MainScreen;
