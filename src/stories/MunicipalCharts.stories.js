
import OverlayBarChart  from '../components/MunicipalCharts/OverlayBarChart';
import PercentageStackedChart  from '../components/MunicipalCharts/PercentageStackedChart';
import SimpleBarChart  from '../components/MunicipalCharts/SimpleBarChart';
import * as overlayBarData from './data/overlay-bar-chart.json';

export default {
    title: 'Municipal Charts',
}

// --------------------------------------------------------------------------------------//
//                                    OverlayBarChart                                    //
// --------------------------------------------------------------------------------------//

export const OverlayBarChartStory = () => {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    const chart = new OverlayBarChart(wrapper, overlayBarData.default)
    wrapper.appendChild(chart.node())
    return wrapper
} 

OverlayBarChartStory.storyName = "Overlay Bar Chart"

// --------------------------------------------------------------------------------------//
//                                    PercentageStackedChart                             //
// --------------------------------------------------------------------------------------//

export const PercentageStackedChartStory = () => {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    const chart = new PercentageStackedChart()
    wrapper.appendChild(chart.node())
    return wrapper
}

PercentageStackedChartStory.storyName = "Percentage Stacked Chart"

// --------------------------------------------------------------------------------------//
//                                        SimpleBarChart                                 //
// --------------------------------------------------------------------------------------//

export const SimpleBarChartStory = () => {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    const chart = new SimpleBarChart()
    wrapper.appendChild(chart.node())
    return wrapper
}

SimpleBarChartStory.storyName = "Simple Bar Chart"