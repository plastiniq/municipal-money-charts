import c3 from 'c3'
import './municipal-money-charts.scss'
import {format} from 'd3-format'

const d3 = Object.assign({},{format})

const formatRand = (x, decimals, randSpace) => {
    decimals = decimals === undefined ? 1 : decimals; // eslint-disable-line no-param-reassign
    randSpace = randSpace === undefined ? ' ' : ''; // eslint-disable-line no-param-reassign
    return `R${randSpace}${d3.format(`,.${decimals}f`)(x)}`;
};

const humaniseRand = (x, longForm) => { // eslint-disable-line import/prefer-default-export
    longForm = longForm === undefined ? true : longForm; // eslint-disable-line no-param-reassign
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

let chart = {}

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
            }
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
            columns : [initialMuni],
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
        }
    });
}


const loadData = (compareMunis, removeSeriesIds) => {
    chart.load({
        unload: removeSeriesIds,
        columns: compareMunis
    })

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

