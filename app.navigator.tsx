import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Farm from './screens/Farm'
import Login from './screens/Login'
// import AddFarm from './screens/AddFarm'
import AddFarm from './screens/NewFarm'

const { Navigator, Screen } = createStackNavigator()

const AppNavigator = () => (
    <NavigationContainer>
        <Navigator
            initialRouteName="Login"
            screenOptions={({ route, navigation }) => ({
                headerShown: false,
                gestureEnabled: true,
            })}
        >
            <Screen name="Farm" component={Farm}></Screen>
            <Screen name="Login" component={Login}></Screen>
            <Screen name="AddFarm" component={AddFarm}></Screen>
        </Navigator>
    </NavigationContainer>
)

export default AppNavigator