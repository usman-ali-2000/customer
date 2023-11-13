import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Alert, FlatList, Image, TouchableOpacity, Modal, RefreshControl } from "react-native";
import messaging from '@react-native-firebase/messaging';


const Api_Url = 'http://192.168.100.2:8000/categoryForm';


export default function Category({route}) {

  const email = route.params.email;

  const [modalVisible, setModalVisible] = useState(false);
  const [itemId, setItemId] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
 
  const handleButton = () => {
 
    navigation.navigate("CategaryForm");
 
  };

  const handleCartPress=()=>{
    navigation.navigate('Cart', {email: email});
  }


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Category',
      headerRight: () => (
        <View style={{ marginRight: 10, flexDirection:'row' }}>
          <TouchableOpacity onPress={()=>navigation.navigate('Search', {email: email})}><Image style={{height:30, width: 30, marginTop:10, marginRight:10}} source={require('../assets/search.png')}/></TouchableOpacity>
          <TouchableOpacity onPress={()=>handleCartPress()}><Image source={require('../assets/cart-icon.png')}/></TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const [myUserData, setMyUserData] = useState('');

  const fetchData = async()=>{
    try{
      const response = await fetch(Api_Url);
      const json = await response.json();
      console.log('json:', json);
      setMyUserData(json);
      setRefreshing(false);
        }catch(error){
        console.log('error in fetching');
      }
      
    }

    const handleRefresh=()=>{
      
      setRefreshing(true);
      fetchData();
    
    }
  
    React.useEffect(()=>{
      const unsubscribe = navigation.addListener('focus', ()=>{
        setRefreshing(true);
        fetchData();
        setTimeout(()=>
        setRefreshing(false), 2000);
      });
      return unsubscribe;     
    }, []);
    
   
    const handleDelete= async()=>{
      if(!itemId){
        return;
      }
      try{const response = await fetch(`http://192.168.100.2:8000/categoryForm/${itemId}`,{
        method:'DELETE',
      });
      if(response.status===200){
        Alert.alert('successfully deleted');
        fetchData();
      }else{
        console.log('error in while deleting data');
      }
    }catch(e){
    console.log('Error:'+e);
  }
}

const NotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // You can handle the notification here as needed, e.g., navigate to a specific screen
    navigation.navigate(remoteMessage.data.key_1, {email: email});
  });
}

useEffect(() => {
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
  
  NotificationListener();

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const unsubscribe = messaging().onMessage(async remoteMessage => {

    const status = remoteMessage.data.key_2;


    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  return unsubscribe;
}, []);

const showAlert =() => {
  Alert.alert(
    'Delete',
    'Are you sure, you want to delete this?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => handleDelete() },
    ],
    { cancelable: true },
  );
  setModalVisible(false);
};

const handleModal = (id2)=>{
  setModalVisible(true);
  setItemId(id2);
  }

  useEffect(()=>{
    fetchData();
  }, []);


  const handleActionPress =(name)=>{
    
    switch(name){
      case 'add':
        handleButton();
        break;
    }
  }

  return (
    <View style={{ paddingTop:0, flexDirection:'column', marginVertical:0}}>
        <View style={{flexDirection:'column', marginVertical:0, height:'100%', backgroundColor:'lightgrey'}} >
         <FlatList
         contentContainerStyle={{paddingHorizontal:10}}
         data={myUserData}
         keyExtractor={(item) => item._id}
         refreshControl ={
         <RefreshControl
         refreshing = {refreshing}
         onRefresh={handleRefresh}/>
         }
         renderItem={({item}) => {
         return(
          <View key={item._id} style={{paddingTop:0, paddingBottom:0, width:'100%', marginVertical:10, borderRadius:30, backgroundColor:'white'  }}>
            <View style={{ paddingLeft:300, width:30}}>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('Items', {text: item.text, email: email})}>
            <Image style={{ width: '100%', height: 200, alignContent: 'center', borderTopRightRadius:30, borderTopLeftRadius:30 }} source={{ uri:item.image }} />
            <Text style={{fontWeight:'normal', fontSize:30, paddingLeft:10, flexWrap:'wrap'}}>{item.text}</Text>
            </TouchableOpacity>
            </View>
         )

         }}
         
         />
          <View style={{flexDirection:'column', flex:1, marginVertical:5, justifyContent:'space-between'}}>
           <Modal 
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={()=>{
            setModalVisible(!modalVisible);
          }}
          supportedOrientations={['portrait', 'landscape']}
          useNativeDriver={true}>
            <View style={{alignItems:'center', width:'100%', justifyContent:'space-between'}}>
              <TouchableOpacity Press={()=>showAlert()} style={{width:'100%', paddingBottom:5}} ><Text style={{fontWeight:'bold', borderWidth:1, height:30, width:'100%', textAlign:'center'}} >Delete</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>setModalVisible(false)} style={{width:'100%', paddingTop:5}} ><Text style={{fontWeight:'bold', borderWidth:1, height:30, width:'100%', textAlign:'center'}}>Close</Text></TouchableOpacity>
            </View>
          </Modal>
          </View>
          </View>
         {/* <Bill callParentFunction={closeModalFromBill}/> */}
          </View> 
  );
};
