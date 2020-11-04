import c3 from 'c3'
import './municipal-money-charts.scss'
import * as d3format from 'd3-format'
import * as d3selection from 'd3-selection'
import { getBBox } from 'bbox'

const formatRand = (x, decimals, randSpace) => {
    decimals = decimals === undefined ? 1 : decimals; 
    randSpace = randSpace === undefined ? ' ' : ''; 
    return `R${randSpace}${d3format.format(`,.${decimals}f`)(x)}`;
};

const humaniseRand = (x, longForm) => {
    longForm = longForm === undefined ? true : longForm;
    const randSpace = longForm ? ' ' : '';
    const decimals = longForm ? 1 : 0;
    const suffixBillion = longForm === true ? ' billion' : 'bn';
    const suffixMillion = longForm === true ? ' million' : 'm';
    const suffixThousand = longForm === true ? '  thousand' : 'k';

    if (Math.abs(x) >= 1000000000) {
        return formatRand(x / 1000000000, decimals, randSpace) + suffixBillion;
    } if (Math.abs(x) >= 1000000) {
        return formatRand(x / 1000000, decimals, randSpace) + suffixMillion;
    } if (!longForm && Math.abs(x) >= 100000) {
        return formatRand(x / 1000, decimals, randSpace) + suffixThousand;
    }
    return formatRand(x, 0);
};

const median = (dataSet) => {
  if (dataSet.length === 1) return dataSet[0]
  const sorted = ([ ...dataSet ]).sort()
  const ceil = Math.ceil(sorted.length / 2)
  const floor = Math.floor(sorted.length / 2)
  if (ceil === floor) return sorted[floor]
  return ((sorted[ceil] + sorted[floor]) / 2)
}

let chart = {}
let medians = []

const muniMoneyChart = (container, initialMuni, period) => {
    chart = c3.generate({
        bindto: container,
        color : {
            pattern : ['#34a853', '#dadada', '#adadad', '#dadada', '#adadad', '#dadada', '#adadad', '#dadada', '#adadad', '#dadada', '#adadad']
        },
       
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
                categories : period
            },
            y: {
                tick: {
                    format: function(d) { return humaniseRand(d, false) },
                    count: 10
                }
            }
        },
        data: {
            columns: [initialMuni],
            type: 'bar'
        },
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
            grouped: false,
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                return '<div class="tooltip"><span class="tooltipName">' + d[0].name + '</span><br/><span class="tooltipValue">' + formatRand(d[0].value, 0, ' ') + '</span></div>'
            }
        },
        onrendered: function() {
            colorChart()
            removeMedians()
            if(this.data.targets.length == 4) {
                addMedians() 
            }
        }
    })
}

const loadData = (compareMunis, removeSeriesIds) => {
    chart.load({
        unload: removeSeriesIds,
        columns: compareMunis,
    })
}

const colorChart = () => {
    
}

    
const addMedians = () => {

    

    let paths = d3selection.selectAll('.c3-chart-bars .c3-shape')

    medians.push(
        [
            [paths._groups[0][0].getBBox().x, paths._groups[0][9].getBBox().x + paths._groups[0][9].getBBox().width],
            median([paths._groups[0][0].getBBox().height, paths._groups[0][3].getBBox().height, paths._groups[0][6].getBBox().height, paths._groups[0][9].getBBox().height])
        ],
        [
            [paths._groups[0][1].getBBox().x, paths._groups[0][10].getBBox().x + paths._groups[0][10].getBBox().width],
            median([paths._groups[0][1].getBBox().height, paths._groups[0][4].getBBox().height, paths._groups[0][7].getBBox().height, paths._groups[0][10].getBBox().height])
        ],
        [
            [paths._groups[0][2].getBBox().x, paths._groups[0][11].getBBox().x + paths._groups[0][11].getBBox().width],
            median([paths._groups[0][2].getBBox().height, paths._groups[0][5].getBBox().height, paths._groups[0][8].getBBox().height, paths._groups[0][11].getBBox().height])
        ]
    )

    _.forEach(medians, function(median, index) {
        d3selection.select(".c3-chart-bars").append('line')
            .attr('x1',median[0][0])
            .attr('x2',median[0][1])
            .attr('y1',median[1])
            .attr('y2',median[1])
            .attr('stroke','#000')
            .attr('class','median-line')
            .attr('stroke-dasharray', 2)
    })

    

}

const removeMedians = () => {
    medians = []
    d3selection.selectAll('.median-line').remove()
}

const unloadData = (removeSeriesIds) => {
    chart.unload({
        ids: removeSeriesIds
    })
}


export { muniMoneyChart, loadData, unloadData }


// fbbc05 - Yellow

/*
profile data is just the indicators pre - calculated
here 's the list of "cubes" - basically the different datasets available https://municipaldata.treasury.gov.za/api/cubes/
the "facts" request lists everything in the cube(paginated to 10 k rows)https : // municipaldata.treasury.gov.za/api/cubes/municipalities/facts
the miif category field here gives an indication of "similar" municipalities
https : // municipalmoney.gov.za/faq#similar-munis
some categories have like 8 munis,
while some have over 100 I think
you can use "parent" code of the same district for local municipalities to fake "nearby" 
watch out, this double slash is breaking the browsability of the API https : // municipaldata.treasury.gov.za/api/cubes//demarcation_changes
you 'll want https://municipaldata.treasury.gov.za/api/cubes/demarcation_changes

 onrendered: function () {
            d3.selectAll(".c3-chart-texts text.c3-text")
                .attr("transform", function(d) {
                    var textSel = d3.select(this);
                    return "rotate(90, "+textSel.attr("x")+", "+(textSel.attr("y"))+")";
                })
                .style("text-anchor", function(d) {
                    return (d.value && d.value > 0) ? "end" : "centre";
                })
        }

*/

