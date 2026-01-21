import { createMMKV } from 'react-native-mmkv';

// Create a single MMKV storage instance
const storage = createMMKV();

/**
 * localStorage-like utility for React Native using MMKV
 * Provides a simple API for storing and retrieving data
 */
export const localStorage = {
    /**
     * Get a string value from storage
     * @param key - The key to retrieve
     * @returns The stored string value or null if not found
     */
    getItem: (key: string): string | null => {
        try {
            const value = storage.getString(key);
            return value ?? null;
        } catch (error) {
            console.error(`Error getting item with key "${key}":`, error);
            return null;
        }
    },

    /**
     * Set a string value in storage
     * @param key - The key to store the value under
     * @param value - The string value to store
     */
    setItem: (key: string, value: string): void => {
        try {
            storage.set(key, value);
        } catch (error) {
            console.error(`Error setting item with key "${key}":`, error);
        }
    },

    /**
     * Remove an item from storage
     * @param key - The key to remove
     */
    removeItem: (key: string): void => {
        try {
            storage.remove(key);
        } catch (error) {
            console.error(`Error removing item with key "${key}":`, error);
        }
    },

    /**
     * Clear all items from storage
     */
    clear: (): void => {
        try {
            storage.clearAll();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },

    /**
     * Get all keys in storage
     * @returns Array of all keys
     */
    getAllKeys: (): string[] => {
        try {
            return storage.getAllKeys();
        } catch (error) {
            console.error('Error getting all keys:', error);
            return [];
        }
    },

    /**
     * Check if a key exists in storage
     * @param key - The key to check
     * @returns True if the key exists, false otherwise
     */
    hasKey: (key: string): boolean => {
        try {
            return storage.contains(key);
        } catch (error) {
            console.error(`Error checking key "${key}":`, error);
            return false;
        }
    },
};

/**
 * JSON storage utility for storing and retrieving objects
 */
export const jsonStorage = {
    /**
     * Get a JSON object from storage
     * @param key - The key to retrieve
     * @returns The parsed object or null if not found or invalid
     */
    getItem: <T = any>(key: string): T | null => {
        try {
            const value = storage.getString(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            console.error(`Error getting JSON item with key "${key}":`, error);
            return null;
        }
    },

    /**
     * Set a JSON object in storage
     * @param key - The key to store the value under
     * @param value - The object to store (will be stringified)
     */
    setItem: <T = any>(key: string, value: T): void => {
        try {
            const stringValue = JSON.stringify(value);
            storage.set(key, stringValue);
        } catch (error) {
            console.error(`Error setting JSON item with key "${key}":`, error);
        }
    },

    /**
     * Remove an item from storage
     * @param key - The key to remove
     */
    removeItem: (key: string): void => {
        localStorage.removeItem(key);
    },
};

/**
 * Number storage utility for storing and retrieving numbers
 */
export const numberStorage = {
    /**
     * Get a number value from storage
     * @param key - The key to retrieve
     * @returns The stored number or null if not found
     */
    getItem: (key: string): number | null => {
        try {
            const value = storage.getNumber(key);
            return value ?? null;
        } catch (error) {
            console.error(`Error getting number item with key "${key}":`, error);
            return null;
        }
    },

    /**
     * Set a number value in storage
     * @param key - The key to store the value under
     * @param value - The number value to store
     */
    setItem: (key: string, value: number): void => {
        try {
            storage.set(key, value);
        } catch (error) {
            console.error(`Error setting number item with key "${key}":`, error);
        }
    },

    /**
     * Remove an item from storage
     * @param key - The key to remove
     */
    removeItem: (key: string): void => {
        localStorage.removeItem(key);
    },
};

/**
 * Boolean storage utility for storing and retrieving booleans
 */
export const booleanStorage = {
    /**
     * Get a boolean value from storage
     * @param key - The key to retrieve
     * @returns The stored boolean or null if not found
     */
    getItem: (key: string): boolean | null => {
        try {
            const value = storage.getBoolean(key);
            return value ?? null;
        } catch (error) {
            console.error(`Error getting boolean item with key "${key}":`, error);
            return null;
        }
    },

    /**
     * Set a boolean value in storage
     * @param key - The key to store the value under
     * @param value - The boolean value to store
     */
    setItem: (key: string, value: boolean): void => {
        try {
            storage.set(key, value);
        } catch (error) {
            console.error(`Error setting boolean item with key "${key}":`, error);
        }
    },

    /**
     * Remove an item from storage
     * @param key - The key to remove
     */
    removeItem: (key: string): void => {
        localStorage.removeItem(key);
    },
};

// Export the storage instance for advanced usage if needed
export { storage };
