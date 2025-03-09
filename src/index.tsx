import { View, Text } from 'react-native'
import React from 'react'
import { Provider } from "react-redux"
import RootNavigator from './navigation/RootNavigator'
import { store } from './store'


const index = () => {
  return (
    <Provider store={store}>
        <RootNavigator/>
    </Provider>
  )
}

export default index