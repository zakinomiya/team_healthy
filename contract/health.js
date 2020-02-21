class HealthCheck {
    
    init() { 
        const sampleData = [ 
        { date: '2020-02-00',
            height: 170.5,
            weight: 65,
            steps: 10734,
            sleep: 250,
            sun: 291 },
        { date: '2020-02-01',
            height: 170.5,
            weight: 65,
            steps: 14703,
            sleep: 373,
            sun: 252 },
        { date: '2020-02-02',
            height: 170.5,
            weight: 65,
            steps: 9037,
            sleep: 256,
            sun: 237 },
        { date: '2020-02-03',
            height: 170.5,
            weight: 65,
            steps: 11746,
            sleep: 316,
            sun: 227 },
        { date: '2020-02-04',
            height: 170.5,
            weight: 65,
            steps: 10633,
            sleep: 254,
            sun: 203 },
        { date: '2020-02-05',
            height: 170.5,
            weight: 65,
            steps: 8548,
            sleep: 438,
            sun: 240 },
        { date: '2020-02-06',
            height: 170.5,
            weight: 65,
            steps: 8559,
            sleep: 357,
            sun: 380 },
        { date: '2020-02-07',
            height: 170.5,
            weight: 65,
            steps: 8333,
            sleep: 362,
            sun: 392 },
        { date: '2020-02-08',
            height: 170.5,
            weight: 65,
            steps: 15492,
            sleep: 335,
            sun: 268 },
        { date: '2020-02-09',
            height: 170.5,
            weight: 65,
            steps: 8863,
            sleep: 392,
            sun: 334 },
        { date: '2020-02-10',
            height: 170.5,
            weight: 65,
            steps: 15373,
            sleep: 282,
            sun: 337 },
        { date: '2020-02-11',
            height: 170.5,
            weight: 65,
            steps: 9259,
            sleep: 339,
            sun: 240 },
        { date: '2020-02-12',
            height: 170.5,
            weight: 65,
            steps: 12797,
            sleep: 311,
            sun: 328 },
        { date: '2020-02-13',
            height: 170.5,
            weight: 65,
            steps: 12584,
            sleep: 477,
            sun: 265 },
        { date: '2020-02-14',
            height: 170.5,
            weight: 65,
            steps: 9430,
            sleep: 329,
            sun: 360 
        }]

        const sampleToilet = [ 
            { date: '2020-02-15', time: '2020-02-15T06:57:56.214Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T07:35:41.617Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T07:52:29.952Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T08:47:53.697Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T08:53:01.913Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T09:09:04.826Z', flag: 0 },
            { date: '2020-02-15', time: '2020-02-15T09:39:44.425Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T11:06:01.526Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T11:11:49.714Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T11:37:57.785Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T11:53:01.335Z', flag: 0 },
            { date: '2020-02-15', time: '2020-02-15T11:57:19.111Z', flag: 0 },
            { date: '2020-02-15', time: '2020-02-15T12:45:22.768Z', flag: 1 },
            { date: '2020-02-15', time: '2020-02-15T13:25:21.638Z', flag: 0 },
            { date: '2020-02-15', time: '2020-02-15T13:29:50.351Z', flag: 1 } ]

        this._mapPut('mainData', tx.publisher, sampleData)
        this._mapPut('toilet', tx.publisher, sampleToilet)
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
        let newData = JSON.parse(data)
        array.push(newData)

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
        let newData = JSON.parse(data)
        array.push(newData)

        // 文字列化する
        // ストレージにしまう
        this._mapPut('toilet', accountName, array)
    }

}

module.exports = HealthCheck
