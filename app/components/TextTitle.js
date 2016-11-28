/**
 * Created by maps_red on 23/11/16.
 */
//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import {styles} from './styles';

export class TextTitle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.styles} refreshing>
                <Image style={styles.title_image} source={this.props.image}/>
                <Text style={styles.title_title}>{this.props.title}</Text>
            </View>
        );
    }
}

TextTitle.propTypes = {
    title: React.PropTypes.string.isRequired,
    image: React.PropTypes.any.isRequired,
    styles: React.PropTypes.object
};

TextTitle.defaultProps = {
    title: 'No title',
    styles: {}
};

