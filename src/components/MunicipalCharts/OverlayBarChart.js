import MunicipalChart from './MunicipalChart.js'

export default class OverlayBarChart extends MunicipalChart {
  constructor (target) {
    super(target)
    this._seriesOrder = null
    this._seriesField = 'item'
    this._valueResizeObserver = new ResizeObserver(this.valueResizeHandler())
  }

  valueResizeHandler () {
    return entries => {
      let maxWidth = entries.reduce((maxWidth, entry) => {
        let width = (entry.contentBoxSize && entry.contentBoxSize[0] && entry.contentBoxSize[0].inlineSize) || 
                (entry.contentBoxSize && entry.contentBoxSize.inlineSize) || 
                entry.contentRect.width

        return Math.max(maxWidth, width)
      }, 0)

      this.d3.selectAll('.item-value').style('min-width', `${maxWidth}px`)
    }
  }

  update () {
    const d3 = this.d3
    const valueResizeObserver = this._valueResizeObserver
    const format = d3.format(this._numberFormat)
    const items = this.orderData(
        this.groupData(this.data(), this._seriesField)
    )
    const maxBarValue = this.maxBarValue()

    valueResizeObserver.disconnect()

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
          .selectAll('.item-track')
            .data([d])
            .join('div')
            .classed('item-track', true)
            .each(function (d) {
              d3.select(this)
              .selectAll('.item-series')
              .data([d])
              .join('div')
              .classed('item-series', true)
                .selectAll('.item-bar')
                .data(d.data)
                .join('div')
                .classed('item-bar', true)
                .attr('data-tooltip', d => format(d.amount))
                .style('width', d => `${d.amount / maxBarValue * 100}%`)

              d3.select(this).selectAll('.item-value')
                .data([d])
                .join('span')
                .classed('item-value', true)
                .style('min-width', 'auto')
                .each(function () {
                  valueResizeObserver.observe(this)
                })
                .text(format(d.data[0].amount))
            })
      })
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