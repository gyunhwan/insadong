import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import React, {useState, useEffect, useStateCallback} from 'react';

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const IapTest = (props) => {
  const [productList, setProductList] = useState([]);
  const [receipt, setReceipt] = useState('');
  const [availableItemsMessage, setAvailableItemsMessage] = useState('');
  const itemSkus = Platform.select({
    ios: [
      'com.cooni.point1000',
      'com.cooni.point5000', // dooboolab
    ],
    android: [
      'south.insadong1',
      'east.insadong1',
      'north.insadong1',

      // 'point_1000', '5000_point', // dooboolab
    ],
  });

  const itemSubs = Platform.select({
    ios: [
      'com.cooni.point1000',
      'com.cooni.point5000', // dooboolab
    ],
    android: [
      'test.sub1', // subscription
    ],
  });
  useEffect(() => {
    console.log(JSON.stringify(itemSkus));
    callIap();
    setSubscription();
    return cwu;
  }, []);
  const setSubscription = async () => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receiptTemp = purchase.transactionReceipt;
        if (receiptTemp) {
          try {
            const ackResult = await finishTransaction(purchase);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
          setReceipt(receiptTemp);
        }
      },
    );
  };
  useEffect(() => {
    console.log(receipt);
  }, [receipt]);
  const cwu = () => {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  };
  const callIap = async () => {
    try {
      const result = await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      console.log('result', result);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const getItems = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      console.log('Products', products);
      setProductList(products);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  const getAvailablePurchases = async () => {
    try {
      console.info(
        'Get available purchases (non-consumable or unconsumed consumable',
      );
      console.info('Available purchases::', purchases);
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  };
  const requestPurchase = async (sku) => {
    try {
      await callIap();
      await RNIap.requestPurchase(sku);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const requestSubscription = async (sku) => {
    try {
      await callIap();
      await RNIap.requestSubscription(sku);
      console.log(sku);
    } catch (err) {
      Alert.alert(err.message);
    }
  };
  const receipt100 = receipt.substring(0, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>react-native-iap V3</Text>
      </View>
      <View style={styles.content}>
        <ScrollView style={{alignSelf: 'stretch'}}>
          <View style={{height: 50}} />
          <TouchableOpacity onPress={() => getAvailablePurchases()}>
            <Text> Get available purchases</Text>
          </TouchableOpacity>

          <Text style={{margin: 5, fontSize: 15, alignSelf: 'center'}}>
            {availableItemsMessage}
            22
          </Text>

          <Text style={{margin: 5, fontSize: 9, alignSelf: 'center'}}>
            {receipt100}
            333
          </Text>

          <TouchableOpacity onPress={() => getItems()}>
            <Text>Get Products ({productList.length})</Text>
          </TouchableOpacity>
          {productList.map((product, i) => {
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 12,
                    color: 'black',
                    minHeight: 100,
                    alignSelf: 'center',
                    paddingHorizontal: 20,
                  }}>
                  {JSON.stringify(product)}
                </Text>
                <TouchableOpacity
                  onPress={() => requestPurchase(product.productId)}
                  // onPress={() => requestSubscription(product.productId)}
                  style={styles.btn}
                  textStyle={styles.txt}>
                  <Text> Request purchase for above product</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.select({
      ios: 0,
      android: 24,
    }),
    paddingTop: Platform.select({
      ios: 0,
      android: 24,
    }),
    backgroundColor: 'white',
  },
  header: {
    flex: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTxt: {
    fontSize: 26,
    color: 'green',
  },
  content: {
    flex: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  btn: {
    height: 48,
    width: 240,
    alignSelf: 'center',
    backgroundColor: '#00c40f',
    borderRadius: 0,
    borderWidth: 0,
  },
  txt: {
    fontSize: 16,
    color: 'white',
  },
});

export default IapTest;
