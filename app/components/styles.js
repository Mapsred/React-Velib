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
        width: 500
    },

    velib_title: {
        width: 200
    },

    velib_distance: {
        width: 100
    },

    velib_bikes: {
        width: 100,
        fontWeight: "bold"
    }
});


export const mapsStyle = {
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

};