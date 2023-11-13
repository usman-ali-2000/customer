import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Category from './components/Category';
import Login from './components/Login';
import Items from './components/Items';
import CustomerReg from './components/CustomerReg';
import Cart from './components/Cart';
import Bill from './components/Bill';
import Notification1 from './components/Notification1';
import 'expo-dev-client';
import Search from './components/Search';
import Chat from './components/Chat';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
      <Stack.Screen name="Home" component={Login}/>
      <Stack.Screen name="Category" component={Category}/>
      <Stack.Screen name="Items" component={Items}/>
      <Stack.Screen name="CustomerReg" component={CustomerReg}/>
      <Stack.Screen name="Cart" component={Cart}/>
      <Stack.Screen name="Bill" component={Bill}/>
      <Stack.Screen name="Notification1" component={Notification1}/>
      <Stack.Screen name="Search" component={Search}/>
      <Stack.Screen name="Chat" component={Chat}/>
     </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
