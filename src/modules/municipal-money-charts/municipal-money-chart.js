import c3 from 'c3'
import { format } from 'd3-format'
import './municipal-money-charts.scss';
import echarts from 'echarts'


const d3 = Object.assign({},{format})

let chart = {}
let eChart = {}

let eChartOptions = {
    title: {
        text: ''
    },
    tooltip: {},
    legend: {
        data:[]
    },
    xAxis: {
        data: [],
        axisTick: {
            show: false
        }
    },
    yAxis: {
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        }
    },
    color: ['#34a853', '#dadada', '#adadad'],
    series: []
}

const municipalMoneyChart = (container, initialMunicipality, period) => {

    chart = c3.generate({
        bindto: container,
        color : {
            pattern : ['#34a853', '#dadada', '#adadad']
        },
        legend: {
            show: false
        },
        grid : {
            y: {
                show: true
            }
        },
        axis : {
            x: {
                type: 'category',
                categories : period
            },
            y: {
                tick: {
                    format: format("~s")
                }
            }
        },
        data: {
            columns : [initialMunicipality],
            type: 'bar'
        },
        transition: {
            duration: 1000
        }
    });
    

}

const loadData = (municipalData) => {
    chart.load({
        columns: [municipalData]
    });

    let muniName = municipalData[0];
    let muniData = municipalData.shift()

    eChartOptions.series.push({
        name: muniName,
        type: 'bar',
        data: muniData
    })
    eChart.setOption(eChartOptions);


}

const unloadData = (series) => {
    chart.unload({
        ids: series
    })
}



const eChartsMuni = (container, initialMunicipalityName, initialMunicipalityData, period) => {

    eChart = echarts.init(document.getElementById(container));

    eChartOptions.series =  [{
        name: initialMunicipalityName,
        type: 'bar',
        data: initialMunicipalityData
    }]

    eChartOptions.xAxis.data = period

    eChart.setOption(eChartOptions);
}

const eChartsUpdate = (series) => {

    series.forEach(seriesUpdate);

    function seriesUpdate(municipality) {

        let muniData = [
            municipality.data[0].amount,
            municipality.data[1].amount,
            municipality.data[2].amount
        ]

        eChartOptions.series.push({
            name: municipality["municipality.name"],
            type: 'bar',
            data: muniData
        })

    }

    eChart.setOption(eChartOptions);
} 









export { municipalMoneyChart, loadData, unloadData, eChartsMuni, eChartsUpdate };

// fbbc05 - Yellow

/*
profile data is just the indicators pre - calculated
here 's the list of "cubes" - basically the different datasets available https://municipaldata.treasury.gov.za/api/cubes/
the "facts" request lists everything in the cube(paginated to 10 k rows)https : // municipaldata.treasury.gov.za/api/cubes/municipalities/facts
the miif category field here gives an indication of "similar" municipalities
https : // municipalmoney.gov.za/faq#similar-munis
some categories have like 8 munis,
while some have over 100 I think
you can use "parent" code of the same district for local municipalities to fake "nearby" 
watch out, this double slash is breaking the browsability of the API https : // municipaldata.treasury.gov.za/api/cubes//demarcation_changes
you 'll want https://municipaldata.treasury.gov.za/api/cubes/demarcation_changes


*/