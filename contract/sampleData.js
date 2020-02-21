const _ = require('lodash')

const createSampleData = (num) => {
    const data = []

    for(let i = 0; i < num; i++){
        data.push({
            date: `2020-02-${i < 10 ? `0${i}` : i}`,
            height: 170.5,
            weight: 65.0,
            steps: Math.round((Math.random() + 1) * 8000),
            sleep:  Math.round((Math.random() + 1) * 250),
            sun: Math.round((Math.random() + 1) * 200)
        })
    }
    return data
}

const createSampleToiletData = (num) => {
    const data = []
    
    for(let i = 0; i < num; i++){
        let datetime = new Date("2020-02-15T20:36:01.962Z") - (Math.random() + 1) * 25000000
        data.push({
            date: '2020-02-15',
            time: new Date(datetime),
            flag: i % 4 === 0 ? 0 : 1
        })
    }
    return _.sortBy(data, 'time', 'asc')
}


// console.log(createSampleData(15))
console.log(createSampleToiletData(15))