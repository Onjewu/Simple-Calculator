import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const buttons = [
  ['C', '+/-', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

export default function Calculator() {
  const [display, setDisplay]   = useState('0');
  const [firstVal, setFirstVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitNext, setWaitNext] = useState(false);

  const handlePress = (btn) => {
    // Clear
    if (btn === 'C') {
      setDisplay('0');
      setFirstVal(null);
      setOperator(null);
      setWaitNext(false);
      return;
    }

    // Toggle positive / negative
    if (btn === '+/-') {
      setDisplay((prev) => String(parseFloat(prev) * -1));
      return;
    }

    // Percentage
    if (btn === '%') {
      setDisplay((prev) => String(parseFloat(prev) / 100));
      return;
    }

    // Operators
    if (['+', '-', '*', '/'].includes(btn)) {
      setFirstVal(parseFloat(display));
      setOperator(btn);
      setWaitNext(true);
      return;
    }

    // Equals
    if (btn === '=') {
      if (operator === null || firstVal === null) return;
      const second = parseFloat(display);
      let result;
      switch (operator) {
        case '+': result = firstVal + second; break;
        case '-': result = firstVal - second; break;
        case '*': result = firstVal * second; break;
        case '/': result = second !== 0 ? firstVal / second : 'Error'; break;
        default:  result = second;
      }
      setDisplay(String(result));
      setFirstVal(null);
      setOperator(null);
      setWaitNext(false);
      return;
    }

    // Decimal point
    if (btn === '.') {
      if (waitNext) {
        setDisplay('0.');
        setWaitNext(false);
        return;
      }
      if (!display.includes('.')) setDisplay((prev) => prev + '.');
      return;
    }

    // Number digits
    if (waitNext) {
      setDisplay(btn);
      setWaitNext(false);
    } else {
      setDisplay((prev) => (prev === '0' ? btn : prev + btn));
    }
  };

  const getButtonStyle = (btn) => {
    if (btn === '0') return [styles.btn, styles.btnWide];
    if (['+', '-', '*', '/', '='].includes(btn)) return [styles.btn, styles.btnOperator];
    if (['C', '+/-', '%'].includes(btn)) return [styles.btn, styles.btnTop];
    return [styles.btn];
  };

  const getTextStyle = (btn) => {
    if (['+', '-', '*', '/', '=', 'C', '+/-', '%'].includes(btn)) return [styles.btnText, styles.btnTextDark];
    return [styles.btnText];
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* Display */}
        <View style={styles.displayContainer}>
          <Text style={styles.subDisplay}>
            {firstVal !== null ? `${firstVal} ${operator}` : ''}
          </Text>
          <Text
            style={styles.mainDisplay}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {display}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {buttons.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {row.map((btn) => (
                <TouchableOpacity
                  key={btn}
                  style={getButtonStyle(btn)}
                  onPress={() => handlePress(btn)}
                  activeOpacity={0.7}
                >
                  <Text style={getTextStyle(btn)}>{btn}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

const BTN_SIZE = 80;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },

  // ── Display ──────────────────────────────────────────────
  displayContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  subDisplay: {
    fontSize: 22,
    color: '#888',
    marginBottom: 4,
  },
  mainDisplay: {
    fontSize: 72,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -2,
  },

  // ── Buttons ───────────────────────────────────────────────
  buttonsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWide: {
    width: BTN_SIZE * 2 + 12,
    alignItems: 'flex-start',
    paddingLeft: 30,
    borderRadius: BTN_SIZE / 2,
  },
  btnOperator: {
    backgroundColor: '#FF9F0A',
  },
  btnTop: {
    backgroundColor: '#A5A5A5',
  },
  btnText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#fff',
  },
  btnTextDark: {
    color: '#000',
  },
});
