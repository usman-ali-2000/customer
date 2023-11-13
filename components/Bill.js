import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState,useRef } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, Modal, Image, Dimensions, BackHandler } from "react-native";
import { Button } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Chat from "./Chat";

export default function Bill({ route }){


  const {height, width} = Dimensions.get('window');

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const NotificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if(remoteMessage.notification.body !== 'new message from rider'){
      setStatus(remoteMessage.notification.body);
      setCookTime(remoteMessage.data.key_2);
      setDboyEmail(remoteMessage.data.body);
      }
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // You can handle the notification here as needed, e.g., navigate to a specific screen
    });
  }

  useEffect(() => {

    console.log('rider', dboyEmail);
    requestUserPermission();
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
      if(remoteMessage.notification.body !== 'new message from rider'){
        setStatus(remoteMessage.notification.body);
      setCookTime(remoteMessage.data.key_2);
      }
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));

      if(remoteMessage.notification.body !== 'new message from rider'){
      setStatus(remoteMessage.notification.body);
      setCookTime(remoteMessage.data.key_2);
      setDboyEmail(remoteMessage.data.body);
      }
    });

    return unsubscribe;
  }, []);



  const navigation = useNavigation();
    const email = route.params.email;
    const qty = route.params.qty;
    const total = route.params.total;

    const Api_Url = 'http://192.168.100.2:8000/customer';
    const Api_Url1 = 'http://192.168.100.2:8000/cart';
    const Api_Url2 = 'http://192.168.100.2:8000/bill';
    const Api_Url3 = 'http://192.168.100.2:8000/students';

    const currentDate = new Date().toLocaleDateString();
    
    const [selectedUserData, setSelectedUserData] = useState('');
    const [billAddress, setbillAddress] = useState('');
    const [billname, setBillName] = useState('');
    const [billPhone, setbillPhone] = useState('');
    const [billCategory, setBillCategory] = useState([]);
    const [billText, setBillText] = useState([]);
    const [billPrice, setBillPrice] = useState([]);
    const [billQuantity, setBillQuantity] = useState([]);    
    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState('Processing...');
    const [cookTime, setCookTime] = useState('');
    const [key2, setKey2] = useState("Bill");
    const [chatCondition, setChatCondition] = useState(false);
    const [dboyEmail, setDboyEmail] = useState('');
    const [chatModal, setChatModal] = useState(false);
 
    const categoryArray = [];
    const textArray = [];
    const priceArray = [];
    const quantityArray = [];



    const fetchData1 = async()=>{
      try{
        const response = await fetch(Api_Url3);
        const json = await response.json();
        console.log('json:', json);

        
        setAdminData(json);
     

       
        }catch(error){
          console.log('error in fetching');
        }
        
      }
      const [expoPushToken, setExpoPushToken] = useState([]);
      const [notification, setNotification] = useState(false);
      const [adminData, setAdminData] = useState([]);
      const notificationListener = useRef();
      const responseListener = useRef();
      const [adminToken, setAdminToken] = useState([]);
    
      const sendNotificationToServer = async (pushToken) => {
 
        try{
            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'key=AAAA5cFjwBA:APA91bHN_Lf_4Gdri_V4n6xEvaXzREi8ysS5GsM_yY9h-VjC--oIusnzQB9Q8quc-2aXfBicymz4280GzPAmhPBJAdf2g_cBSV1J996UIW88pFuojtV1BZsFdUGv95lBRWF_ZYY9bFLN',
              },
              body: `{
              "to": "${pushToken}",
              "collapse_key": "type_a",
              "notification": {
                  "body": " this is a notification from customer",
                  "title": "CUSTOMER",
              },
              "data": {
                  "body": "${email}",
                  "title": "${key2}",
                  "key_1": "${postedId}",
                  "key_2": "Bill"
              }
          }`,
          });
        
          response.json().then(data => {
              console.log(data);
          });
        }
        catch(e) {
        console.log("Error: sendNotificationForLike>>", e)
        }
          }

        
        

  const fetchCart = async()=>{
    try{
    const response = await fetch(Api_Url1);
    const json = await response.json();
    console.log('cart:', json);

    const selectedData1 = json.filter(item=> item.email === email);
    for(let i=0; i<selectedData1.length; i++){
   const item1 = selectedData1[i];
   const cartCategory = item1.category;
    const cartText =  item1.text;
    const cartQuantity = item1.quantity;
    const cartprice = item1.price;

    categoryArray.push(cartCategory);
    textArray.push(cartText);
    quantityArray.push(cartQuantity);
    priceArray.push(cartprice);

    console.log('cart2:',cartCategory);
    
}

    }catch(e){
        console.log(e, 'error while cart fetching');
    }
  }

 const fetchData = async()=>{

    try{
      const response = await fetch(Api_Url);
      const json = await response.json();
      console.log('json:', json);


    const selectedData = json.filter(item => item.email === email);
    const item = selectedData[0];
    const customerAddress = item.address; 
    const customerName = item.name;
    const customerPhone = item.phone;
    setSelectedUserData(selectedData);
     console.log('selected:', selectedUserData);
     console.log('email:', email);
     console.log('address:', customerAddress);
     console.log('name:', customerName);
     console.log('phone no:', customerPhone);
     console.log('quantity:', qty);
     console.log('total:', total);
    
    setbillAddress(customerAddress);
    setBillName(customerName);
    setbillPhone(customerPhone);
    setBillCategory(categoryArray);
    setBillText(textArray);
    setBillPrice(priceArray);
    setBillQuantity(quantityArray);


}catch(error){
        console.log(error,'error in fetching');
      }
      
    }

    const tax = total*0.1;
    const deliveryFee = 50;
    const grandTotal = total+tax+deliveryFee;
    
    const handleSubmit = async ()=>{
        const data = {date: currentDate, name: billname, address: billAddress, email: email, phone: billPhone, category: billCategory, text: billText, price: billPrice, quantity: billQuantity, delivery:deliveryFee, tax: tax, total:grandTotal, status: 'pending'};
        await fetch(Api_Url2, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    
    })
      .then(response => response.json())
      .then(json => {console.log('bill',json)
       Alert.alert('Order in process...');
       postedId = json._id;
       console.log(json._id);
       console.log('category', billCategory);
      })
      .catch(error => console.error(error))
      }
     
    
    useEffect(()=>{
        fetchData();
        fetchCart();
        fetchData1();
        deleteCart();
        console.log('status',status);

       checkOrder();
      },[cookTime]);



      const showAlert= (id) => {
        if(status==='Cooking...'){  
          setKey2('cancelOrder');    
        Alert.alert(
          'Delete',
          'Are you sure, you want to delete this?',
          [
            { text: 'Cancel', style: 'cancel', onPress: ()=> setStatus('Cooking...')},
            { text: 'Confirm', onPress: () => sendCancelRequest() },
          ],
          { cancelable: true },
        );
        setStatus('wait to Cancel');

      }
  else if(status==='Processing...'){
    Alert.alert(
      'Delete',
      'Are you sure, you want to delete this?',
      [
        { text: 'Cancel', style: 'cancel'},
        { text: 'Confirm', onPress: () => deleteBill(id) },
      ],
      { cancelable: true },
    );
  }
else if(cookTime === 'deleted' ){
  setModalVisible(false);
}
else if(cookTime === 'cannot delete this order'){
  setStatus('Cooking...');
}
  else if(status === 'wait to Cancel'){
    Alert.alert('please wait...!');
  }else{
    
    Alert.alert('you cannot cancel this order!');
  }

};


