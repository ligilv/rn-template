import { atom, useAtom, useAtomValue, useSetAtom, type Atom, type PrimitiveAtom, type WritableAtom, type SetStateAction } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { localStorage, jsonStorage, numberStorage, booleanStorage } from './storage';

/**
 * Jotai utility functions for common state management patterns
 */

/**
 * Create a persisted atom that syncs with MMKV storage
 * @param key - Storage key
 * @param initialValue - Initial value if not found in storage
 * @returns A persisted atom
 */
export function atomWithMMKV<T>(key: string, initialValue: T): PrimitiveAtom<T> {
    return atomWithStorage<T>(
        key,
        initialValue,
        {
            getItem: (storageKey: string) => {
                try {
                    const value = jsonStorage.getItem<T>(storageKey);
                    return value ?? initialValue;
                } catch {
                    return initialValue;
                }
            },
            setItem: (storageKey: string, value: T) => {
                try {
                    jsonStorage.setItem(storageKey, value);
                } catch (error) {
                    console.error(`Error setting atom storage for key "${storageKey}":`, error);
                }
            },
            removeItem: (storageKey: string) => {
                try {
                    jsonStorage.removeItem(storageKey);
                } catch (error) {
                    console.error(`Error removing atom storage for key "${storageKey}":`, error);
                }
            },
        },
        { getOnInit: true }
    );
}

/**
 * Create a persisted string atom
 */
export function atomWithMMKVString(key: string, initialValue: string = ''): PrimitiveAtom<string> {
    return atomWithStorage<string>(
        key,
        initialValue,
        {
            getItem: (storageKey: string) => {
                try {
                    return localStorage.getItem(storageKey) ?? initialValue;
                } catch {
                    return initialValue;
                }
            },
            setItem: (storageKey: string, value: string) => {
                try {
                    localStorage.setItem(storageKey, value);
                } catch (error) {
                    console.error(`Error setting string atom storage for key "${storageKey}":`, error);
                }
            },
            removeItem: (storageKey: string) => {
                try {
                    localStorage.removeItem(storageKey);
                } catch (error) {
                    console.error(`Error removing string atom storage for key "${storageKey}":`, error);
                }
            },
        },
        { getOnInit: true }
    );
}

/**
 * Create a persisted number atom
 */
export function atomWithMMKVNumber(key: string, initialValue: number = 0): PrimitiveAtom<number> {
    return atomWithStorage<number>(
        key,
        initialValue,
        {
            getItem: (storageKey: string) => {
                try {
                    return numberStorage.getItem(storageKey) ?? initialValue;
                } catch {
                    return initialValue;
                }
            },
            setItem: (storageKey: string, value: number) => {
                try {
                    numberStorage.setItem(storageKey, value);
                } catch (error) {
                    console.error(`Error setting number atom storage for key "${storageKey}":`, error);
                }
            },
            removeItem: (storageKey: string) => {
                try {
                    numberStorage.removeItem(storageKey);
                } catch (error) {
                    console.error(`Error removing number atom storage for key "${storageKey}":`, error);
                }
            },
        },
        { getOnInit: true }
    );
}

/**
 * Create a persisted boolean atom
 */
export function atomWithMMKVBoolean(key: string, initialValue: boolean = false): PrimitiveAtom<boolean> {
    return atomWithStorage<boolean>(
        key,
        initialValue,
        {
            getItem: (storageKey: string) => {
                try {
                    return booleanStorage.getItem(storageKey) ?? initialValue;
                } catch {
                    return initialValue;
                }
            },
            setItem: (storageKey: string, value: boolean) => {
                try {
                    booleanStorage.setItem(storageKey, value);
                } catch (error) {
                    console.error(`Error setting boolean atom storage for key "${storageKey}":`, error);
                }
            },
            removeItem: (storageKey: string) => {
                try {
                    booleanStorage.removeItem(storageKey);
                } catch (error) {
                    console.error(`Error removing boolean atom storage for key "${storageKey}":`, error);
                }
            },
        },
        { getOnInit: true }
    );
}

/**
 * Create a derived atom that computes a value from other atoms
 * @param baseAtom - The base atom to derive from
 * @param transform - Function to transform the base value
 * @returns A derived atom
 */
export function createDerivedAtom<T, R>(
    baseAtom: Atom<T>,
    transform: (value: T) => R
): Atom<R> {
    return atom((get) => transform(get(baseAtom)));
}

/**
 * Create a toggle atom from a boolean atom
 * @param booleanAtom - The boolean atom to toggle
 * @returns A writable atom that toggles the boolean value when written to
 */
