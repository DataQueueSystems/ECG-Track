import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import CustomText from '../../customText/CustomText';
import { fonts } from '../../customText/fonts';

export default function CustomDropdown({ label, options, value, onChange }) {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  const handleSelect = (item) => {
    onChange(item);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
          <CustomText style={[styles.label,{fontFamily:fonts.Medium}]}>{label} : </CustomText>
      <TouchableOpacity
        style={[styles.dropdown, { borderColor: theme.colors.primary }]}
        onPress={() => setIsVisible(true)}>
        <CustomText style={styles.selectedCustomText}>
          {value ? options.find((opt) => opt.value === value)?.label : 'Select'}
        </CustomText>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent,{backgroundColor:theme.colors.background}]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}>
                  <CustomText style={[styles.optionCustomText,{fontFamily:fonts.Regular}]}>{item.label}</CustomText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.error }]}
              onPress={() => setIsVisible(false)}>
              <CustomText style={[styles.closeButtonCustomText,{fontFamily:fonts.SemiBold}]}>Close</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  selectedCustomText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionCustomText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonCustomText: {
    color: 'white',
  },
});
