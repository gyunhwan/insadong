import * as React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Button,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import qs from 'qs';
import Geolocation from 'react-native-geolocation-service';

import HeaderY from './Common/HeaderY';

const baseURL = 'http://dmonster1472.cafe24.com/';

const Depth01 = (props) => {
  const navigation = props.navigation;
  const list = props.route.params.list;
  const title = props.route.params.title;
  const category = props.route.params.category;

  console.log('Depth01 list', list);

  const sheetRef = React.useRef(null);

  const [selectList, setSelectList] = React.useState([]);

  const [location, setLocation] = React.useState({});
  const [locationLoad, setLocationLoad] = React.useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  };

  const getList = () => {
    axios({
      method: 'post',
      url: `${baseURL}/json/proc_json.php?method=proc_get_insadong_category`,
      data: qs.stringify({
        ca_name: category,
      }),
    })
      .then((res) => {
        console.log('c', res);
        if (res.data.resultItem.message === '조회성공') {
          setSelectList(res.data.arrItems);
        }
      })
      .catch((e) => console.log(e));
  };

  console.log('Depth01 selectList :: ', selectList);

  React.useEffect(() => {
    getList();
    // requestPermissions();
  }, []);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    Geolocation.getCurrentPosition(
      (location) => {
        let userGeo = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        //           userGeo 에 담는 lat, lng 값 useState 변수에 담아서 webview 에 넣어주시면 될 것 같습니다
        setLocation(userGeo);
        setLocationLoad(true);

        //return true;
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 100000},
    );
  }, [locationLoad]);

  const RenderRow = ({item, idx}) => {
    return (
      <>
        <TouchableOpacity
          key={item.id}
          style={styles.listWrap}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Detail', {
              title: item.title,
              content: item.content,
              background: item.photo,
              navigation: navigation,
              subId: item.id,
              items: item,
            })
          }>
          <View style={styles.listTextWrap}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={[styles.listDesc, {lineHeight: 22}]} numberOfLines={3}>
              {item.content}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/images/right-arrow.png')}
                style={{width: 10, height: 10, marginRight: 10}}
                resizeMode="contain"
              />
              <Text style={{fontSize: 13, marginRight: 7, color: '#666666'}}>
                재생시간
              </Text>
              <Text style={{fontSize: 13, color: '#666666'}}>
                {item.duration}
              </Text>
            </View>
            {/* <Text style={styles.playTime}>{`재생시간 ${item.playTime}`}</Text> */}
          </View>
          <View style={styles.listMedia}>
            <ImageBackground
              source={{uri: `${item.photo}`}}
              resizeMode="cover"
              borderBottomRightRadius={15}
              borderTopLeftRadius={12}
              style={{
                width: 120,
                height: 180,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Image
                source={require('../assets/images/ic_sound.png')}
                resizeMode="contain"
                style={{width: 50, height: 50, margin: 5}}
              />
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = React.useRef();

  /** 웹뷰 ref */
  const handleSetRef = (_ref) => {
    webviewRef = _ref;
  };

  /** webview 로딩 완료시 */
  // const handleEndLoading = (e) => {
  //   console.log('handleEndLoading');
  //   /** rn에서 웹뷰로 정보를 보내는 메소드 */
  //   webviewRef.postMessage(
  //     console.log('로딩 완료시 webview로 정보를 보내는 곳'),
  //   );
  // };

  const onLoadWebview = () => {
    webviewRef.postMessage(location);
  };

  const onMessage = (message) => {
    console.log('I can’t see this message!');
  };

  return (
    <>
      <HeaderY title={title} navigation={navigation} />

      <WebView
        webviewRef={webviewRef}
        source={{
          uri: `https://dmonster1472.cafe24.com/map/index.php?lat=${location.lat}&lng=${location.lng}`,
        }}
        style={{
          width: Dimensions.get('window').width,
          height: 270,
        }}
        ref={handleSetRef}
        javaScriptEnabled={true}
        onLoad={onLoadWebview}
        // onMessage={onMessage}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -10,
          width: Dimensions.get('window').width,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          height: 480,
          marginBottom: 10,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          justifyContent: 'center',
        }}>
        {selectList.length > 0 ? (
          <FlatList
            data={selectList}
            renderItem={RenderRow}
            keyExtractor={(list, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            style={styles.listWrapBox}
            navigation={navigation}
          />
        ) : null}
        {selectList.length === 0 ? (
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: '#252525',
              }}>
              리스트가 없습니다.
            </Text>
          </View>
        ) : selectList.length > 0 && selectList.length < 3 ? (
          <View style={{marginBottom: 10}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: '#252525',
                paddingVertical: 7,
                backgroundColor: '#eee',
                borderRadius: 25,
              }}>
              더 이상 리스트가 없습니다.
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listWrapBox: {
    backgroundColor: 'transparent',
    zIndex: 5,
    elevation: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginTop: 25,
  },
  listWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginVertical: 12,
  },
  listTextWrap: {
    flex: 2,
    marginRight: 20,
    justifyContent: 'center',
  },
  listMedia: {
    flex: 1,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listDesc: {
    fontSize: 15,
    marginBottom: 15,
    color: '#888888',
  },
  playTime: {
    fontSize: 14,
    color: '#888888',
  },
  arrow: {
    fontFamily: 'xeicon',
    fontSize: 20,
  },
});

// const ArrowFont = Styled.Text`
// font-size: 20px;
// font-family: 'xeicon';
// `;

export default Depth01;
