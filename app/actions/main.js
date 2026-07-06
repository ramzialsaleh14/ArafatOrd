import * as Commons from "../utils/Commons";
import * as ServerOperations from "../utils/ServerOperations";
import i18n from "../languages/langStrings";
import {
    Platform,
    BackHandler,
    I18nManager
} from "react-native";

export const switchLanguage = async (curLang) => {
    const changeTo = curLang == "English" ? "en" : "ar";
    console.log(changeTo);
    await Commons.removeFromAS("lang");
    await Commons.saveToAS("lang", changeTo);
    if (changeTo == "ar") {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
    } else {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
    }
    i18n.locale = changeTo;
};