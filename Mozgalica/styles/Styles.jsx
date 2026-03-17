import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'top',
        alignItems: 'center',
        padding: 10,
        paddingVertical: 50,
        backgroundColor: '#ffffd4',
    },
    homeContainer: {
        flex: 1,
        justifyContent: 'top',
        alignItems: 'center',
        padding: 10,
        paddingVertical: 20,
        backgroundColor: '#ffffd4',
        gap: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    headerStyle: {
        backgroundColor: '#347433'
    },
    headerTTTStyle: {
        backgroundColor: '#0E2148'
    },
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#fffff5',
    },
    headerTintColor: '#fffff5',
    button: {
        backgroundColor: '#347433',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        alignItems: 'center',
        height: 48
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonGame: {
        backgroundColor: '#99bd23ff',
        height: 115,
        width: 115,
        borderRadius: 15,
        alignItems: 'center',
        paddingVertical: 40,
    },
    buttonGameText: {
        color: '#fffff5',
        fontSize: 24,
        fontWeight: 'bold',
        paddingBottom: 50,
    },
    textInput: {
        borderWidth: 1, 
        borderRadius: 20,
        marginVertical: 10, 
        paddingLeft: 20,
        width: 200
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        borderRadius: 15,
    },
    imageText: {
        color: '#3d3476ff',
        fontSize: 20,
        fontWeight: 'bold',
    }
});