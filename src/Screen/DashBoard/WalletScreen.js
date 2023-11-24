import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {CommonHeader} from '../../components';
import {Images} from '../../helper/IconConstant';
import {fontSize, hp, wp} from '../../helper/Constant';
import {useSelector} from 'react-redux';

const WalletScreen = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [myWallet, setMyWallet] = useState('00.00');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const strings = useSelector(state => state?.languageReducer?.languageObject);
  const isFocused = useIsFocused();
  const UserData = async () => {
    const journeyData = await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get();
    setUserData(journeyData.data());
  };
  const SetWalletData = async () => {
    let data = await firestore()
      .collection('UserWallet')
      .doc(auth().currentUser.uid)
      .get()
      .then(a => a.data().wallet);
    return data;
  };

  const getTransactionHistory = async () => {
    await firestore()
      .collection('UserWallet')
      .doc(auth().currentUser.uid)
      .get()
      .then(a => setTransactionHistory(a.data().transactionHistory));
  };

  useEffect(() => {
    if (myWallet != SetWalletData()) {
      SetWalletData().then(e => {
        setMyWallet(e);
      });
    } else {
      setMyWallet(myWallet);
    }
  }, [isFocused]);

  useEffect(() => {
    if (transactionHistory) {
      getTransactionHistory();
    }
  }, [isFocused]);

  useEffect(() => {
    UserData();
  }, []);
  const color = useSelector(state => state?.themereducer?.colorTheme);
  const styles = ThemeStyle(color);
  return (
    <View style={{flex: 1, backgroundColor: color.bgColor}}>
      <CommonHeader
        onPress1={false}
        onPress2={false}
        Images1={Images.planIcon}
        headerName={strings.wallet}
      />
      <View style={styles.walletBody}>
        <View style={styles.mywalletCardBody}>
          <Text style={styles.mywalletCardName}>{userData?.Name}</Text>
          <Text style={styles.mywalletCardBalanceTitle}>
            {strings.yourBalance}
          </Text>
          <View style={styles.mywalletCardBalanceBody}>
            <Text style={styles.mywalletCardBalance}>${myWallet}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TopUp')}
              style={styles.topUpBut}>
              <Image style={styles.topUpIcon} source={Images.topUpIcon} />
              <Text style={{color: '#000'}}>{strings.topUp}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={styles.transactionHistoryHeader}>
            <Text style={styles.headerText}>{strings.transactionHistory}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionHistory')}
              style={styles.transactionHistoryViewAllBut}>
              <Text style={styles.ViewAllButText}>{strings.ViewAll}</Text>
              <Image style={styles.ViewAllButIcon} source={Images.downArrow} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={transactionHistory}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.FlatListBody}>
                <View style={styles.headerBody}>
                  <Text numberOfLines={1} style={styles.headerText}>
                    {item.title}
                  </Text>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
                <Text style={{color: color.darkLight}}>
                  {item.date} - {item.time}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default WalletScreen;

const ThemeStyle = color =>
  StyleSheet.create({
    walletBody: {
      flex: 1,
      paddingTop: hp(3),
      paddingHorizontal: wp(6),
    },
    mywalletCardBody: {
      borderRadius: 10,
      paddingVertical: hp(3),
      paddingHorizontal: wp(6),
      backgroundColor: color.commonBlue,
    },
    mywalletCardName: {
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: hp(3),
      fontSize: fontSize(18),
    },
    mywalletCardBalanceTitle: {
      fontWeight: '500',
      color: '#fff',
      marginBottom: hp(1),
      fontSize: fontSize(16),
    },
    mywalletCardBalanceBody: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mywalletCardBalance: {
      fontWeight: 'bold',
      color: '#fff',
      fontSize: fontSize(25),
    },
    topUpBut: {
      borderRadius: 50,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: hp(1.3),
      paddingHorizontal: wp(4),
    },
    topUpIcon: {
      width: wp(5),
      height: wp(5),
      marginEnd: wp(1),
    },
    transactionHistoryHeader: {
      paddingTop: hp(4),
      flexDirection: 'row',
      paddingBottom: hp(2),
      alignItems: 'center',
    },
    headerText: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: fontSize(20),
      color: color.black,
    },
    transactionHistoryViewAllBut: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ViewAllButText: {
      marginEnd: wp(3),
      fontWeight: '600',
      color: color.commonBlue,
    },
    ViewAllButIcon: {
      width: wp(6),
      height: wp(6),
      tintColor: color.commonBlue,
      transform: [{rotate: '270deg'}],
    },
    FlatListBody: {
      borderBottomWidth: 1,
      paddingVertical: hp(2),
      borderColor: color.grey,
    },
    headerBody: {
      flexDirection: 'row',
      marginBottom: hp(1),
    },
    headerText: {
      flex: 1,
      fontWeight: '600',
      fontSize: fontSize(18),
      color: color.black,
    },
    priceText: {
      fontSize: fontSize(18),
      color: color.black,
    },
  });
