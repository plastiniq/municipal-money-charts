import MunicipalChart from './MunicipalChart.js'

export default class OverlayBarChart extends MunicipalChart {
  constructor (target) {
    super(target)
    this._seriesOrder = null
    this._seriesField = 'item'
    this.update()
  }

  update () {
    const d3 = this.d3
    const format = d3.format(this._numberFormat)
    const items = this.orderData(
        this.groupData(this.data(), this._seriesField)
    )
    
    const maxBarValue = this.maxBarValue()

    d3.select(this.node()).selectAll('.item')
      .data(items)
      .join('div')
      .classed('item', true)
      .each(function (d) {
        d3.select(this)
          .selectAll('.item-label')
          .data([d])
          .join('div')
          .classed('item-label', true)
          .text(d => d.item)

        d3.select(this)
          .selectAll('.item-series')
          .data([d])
          .join('div')
          .each(function (d) {
            d3.select(this).selectAll('.item-value')
              .data([d])
              .join('span')
              .classed('item-value', true)
              .text(format(d.data[0].amount))
          })
          .classed('item-series', true)
            .selectAll('.item-bar')
            .data(d.data)
            .join('div')
            .classed('item-bar', true)
            .attr('data-tooltip', d => format(d.amount))
            .style('width', d => `${d.amount / maxBarValue * 100}%`)
      }).selectAll('.item-value').raise()
  }

  seriesOrder (value) {
    if (!arguments.length) {
      return this._seriesOrder
    }

    this._seriesOrder = value
    this.update()

    return this
  }

  seriesField (value) {
    if (!arguments.length) {
      return this._seriesField
    }

    this._seriesField = value
    this.update()

    return this
  }

  groupData (value, key) {
    return Array.from(this.d3.group(value, d => d[key]), ([item, data]) => ({ item, data }))
  }

  orderData (value) {
    if (this._seriesOrder) {
      value.forEach(item => {
        item.data = this._seriesOrder.map(seriesName => item.data.find(series => (series.phase === seriesName)))
      })
    }
  
    return value
  }

  maxBarValue () {
    return this.data().reduce((acc, curr) => {
      return Math.max(acc, curr.amount)
    }, 0)
  }
}