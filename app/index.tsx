import React from "react";
import { StyleSheet, View } from "react-native";
import Login from "./login";

export default function Index() {
    return (
            <Login />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
});