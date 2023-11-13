import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Image, Modal, TouchableOpacity } from "react-native";

export default function Search({route}){

    const txt = route.params.text;
const email = route.params.email;


    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);
    const [found, setFound] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cartImage, setCartImage] = useState('');
    const [cartPrice, setCartPrice] = useState('');
    const [cartText, setCartText] = useState('');
    const [cartCategory, setCartCategory] = useState('');
    const [cartModalVisible, setCartModalVisible] = useState(false);
    const [qty, setQty] = useState(1);
    
    const totalprice = cartPrice*qty;

    const navigation = useNavigation();

    const fetchItem= async()=>{
      
      const response = await fetch('http://192.168.100.2:8000/item');
        const json = await response.json();
        setData(json)
    
      }

    useEffect(()=>{
        fetchItem();
        console.log('data:', data);
        console.log('email:',email)
    },[]);

    const moveToCart=()=>{

        setQty(1);
        navigation.navigate('Cart',{email:email});
      
      }

    const handleSubmit = async ()=>{

        const data = { email: email, category:cartCategory, image: cartImage, text: cartText, price:totalprice, quantity: qty };
        await fetch('http://192.168.100.2:8000/cart', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(json => {console.log(json)
       setCartModalVisible(true);
    })
      .catch(error => console.error(error))
      }

      const handleCartSubmit =()=>{
        handleSubmit();
 
         setTimeout(()=>{
             setCartModalVisible(false);
         }, 2000);
 
       }

    const handleModal=(id2, id3, id4, id5)=>{
        setModalVisible(true);
        setCartImage(id2);
        setCartPrice(id3);
        setCartText(id4);
        setCartCategory(id5);
    }

    const toggleModal = () => {
        setQty(1);
        setModalVisible(!modalVisible);
      };

    const addItem =()=>{
        setQty(prevQty => prevQty + 1);
       
      }
    
      const lessItem =()=>{
        if(qty>1)
        setQty(prevQty => prevQty - 1);
      }

    handleSearch=(text)=>{
        setQuery(text)
        const searchedData = data.filter((item)=> item.text.includes(text));
        setFound(searchedData);
        console.log(searchedData);
    }

    return(
        <View>
            <TextInput
            style={{borderWidth:1, borderColor:'grey', height:40, borderRadius:30, backgroundColor:'lightgrey', paddingLeft:10}}
            onChangeText={(text)=>handleSearch(text)}
            value={query}
            placeholder="Search..."/> 
             <FlatList
            data={found}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) =>(
                <TouchableOpacity onPress={()=>handleModal(item.image, item.price, item.text, item.category)}>
            <View style={{paddingTop:0, paddingBottom:5, borderWidth:1, width:'100%', flexDirection:'row', height:140, marginBottom:10  }}>
            <Image style={{ width: '30%', height: '100%', alignContent: 'center' }} source={{ uri:item.image }} />
            <View style={{flexDirection:'column'}}>
            <Text style={{fontWeight:'normal', fontSize:30, paddingLeft:10, flexWrap:'wrap'}}>{item.text}</Text>
            <Text style={{fontWeight:'normal', fontSize:20, paddingLeft:140, flexWrap:'wrap', paddingTop:70}}>Rs:{item.price}</Text>
            </View>
            </View>
            </TouchableOpacity>)}
          />
          <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={()=>{
            setModalVisible(!modalVisible);
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
          onPress={toggleModal}
        >
            <View style={{height: 400, width: 360, backgroundColor:'white', marginTop:500, paddingBottom:10}}>
                <TouchableOpacity onPress={()=>{setModalVisible(false)}}><Text style={{ fontSize:20, marginLeft:330, paddingBottom:10}}>X</Text></TouchableOpacity>
                <View style={{flex:1 , flexDirection:'row',}}>
                <Image style={{ width: '30%', height: '60%', alignContent: 'center' }} source={{ uri:cartImage }} />
                <View style={{flex:1, flexDirection: 'column', paddingLeft:10}}>
                 <Text style={{fontSize:20, fontWeight:'bold'}}>{cartCategory}</Text>
                 <Text style={{fontSize:20}}>{cartText}</Text>
                 <Text style={{fontSize:20}}>price: {totalprice}</Text>
                </View>
                <View style={{flex:1, flexDirection: 'column', paddingLeft:10}}>
                <View style={{flex:1, flexDirection:'row'}}>
                <TouchableOpacity style={{height:30}} onPress={()=>{lessItem()}}><Image source={require('../assets/minus-button.png')} style={{height:30, width:30}}/></TouchableOpacity>
                <View  style={{height:30, width:30, paddingLeft:10}}><Text style={{fontSize:20}}>{qty}</Text></View>
                <TouchableOpacity onPress={()=>{addItem()}}><Image source={require('../assets/add.png')} style={{height:30, width:30}}/></TouchableOpacity>
                </View>
                </View>
                </View>
                <View style={{flex:1, flexDirection:'row', marginHorizontal:30}}>
                <View style={{ height:50, width:100, alignItems:'center'}}><TouchableOpacity onPress={()=>{moveToCart()}}><Text style={{paddingTop:10, fontSize:15, backgroundColor:'red', color:'white', height:50, width:100, textAlign:'center'}}>Move to cart</Text></TouchableOpacity></View>
                <View style={{ height:50, width:100, alignItems:'center', paddingLeft:120}}><TouchableOpacity onPress={()=>{handleCartSubmit()}}><Text style={{paddingTop:10, fontSize:15, backgroundColor:'red', color:'white', height:50, width:100, textAlign:'center'}}>Add to Cart</Text></TouchableOpacity></View>
                </View>
            </View>
        </TouchableOpacity>
        </Modal>
        <View style={{ flex:1, justifyContent:'space-between'}}>
            <Modal 
            animationType="slide"
            transparent={true}
            visible={cartModalVisible}
            onRequestClose={()=>{
                setCartModalVisible(!cartModalVisible);
            }}
            supportedOrientations={['portrait', 'landscape']}
            useNativeDriver={true}
            >
            <View style={{height: 200, width: 360, backgroundColor:'white', marginTop:620, paddingBottom:5}}>
            <Text style={{textAlign:'center', backgroundColor:'black', color: 'white', fontSize:30, borderRadius:20 }}> Added to cart</Text>
            </View>
            </Modal>
            </View>
            </View>
    )
}