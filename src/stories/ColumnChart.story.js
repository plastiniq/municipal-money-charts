import ColumnChart  from '../components/MunicipalCharts/ColumnChart';
import '../components/MunicipalCharts/ColumnChart.css'
import './ColumnChart.scss'

const story = () => {
    
    
    let muniData = [
        {
            "municipality": {
                "code": "TSH",
                "name": "City of Tshwane"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#34A853",
                    "value": 1
                }, {
                    "period": "2016-2017",
                    "fillColor": "#34A853",
                    "value": 2
                }, {
                    "period": "2017-2018",
                    "fillColor": "#34A853",
                    "value": 3
                }, {
                    "period": "2018-2019",
                    "fillColor": "#34A853",
                    "value": 4
                }
            ],
            "resultType": "currency"
        },
    ]

    let comparison = [
        {
            "municipality": {
                "code": "TSH",
                "name": "City of Tshwane"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#34A853",
                    "value": 1
                }, {
                    "period": "2016-2017",
                    "fillColor": "#34A853",
                    "value": -5
                }, {
                    "period": "2017-2018",
                    "fillColor": "#34A853",
                    "value": 3
                }, {
                    "period": "2018-2019",
                    "fillColor": "#34A853",
                    "value": 4
                }
            ],
            "resultType": "currency"
        },
        {
        "municipality": {
            "code": "CPT",
            "name": "City Cape Town"
        },
        "data": [
            {
                "period": "2015-2016",
                "fillColor": "#ccc",
                "value": 2
            }, {
                "period": "2016-2017",
                "fillColor": "#ccc",
                "value": 6
            }, {
                "period": "2017-2018",
                "fillColor": "#ccc",
                "value": 7
            }, {
                "period": "2018-2019",
                "fillColor": "#ccc",
                "value": 8
            }
            ],
            "resultType": "currency"
        },
        {
            "municipality": {
                "code": "JHB",
                "name": "City of Johannesburg"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#ccc",
                    "value": 2
                }, {
                    "period": "2016-2017",
                    "fillColor": "#ccc",
                    "value": 10
                }, {
                    "period": "2017-2018",
                    "fillColor": "#ccc",
                    "value": 5
                }, {
                    "period": "2018-2019",
                    "fillColor": "#ccc",
                    "value": 15
                }
            ],
            "resultType": "currency"
        },
        {
            "municipality": {
                "code": "NMB",
                "name": "Nelson Mandela Bay"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#ccc",
                    "value": 1
                }, {
                    "period": "2016-2017",
                    "fillColor": "#ccc",
                    "value": 2
                }, {
                    "period": "2017-2018",
                    "fillColor": "#ccc",
                    "value": 1
                }, {
                    "period": "2018-2019",
                    "fillColor": "#ccc",
                    "value": 3
                }
            ],
            "resultType": "currency"
        }
    ]


    let comparison2 = [
        {
            "municipality": {
                "code": "TSH",
                "name": "City of Tshwane"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#34A853",
                    "value": 1
                }, {
                    "period": "2016-2017",
                    "fillColor": "#34A853",
                    "value": 2
                }, {
                    "period": "2017-2018",
                    "fillColor": "#34A853",
                    "value": 3
                }, {
                    "period": "2018-2019",
                    "fillColor": "#34A853",
                    "value": 4
                }
            ],
            "resultType": "currency"
        },
        {
        "municipality": {
            "code": "NmN",
            "name": "NomNom"
        },
        "data": [
            {
                "period": "2015-2016",
                "fillColor": "#ccc",
                "value": 2
            }, {
                "period": "2016-2017",
                "fillColor": "#ccc",
                "value": 6
            }, {
                "period": "2017-2018",
                "fillColor": "#ccc",
                "value": 7
            }, {
                "period": "2018-2019",
                "fillColor": "#ccc",
                "value": 8
            }
            ],
            "resultType": "currency"
        },
        {
            "municipality": {
                "code": "JHB",
                "name": "City of Johannesburg"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#ccc",
                    "value": 2
                }, {
                    "period": "2016-2017",
                    "fillColor": "#ccc",
                    "value": 10
                }, {
                    "period": "2017-2018",
                    "fillColor": "#ccc",
                    "value": 5
                }, {
                    "period": "2018-2019",
                    "fillColor": "#ccc",
                    "value": 15
                }
            ],
            "resultType": "currency"
        },
        {
            "municipality": {
                "code": "NMB",
                "name": "Nelson Mandela Bay"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#ccc",
                    "value": 1
                }, {
                    "period": "2016-2017",
                    "fillColor": "#ccc",
                    "value": 2
                }, {
                    "period": "2017-2018",
                    "fillColor": "#ccc",
                    "value": 1
                }, {
                    "period": "2018-2019",
                    "fillColor": "#ccc",
                    "value": 3
                }
            ],
            "resultType": "currency"
        }
    ]

    let removeData = [
        {
            "municipality": {
                "code": "TSH",
                "name": "City of Tshwane"
            },
            "data": [
                {
                    "period": "2015-2016",
                    "fillColor": "#34A853",
                    "value": 1
                }, {
                    "period": "2016-2017",
                    "fillColor": "#34A853",
                    "value": 2
                }, {
                    "period": "2017-2018",
                    "fillColor": "#34A853",
                    "value": 3
                }, {
                    "period": "2018-2019",
                    "fillColor": "#34A853",
                    "value": 4
                }
            ],
            "resultType": "currency"
        },
    

    ]


    let medians = [
        {
            "period": "2015-2016",
            "value": 2
        }, {
            "period": "2016-2017",
            "value": 4
        }, {
            "period": "2017-2018",
            "value": 3
        }, {
            "period": "2018-2019",
            "value": 8
        }
    ]

    let medians2 = [
        {
            "period": "2015-2016",
            "value": 1
        }, {
            "period": "2016-2017",
            "value": -3
        }, {
            "period": "2017-2018",
            "value": -4
        }, {
            "period": "2018-2019",
            "value": 10
        }
    ]

  

    let problemMedians1 = [
        {
            "period": "2015-2016",
            "value": -11.35
        }, {
            "period": "2016-2017",
            "value": -11.3999999999
        }, {
            "period": "2017-2018",
            "value": -8.1
        }, {
            "period": "2018-2019",
            "value": -22.0999999999
        }
    ]

    let problemMedians2 = [
        {
            "period": "2015-2016",
            "value": -23.7
        }, {
            "period": "2016-2017",
            "value": -20.9
        }, {
            "period": "2017-2018",
            "value": -29.2
        }, {
            "period": "2018-2019",
            "value": -36.8
        }
    ]

    let compareChart = undefined;

    let container = document.createElement('div')

    let chartContainer = document.createElement('div')
    chartContainer.setAttribute('id', 'compareChart')
    container.appendChild(chartContainer)

    // let compareChart = new ColumnChart('#compareChart', muniData)

    let generateButton = document.createElement('button')
    generateButton.innerHTML = 'Generate'
    generateButton.addEventListener('click', function() { compareChart = new ColumnChart('#compareChart', muniData) })
    container.appendChild(generateButton)

    let button = document.createElement('button')
    button.innerHTML = 'Load Data'
    button.addEventListener('click', function() { compareChart.loadData(comparison) })
    container.appendChild(button)

    let swapDataButton = document.createElement('button')
    swapDataButton.innerHTML = 'Swap Data'
    swapDataButton.addEventListener('click', function() { compareChart.loadData(comparison2) })
    container.appendChild(swapDataButton)

    let removeButton = document.createElement('button')
    removeButton.innerHTML = 'Remove Data'    
    removeButton.addEventListener('click', function() { compareChart.loadData(removeData) })
    container.appendChild(removeButton)

    let medianButton = document.createElement('button')
    medianButton.innerHTML = 'Load Medians'
    medianButton.addEventListener('click', function() { compareChart.loadMedians(problemMedians1) })
    container.appendChild(medianButton)

    let swapMediansButton = document.createElement('button')
    swapMediansButton.innerHTML = 'Swap Medians'
    swapMediansButton.addEventListener('click', function() { compareChart.loadMedians(problemMedians2) })
    container.appendChild(swapMediansButton)

    let removeMediansButton = document.createElement('button')
    removeMediansButton.innerHTML = 'Remove Medians'
    removeMediansButton.addEventListener('click', function() { compareChart.removeMedians() })
    container.appendChild(removeMediansButton)

    let highlightButton = document.createElement('button')
    highlightButton.innerHTML = 'Highlight'
    highlightButton.addEventListener('click', function() { compareChart.highlightCol('CPT') })
    container.appendChild(highlightButton)

    return container



}

story.storyName = "Column Chart"
export default story