const chatOption=()=>{
console.log(dboyEmail);
  return(
    <View>
     {dboyEmail !=='' && chatCondition === true?<Button title="Chat" onPress={()=>setChatModal(true)}/>:''}
    </View>
  )
}

const checkOrder=()=>{
  if(cookTime === 'deleted'){
    Alert.alert('order deleted succelfully!!!');
    setModalVisible(false);
  }

  if(cookTime === 'cannot delete this order'){
    setStatus('Cooking...');
    setCookTime('20...30 mins');
  }
  if(status === 'Picked...'){
    setCookTime('5-10 mins');
    setModalVisible(true);
    setChatCondition(true);

  }
  if(status === 'Delivered'){
    setModalVisible(false);
    deleteChat();

    Alert.alert('Your order has been delivered...');
  }
}


const deleteChat= async()=>{
  try{const response = await fetch('http://192.168.100.2:8000/chat');
  const json = await response.json();
  const getData = json.filter(item=> item.from === email && item.to === dboyEmail || item.from === dboyEmail && item.to === email );
  for(let i=0; i<getData.length; i++){
    const item = getData[i];
    const id = item._id;
   await fetch(`http://192.168.100.2:8000/chat/${id}`,{
  method:'DELETE',
});
  }
  console.log('deleteCart:',json);

}catch(e){
console.log('ERROR deleting cart', e);
}
}

    const sendCancelRequest= async () => {
            
      for(let i=0; i<adminData.length; i++){
        const item = adminData[i];
        const token1 = item.pushtoken;
        await sendNotificationToServer(token1);
       console.log(token1); 
      }
    }

      const deleteBill= async(id)=>{
        try{
          await fetch(`http://192.168.100.2:8000/bill/${id}`,{
            method: 'DELETE',
          })

      setModalVisible(false);
      Alert.alert('order deleted successfully...');
        
    }catch(e){

          console.log('error while deleting bill...', e);
        
        }

      }

      const deleteCart= async()=>{
        try{const response = await fetch(Api_Url1);
        const json = await response.json();
        const getData = json.filter(item=> item.email === email);
        for(let i=0; i<getData.length; i++){
          const item = getData[i];
          const id = item._id;
         await fetch(`http://192.168.100.2:8000/cart/${id}`,{
        method:'DELETE',
      });
        }
        console.log('deleteCart:',json);
      
    }catch(e){
      console.log('ERROR deleting cart', e);
    }
  }
  

     const submitData=async()=>{

        await handleSubmit();       
        for(let i=0; i<adminData.length; i++){
          const item = adminData[i];
          const token1 = item.pushtoken;
          await sendNotificationToServer(token1);
         console.log(token1); 
        }
        await deleteCart();
        setModalVisible(true);
        return true;
      }
   
      const submitData1=async()=>{
       await submitData();
       backHandler();
  }

    
      const back=() => {
      if (modalVisible) {
        return true;
      } else {
        return false;
      }
    }
    const backHandler =() => {

      BackHandler.addEventListener('hardwareBackPress', back);
  
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', back);
      };
    };

  //   React.useEffect(() => {
  //     navigation.addListener('beforeRemove', (e) => {
  //         e.preventDefault();
  //     });
  // }, [navigation]);

    
    return(
        <View>
            <View style={{alignContent:'center', width:'100%', paddingLeft:20}}>
            <Text style={{fontWeight:'bold', color:'red'}}>Confirm/Edit Address</Text>
            <TextInput
            style={{borderWidth:1, height:80, width:300,  borderRadius:5, paddingLeft:10, textAlign:'justify', fontSize:15, color:'blue', textAlignVertical:'top' }}
             placeholder="address"
              multiline
              numberOfLines={3}
              value={billAddress}
              onChangeText={setbillAddress}
            />
            </View>
            <Text style={{textAlign:'center', fontWeight:'bold', fontSize:30, color:'red', paddingTop:30}}>Bill Summary</Text>
            <Text style={{fontWeight:'bold', paddingLeft:20}}>Date: {currentDate}</Text>
             <View style={{flexDirection:'row', width:300, marginHorizontal:20, borderWidth:1, alignContent:'center', paddingRight:20, borderRadius:5, height:120, paddingLeft:20}}>
                <View style={{flex:1, flexDirection:'column'}}>
                <Text>no. of items</Text>
                <Text>sub total</Text>
                <Text>Delivery fee</Text>
                <Text>GST</Text>
                <Text style={{borderTopWidth:1}}>Total</Text>
                </View>
                <View style={{flex:1, flexDirection:'column'}}>
                <Text>{qty}</Text>
                <Text>{total}</Text>
                <Text>{deliveryFee}</Text>
                <Text>{tax}</Text>
                <Text style={{borderTopWidth:1}}>{total + tax + deliveryFee}</Text>
                </View>
             </View>
             <View style={{ alignItems:'center'}}>
                {/* <TouchableOpacity onPress={()=>navigation.navigate('Notification1')}>
                    <Text style={{backgroundColor:'red', color:'white', textAlign:'center', height:40, width:350, fontSize:20, fontWeight:'bold', borderRadius:10}}>Notification</Text>
                </TouchableOpacity> */}
             </View>
             <View style={{paddingTop:280, alignItems:'center'}}>
                <TouchableOpacity onPress={submitData1}>
                    <Text style={{backgroundColor:'red', color:'white', textAlign:'center', height:40, width:350, fontSize:20, fontWeight:'bold', borderRadius:10}}>Confirm Order</Text>
                </TouchableOpacity>
             </View>
             <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={()=>{
            // setModalVisible(!modalVisible);
            setModalVisible(back);
        }}
        supportedOrientations={['portrait', 'landscape']}
        useNativeDriver={true}
        >
        <TouchableOpacity
          style={{  flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          // onPress={toggleModal}
        >
            <View style={{height: 400, width: width, backgroundColor:'white', marginTop:500, paddingBottom:10, borderTopLeftRadius:30, borderTopRightRadius:30}}>
                {/* <TouchableOpacity onPress={()=>{setModalVisible(false)}}><Text style={{ fontSize:20, marginLeft:330, paddingBottom:10}}>X</Text></TouchableOpacity> */}
               <View style={{alignItems:'center'}}>
               <Text style={{fontSize:30, padding:5, fontWeight:'bold'}}>{status}</Text>
               <Text style={{fontSize:20, padding:5, }}>{cookTime}</Text>
               <Button title="Cancel" onPress={()=>showAlert(postedId)}/>
               <View style={{marginTop:10, width:80}}>{chatOption()}</View>
               </View>
            </View>
        </TouchableOpacity>
        </Modal>
        <Modal
        animationType="slide"
        transparent={false}
        visible={chatModal}
        onRequestClose={()=>{setChatModal(false)}}
        supportedOrientations={['portrait', 'landscape']}
        useNativeDriver={true}
        >
          {/* <Button title="close" onPress={()=>setChatModal(false)}/> */}
          <TouchableOpacity onPress={()=>setChatModal(false)}>
            <Text style={{marginLeft:300, color:'blue'}}>Close</Text>
          </TouchableOpacity>
          <View style={{height:'90%'}}>
          <Chat riderEmail={dboyEmail} customerEmail={email}/>
          </View>
        </Modal>
        </View>
    );
}