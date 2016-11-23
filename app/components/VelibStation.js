/**
 * Created by maps_red on 23/11/16.
 */
//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {styles} from './styles';

export class VelibStation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={StyleSheet.flatten([{height: 50, padding: 10}, styles.velib])} refreshing>
                <Text style={styles.velib_title}>{this.props.title}</Text>
                <Text style={styles.velib_distance}>{this.props.distance}m</Text>
                {this.props.bikes && <Text style={styles.velib_bikes}>{this.props.bikes.remaining}/{this.props.bikes.total}</Text>}
            </View>
        );
    }
}

VelibStation.propTypes = {
    title: React.PropTypes.string.isRequired,
    distance: React.PropTypes.string.isRequired,
    bikes: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object
};

VelibStation.defaultProps = {
    title: 'No title',
    styles: {}
};

