import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { LoginScreen } from "./screens/Login";
import MainScreen from "./screens/Main";
import NewOrderScreen from "./screens/NewOrder";
import { MyOrdersScreen } from "./screens/MyOrders";
import { OrdersReportScreen } from "./screens/OrdersReport";
import { WorkshopItemsScreen } from "./screens/WorkShopItems";
import { ItemsToBeApprovedScreen } from "./screens/ItemsToBeApproved";
import { MinusQtyItemsScreen } from "./screens/MinusQtyItems";
import i18n from "./languages/langStrings";
import * as Commons from "./utils/Commons";

const { Navigator, Screen } = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Navigator initialRouteName="Login">
      <Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={LoginScreen}
      ></Screen>
      <Screen
        options={{
          headerShown: false,
        }}
        name="Main"
        component={MainScreen}
      ></Screen>
      <Screen
        options={{
          title: i18n.t("newOrd")
        }}
        name="NewOrder"
        component={NewOrderScreen}
      ></Screen>
      <Screen
        options={{
          title: i18n.t("myOrders")
        }}
        name="MyOrders"
        component={MyOrdersScreen}
      ></Screen>
      <Screen
        options={{
          title: i18n.t("ordersReport")
        }}
        name="OrdersReport"
        component={OrdersReportScreen}
      ></Screen>
      <Screen
        options={{
          title: i18n.t("workshopItems")
        }}
        name="WorkshopItems"
        component={WorkshopItemsScreen}
      ></Screen>
      <Screen
        options={{
          title: i18n.t("itemsToBeApproved")
        }}
        name="ItemsToBeApproved"
        component={ItemsToBeApprovedScreen}
      ></Screen>
      <Screen
        options={{
          title: i18n.t("minusQtyItems")
        }}
        name="MinusQtyItems"
        component={MinusQtyItemsScreen}
      ></Screen>
    </Navigator>
  </NavigationContainer>
);

export default AppNavigator;
