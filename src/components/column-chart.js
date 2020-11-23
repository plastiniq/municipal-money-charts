var svg
var margin = {top: 50, right: 20, bottom: 50, left: 50}
var x = {}
var y = {}
var height
var width
var xAxis
var yAxis

const formatRand = (x, decimals, randSpace) => {
        decimals = decimals === undefined ? 1 : decimals;
        randSpace = randSpace === undefined ? ' ' : '';
        return `R${randSpace}${d3.format(`,.${decimals}f`)(x)}`;
    }

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
    }

const formatter = (d, resultType) => {
        if(resultType == 'currency') {
            return humaniseRand(d, false)
        }
        else if(resultType == 'months') {
            return Math.round(d * 10) / 10
        }
        else if(resultType == 'percentage') {
            return Math.round(d * 10) / 10 + '%'
        }
        else if(resultType == 'ratio') {
            return Math.round(d * 10) / 10
        }
        else {
            return d
        }
    }

const x_gridlines = () => {
    return d3.axisLeft(y).ticks(10)
}

const drawMuniChart = (container, muniData) => {

    width = document.querySelector(container).offsetWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    x = d3.scaleBand().range([0, width]).paddingInner(0.2)
    y = d3.scaleLinear().range([height, 0])

    xAxis = d3.axisBottom()
        .scale(x)

    yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10)
        .tickFormat(function(d) {
            return formatter(d, muniData[0].resultType)
        });

    svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr('class','muniChart')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


    setAxes()

    svg.append('g').attr('class', 'chartData')

    svg.append('g').attr('class', 'medians')

    addMedians(container)

    loadData(container, muniData)

}

const setAxes = () => {

    x.domain(muniData[0].data.map(function(d) { return d.period }))

    let muniMaxes = muniData.map(function(d) { return d3.max(d.data, function(e) { return e.value }) } )

    y.domain([0, d3.max(muniMaxes, function(d) { return d })])

    svg.append("g")
        .datum(muniData[0].data.map(function(d) { return d.period }))
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)

    svg.append("g")
        .attr("class", "grid")
        .call(x_gridlines()
          .tickSize(-width)
          .tickFormat("")
        )

}

const adjustY = (max) => {

    y.domain([0, max])

    svg.select('.y')
        .transition().duration(1500)
        .call(yAxis)

    svg.select('.grid')
        .transition().duration(1500)
        .call(x_gridlines()
          .tickSize(-width)
          .tickFormat("")
        )

}

const adjustBars = (muniCount) => {

    svg.selectAll('.bar')
        .transition().delay(function(i) { return i * 50 }).duration(1000)
        .attr('height', function(d) { return height - y(d) })
        .attr('width', x.bandwidth() / muniCount)
        .attr("y", function(d) { return y(d) })

    // svg.selectAll('.label')
    //     .transition().delay(function(i) { return i * 200 }).duration(1500)
    //     .attr("y", function(d) { return y(d) - 40 })

    // svg.selectAll('.label rect')
    //     .transition().delay(function(i) { return i * 200 }).duration(1500)
    //     .attr("y", function(d) { return y(d) - 40 -5 })

    // svg.selectAll('.label text')
    //     .transition().delay(function(i) { return i * 200 }).duration(1500)
    //     .attr("y", function(d) { return y(d) - 40 })

}

const addMedians = (container) => {

    svg = d3.select(container + ' svg')

    let categoryCount = muniData[0].data.map(function(d) { return d.period })

    for(let i = 0; i < categoryCount.length; i++) {

        svg.select('g.medians')
            .append('line')
                .attr('period',categoryCount[i])
                .attr('value',0)
                .attr('class','median')
                .attr('stroke','#000')
                .attr("x1", x(categoryCount[i]) )
                .attr("x2", x(categoryCount[i]) + x.bandwidth())
                .attr("y1", y(0))
                .attr("y2", y(0))
                .attr("height", 1)
                .attr('stroke-dasharray','5px')
                .attr('opacity',0)


    }

}

const loadMedians = (container, medians) => {


    medians.forEach(function(median, i) {

        svg.select('line.median[period="' + median.period + '"]')
            .transition().delay( i * 200 ).duration(500)
            .attr('y1', y(median.value))
            .attr('y2', y(median.value))
            .attr('opacity',1)
            .attr('value', median.value)
    })


}

const adjustMedians = () => {


    let medians = svg.selectAll('line.median')
        medians._groups[0].forEach(function(median, index) {
            svg.select('line.median[period="' + median.attributes['period'].value +'"]')
                .transition().duration(500)
                .attr('y1', y(median.attributes['value'].value))
                .attr('y2', y(median.attributes['value'].value))
        })


}

