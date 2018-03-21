import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions, addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Groups from './screens/groups.screen';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    tabText: {
        color: '#777',
        fontSize: 10,
        justifyContent: 'center',
    },
    selected: {
        color: 'blue',
    },
});

const TestScreen = title => () => (
    <View style={styles.container}>
        <Text>
            {title}
        </Text>
    </View>
);
//This should create the tabs in the main screen
const MainScreenNavigator = TabNavigator({
    Chats: { screen: Groups },
    Settings: { screen: TestScreen('Settings') },
}, {
    initialRouteName: 'Chats',
});
//This will hold all of our Screens
//We can also push different Screens and Navigators on the stack
const AppNavigator = StackNavigator({
    Main: { screen: MainScreenNavigator },
});

//Initialise the reducer
const initialState = AppNavigator.router.getStateForAction( NavigationActions
    .reset({
        index: 0,
        actions: [
            NavigationActions.navigate({
                routeName: 'Main',
            })
        ],
    })
);
//Track Navigation Actions in Redux
export const navigationReducer = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    //Return this state if there is not a next state
    return nextState || state;
};

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const navigationMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav
);
const addListener = createReduxBoundAddListener("root");

class AppWithNavigationState extends Component {
    render() {
        return(
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
                addListener,
            })}/>
        );
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});
//Connect our AppNavigator with Redux
export default connect(mapStateToProps)(AppWithNavigationState);