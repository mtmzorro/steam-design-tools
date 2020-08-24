interface BackgroundData {
    // background item name
    name: string
    // background full-size url
    backgroundUrl: string,
    // background item steam market url
    marketUrl: string,
    // background item steam market price
    
    marketPrice: string,
    // is like
    isLike: boolean
}

declare class ChromeStorage {
    static set(itemName: string, value: BackgroundData[]): Promise<{
        success: boolean
        result: BackgroundData | string
    }>
    static get(itemName: string): Promise<{
        success: boolean
        result: BackgroundData[] | string
    }>
    static remove(itemName: string): Promise<{
        success: boolean
        result?: string
    }>
    static insertInto (itemName: string, insertData: BackgroundData, key: string): Promise<{
        success: boolean
        isExist: boolean
        result: BackgroundData[] | string
    }>
}

export default ChromeStorage