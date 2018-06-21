import _ from 'lodash';

function isNonEmptyString(str) {
    return _.isString(str) && str !== '';
}

function encode(value) {
    try {
        return encodeURIComponent(value);
    } catch (e) {
        console.error(`encodeURIComponent ${value} error`);
    }
}

function decode(value) {
    try {
        return decodeURIComponent(value);
    } catch (e) {
        console.error(`decodeURIComponent ${value} error`);
    }
}

const cookie = {
    parse() {
        const pairs = document.cookie.split('; ');

        if (pairs[0] === '') return {};

        return pairs.reduce((pre, cur) => {
            const [key, value] = cur.split('=');
            pre[key] = value;
            return pre;
        }, {});
    },

    set(name, value, option = {}) {
        if (!isNonEmptyString(name)) {
            throw new TypeError('Cookie name must be a non-empty string');
        }

        value = encode(String(value));
        let text = name + '=' + value;

        let {expires, domain, path, maxAge} = option;

        // maxAge
        if (_.isNumber(maxAge)) {
            expires = new Date(+new Date + maxAge);
        }

        if (expires instanceof Date) text += `; expires=${expires.toUTCString()}`;
        if (isNonEmptyString(domain)) text += `; path=${domain}`;
        if (isNonEmptyString(path)) text += `; path=${path}`;

        document.cookie = text;
        return text;
    },

    get(name, shouldDecode) {
        if (!isNonEmptyString(name)) {
            throw new TypeError('Cookie name must be a non-empty string');
        }

        const value = cookie.parse()[name] || null;
        if (shouldDecode) {
            return decode(value);
        } else {
            return value;
        }
    },

    remove(name) {
        cookie.set(name, '', new Date(0));
    }
};

export default cookie;
