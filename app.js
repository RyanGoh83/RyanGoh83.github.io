//on load, display data
let tableContainer = '';
document.onload = getData();

//helper functions
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function json(response) {
    return response.json()
}

//grabs required data from file
function getData(){
    fetch('data.json')
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Request succeeded with JSON response', data);
        insertTable(data);
        displayChart(data);
    })
    .catch(function(err) {
        console.log('Fetch Error', err);
});
}

//displays the table with data
function insertTable(res) {
    let avg = calcAvg(res);
    let median = calcMedian(res);
    tableContainer = document.getElementById('table-display');
    let tableContent = '';
    tableContent +=`
    <table class="table table-hover">
        <tr class="table-info">
        <th scope="row">Updated on (YYYY-MM-DD):</th>
        <td>${res[0].Date}</th>
        </tr>
        <tr>
        <th scope="row">STI Close:</th>
        <td>${res[0].StiClose}</th>
        </tr>
        <tr class="table-info">
        <th scope="row">PE:</th>
        <td>${res[0].PE}x</th>
        </tr>
        <tr>
        <th scope="row">PE10 Value:</th>
        <td>${parseFloat(res[0].PE10).toFixed(2)}x</th>
        </tr>
        <tr class="table-info">
        <th scope="row">Average (since 2003):</th>
        <td>${avg.toFixed(2)}x</th>
        </tr>
        <tr>
        <th scope="row">Median (since 2003):</th>
        <td>${median.toFixed(2)}x</th>
        </tr>
    </table>`;
    //console.log(tableContent);
    tableContainer.innerHTML = tableContent;
}

function calcAvg(res){
    vals = [];
    let sum = 0;
    for (i = 0; i < res.length; i++) {
        vals.push(parseFloat(res[i].PE10));
    }
    for (i = 0; i < vals.length; i++) {
            sum += vals[i];
        }
    let avg = sum / vals.length;
    return avg;
}

function calcMedian(res){
    vals = [];
    for (i = 0; i < res.length; i++) {
        vals.push(parseFloat(res[i].PE10));
    }
    vals.sort((a, b) => a - b);
    let pivot = Math.floor(vals.length / 2);
    return vals.length % 2 ? vals[pivot] : (vals[pivot - 1] + vals[pivot]) / 2;
}

//displays chart
function displayChart(data) {
    let chartData = data.reverse();
    //console.log(chartData);
    let years = [];
    let pe10Data = [];
    let stiData = [];
    for (i = 0; i < chartData.length; i++) {
        years.push(chartData[i].Date);
        pe10Data.push(parseFloat(chartData[i].PE10).toFixed(2));
        stiData.push(parseFloat(chartData[i].StiClose).toFixed(2));
    }
    //console.log(years, pe10Data);
    let lineChartData = {
            labels: years,
            datasets: [
            { 
                data: pe10Data,
                label: "STI PE10 (monthly)",
                borderColor:"#3e95cd",
                backgroundColor: "#3e95cd",
                fill: false,
                yAxisID: 'y-axis-1'
            },
            { 
                data: stiData,
                label: "STI (monthly)",
                borderColor:"#808080",
                backgroundColor: "#808080",
                fill: false,
                yAxisID: 'y-axis-2'
            }
            ]
        };
    let ctx = document.getElementById("myChart").getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: lineChartData,
        options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1'
                },
                {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2'
                }]
            }
        }
    });
}