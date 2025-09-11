import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

// This is the expo local router 
const Employees = () => {
    const { id } = useLocalSearchParams();

  return (
    <View>
      <Text> Employees  </Text>
    </View>
  )
}

export default Employees