import c3 from 'c3'
import './MuniMoneyChart.scss'
import * as d3format from 'd3-format'

export default class MuniMoneyChart {

    constructor(container, muniData) {

        let chartCategories = []

        muniData.data.forEach(function (dataPoint, index) {
            chartCategories.push(dataPoint.period)
        })

        let chartData = {
            columns: [[]],
            types: {},
            colors: {},
            labels: {
                format: (d) => { 
                    return muniData.resultType == 'currency' ? this.humaniseRand(d, false) : d
                }, 
            },
            selection: {
                enabled: true
            }
        }

        chartData.columns[0].push(muniData.municipality.code)

        muniData.data.forEach(function (dataPoint, index) {
            chartData.columns[0].push(dataPoint.value)
        })

        chartData.types[muniData.municipality.code] = 'bar'; 
        chartData.colors[muniData.municipality.code] = function(d) {
            if(muniData.data[d.index] != undefined) {
                return muniData.data[d.index].fillColor
            }
        }
    
        this.chart = c3.generate({
            bindto: container,
            legend: {
                show: false
            },
            grid : {
                y: {
                    show: true
                },
            },
            axis : {
                x: {
                    type: 'category',
                    categories : chartCategories
                },
                y: {
                    tick: {
                        format: (d) => { 
                            return muniData.resultType == 'currency' ? this.humaniseRand(d, false) : d
                        },
                        count: 7
                    }
                }
            },
            data: chartData,
            transition: {
                duration: 1000
            },
            bar: {
                width: {
                    ratio: 0.5,
                },
                space: 0.25
            },
            tooltip: {
                show: false,
                grouped: false,
                position: function (element) {
                    let tooltipPos = document.querySelectorAll('.c3-bars-' + element[0].id)[0].children[element[0].index].getBBox()
                    let axisY = document.querySelectorAll('.c3-axis-y')[0].getBBox()
                    return { left: (tooltipPos.x + axisY.width + tooltipPos.width/2), top: tooltipPos.y - 40 }
                },
                contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
                    let tooltipValue = muniData.resultType == 'currency' ? this.humaniseRand(d[0].value, false) : d[0].value
                    // let tooltipValue = ''
                    return '<div class="tooltip"><span class="tooltipValue">' + tooltipValue + '</span></div>'
                }
            },
            labels: true,
            oninit: () => {
                this.addMedians()
                this.addSVGFilters()
                // this.renderLabels(muniData)
            }
        })

       
    }

    formatRand = (x, decimals, randSpace) => {
        decimals = decimals === undefined ? 1 : decimals; 
        randSpace = randSpace === undefined ? ' ' : ''; 
        return `R${randSpace}${d3format.format(`,.${decimals}f`)(x)}`;
    }

    humaniseRand = (x, longForm) => {
        longForm = longForm === undefined ? true : longForm;
        const randSpace = longForm ? ' ' : '';
        const decimals = longForm ? 1 : 0;
        const suffixBillion = longForm === true ? ' billion' : 'bn';
        const suffixMillion = longForm === true ? ' million' : 'm';
        const suffixThousand = longForm === true ? '  thousand' : 'k';

        if (Math.abs(x) >= 1000000000) {
            return this.formatRand(x / 1000000000, decimals, randSpace) + suffixBillion;
        } if (Math.abs(x) >= 1000000) {
            return this.formatRand(x / 1000000, decimals, randSpace) + suffixMillion;
        } if (!longForm && Math.abs(x) >= 100000) {
            return this.formatRand(x / 1000, decimals, randSpace) + suffixThousand;
        }
        return this.formatRand(x, 0);
    }

   
  

    loadMunis = (compareMunis) => {

        let compareMunisData = []
        let removeMuniIds = []
        let compareMunisColors = {}

        compareMunis.forEach(function(muni) {
            let muniData = [muni.municipality.code]

            compareMunisColors[muni.municipality.code] = function(d) {
                if(muni.data[d.index] != undefined) {
                    return muni.data[d.index].fillColor
                }
            }

            muni.data.forEach(function (dataPoint, index) {
                muniData.push(dataPoint.value)
                compareMunisColors[muni.municipality.code][index] = dataPoint.fillColor
            })

            compareMunisData.push(muniData)
        })

        if(this.chart.data().length > 1) {
            this.chart.data().forEach(function(muni, index) {
                index > 0 ? removeMuniIds.push(muni.id) : ''
            })
        }

        this.chart.load({
            columns: compareMunisData,
            type: 'bar',
            colors: compareMunisColors,
            unload: removeMuniIds
        })
        
    }

    unloadMunis = () => {

        let removeMuniIds = []
        this.chart.data().forEach(function(muni, index) {
            index > 0 ? removeMuniIds.push(muni.id) : ''
        })
        this.chart.unload({
            ids: removeMuniIds
        })

    }

    showMuni = (muni) => {

        this.chart.tooltip.show({x: 3})

        this.chart.select([muni]) 
    }

        
    addMedians = () => {

        let medianLines = document.querySelectorAll('.medianLine')
        medianLines.forEach(el => el.remove())

        let xCount = this.chart.data()[0].values.length

        for(let i = 0; i < xCount; i++) {

            // chart.regions.add({axis:'x',start: i - 0.5, end: i + 0.5})

        // .c3-axis-x line

        // medianMarkers.forEach(function(medianMarker) {
        //     let markerPos = medianMarker['attributes']

            let mediansContainer = document.querySelectorAll('.c3-chart')
            let medianLine = document.createElementNS('http://www.w3.org/2000/svg','line')
            
            medianLine.setAttribute('x1',1 * i)
            medianLine.setAttribute('x2',(1 + 100) * i)
            medianLine.setAttribute('y1', mediansContainer[0].getBBox().height)
            medianLine.setAttribute('y2', mediansContainer[0].getBBox().height)
            medianLine.setAttribute('stroke','red')
            medianLine.setAttribute('opacity',0)
            medianLine.setAttribute('class','median-line')
            medianLine.setAttribute('stroke-dasharray', 2)
            
            medianLine.classList.add('medianLine')
            

            mediansContainer[0].appendChild(medianLine)

            // medianMarker.remove()
        // })

        }

    
        
    }

    loadMedians = (medians) => {
        let medianData = ['medians']

        medians.data.forEach(function (dataPoint, index) {
            medianData.push(dataPoint.value)
        })

        this.chart.load({
            columns: [medianData],
            type: 'scatter',
            colors: {
                medians: 'transparent'
            }
        })

        let medianMarkers = document.querySelectorAll('.c3-circles-medians > circle')
        let medianLines = document.querySelectorAll('.medianLine')
        
        medianMarkers.forEach(function(medianMarker, index) {
            let markerPos = medianMarker['attributes']
            requestAnimationFrame(function(){
                medianLines[index].style.transitionDuration = '2s'
                medianLines[index].setAttribute('x1',parseInt(markerPos[2].nodeValue) - 100)
                medianLines[index].setAttribute('x2',parseInt(markerPos[2].nodeValue) + 100)
                medianLines[index].setAttribute('y1',markerPos[3].nodeValue)
                medianLines[index].setAttribute('y2',markerPos[3].nodeValue)
                medianLines[index].setAttribute('opacity',1)
            })
        })
    }

    removeMedians = () => {
        
    }


    renderLabels = (muniData) => {

        // if(document.querySelectorAll('.c3-chart-texts .c3-texts > rect') != null) { 
        //     document.querySelectorAll('.c3-chart-texts .c3-texts > rect').forEach(e => e.remove());
        // }

        // let columnLabels = document.querySelectorAll('.c3-chart-texts .c3-texts-' + muniData.municipality.code + ' > .c3-text')

        // for (const el of columnLabels) {

            // let labelRect = document.createElementNS('http://www.w3.org/2000/svg','rect')

            // labelRect.setAttribute('x', parseInt(el.getAttribute('x')) - 23)
            // labelRect.setAttribute('y', parseInt(el.getAttribute('y') - 18) - (el.getBBox().height + 20)/2)
            // labelRect.setAttribute('rx', 5)
            // labelRect.setAttribute('ry', 5)
            // labelRect.setAttribute('width', el.getBBox().width + 15)
            // labelRect.setAttribute('height',el.getBBox().height + 8)
            // labelRect.classList.add('labelRectangle')

            // document.getElementsByClassName('c3-texts-' + muniData.municipality.code)[0].appendChild(labelRect)

            // el.setAttribute('y', parseInt(el.getAttribute('y')) - 18)

            // document.getElementsByClassName('c3-texts-' + muniData.municipality.code)[0].appendChild(el)
            // el.setAttribute('style','filter: url(#displacementFilter);')
        // }

        // let removeColumnLabels = document.querySelectorAll('.c3-chart-texts .c3-texts > .c3-text')
        // for (const el of removeColumnLabels) {
        //     if(!el.parentNode.classList.contains('c3-texts-' + muniData.municipality.code)) {
        //         el.remove()
        //     }
        // }

    }

    showTooltips = () => {
        this.chart.tooltip.show({x:2})
    }

    addSVGFilters = () => {


        let feFlood = document.createElement('svg')
        feFlood.innerHTML = `
        <defs>
            <filter x="0" y="0" width="1" height="1" id="flood">
                <feFlood flood-color="yellow"/>
                <feComposite in="SourceGraphic"/>
            </filter>
            <filter x="-0.005" y="-0.01" width="1.01" height="1.02" id="border">
                <feFlood flood-color="black"/>
                <feComposite in="SourceGraphic"/>
            </filter>
        </defs>
        `

        let labelFilter = document.createElement('svg')
        labelFilter.innerHTML = `
        <svg>
            <filter id="rounded-corners" x="-20%" width="140%" y="-15%" height="140%">
                <feFlood flood-color="#ffffff"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComponentTransfer>
                    <feFuncA type="table"tableValues="0 0 0 1"/>
                </feComponentTransfer>

                <feComponentTransfer>
                    <feFuncA type="table"tableValues="0 1 1 1 1 1 1 1"/>
                </feComponentTransfer>

                <feComposite operator="over" in="SourceGraphic"/>

            </filter>
        </svg>
        `
        document.body.appendChild(feFlood)
        document.body.appendChild(labelFilter)

    }

}