import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import ToggleSwitch from 'toggle-switch-react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {strings} from '../../helper/Strings';
import {Images} from '../../helper/IconConstant';
import {color} from '../../helper/ColorConstant';
import {fontSize, hp, wp} from '../../helper/Constant';
import {SettingData} from '../../assets/DummyData/SettingData';
import {CommonHeader, OnBoardingTwoButton, TextData} from '../../components';

const AccountScreen = ({navigation}) => {
  const [modal, setModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [toggleSwitchBut, setToggleSwitchBut] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();

  useEffect(() => {
    getData();
    UserData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('DarkMode');
      setToggleSwitchBut(JSON.parse(jsonValue));
      const languageData = await AsyncStorage.getItem('selected_Language');
      setSelectedLanguage(JSON.parse(languageData));
    } catch (e) {
      console.log('getData error :>> ', e);
    }
  };

  const DarkModeAsyncStorage = async isOn => {
    try {
      await AsyncStorage.setItem('DarkMode', JSON.stringify(isOn));
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const UserData = async () => {
    const journeyData = await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get();
    setUserData(journeyData.data());
  };

  const openModal = () => {
    setModal(true);
  };
  const closeModal = async () => {
    setModal(false);
  };

  return (
    <View style={styles.container}>
      <CommonHeader
        Images2={null}
        onPress1={false}
        onPress2={false}
        navigation1={() => {}}
        navigation2={() => {}}
        Images1={Images.planIcon}
        headerName={strings.account}
      />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.headerStyle}>
          <View style={styles.profilePicViewStyle}>
            <Image
              resizeMode="stretch"
              style={styles.profilePicStyle}
              source={{uri: userData?.profileImageURL}}
            />
            <View style={styles.headertextStyle}>
              <Text style={styles.NameStyle}>{userData?.Name}</Text>
              <Text style={styles.userNameStyle}>{userData?.Email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellTouchStyle}>
            <Image
              resizeMode="stretch"
              source={Images.quCode}
              style={styles.bellStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionListStyle}>
          <SectionList
            sections={SettingData}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={true}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.listTouchStyle}
                  disabled={item.title == 'Dark Mode' ? true : false}
                  onPress={() => {
                    item.title !== 'Logout'
                      ? navigation.navigate(item.screen)
                      : openModal();
                  }}>
                  <View>
                    <Image
                      source={item.icon}
                      style={[
                        styles.listImageDiffStyle,
                        {
                          tintColor:
                            item.title == 'Logout' ? color.red : color.black,
                        },
                      ]}
                      resizeMode="stretch"
                    />
                  </View>
                  <View style={styles.listTextViewStyle}>
                    {item.title == 'Language' ? (
                      <View style={styles.listConditionStyle}>
                        <Text style={styles.listTitleTextStyle}>
                          {item.title}
                        </Text>
                        <Text
                          style={[
                            styles.listTitleTextStyle,
                            {color: color.commonBlue},
                          ]}>
                          {selectedLanguage?.language}
                        </Text>
                      </View>
                    ) : item.title == 'Dark Mode' ? (
                      <Text style={styles.listTitleTextStyle}>
                        {item.title}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.listTitleTextStyle,
                          {
                            color:
                              item.title == 'Logout' ? color.red : color.black,
                          },
                        ]}>
                        {item.title}
                      </Text>
                    )}
                  </View>
                  <View>
                    {item.title !== 'Logout' && item.title !== 'Dark Mode' ? (
                      <Image
                        source={Images.forward}
                        style={styles.forwardIconStyle}
                        resizeMode="contain"
                      />
                    ) : item.title == 'Dark Mode' ? (
                      <View style={{right: 20}}>
                        <ToggleSwitch
                          size="medium"
                          isOn={toggleSwitchBut}
                          onColor={color.commonBlue}
                          onToggle={isOn => {
                            setToggleSwitchBut(isOn);
                            DarkModeAsyncStorage(isOn);
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            }}
            renderSectionHeader={({section: {header}}) => (
              <View style={styles.listHeaderViewStyle}>
                <Text style={styles.header}>{header}</Text>
                <View
                  style={[
                    styles.listHeaderLineStyle,
                    {
                      width:
                        header === 'General'
                          ? '80%'
                          : header === 'About'
                          ? '80%'
                          : '95%',
                    },
                  ]}></View>
              </View>
            )}
          />
        </View>
      </ScrollView>
      <Modal
        isVisible={modal}
        backdropOpacity={0.8}
        onDismiss={closeModal}
        onBackdropPress={closeModal}
        style={styles.modalStyle}>
        <View style={styles.modalViewStyle}>
          <View style={styles.modalsubViewStyle}>
            <TextData
              text={strings.logout}
              textStyle={styles.modalLogoutTextStyle}
            />
            <View style={styles.lineStyle} />
            <TextData
              text={strings.logoutText}
              textStyle={[
                styles.modalLogoutTextStyle,
                {color: color.black, marginTop: hp(2)},
              ]}
            />
            <View style={styles.TwoButtonViewStyle}>
              <OnBoardingTwoButton
                buttonTextOne={strings.cancel}
                buttonTextTwo={strings.logoutYes}
                TwoButtonStyle={styles.TwoButtonStyle}
                onPress1={() => {
                  closeModal();
                }}
                onPress2={() => {
                  auth().signOut();
                  navigation.navigate('WelcomeScreen');
                  closeModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  headerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hp(2),
    marginHorizontal: wp(6.66),
    justifyContent: 'space-between',
  },
  profilePicViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicStyle: {
    width: hp(7.38),
    height: hp(7.38),
    borderRadius: 100,
  },
  headertextStyle: {marginHorizontal: 10},
  userNameStyle: {
    marginVertical: 5,
    color: color.black,
    fontSize: fontSize(12),
  },
  bellTouchStyle: {
    padding: hp(1.2),
    borderRadius: 100,
    borderColor: color.black,
  },
  bellStyle: {height: hp(3.07), width: hp(3.07), tintColor: color.black},
  NameStyle: {
    fontWeight: '500',
    color: color.black,
  },
  listTouchStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp(2.4),
    marginHorizontal: wp(6),
  },
  listImageDiffStyle: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  listImageViewStyle: {
    borderWidth: 1,
    padding: hp(1.7),
    borderRadius: 100,
    borderColor: color.grey,
  },
  listImageStyle: {
    width: hp(4),
    height: hp(4),
  },
  listTextViewStyle: {
    width: '75%',
    marginHorizontal: 15,
  },
  listTitleTextStyle: {
    fontWeight: '600',
    fontSize: fontSize(16),
  },
  listDiscriptionTextStyle: {
    color: color.black,
  },
  forwardIconStyle: {
    width: hp(3),
    height: wp(3),
    resizeMode: 'contain',
  },
  listHeaderViewStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: wp(3),
  },
  listHeaderLineStyle: {
    borderWidth: 0.5,
    borderColor: color.grey,
    marginHorizontal: wp(3),
  },
  header: {
    fontSize: fontSize(14),
  },
  listConditionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalStyle: {
    margin: wp(0),
    justifyContent: 'flex-end',
  },
  modalViewStyle: {
    height: hp(30),
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalsubViewStyle: {
    marginTop: hp(5),
    alignItems: 'center',
  },
  modalLogoutTextStyle: {
    color: color.red,
    fontWeight: '700',
    fontSize: fontSize(18),
  },
  lineStyle: {
    height: 2,
    marginTop: hp(2),
    marginHorizontal: wp(5),
    paddingHorizontal: wp(42),
    backgroundColor: color.lightGray,
  },
  TwoButtonViewStyle: {
    marginTop: hp(4),
  },
});
