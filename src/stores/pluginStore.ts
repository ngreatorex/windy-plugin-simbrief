import { writable } from 'svelte/store';

const STORAGE_KEY = 'windy-plugin-simbrief/username';

const initialValue = localStorage.getItem(STORAGE_KEY);

export const simbriefUsernameStore = writable(initialValue);
simbriefUsernameStore.subscribe((value) => {
    if (value != null) {
        localStorage.setItem(STORAGE_KEY, value);
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
});