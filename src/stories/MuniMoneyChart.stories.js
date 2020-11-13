import {MuniMoneyChart, loadMunis, unloadMunis, loadMedians, showMuni} from '../components/MuniMoneyChart/MuniMoneyChart';
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
    wrapper.appendChild(MuniMoneyChart(muniDataIn.mainMuni[category]).element)
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
    wrapper.appendChild(MuniMoneyChart(muniDataIn.mainMuni['cash_balance']).element)

    const btnsContainer = document.createElement('div')
    btnsContainer.setAttribute('style', 'margin-top: 3em; text-align: center')
    wrapper.appendChild(btnsContainer)

    const additionalMunisBtn = document.createElement('button')
    additionalMunisBtn.innerText = 'Load Munis'
    additionalMunisBtn.addEventListener('click', () => loadMunis(muniDataIn.comparisons['cash_balance'][0]));
    btnsContainer.appendChild(additionalMunisBtn)

    const swapMunisBtn = document.createElement('button')
    swapMunisBtn.innerText = 'Swap Munis'
    swapMunisBtn.addEventListener('click', () => loadMunis(muniDataIn.comparisons['cash_balance'][1]));
    btnsContainer.appendChild(swapMunisBtn)

    const removeMunisBtn = document.createElement('button')
    removeMunisBtn.innerText = 'Unload Munis'
    removeMunisBtn.addEventListener('click', () => unloadMunis());
    btnsContainer.appendChild(removeMunisBtn)

    const highlightMuniBtn = document.createElement('button')
    highlightMuniBtn.innerText = 'Highlight Muni'
    highlightMuniBtn.addEventListener('click', () => showMuni('CPT'));
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
    wrapper.appendChild(MuniMoneyChart(muniDataIn.mainMuni['cash_balance']).element)
    loadMunis(muniDataIn.comparisons['cash_balance'][0])

    const btnsContainer = document.createElement('div')
    btnsContainer.setAttribute('style', 'margin-top: 3em; text-align: center')
    wrapper.appendChild(btnsContainer)

    const addMediansBtn = document.createElement('button')
    addMediansBtn.innerText = 'Add Medians'
    addMediansBtn.addEventListener('click', () => loadMedians(muniDataIn.medians['cash_balance']));
    btnsContainer.appendChild(addMediansBtn)

    return wrapper

} 

medianChart.storyName = "Medians"