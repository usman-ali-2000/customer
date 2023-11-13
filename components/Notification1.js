import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button } from "react-native";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notification1() {
  const [adminToken, setAdminToken] = useState('');

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      GetFCMToken();
    }
  }
  
  async function GetFCMToken() {
    try {
      let fcmtoken = await AsyncStorage.getItem("fcmtoken");
      console.log(fcmtoken, "oldtoken");
      if (!fcmtoken) {
        fcmtoken = await messaging().getToken();
        await AsyncStorage.setItem("fcmtoken", fcmtoken);
        console.log(fcmtoken, "newtoken");
      }
      setAdminToken(fcmtoken); // Set the adminToken state with the FCM token
    } catch (e) {
      console.log(e, "error fcmToken");
    }
  }
  
  const NotificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // You can handle the notification here as needed, e.g., navigate to a specific screen
    });
  }

  useEffect(() => {
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
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const sendNotificationToServer = async () => {
 
try{
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'key=AAAA5cFjwBA:APA91bHN_Lf_4Gdri_V4n6xEvaXzREi8ysS5GsM_yY9h-VjC--oIusnzQB9Q8quc-2aXfBicymz4280GzPAmhPBJAdf2g_cBSV1J996UIW88pFuojtV1BZsFdUGv95lBRWF_ZYY9bFLN',
      },
      body: `{
      "to": "dH9UKHudRIGt5k-mz0tIm2:APA91bHGSrH3c9kjtyhv-giHvV9vJkeJ5WvDl_SkkErIfi7yQcXivaYkJ7ku1yQXp_XX_Sq0N9pJZPYCFQhSu8CAghEmzrDWmUxyreXdmJ_mwfUYzXDkl2V3vY1PS9iXlQUI7beWlLQe",
      "collapse_key": "type_a",
      "notification": {
          "body": " this is a notification from customer",
          "title": "CUSTOMER",
      },
      "data": {
          "body": "Liked your post",
          "title": "Fiyer",
          "key_1": "Value for key_1",
          "key_2": "Value for key_2"
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


  return (
    <View>
      <Text>notification page...</Text>
      <Button title='send' onPress={sendNotificationToServer} />
    </View>
  );
}
