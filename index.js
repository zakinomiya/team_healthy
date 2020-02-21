const f = () => {
    const data = []
    for (let i = 0; i < 10; i++){
        data.push({
            date: `2020-02-1${i}`,
            height: 170.5,
            weight: 60.3,
            steps: Math.round((Math.random()) * 15000),
            sleep: Math.round(Math.random() * 500),
            sun: Math.round(Math.random() * 300)
        })
    }
    return data
}

console.log(f())