import * as React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import axios from 'axios';
import topImg from '../assets/images/top_img.png';

const baseURL = 'http://dmonster1472.cafe24.com/';

const IntroScreen = (props) => {
  const navigation = props.navigation;

  const [list, setList] = React.useState([]);

  const getList = () => {
    axios({
      method: 'get',
      url: `${baseURL}/json/proc_json.php?method=proc_get_insadong`,
    })
      .then((res) => {
        if (res.data.resultItem.message === '조회성공') {
          console.log('IntroScreen res : ', res);
          setList(res.data.arrItems);
        }
      })
      // .then((res) => console.log('인사동 data :: ', res.data))
      .catch((e) => console.log(e));
  };

  React.useEffect(() => {
    getList();
  }, []);

  return (
    <View style={{flex: 1}}>
      <AutoHeightImage
        source={topImg}
        width={Dimensions.get('window').width}
        style={{zIndex: 5, alignSelf: 'flex-start'}}
      />
      <View style={{position: 'relative'}}>
        <ImageBackground
          source={require('../assets/images/map_road.png')}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 180,
            marginTop: 0,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '북',
                title: '북인사 마당',
              })
            }
            style={{position: 'absolute', top: 15, left: 60, zIndex: 5}}>
            <AutoHeightImage
              source={require('../assets/images/map_info04.png')}
              width={145}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '서',
                title: '공평도시유적전시관',
              })
            }
            style={{position: 'absolute', top: 300, left: 5, zIndex: 5}}>
            <AutoHeightImage
              source={require('../assets/images/map_info02.png')}
              width={145}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '동',
                title: '낙원악기 상가',
              })
            }
            style={{position: 'absolute', top: 180, right: 20, zIndex: 5}}>
            <AutoHeightImage
              source={require('../assets/images/map_info01.png')}
              width={145}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '남',
                title: '남인사 마당',
              })
            }
            style={{position: 'absolute', bottom: 50, right: 90, zIndex: 5}}>
            <AutoHeightImage
              source={require('../assets/images/map_info03.png')}
              width={145}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'flex-end',
          backgroundColor: '#FFCF03',
          width: Dimensions.get('window').width,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <AutoHeightImage
          source={require('../assets/images/map_text.png')}
          width={Dimensions.get('window').width - 100}
        />
      </View>
    </View>
  );
};

export default IntroScreen;