const removeMedians = () => {

    let medians = svg.selectAll('line.median')
    medians._groups[0].forEach(function(median, index) {
        svg.select('line.median[period="' + median.attributes['period'].value +'"]')
            .transition().duration(500)
            .attr('y1', y(0))
            .attr('y2', y(0))
            .attr('opacity',0)
    })
}

const loadData = (container, muniData) => {

    let activeMunis = 0

    if(svg.selectAll('g.chartData > g')._groups[0].length > 0) {

        activeMunis = svg.selectAll('g.chartData > g')._groups[0].length
        let muniMax = d3.max(muniData.map(function(d) { return d3.max(d.data, function(e) { return e.value }) } ))
        adjustY(muniMax)
        adjustBars(activeMunis + muniData.length)
        adjustMedians()
    }


    // Resize activeMunis

    // svg.selectAll('.bar')
    //     .transition().delay(function(i) { return i * 200 }).duration(500)
    //     .attr('width', x.bandwidth() / (muniData.length + activeMunis))

    // svg.selectAll('.label')
    //     .transition().delay(function(i) { return i * 200 }).duration(1500)
    //     .attr("x", function(d) { return y(d) - 40 })

    // svg.selectAll('.label rect')
    //     .transition().delay(function(i) { return i * 200 }).duration(1500)
    //     .attr("x", x.bandwidth() / (muniData.length + activeMunis) )

    // svg.selectAll('.label text')
    //     .transition().delay(function(i) { return i * 200 }).duration(1500)
    //     .attr("x", function(d) { return y(d) - 40 })


    muniData.forEach(function(muni ,muniIndex) {

        svg.selectAll('.chartData')
            .append('g')
            .attr('id', 'data-' + muni.municipality.code)
            .attr('muni', muni.municipality.code)

        muni.data.forEach(function(data, dataIndex) {

                svg.selectAll('#data-' + muni.municipality.code)
                    .append('g')
                        .attr('class', 'barGroup')
                        .attr('muni', muni.municipality.code)
                        .attr('period', data.period)
                        .attr('value', data.value)
                        .attr('index', dataIndex)

                svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"]')
                    .append('rect')
                        .datum(data.value)
                        .attr('class','bar')
                        .attr('fill',data.fillColor)
                        .attr("x", x(data.period) + ((muniIndex + activeMunis) * x.bandwidth() / (muniData.length + activeMunis)) + (dataIndex + 1 * 5) )
                        .attr("width", (x.bandwidth()) / (muniData.length + activeMunis) - 5)
                        .attr("y", y(0))
                        .attr("height", 0 )
                        .transition().delay( dataIndex * 200 ).duration(500)
                        .attr("y", y(data.value))
                        .attr("height", height - y(data.value))

                // let relatedRect = svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"] rect.bar')
                // let labelX = parseInt(relatedRect.attr('x')) + parseInt(relatedRect.attr('width')/2)
                // let labelY = y(data.value) - 40

                // svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"]')
                //     .append('g')
                //         .datum(data.value)
                //         .attr('class','label')
                //         .attr('x', labelX)
                //         .attr('y', labelY)
                //         .attr('opacity', 0)

                // svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"] g.label')
                //     .append('rect')
                //         .attr('x', labelX - 5)
                //         .attr('y', labelY - 4)
                //         .attr('ry', 5)
                //         .attr('rx', 5)
                //         .attr('fill','#ccc')
                //         .attr('width', 0)
                //         .attr('height', 0)


                // svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"] g.label')
                //     .append('text')
                //         .attr("dy", ".75em")
                //         .attr('x',labelX)
                //         .attr('y', labelY)
                //         .text(data.value)

                // svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"] g.label rect')
                //     .attr('width', svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"] g.label text').attr('width') + 20)
                //     .attr('height', svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"] g.label text').attr('height') + 20)

                // svg.select('#data-' + muni.municipality.code + ' g[index="' + dataIndex + '"] g')
                //     .transition().delay(dataIndex * 100).duration(500)
                //     .attr('opacity',1)

        })


    })

    return

}

const removeData = (container, ids) => {

    let max = y.domain()[1]

    ids.forEach(function(muni, i) {

        svg.selectAll('#data-' + muni + ' .label')
            .transition().duration(500)
            .attr("opacity", 0)
            .remove()

        svg.selectAll('#data-' + muni + ' .bar')
            .transition().duration(500)
            .attr("y", y(0))
            .attr("height", 0 )

        svg.select('#data-' + muni)
            .remove()

    })

    let currentMaxes = []


    let currentMunis = svg.selectAll(container + ' g.barGroup[muni]')
    currentMunis._groups[0].forEach(function(muni) {
        currentMaxes.push(muni.attributes['value'].value)
    })

    adjustY(d3.max(currentMaxes))
    adjustBars(svg.selectAll('g.chartData > g')._groups[0].length)
    adjustMedians()


}
