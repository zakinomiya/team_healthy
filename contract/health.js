class HealthCheck {

    init() {
    }

    //private put(文字列変換用)
    _mapPut(k,f,v){
        const value = JSON.stringify(v)
        storage.mapPut(k, f, value)
    }

    //private get(文字列変換用)
    _mapGet(k, f){
        const v = storage.mapGet(k, f)
        if(!v) return
        return JSON.parse(v)
    }

    //配列を取ってくる
    _getArray(accountName){
        // ユーザーを取ってくる
        // 文字列からパース
        const userInfo = this._mapGet('mainData', accountName)

        // ユーザーがいなければ空の配列(新規のユーザー)
        if(!userInfo) {
            return []
        }
        // 配列を返す
        return userInfo
    }

    //setter(トイレ以外)
    setData(data){
        const accountName = tx.publisher

        //前回までの配列を持ってくる
        var array = this._getArray(accountName)

        // 文字列化する
        // ストレージにしまう
        this._mapPut('mainData', accountName, array.push(data))
    }

    //setter(トイレ)
    setToilet(data) {
        const accountName = tx.publisher

        //前回までの配列を持ってくる
        var array = this._getArray(accountName)

        // 文字列化する
        // ストレージにしまう
        this._mapPut('toilet', accountName, array.push(data))
    }

}

module.exports = HealthCheck
