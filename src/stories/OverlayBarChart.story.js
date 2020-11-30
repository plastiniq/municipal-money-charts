import OverlayBarChart  from '../components/MunicipalCharts/OverlayBarChart';
import * as data1 from './data/overlay-bar-chart-1.json';
import * as data2 from './data/overlay-bar-chart-2.json';

const chart = new OverlayBarChart()
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