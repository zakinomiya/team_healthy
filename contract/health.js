class HealthCheck {

    init() {
    }

    /*
    stringにしてputする
    k: key
    f: field
    v: value
    */
    _mapPut(k,f,v){
        const value = JSON.stringify(v)
        storage.mapPut(k, f, value)
    }


    /*
    配列を取ってくる
    d: トイレかそれ以外か
    accountName: アカウント
    */
    _getArray(d, accountName){
        const userInfo = storage.mapGet(d, accountName)

        // いなければ空の配列(新規)
        if(!userInfo) return []

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
        var array = this._getArray('data', accountName)

        // 文字列化する
        // ストレージにしまう
        this._mapPut('data', accountName, array.push(data))
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
        var array = this._getArray('toilet', accountName)

        // 文字列化する
        // ストレージにしまう
        this._mapPut('toilet', accountName, array.push(data))
    }

}

module.exports = HealthCheck
