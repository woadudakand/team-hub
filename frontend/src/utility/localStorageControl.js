const getItem = (key) => {
    const data = localStorage.getItem(key);

    try {
        return data;
    } catch (err) {
        return data;
    }
};

const setItem = (key, value) => {
    const stringify = value;
    return localStorage.set(key, stringify);
};

const removeItem = (key) => {
    localStorage.removeItem(key);
};

export { getItem, setItem, removeItem };
