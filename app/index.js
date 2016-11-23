/**
 * Created by maps_red on 22/11/16.
 */

//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import {Text, View, AsyncStorage, ListView} from 'react-native';
import {styles} from './components/styles';
import MapView from 'react-native-maps';


const API_URL = 'http://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&facet=banking&facet=bonus&facet=status&facet=contract_name';


export default class ReactVelib extends Component {

    constructor() {
        super();

        this.apiClient = new ApiClient();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {data: {records: {}}, requestFrom: '', dataSource: ds.cloneWithRows([])};
        this.getData();
    }

    render() {
        this.geolocAction();
        return (
            <View style={styles.container} refreshing>
                <MapView initialRegion={{latitude: 37.78825,longitude: -122.4324,latitudeDelta: 0.0922,longitudeDelta: 0.0421}}/>
                <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections/>
            </View>
        );
    }

    getData() {
        this.apiClient.get(API_URL).then((data) => {
            this.setState({data: data.data, requestFrom: data.from});
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.data.records)
            });
        });
    }

    renderRow(rowData) {
        const name = (rowData.fields.name).split(" - ");
        const totalBike = rowData.fields.available_bike_stands;
        const bikes = rowData.fields.available_bikes;
        const pos = this.state.position;
        const velibPos = rowData.fields.position;
        const distance = this.getDistanceFromLatLonInKm(pos.lattitude, pos.longitude, velibPos[0], velibPos[1]);
        return (
            <View style={styles.row}>
                <Text>{name[name.length - 1]}</Text>
                <Text>{Math.round(distance)}m</Text>
                <Text>{`${bikes}/${totalBike}`}</Text>
            </View>
        );
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    geolocAction() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({position: {lattitude: position.coords.latitude, longitude: position.coords.longitude}});
                this.setState({posString: JSON.stringify(this.state.position, undefined, 2)});

            },
            (error) => alert(JSON.stringify(error)),
            // {enableHighAccuracy: false, timeout: 8000, maximumAge: 1000}

        )
    }

}


class ApiClient {
    constructor() {
        this.cache = AsyncStorage
    }

    async get(url) {
        const key = encodeURIComponent(url);
        try {
            let value = await this.cache.getItem(key);
            if (value !== null) {
                return Promise.resolve({data: JSON.parse(value), from: 'Cache'});
            } else {
                return fetch(url)
                    .then(response => response.json())
                    .then((json) => {
                        this.cache.setItem(key, JSON.stringify(json));
                        return {data: json, from: 'API'};
                    })
                    ;
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    static clearCache() {
        AsyncStorage.clear();
    }
}
