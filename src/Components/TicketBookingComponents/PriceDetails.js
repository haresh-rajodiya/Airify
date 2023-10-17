import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CardHeader from './CardHeader';
import {Images} from '../../helper/IconConstant';
import {useSelector} from 'react-redux';
import {fontSize, hp, wp} from '../../helper/Constant';
import {color} from '../../helper/ColorConstant';
import {strings} from '../../helper/Strings';

const PriceDetails = () => {
  const item = useSelector(state => state.searchFlight.searchFlightCardData);
  const searchFlightData = useSelector(e => e?.place?.searchFlightData);
  const totalSeat = Number(searchFlightData.passenger.split(' ')[0]);
  const ticketPrice = parseInt(item?.price.slice(1, 8).split(',').join(''), 10);
  const insurancePrice = Math.round((totalSeat * ticketPrice * 2.8) / 100);
  const travelTax = Math.round((totalSeat * ticketPrice * 1.5) / 100);
  return (
    <View style={styles.cardBody}>
      <CardHeader
        FirstImage={Images.dollarIcon}
        header={strings.Pice_Detail_string}
      />
      <View style={styles.ticketPriceViewStyle}>
        <View style={styles.priceViewStyle}>
          <Text numberOfLines={1} style={styles.priceTextStyle}>
            {item.airlineName}{' '}
            {`(${strings.Adult}) x ${Number(
              searchFlightData.passenger.split(' ')[0],
            )} `}
          </Text>
          <Text numberOfLines={1} style={styles.priceTextStyle}>
            ${totalSeat * ticketPrice}.00
          </Text>
        </View>
        <View style={styles.priceViewStyle}>
          <Text numberOfLines={1} style={styles.priceTextStyle}>
            {strings.travel_inssurance}
          </Text>
          <Text style={styles.priceTextStyle}>${insurancePrice}.00</Text>
        </View>
        <View style={styles.priceViewStyle}>
          <Text numberOfLines={1} style={styles.priceTextStyle}>
            {strings.tax}
          </Text>
          <Text style={styles.priceTextStyle}>${travelTax}.00</Text>
        </View>
      </View>
      <View style={styles.priceViewStyle}>
        <Text numberOfLines={1} style={styles.priceTextStyle}>
          {strings.total_price}
        </Text>
        <Text numberOfLines={1} style={styles.priceTextStyle}>
          ${totalSeat * ticketPrice + insurancePrice + travelTax}.00
        </Text>
      </View>
    </View>
  );
};

export default PriceDetails;

const styles = StyleSheet.create({
  priceTextStyle: {
    fontSize: fontSize(17),
    fontWeight: '600',
    color: color.black,
  },
  priceViewStyle: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: hp(1),
    justifyContent: 'space-between',
  },
  ticketPriceViewStyle: {
    marginVertical: hp(1),
    borderBottomWidth: 0.5,
    borderColor: '#e2e2e2',
  },
  cardBody: {
    backgroundColor: color.white,
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
    borderRadius: 10,
    borderColor: '#000',
  },
  plusIconStyle: {
    height: hp(2),
    width: hp(2),
  },
});
