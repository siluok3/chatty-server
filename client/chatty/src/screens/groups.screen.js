//This will show on the 'Chat' Tab a list of user's groups

import { _ } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
        flex: 1,
    },
    groupContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    groupName: {
        fontWeight: 'bold',
        flex: 0.7,
    }
});

//create fake data to populate them on our ListView
const fakeData = () => _.times(100, i => ({
    id: i,
    name: `Group ${i}`,
}));
//Populate a single Group
class Group extends Component {
    constructor(props) {
        super(props);

        this.goToMessages =  this.props.goToMessages.bind(
            this, this.props.group
        );
    }
    render() {
        const { id, name } = this.props.group;
        return (
            <TouchableHighlight
                key={id}
                onPress={this.goToMessages}
            >
                <View style={styles.groupContainer}>
                    <Text style={styles.groupName}>{`${name}`}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
//Instead of typescript
Group.propTypes = {
    goToMessages: PropTypes.func.isRequired,
    group: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })
};
//Populate all the Groups
class Groups extends Component {
    static navigationOptions = {
        title: 'Chats',
    };

    constructor(props) {
        super(props);
        this.goToMessages = this.goToMessages.bind(this);
    };

    keyExtractor = item => item.id.toString();

    goToMessages(group) {
        const { navigate } =  this.props.navigation;
        navigate('Messages', { groupId: group.id, title: group.name});
    };

    renderItem = ({ item }) => <Group group={item} goToMessages={this.goToMessages}/>;

    render() {
        return(
            <View style={styles.container}>
                <FlatList
                    data={fakeData()}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

Groups.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }),
};

export default Groups;