import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity, Alert } from "react-native";


export default function Cart({route}){

  const navigation = useNavigation();

    const email = route.params.email;
    const qty = route.params.qty;

    const Api_Url = 'http://192.168.100.2:8000/cart';
 
    const [selectedUserData, setSelectedUserData] = useState('');
    const [myUserData, setMyUserData] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [total1, setTotal1] = useState('');
    const [itemqty, setItemQty] = useState();
 
    const fetchData = async () => {
        try {
          const response = await fetch(Api_Url);
          const json = await response.json();
          console.log('json:', json);
          setMyUserData(json);
      
          const selectedData = json.filter(item => item.email === email);
     
          let total2 = 0;
          for(let i=0; i<selectedData.length; i++){
            const item = selectedData[i];
            const price = item.price;
            total2 += price;
          }

          setTotal1(total2);
          const dataLength = selectedData.length;
          setItemQty(dataLength);

          setSelectedUserData(selectedData);
          console.log('selected:', selectedData);
          setRefreshing(false);
          console.log(total1);
 
        } catch (error) {
          console.log('error in fetching:', error);
        }
      };

      const email1 = email;
      const qty1 = qty;

      // console.log(email1);
      const handleNavigation=()=>{
      
        navigation.navigate('Bill', {email: email1, qty: itemqty, total: total1});
      
      }
      

    useEffect(()=>{
        fetchData();
    },[]);

    const handleRefresh=()=>{
        setRefreshing(true);
        fetchData();
    }

    const handleDelete= async(itemId)=>{
 
      try{const response = await fetch(`http://192.168.100.2:8000/cart/${itemId}`,{
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

    return(

      <View style={{height:'100%'}}>
        <View style={{height:'88%'}} >
        <FlatList
        data={selectedUserData}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
          refreshing = {refreshing}
          onRefresh={handleRefresh}/>
        }
        renderItem={({item}) => {
        return(
        
        <View key={item._id} style={{paddingTop:0, paddingBottom:5, borderWidth:1, width:'100%', flexDirection:'row', height:140, marginBottom:10  }}>
           <Image style={{ width: '30%', height: '100%', alignContent: 'center' }} source={{ uri:item.image }} />
           <View style={{flexDirection:'column'}}>
           <Text style={{fontWeight:'normal', fontSize:20, paddingLeft:10, flexWrap:'wrap', width:150}}>{item.text}</Text>
           <Text style={{fontWeight:'normal', fontSize:20, paddingLeft:10, flexWrap:'wrap', width:150}}>qty: {item.quantity}</Text>
           <Text style={{fontWeight:'normal', fontSize:20, paddingLeft:10, flexWrap:'wrap', paddingTop:20}}>Rs:{item.price}</Text>
           </View>
           <View style={{flexDirection:'column'}}>
           <View style={{paddingLeft:30, paddingRight:30}}>
           <TouchableOpacity onPress={()=>handleDelete(item._id)}>
           <Image style={{height:30, width:30, marginVertical:50, marginHorizontal:20 }} source={require('../assets/recycle-bin.png')}/>
           </TouchableOpacity>
           </View>
           </View>
          </View>
        )
        }}
        />
        </View>
        <View style={{alignItems:'center', paddingTop:10}}>
          <Text style={{fontWeight:'bold', fontSize:15}}>Total {total1}</Text>
          <TouchableOpacity onPress={()=>handleNavigation()}>
            <Text style={{backgroundColor:'red', color:'white', textAlign:'center', height:40, width:350, fontSize:20, fontWeight:'bold', borderRadius:10}}>Proceed Order</Text>
          </TouchableOpacity>
        </View>
        </View>

    );
}