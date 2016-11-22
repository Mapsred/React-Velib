/**
 * Created by maps_red on 22/11/16.
 */

//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import {Text, View, Navigator, AsyncStorage, TouchableOpacity, ListView} from 'react-native';
import {styles} from './components/styles';

const API_URL = 'http://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&facet=banking&facet=bonus&facet=status&facet=contract_name';


export default class ReactVelib extends Component {
    constructor() {
        super();

        this.apiClient = new ApiClient();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {data: {records: {}}, requestFrom: '', dataSource: ds.cloneWithRows([])};
        this.getData()
    }

    render() {
        return (
            <View style={styles.container} refreshing>
                <ListView dataSource={this.state.dataSource} renderRow={ReactVelib.renderRow} enableEmptySections/>
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

    static renderRow(rowData) {
        const name = (rowData.fields.name).split(" - ");
        const totalBike = rowData.fields.available_bike_stands;
        const bikes = rowData.fields.available_bikes;
        return (
            <View style={styles.row}>
                <Text>{name[name.length - 1]}</Text>
                <Text>100m</Text>
                <Text>{`${bikes}/${totalBike}`}</Text>
            </View>
        );
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
