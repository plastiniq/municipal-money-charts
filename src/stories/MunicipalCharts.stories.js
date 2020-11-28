
import OverlayBarChart  from '../components/MunicipalCharts/OverlayBarChart';
import PercentageStackedChart  from '../components/MunicipalCharts/PercentageStackedChart';
import SimpleBarChart  from '../components/MunicipalCharts/SimpleBarChart';
import * as overlayBarData1 from './data/overlay-bar-chart-1.json';
import * as overlayBarData2 from './data/overlay-bar-chart-2.json';

export default {
    title: 'Municipal Charts',
}

// --------------------------------------------------------------------------------------//
//                                    OverlayBarChart                                    //
// --------------------------------------------------------------------------------------//
const overlayBarChart = new OverlayBarChart()
const dataOptions = {
    'Data 1': overlayBarData1.default,
    'Data 2': overlayBarData2.default
}

export const OverlayBarChartStory = ({ smallBreakpoint, dataName, numberFormat }) => {
    overlayBarChart.data(dataOptions[dataName]).numberFormat(numberFormat).smallBreakpoint(smallBreakpoint)
    return overlayBarChart.node()
} 

OverlayBarChartStory.storyName = "Overlay Bar Chart"

OverlayBarChartStory.argTypes = {
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

OverlayBarChartStory.args = {
    smallBreakpoint: 300,
    dataName: Object.keys(dataOptions)[0],
    numberFormat: ',.2r'
}


// --------------------------------------------------------------------------------------//
//                                    PercentageStackedChart                             //
// --------------------------------------------------------------------------------------//

export const PercentageStackedChartStory = () => {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    const chart = new PercentageStackedChart(wrapper)
    return wrapper
}

PercentageStackedChartStory.storyName = "Percentage Stacked Chart"

// --------------------------------------------------------------------------------------//
//                                        SimpleBarChart                                 //
// --------------------------------------------------------------------------------------//

export const SimpleBarChartStory = () => {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    const chart = new SimpleBarChart(wrapper)
    return wrapper
}

SimpleBarChartStory.storyName = "Simple Bar Chart"