export function createToggleAtom(booleanAtom: PrimitiveAtom<boolean>): WritableAtom<null, [], void> {
    return atom(null, (get, set) => {
        set(booleanAtom, !get(booleanAtom));
    });
}

/**
 * Create an atom with increment/decrement functionality
 * @param numberAtom - The number atom to increment/decrement
 * @returns An object with increment and decrement functions
 */
export function createCounterAtom(numberAtom: PrimitiveAtom<number>) {
    return {
        increment: atom(null, (get, set, by: number = 1) => {
            set(numberAtom, get(numberAtom) + by);
        }),
        decrement: atom(null, (get, set, by: number = 1) => {
            set(numberAtom, get(numberAtom) - by);
        }),
        reset: atom(null, (get, set, value: number = 0) => {
            set(numberAtom, value);
        }),
    };
}

/**
 * Create a writable derived atom
 * @param baseAtom - The base atom
 * @param read - Read function to transform the base value
 * @param write - Write function to update the base atom
 * @returns A writable derived atom
 */
export function createWritableDerivedAtom<T, R>(
    baseAtom: PrimitiveAtom<T>,
    read: (value: T) => R,
    write: (get: <V>(atom: Atom<V>) => V, set: <V>(atom: WritableAtom<V, [SetStateAction<V>], void>, value: SetStateAction<V>) => void, newValue: SetStateAction<R>) => void
): WritableAtom<R, [SetStateAction<R>], void> {
    return atom(
        (get) => read(get(baseAtom)),
        (get, set, newValue: SetStateAction<R>) => write(get, set, newValue)
    );
}

/**
 * Hook to only read an atom value (alias for useAtomValue)
 * @param atom - The atom to read
 * @returns The atom value
 */
export function useAtomRead<T>(atom: Atom<T>): T {
    return useAtomValue(atom);
}

/**
 * Hook to only set an atom value (alias for useSetAtom)
 * @param atom - The atom to set
 * @returns Setter function
 */
export function useAtomWrite<T>(atom: PrimitiveAtom<T>): (value: T) => void {
    return useSetAtom(atom);
}

/**
 * Create a selector atom for filtering/selecting from an array atom
 * @param arrayAtom - The array atom
 * @param selector - Function to select items from the array
 * @returns A derived atom with selected items
 */
export function createSelectorAtom<T, R>(
    arrayAtom: Atom<T[]>,
    selector: (item: T) => boolean
): Atom<T[]> {
    return atom((get) => get(arrayAtom).filter(selector));
}

/**
 * Create a sorted atom from an array atom
 * @param arrayAtom - The array atom
 * @param compareFn - Comparison function for sorting
 * @returns A derived atom with sorted array
 */
export function createSortedAtom<T>(
    arrayAtom: Atom<T[]>,
    compareFn?: (a: T, b: T) => number
): Atom<T[]> {
    return atom((get) => {
        const arr = [...get(arrayAtom)];
        return compareFn ? arr.sort(compareFn) : arr.sort();
    });
}

/**
 * Create an async atom with loading and error states
 * @param asyncFn - Async function to fetch data
 * @returns An async atom
 */
export function createAsyncAtom<T>(
    asyncFn: () => Promise<T>
): Atom<Promise<T>> {
    return atom(async () => {
        try {
            return await asyncFn();
        } catch (error) {
            console.error('Error in async atom:', error);
            throw error;
        }
    });
}

/**
 * Create a debounced atom that delays updates
 * Note: This creates a writable derived atom that debounces writes
 * @param baseAtom - The base atom
 * @param delay - Delay in milliseconds
 * @returns A debounced writable atom
 */
export function createDebouncedAtom<T>(
    baseAtom: PrimitiveAtom<T>,
    delay: number = 300
): WritableAtom<T, [SetStateAction<T>], void> {
    const timeoutMap = new WeakMap<PrimitiveAtom<T>, ReturnType<typeof setTimeout>>();

    return atom(
        (get) => get(baseAtom),
        (get, set, newValue: SetStateAction<T>) => {
            const existingTimeout = timeoutMap.get(baseAtom);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }

            const timeoutId = setTimeout(() => {
                set(baseAtom, newValue);
                timeoutMap.delete(baseAtom);
            }, delay);

            timeoutMap.set(baseAtom, timeoutId);
        }
    );
}

// Re-export commonly used Jotai functions for convenience
export { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
export type { Atom, PrimitiveAtom, WritableAtom } from 'jotai';
