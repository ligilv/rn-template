import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { localStorage, numberStorage } from '../utils';

export const HomeScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [storedValue, setStoredValue] = useState<string | undefined>('');
  const [visitCount, setVisitCount] = useState(0);

  // Load stored values on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = () => {
    // Get string value
    const value = localStorage.getItem('userInput');
    setStoredValue(value ?? undefined);

    // Get visit count
    const count = numberStorage.getItem('visitCount') || 0;
    (count);

    // Increment visit count
    numberStorage.setItem('visitCount', count + 1);
    setVisitCount(count + 1);
  };

  const saveValue = () => {
    if (inputValue.trim()) {
      localStorage.setItem('userInput', inputValue);
      setStoredValue(inputValue);
      setInputValue('');
    }
  };

  const deleteValue = () => {
    localStorage.removeItem('userInput');
    setStoredValue(undefined);
    setInputValue('');
  };

  const clearAll = () => {
    localStorage.clear();
    setStoredValue(undefined);
    setVisitCount(0);
    setInputValue('');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>MMKV Storage Example</Text>

      <View style={styles.mmkvContainer}>
        <Text style={styles.sectionTitle}>Storage Demo</Text>

        {/* Visit Counter */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Visit Count:</Text>
          <Text style={styles.infoValue}>{visitCount}</Text>
        </View>

        {/* Current Stored Value */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Stored Value:</Text>
          <Text style={styles.infoValue}>
            {storedValue || '(empty)'}
          </Text>
        </View>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Enter text to store"
          value={inputValue}
          onChangeText={setInputValue}
          placeholderTextColor="#999"
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={saveValue}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={deleteValue}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearAll}>
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          MMKV is a fast key-value storage library. Data persists across app
          restarts.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  mmkvContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  clearButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
