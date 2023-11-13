import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Alert, RefreshControl, Modal, Dimensions } from "react-native";


  
export default function Items({route}){
const txt = route.params.text;
const email = route.params.email;
 
const navigation = useNavigation();
const isFocus = useIsFocused();

const Api_Url = 'http://192.168.100.2:8000/item';
const Api_Url1 = 'http://192.168.100.2:8000/cart';

const {height, width} = Dimensions.get('window');

const [userData, setMyUserData] = useState('');
const [selectedUserData, setSelectedUserData] = useState('');
const [refreshing, setRefreshing] = useState(false);
const [modalVisible, setModalVisible] = useState(false);

const handleCartPress=()=>{
    navigation.navigate('Cart',{email: email});
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Items',
      headerRight: () => (
        <View style={{ marginRight: 10, flexDirection:'row' }}>
          <TouchableOpacity onPress={()=>navigation.navigate('Search', {email: email})}><Image style={{height:30, width: 30, marginTop:10, marginRight:10}} source={require('../assets/search.png')}/></TouchableOpacity>
          <TouchableOpacity onPress={()=>handleCartPress()}><Image source={require('../assets/cart-icon.png')}/></TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);



const fetchData = async()=>{
    try{

      const response = await fetch(Api_Url);
      const json = await response.json();
      console.log('json:', json);
      setMyUserData(json);
    //   setRefreshing(false);

    const selectedData = json.filter(item => item.category === txt);
     setSelectedUserData(selectedData);
     console.log('selected:', selectedUserData);
     setRefreshing(false);
     setModalVisible(false);  
    }catch(error){
        console.log('error in fetching');
      }
      
    }

    useEffect(()=>{
        fetchData();
      }, []);

      

      const handleRefresh=()=>{
        setRefreshing(true);
        fetchData();
      }

      const [cartImage, setCartImage] = useState();
      const [cartPrice, setCartPrice] = useState();
      const [cartText, setCartText] = useState('');
      const [cartCategory, setCartCategory] = useState('');

      const [qty, setQty] = useState(1);
     
      const [cartModalVisible, setCartModalVisible] = useState(false);
 
      const totalprice = cartPrice*qty;

      const handleSubmit = async ()=>{
        const data = { email:email, category:cartCategory, image: cartImage, text: cartText, price:totalprice, quantity: qty };
        await fetch(Api_Url1, {
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

      React.useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', ()=>{
        //   setRefreshing(true);
          fetchData();
          setTimeout(()=>
          setRefreshing(false), 2000);
        });
        return unsubscribe;     
      }, []);

      // const [totalCartPrice, setTotalCartPrice] = useState(cartPrice);

      

  const addItem =()=>{
    setQty(prevQty => prevQty + 1);
    // const total= cartPrice*qty;
    //   setTotalCartPrice(total);

  }

  const lessItem =()=>{
    if(qty>1)
    setQty(prevQty => prevQty - 1);
    // setTotalCartPrice(total-cartPrice);
  }

  const moveToCart=()=>{
    setQty(1);
    navigation.navigate('Cart',{email:email});
    // setTotalCartPrice(cartPrice);
  }

      return(
    <View>
        <View style={{height:'100%'}}>
        <Text style={{fontSize:30, fontWeight:'bold'}}>{txt}</Text>
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
           <TouchableOpacity onPress={()=>handleModal(item.image, item.price, item.text, item.category)}>
           <View key={item._id} style={{paddingTop:0, paddingBottom:5, borderWidth:1, width:'100%', flexDirection:'row', height:140, marginBottom:10  }}>
           <Image style={{ width: '30%', height: '100%', alignContent: 'center' }} source={{ uri:item.image }} />
           <View style={{flexDirection:'column'}}>
           <Text style={{fontWeight:'normal', fontSize:30, paddingLeft:10, flexWrap:'wrap'}}>{item.text}</Text>
           <Text style={{fontWeight:'normal', fontSize:20, paddingLeft:140, flexWrap:'wrap', paddingTop:70}}>Rs:{item.price}</Text>
           </View>
           </View>
           </TouchableOpacity>
        )

        }}
        
        />
        </View>
        <View style={{ flex:1, justifyContent:'space-between',}}>
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
            <View style={{height: 400, width: width, backgroundColor:'white', marginTop:500, paddingBottom:10}}>
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
        <View>
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
            <View style={{height: 200, width: width, backgroundColor:'white', marginTop:620, paddingBottom:5}}>
            <Text style={{textAlign:'center', backgroundColor:'black', color: 'white', fontSize:30, borderRadius:20 }}> Added to cart</Text>
            </View>
            </Modal>
            </View>
        </View>
        </View>
  </View>
);
}