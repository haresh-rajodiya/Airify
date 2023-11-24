import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {View, Text, StyleSheet} from 'react-native';
import {hp, wp} from '../../helper/Constant';
import {Images} from '../../helper/IconConstant';
import {AlertConstant} from '../../helper/AlertConstant';
import {
  OnBoardingModuleHeader,
  OnBoardingSingleButton,
  OnBoardingTextInput,
} from '../../components';
import {useSelector} from 'react-redux';

const ResetPassword = ({navigation: {goBack}, navigation}) => {
  const [email, setEmail] = useState('');
  const strings = useSelector(state => state?.languageReducer?.languageObject);
  const validation = () => {
    if (!email.trim().match('[a-z0-9]+@[a-z]+.[a-z]{2,3}')) {
      AlertConstant(strings.enter_valid_email);
      return;
    } else {
      sendOTP();
    }
  };

  const sendOTP = async () => {
    try {
      await auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          AlertConstant(strings.pasword_reset_email_send);
        })
        .catch(err => {
          console.log('err :>> ', err);
        });
    } catch (error) {
      console.log('error :>> ', error);
    }
    await auth().signOut();
    navigation.navigate('SignInScreen');
  };
  const color = useSelector(state => state?.themereducer?.colorTheme);
  const styles = ThemeStyle(color);
  return (
    <View style={styles.container}>
      <View style={{flex: 0.27, backgroundColor: 'blue'}}>
        <OnBoardingModuleHeader
          onPress={() => {
            goBack();
          }}
          SubText={strings.HeaderSub}
          backImage={Images.backIcon}
          MainText={strings.HeaderMain}
        />
      </View>
      <View style={{flex: 0.73, marginTop: hp(3)}}>
        <Text style={styles.textInputTitleStyle}>{strings.EmailText}</Text>
        <OnBoardingTextInput
          value={email}
          textInputIcon={Images.Email}
          keyboardType={'email-address'}
          onChangeText={email => setEmail(email)}
          textInputPlaceholder={strings.EmailText}
        />
        <View style={styles.buttonViewStyle}>
          <View style={[styles.lineStyle]} />
          <OnBoardingSingleButton
            buttonText={strings.EmailSend}
            buttonStyle={styles.buttonStyle}
            onPress={() => {
              validation();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const ThemeStyle = color =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    textInputTitleStyle: {
      color: 'black',
      marginLeft: wp(6),
    },
    signUpStyle: {
      alignSelf: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: wp(22),
      justifyContent: 'space-around',
    },
    buttonStyle: {
      height: hp(6),
      marginTop: hp(3),
    },
    lineStyle: {
      height: 1,
      marginHorizontal: wp(5),
      backgroundColor: '#ECEFEF',
    },
    buttonViewStyle: {flex: 1, justifyContent: 'flex-end', marginBottom: hp(4)},
  });

export default ResetPassword;
