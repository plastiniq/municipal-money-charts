import OverlayBarChart  from '../components/MunicipalCharts/OverlayBarChart';
const d3Format = require('d3-format')
import * as data1 from './data/overlay-bar-chart-1.json';
import * as data2 from './data/overlay-bar-chart-2.json';

const chart = new OverlayBarChart()

const dataOptions = {
    'Data 1': data1.default,
    'Data 2': data2.default,
    'Empty Data': []
}

const formatOptions = {
    'R currency': d3Format.formatLocale({
        decimal: '.',
        thousands: ' ',
        grouping: [3],
        currency: ['R', ''],
    }).format('$,'),
    'default currency': d3Format.format('($.2f')
}

const story = ({ width, smallBreakpoint, dataName, format }) => {
    chart.data(dataOptions[dataName]).format(formatOptions[format]).smallBreakpoint(smallBreakpoint).width(width)
    return chart.node
} 

export default story

story.storyName = "Overlay Bar Chart"

story.argTypes = {
    width: {
        control: {
            type: 'number'
        }
    },
    smallBreakpoint: {
        control: {
            type: 'number'
        },
    },
    dataName: {
        control: {
            type: 'select',
            options: Object.keys(dataOptions)
        }
    },
    format: {
        control: {
            type: 'select',
            options: Object.keys(formatOptions)
        }
    }
}

story.args = {
    width: '',
    smallBreakpoint: 300,
    dataName: Object.keys(dataOptions)[0],
    format: Object.keys(formatOptions)[0]
}