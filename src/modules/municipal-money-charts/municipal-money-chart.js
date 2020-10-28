import c3 from 'c3'
import './municipal-money-charts.scss'
import {format} from 'd3-format'

const d3 = Object.assign({},{format})

let chart = {}

const muniMoneyChart = (container, initialMuni, period) => {


    console.log(initialMuni)

    chart = c3.generate({
        bindto: container,
        color : {
            pattern : ['#34a853', '#dadada', '#adadad', '#dadada', '#adadad']
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
                    format: d3.format(".2s"),
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
        }
    });
}




const loadData = (compareMuni) => {
    chart.load({
        columns: [compareMuni]
    });

}

const unloadData = (series) => {
    console.log(series);
    chart.unload({
        ids: series
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

