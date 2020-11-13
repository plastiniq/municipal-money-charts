import MuniMoneyChart  from '../components/MuniMoneyChart/MuniMoneyChart';
import { muniDataIn } from '../assets/data.js';

export default {
    title: 'MuniMoneyChart',
}


// --------------------------------------------------------------------------------------//
//                                     BASIC CHART                                      //
// --------------------------------------------------------------------------------------//

export const basicChart = ({category}) => {

    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    let basicChart = new MuniMoneyChart('#basicChart', muniDataIn.mainMuni[category])
    wrapper.appendChild(basicChart.chart.element)
    return wrapper
} 

basicChart.storyName = "Basic Chart"
basicChart.argTypes = {
    category: {
        control: {
            type: 'select',
            options: [
                'cash_balance',
                'cash_coverage',
                'operating_budget',
                'capital_budget',
                'repairs_maintenance',
                'wasteful_expenditure',
                'current_ratio',
                'liquidity_ratio'    
            ],
        },
    },
}
basicChart.args = {
    category: 'cash_balance'
}

// --------------------------------------------------------------------------------------//
//                                     COMPARISONS                                      //
// --------------------------------------------------------------------------------------//

export const compareChart = () => {

    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    let compareChart = new MuniMoneyChart('#compareChart',muniDataIn.mainMuni['cash_balance'])
    wrapper.appendChild(compareChart.chart.element)

    const btnsContainer = document.createElement('div')
    btnsContainer.setAttribute('style', 'margin-top: 3em; text-align: center')
    wrapper.appendChild(btnsContainer)

    const additionalMunisBtn = document.createElement('button')
    additionalMunisBtn.innerText = 'Load Munis'
    additionalMunisBtn.addEventListener('click', () => compareChart.loadMunis(muniDataIn.comparisons['cash_balance'][0]));
    btnsContainer.appendChild(additionalMunisBtn)

    const swapMunisBtn = document.createElement('button')
    swapMunisBtn.innerText = 'Swap Munis'
    swapMunisBtn.addEventListener('click', () => compareChart.loadMunis(muniDataIn.comparisons['cash_balance'][1]));
    btnsContainer.appendChild(swapMunisBtn)

    const removeMunisBtn = document.createElement('button')
    removeMunisBtn.innerText = 'Unload Munis'
    removeMunisBtn.addEventListener('click', () => compareChart.unloadMunis());
    btnsContainer.appendChild(removeMunisBtn)

    const highlightMuniBtn = document.createElement('button')
    highlightMuniBtn.innerText = 'Highlight Muni'
    highlightMuniBtn.addEventListener('click', () => compareChart.showMuni('CPT'));
    btnsContainer.appendChild(highlightMuniBtn)
    return wrapper

} 

compareChart.storyName = "Comparisons"


// --------------------------------------------------------------------------------------//
//                                       MEDIANS                                        //
// --------------------------------------------------------------------------------------//

export const medianChart = () => {

    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    let medianChart = new MuniMoneyChart('#medianChart',muniDataIn.mainMuni['cash_balance'])
    wrapper.appendChild(medianChart.chart.element)
    medianChart.loadMunis(muniDataIn.comparisons['cash_balance'][0])

    const btnsContainer = document.createElement('div')
    btnsContainer.setAttribute('style', 'margin-top: 3em; text-align: center')
    wrapper.appendChild(btnsContainer)

    const addMediansBtn = document.createElement('button')
    addMediansBtn.innerText = 'Add Medians'
    addMediansBtn.addEventListener('click', () => medianChart.loadMedians(muniDataIn.medians['cash_balance']));
    btnsContainer.appendChild(addMediansBtn)

    return wrapper

} 

medianChart.storyName = "Medians"