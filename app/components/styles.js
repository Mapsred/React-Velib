/**
 * Created by maps_red on 22/11/16.
 */

import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    velib: {
        backgroundColor: '#F5FBFE',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 500,
        height: 60,
        padding: 10
    },

    velib_title: {
        width: 200,
        fontWeight: "bold"
    },

    velib_distance: {
        width: 100,
        paddingLeft: 10,
    },

    velib_bikes: {
        width: 100,
        fontWeight: "bold"
    },

    title_image: {
        width: 50,
        height: 50
    },

    title_title: {
        width: 300,
        fontWeight: "bold",
        paddingTop: 15,
        paddingLeft: 10
    },

    title_view: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 500,
        height: 60,
        padding: 10,
        marginLeft: 140
    }
});


export const mapsStyle = {
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        height: 200,
    },

};