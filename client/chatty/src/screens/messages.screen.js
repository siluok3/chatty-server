//This will show on the 'Messages' Tab a list of user's groups
import { _ } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql, compose} from 'react-apollo';
import {
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import randomColor from 'randomcolor';

import Message from '../components/message.component';
import MessageInput from '../components/message-input.component';
import GROUP_QUERY from '../graphql/group.query';

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        backgroundColor: '#e5ddd5',
        flex: 1,
        flexDirection: 'column',
    },
    loading: {
        justifyContent: 'center',
    },
});

class Messages extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;

        return {
            title: state.params.title,
        };
    };

    constructor(props) {
        super(props);
        const usernameColors = {};
        if(props.group && props.group.users) {
            props.group.users.forEach((user) => {
                usernameColors[user.username] = randomColor();
            });
        }

        this.state = {
            usernameColors,
        };

        this.renderItem = this.renderItem.bind(this);
        this.send = this.send.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const usernameColors = {};
        // Let's check for new messages
        if(nextProps.group) {
            if(nextProps.group.users) {
                //apply color to each user
                nextProps.group.users.forEach( (user) => {
                    usernameColors[user.username] = this.state.usernameColors[user.username] || randomColor();
                });
            }
            this.setState({
                usernameColors,
            });
        }
    }

    send(text) {
        // TODO send the actual message
        console.log(`sending message...${text}`)
    }

    keyExtractor = item => item.id;

    renderItem = ({ item: message }) => (
        <Message
            color={this.state.usernameColors[message.from.username]}
            isCurrentUser={message.from.id === 1} //until we have the oauth implementation
            message={message}
        />
    );

    render() {
        const { loading, group } = this.props;

        if(loading && !group) {
            return (
                <View style={[styles.loading, styles.container]}>
                    <ActivityIndicator />
                </View>
            );
        }
        //return a list of messages for a group
        return(
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={'position'}
                    contentContainerStyle={styles.container}
                    keyboardVerticalOffset={64}
                    style={styles.container}
                >
                    <FlatList
                    data={group.messages.slice().reverse()}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    />
                    <MessageInput send={this.send} />
                </KeyboardAvoidingView>
            </View>
        );
    }
}

Messages.propTypes = {
    group: PropTypes.shape({
        messages: PropTypes.array,
        users: PropTypes.array,
    }),
    loading: PropTypes.bool,
};

const groupQuery =  graphql(GROUP_QUERY, {
    options: ownProps => ({
        variables: {
            groupId: ownProps.navigation.state.params.groupId,
        },
    }),
    props: ({ data: { loading, group } }) => ({
        loading, group,
    }),
});

export default compose(
    groupQuery,
)(Messages);