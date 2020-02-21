class HealthCheck {
    
    init() { 
    }

    /*
    配列をstringにしてputする
    k: key
    f: field
    v: value
    */
    _mapPut(k,f,v){
        const value = JSON.stringify(v) 
        storage.mapPut(k, f, value)
    }

    /*
    stringを配列に戻して返す
    k: key
    f: field
    */
    _mapGet(k, f) {
        let v = storage.mapGet(k, f)

        // いなければ空の配列(新規)
        if (!v) return []

        return JSON.parse(v)
    }

    /*
    配列を取ってくる
    d: トイレかそれ以外か
    accountName: アカウント
    */
    _getArray(d, accountName){
        let userInfo = this._mapGet(d, accountName)
            
        // 配列を返す
        return userInfo
    }

    /*
    セッター(トイレ以外)
    data: {
        date
        height
        weight
        steps
        sleep
        sun
    }
    */
    setData(data){
        const accountName = tx.publisher

        //前回までの配列を持ってくる
        let array = this._getArray('data', accountName)
        array.push(data)

        // 文字列化する
        // ストレージにしまう
        this._mapPut('data', accountName, array)

        //test
        //return storage.mapGet('data', accountName)
    }

    /*
    セッター(トイレ)
    data: {
        date
        flag
        time
    }
    */
    setToilet(data) {
        const accountName = tx.publisher

        //前回までの配列を持ってくる
        let array = this._getArray('toilet', accountName)
        array.push(data)

        // 文字列化する
        // ストレージにしまう
        this._mapPut('toilet', accountName, array)
    }

}

module.exports = HealthCheck
