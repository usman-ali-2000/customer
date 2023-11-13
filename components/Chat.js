import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from "react-native";

export default function Chat(props){

    // const customerEmail = route.params.customerEmail;
    // const riderEmail = route.params.riderEmail; 
    // const riderToken = route.params.riderToken;

    const [chat, setChat] = useState('');    
    const [customerData, setCustomerData] = useState('');
    const [customToken, setCustomToken] = useState('');

    const sendNotificationToServer = async () => {
 
        try{
            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'key=AAAAcJqMecs:APA91bF9m92oQT3BvQUxBvwjkmOrQmIhxYBzOIlQNGEzwCqOeRWl0bOzUyr-NaAt7P20zZqYsJb71R_r9CcjUvcdSgI7-WPK1yamvxD3loqOpFN7btVO_pVpJfu9JO2ghn77eGQzAt2D',
              },
              body: `{
              "to": "${customToken}",
              "collapse_key": "type_a",
              "notification": {
                  "body": "new message from customer",
                  "title": "Customer",
              },
              "data": {
                  "body": "new message from customer",
                  "title": "Fiyer",
                  "key_1": "Bill",
                  "key_2": "20...30 mins"
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
    
    const fetchToken=async(email)=>
    
    {
        const response = await fetch('http://192.168.100.2:8000/dboy');
        const json = await response.json();
        const selectedData = json.filter(item => item.email === email );
        // console.log(selectedData);
        const customerToken = selectedData[0].pushtoken;
        setCustomToken(customerToken);
        console.log('tokenrider',customToken); 
    }

    
    const fetchChat=async()=>{

         const response = await fetch('http://192.168.100.2:8000/chat');
         const json = await response.json();
 
         const getRider = await json.filter((item)=> item.from === props.riderEmail && item.to === props.customerEmail || item.from === props.customerEmail && item.to === props.riderEmail );
        setCustomerData(getRider);

    }


    const sendChat=async()=>{
        await fetchToken(props.riderEmail);
        if(chat !== '' && customToken !==''){
            const data = { to:props.riderEmail, from:props.customerEmail, text:chat };
        await fetch('http://192.168.100.2:8000/chat', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(json => {console.log(json)
    })
      .catch(error => console.error(error))

      sendNotificationToServer();
      console.log('chat:', chat);
      setChat('');

        }
    }

    useEffect(()=>{
        fetchChat();
    },[customerData]);

    return(
        <View style={{height:'100%', flexDirection:'column'}}>
            <FlatList
            style={{flex:1,height:'92%'}}
            data={customerData}
            keyExtractor={(item)=>item._id}
            renderItem={({item})=>{
                return(

                    <View style={item.from===props.customerEmail?{ margin:10, padding:5, maxWidth:'70%', backgroundColor:'blue', marginVertical:5, alignSelf:'flex-end', borderRadius:10}:{margin:10, padding:5, maxWidth:'70%', backgroundColor:'white', marginVertical:5, alignSelf:'flex-start', borderRadius:10} }>
                    <Text style={item.from===props.customerEmail? { textAlign:'right', fontSize:20, color:'white'}:{textAlign:'left', fontSize:20, color:'black'}}>{item.text}</Text>
                    </View>
                    
                );
            }}
            inverted={true}
            />
            <View style={{borderWidth:1, borderColor:'lightgrey', height:40, borderRadius:30, flexDirection:'row'}}>
                <TextInput
                style={{fontSize:20, paddingLeft:5, width:320}}
                placeholder="type here..."
                onChangeText={(txt)=>setChat(txt)}
                value={chat}
                multiline={true}
                />
                <TouchableOpacity onPress={sendChat}>
                <Image style={{height:35, width:35, marginTop:2}} source={require('../assets/paper-plane.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}