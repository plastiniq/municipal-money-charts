import PercentageStackedChart  from '../components/MunicipalCharts/PercentageStackedChart';

import * as data2Items from './data/percentage-bar-chart_2-items.json';
import * as data2ItemsTiny from './data/percentage-bar-chart_2-items-tiny.json';
import * as data3Items from './data/percentage-bar-chart_3-items.json';
import * as data3ItemsTiny from './data/percentage-bar-chart_3-items-tiny.json';

const chart = new PercentageStackedChart()
const dataOptions = {
    '2 Items': data2Items.default,
    '2 Items Tiny': data2ItemsTiny.default,
    '3 Items': data3Items.default,
    '3 Items Tiny': data3ItemsTiny.default
}

const story = ({ width, smallBreakpoint, dataName }) => {
    chart.data(dataOptions[dataName]).smallBreakpoint(smallBreakpoint).width(width)
    return chart.node
}

export default story

story.argTypes = {
    width: {
        control: {
            type: 'number'
        }
    },
    dataName: {
        control: {
            type: 'select',
            options: Object.keys(dataOptions)
        }
    }
}

story.args = {
    width: '',
    smallBreakpoint: 300,
    dataName: Object.keys(dataOptions)[0]
}

story.storyName = "Percentage Stacked Chart"