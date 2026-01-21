import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createMMKV } from 'react-native-mmkv';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create MMKV storage instance
const storage = createMMKV();

type RootStackParamList = {
  HomeTabs: undefined;
  Explore: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  const [inputValue, setInputValue] = useState('');
  const [storedValue, setStoredValue] = useState<string | undefined>('');
  const [visitCount, setVisitCount] = useState(0);

  // Load stored values on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = () => {
    // Get string value
    const value = storage.getString('userInput');
    setStoredValue(value);

    // Get visit count
    const count = storage.getNumber('visitCount') || 0;
    setVisitCount(count);

    // Increment visit count
    storage.set('visitCount', count + 1);
    setVisitCount(count + 1);
  };

  const saveValue = () => {
    if (inputValue.trim()) {
      storage.set('userInput', inputValue);
      setStoredValue(inputValue);
      setInputValue('');
    }
  };

  const deleteValue = () => {
    storage.remove('userInput');
    setStoredValue(undefined);
    setInputValue('');
  };

  const clearAll = () => {
    storage.clearAll();
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

function ExploreScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Find new places and ideas here.</Text>
      <FontAwesome name="rocket" size={30} color="#900" />

    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'Home' }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerTitle: 'Explore' }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Explore"
            component={ExploreScreen}
            options={{ title: 'Explore' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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

export default App;
