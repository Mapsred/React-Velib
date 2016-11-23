/**
 * Created by maps_red on 22/11/16.
 */

//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import {Text, View, AsyncStorage, ListView, Image} from 'react-native';
import {styles, mapsStyle} from './components/styles';
import MapView from 'react-native-maps';
import {VelibStation} from './components/VelibStation';


const API_URL = 'http://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&facet=banking&facet=bonus&facet=status&facet=contract_name';

export default class ReactVelib extends Component {

    constructor() {
        super();

        this.apiClient = new ApiClient();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {data: {records: {}}, requestFrom: '', dataSource: ds.cloneWithRows([]), markers: []};
        this.getData();
        this.geolocAction();
    }

    render() {
        return (
            <View style={mapsStyle.container} refreshing>
                <MapView style={mapsStyle.map} initialRegion={this.state.region}>
                    {this.state.markers.map(marker =>
                        (<MapView.Marker coordinate={marker.coordinate} title={marker.title} image={marker.image}
                                         description={marker.description}/>))}
                </MapView>
                <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections/>
            </View>
        );
    }

    getData() {
        this.apiClient.get(API_URL).then((data) => {
            this.setState({data: data.data, requestFrom: data.from});
            this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.data.records)});
        });
    }

    renderRow(rowData) {
        const fields = rowData.fields;
        const name = (fields.name).split(" - ");
        const bikes = {remaining: fields.available_bikes, total: fields.available_bike_stands};
        const pos = this.state.position;
        const velibPos = fields.position;
        const distance = this.getDistanceFromLatLonInKm(pos.latitude, pos.longitude, velibPos[0], velibPos[1]);
        this.incrementMarkups(fields, velibPos);

        return (<VelibStation title={name[name.length - 1]} distance={Math.round(distance)} bikes={bikes}/>);
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
                this.setState({position: {latitude: position.coords.latitude, longitude: position.coords.longitude}});
                this.setState({posString: JSON.stringify(this.state.position, undefined, 2)});
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }
                });
            }, (error) => alert(JSON.stringify(error))
        )
    }

    incrementMarkups(fields, velibPos) {
        const description = fields.available_bikes + "/" + fields.available_bike_stands;
        this.state.markers.push({
            coordinate: {latitude: velibPos[0], longitude: velibPos[1]},
            title: fields.address,
            description: description,
            image: require('../assets/images/pink_mark.png')
        });
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
