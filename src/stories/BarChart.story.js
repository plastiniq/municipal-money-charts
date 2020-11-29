import BarChart  from '../components/MunicipalCharts/BarChart';
import * as data1 from './data/bar-chart.json';
import * as data2 from './data/bar-chart.json';

const chart = new BarChart()
const dataOptions = {
    'Data 1': data1.default,
    'Data 2': data2.default,
    'Empty Data': []
}

const story = ({ width, smallBreakpoint, dataName, numberFormat }) => {
    chart.data(dataOptions[dataName]).numberFormat(numberFormat).smallBreakpoint(smallBreakpoint).width(width)
    return chart.node
} 

export default story

story.storyName = "Bar Chart"

story.argTypes = {
    width: {
        control: {
            type: 'number'
        }
    },
    smallBreakpoint: {
        control: {
            type: 'select',
            options: [
                300,
                2000 
            ],
        },
    },
    dataName: {
        control: {
            type: 'select',
            options: Object.keys(dataOptions)
        }
    },
    numberFormat: {
        control: {
            type: 'select',
            options: [
                ',.2r',
                '.2s',
                '($.2f'
            ]
        }
    }
}

story.args = {
    width: '',
    smallBreakpoint: 300,
    dataName: Object.keys(dataOptions)[0],
    numberFormat: ',.2r'
}