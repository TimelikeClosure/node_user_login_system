"use strict";

class Timeout {
    constructor(callback, delay = 0, ...params){
        this.timeout = setTimeout(() => {
            this.timeout = null;
            callback(...params);
        }, delay);
    }

    isActive(){
        return this.timeout !== null;
    }

    clear(){
        this.timeout = null;
        return clearTimeout(this.timeout);
    }

    ifActive(callback, clear = false){
        return (...args) => {
            if (this.isActive()){
                clear && this.clear();
                return callback(...args);
            }
        };
    }
}

module.exports = exports = Timeout;