
export class LanguageHandler {
    constructor() {
        this._data = {};
        this._lang = null;
    }
    setData(name, data) {
        this._data[name] = data;
    }
    set lang(name) {
        this._lang = name;
    }
    t(key) {
        if (!(this._lang in this._data))
            return key;
        if (!(key in this._data[this._lang]))
            return key;
        return this._data[this._lang][key];
    }
}

export default new LanguageHandler();
