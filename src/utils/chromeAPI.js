/* global chrome */
class ChromeStorage {
    /**
     * set localStorage item
     * @param {string} itemName 
     * @param {any} value 
     */
    static set (itemName, value) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.set({[itemName]: value}, () => {
                    // success
                    resolve({
                        success: true,
                        result: value
                    })
                });
            } catch (error) {
                resolve({
                    success: false,
                    result: error
                })
            }
        });
    }
    /**
     * get localStorage item
     * @param {string} itemName 
     */
    static get (itemName) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.get([itemName], (result) => {
                    // success
                    resolve({
                        success: true,
                        result: result
                    })
                });
            } catch (error) {
                resolve({
                    success: false,
                    result: error
                })
            }
            
        });
    }
    /**
     * remove localStorage item
     * @param {string} itemName 
     */
    static remove (itemName) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.remove([itemName], () => {
                    // success
                    resolve({
                        success: true
                    })
                });
            } catch (error) {
                resolve({
                    success: false,
                    result: error
                })
            }
            
        });
    }
    /**
     * insert data into localStorage item
     * @param {string} itemName 
     * @param {object} insertData 
     * @param {string} key Used to determine whether insertData is exists
     */
    static insertInto (itemName, insertData, key) {
        return this.get(itemName).then((data) => {
            // get exception
            if (!data.success) {
                return {
                    success: false,
                    isExist: false,
                    result: data.result
                }
            }

            let newItemData = [];
            // localStorage item is exists
            if (typeof data.result[itemName] !== 'undefined') {
                newItemData = [ ...data.result[itemName] ];
                // insertData key is exists
                const isExist = newItemData.find((value) => {
                    return value[key] === insertData[key];
                });
                // insertData is exists return
                if (isExist) {
                    return {
                        success: true,
                        isExist: true,
                        result: newItemData
                    }
                }
            }
            // add insertData
            newItemData.push(insertData);
            return this.set(itemName, newItemData).then((data) => {
                if (data.success) {
                    return {
                        success: true,
                        isExist: false,
                        result: data.result
                    }
                } else {
                    return {
                        success: false,
                        isExist: false,
                        result: data.result
                    }
                }
            })
        })
    }
}

export default ChromeStorage;