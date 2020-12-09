import GroupedBarChart  from '../components/MunicipalCharts/GroupedIntensityBarChart'
import * as data1 from './data/grouped-intensity-bar-chart-1.json'
import * as data2 from './data/grouped-intensity-bar-chart-1-positive.json'
import * as data3 from './data/grouped-intensity-bar-chart-1-negative.json'
const d3Format = require('d3-format')

const chart = new GroupedBarChart()
const dataOptions = {
    'Positive and negative': data1.default,
    'All positive': data2.default,
    'All negative': data3.default
}

const formatOptions = {
    'short': d3Format.format('.2s'),
    'full': d3Format.format('')
}

const highlightOptions = {
    'Empty': '',
    'Rent Of Facilities And Equipment': 'Rent Of Facilities And Equipment',
    'Interest Earned - Outstanding Debtors': 'Interest Earned - Outstanding Debtors',
}

const intensityLabelOptions = {
    'percentage_change': 'percentage_change',
    'amount': 'amount'
}

const barGroupingOptions = {
    'comparison': 'comparison',
    'item': 'item'
}


const story = ({ width, smallBreakpoint, dataName, format, highlight, intensityLabelField, barGroupingField, xAxisLabel }) => {
    chart.data(dataOptions[dataName])
        .format(formatOptions[format])
        .smallBreakpoint(smallBreakpoint)
        .width(width)
        .highlight(highlightOptions[highlight])
        .intensityLabelField(intensityLabelOptions[intensityLabelField])
        .barGroupingField(barGroupingOptions[barGroupingField])
        .xAxisLabel(xAxisLabel)
    return chart.node
} 

story.storyName = "Grouped Intensity Bar Chart"
export default story

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
    highlight: {
        control: {
            type: 'select',
            options: Object.keys(highlightOptions)
        }
    },
    format: {
        control: {
            type: 'select',
            options: Object.keys(formatOptions)
        }
    },
    intensityLabelField: {
        control: {
            type: 'select',
            options: Object.keys(intensityLabelOptions)
        }
    },
    barGroupingField: {
        control: {
            type: 'select',
            options: Object.keys(barGroupingOptions)
        }
    },
    xAxisLabel: {
        control: {
            type: 'text'
        }
    }
}

story.args = {
    width: '',
    smallBreakpoint: 500,
    dataName: Object.keys(dataOptions)[0],
    highlight: Object.keys(highlightOptions)[0],
    format: Object.keys(formatOptions)[0],
    intensityLabelField: Object.keys(intensityLabelOptions)[0],
    barGroupingField: Object.keys(barGroupingOptions)[0],
    xAxisLabel: 'Original budget'
}