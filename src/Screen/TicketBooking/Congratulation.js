import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackActions, useRoute} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {fontSize, hp, wp} from '../../helper/Constant';
import {strings} from '../../helper/Strings';
import {color} from '../../helper/ColorConstant';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

const Congratulation = ({navigation, route}) => {
  const tripType = route?.params?.TripType;
  const header = route?.params?.header;
  console.log('=>>>>>>>>> tripTyope', tripType);
  console.log('=>>>>>>>>> headerType', header);
  const totalPaymentList = useSelector(e => e.SelectSeatData.totalPaymentList);
  const [UserPointData, setUserPointData] = useState({});

  console.log('totalPaymentList>>>>>>>>>>>>>', totalPaymentList);
  const getUserPointData = async () => {
    await firestore()
      .collection('Points')
      .onSnapshot(querySnapshot => {
        querySnapshot?.forEach(documentSnapshot => {
          if (documentSnapshot.id == auth().currentUser.uid) {
            setUserPointData(documentSnapshot?.data());
          }
        });
      });
  };

  const setPoint = async () => {
    await firestore()
      .collection('Points')
      .doc(auth().currentUser.uid)
      .update({
        TotalPoints:
          Number(UserPointData?.TotalPoints) +
          (totalPaymentList.return
            ? totalPaymentList.return.points.getPoint +
              totalPaymentList.departure.points.getPoint
            : totalPaymentList.departure.points.getPoint),
        PointsHistory: [
          {
            title: 'points',
            price: `+${
              totalPaymentList.return
                ? totalPaymentList.return.points.getPoint +
                  totalPaymentList.departure.points.getPoint
                : totalPaymentList.departure.points.getPoint
            }`,
            date: moment(new Date()).format('MMM D,YYYY'),
            time: new Date().toLocaleTimeString('en-IN'),
          },
          ...UserPointData?.PointsHistory,
        ],
      });
    navigation.navigate(header, {TripType: tripType});
  };
  useEffect(() => {
    getUserPointData();
  }, []);
  return (
    <View
      style={{
        flex: 1,
      }}>
      <StatusBar barStyle={'dark-content'} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: wp(6),
        }}>
        <LottieView
          source={require('../../helper/Congratulation.json')}
          autoPlay
          loop
          style={{
            height: hp(20),
            width: wp(100),
          }}
        />
        <Text
          style={{
            fontSize: fontSize(25),
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: hp(2),
            color: '#000',
          }}>
          {strings.you_earned}{' '}
          {totalPaymentList.return
            ? totalPaymentList.return.points.getPoint +
              totalPaymentList.departure.points.getPoint
            : totalPaymentList.departure.points.getPoint}{' '}
          {strings.points}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginTop: hp(2),
            color: '#000',
          }}>
          {strings.use_your_point}
        </Text>
      </View>
      <View style={styles.bottomButtonBody}>
        <TouchableOpacity
          onPress={() => {
            setPoint();
          }}
          style={styles.okButton}>
          <Text style={styles.okButtonText}>{strings.ok}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Congratulation;

const styles = StyleSheet.create({
  bottomButtonBody: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(6),
    paddingTop: hp(2),
    paddingBottom: hp(4),
    flexDirection: 'row',
  },

  okButton: {
    backgroundColor: color.commonBlue,
    paddingVertical: hp(2),
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
  },
  okButtonText: {
    fontSize: fontSize(18),
    fontWeight: '500',
    color: '#fff',
  },
});
