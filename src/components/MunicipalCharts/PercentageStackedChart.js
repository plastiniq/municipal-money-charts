import MunicipalChart from './MunicipalChart.js'

export default class PercentageStackedChart extends MunicipalChart {
  constructor (target) {
    super(target)
    this._items = this.d3.select(this.node).append('div').classed('items', true).node()
    this._internalLabel = d => [d.amount, d.label]
    this._externalLabel = d => [`${d.label ? d.label + ': ' : ''} ${d.amount}`]
    this._itemResizeObserver = new ResizeObserver(this.itemResizeHandler())
  }

  itemResizeHandler () {
    const d3 = this.d3
  
    return () => {
      const nodeRect = this.node.getBoundingClientRect()
      var overflowCounter = 0

      d3.select(this.node).selectAll('.item').each(function () {
        const internalLabel = d3.select(this).select('.item-label.internal')
        const externalLabel = d3.select(this).select('.item-label.external')
        const overflow = internalLabel.node() && internalLabel.node().clientWidth > this.clientWidth
        d3.select(this).classed('label-overflow', overflow)

        if (overflow && externalLabel.node()) {
          let itemRect = d3.select(this).node().getBoundingClientRect()
          let externalRect = externalLabel.node().getBoundingClientRect()
          let offsetScale = (itemRect.left + itemRect.width / 2 - nodeRect.left) / nodeRect.width
          externalLabel.attr('data-align', offsetScale < 1 / 3 ? 'left' : offsetScale < 2 / 3 ? 'center' : 'right')
          externalLabel.style('height',`${parseInt(getComputedStyle(externalLabel.node()).getPropertyValue('--level-height')) * ++overflowCounter}px`)
        }
      })
    }
  }

  updateProvider () {
    const d3 = this.d3
    const maxValue = this.maxValue()
    const internalLabelFunc = this._internalLabel
    const externalLabelFunc = this._externalLabel
    const itemResizeObserver = this._itemResizeObserver
    itemResizeObserver.disconnect()

    d3.select(this._items).selectAll('.item')
      .data(this.data())
      .join(
        enter => enter.append('div').style('flex-grow', 0),
        update => update,
        exit => exit.transition().style('flex-grow', 0).style('margin-right', 0).remove()
      )
      .each(function (d) {
        itemResizeObserver.observe(this)

        // create or update internal label
        d3.select(this)
          .selectAll('.item-label.internal')
          .data([d])
          .join('div')
            .classed('item-label internal', true)
            .selectAll('div')
              .data(d => internalLabelFunc(d))
              .join('div')
              .text(d => d)

        // create or update external label
        d3.select(this)
          .selectAll('.item-label.external')
          .data([d])
            .join('div')
              .classed('item-label external', true)
              .selectAll('div')
              .data([d])
              .join('div')
                .selectAll('div')
                  .data(externalLabelFunc(d))
                  .join('div')
                  .text(d => d)
      })
      .classed('item', true)
      .transition()
      .style('flex-grow', d => d.amount / maxValue)
      .style('margin-right', '4px')
  }

  internalLabel (func) {
    if (!arguments.length) {
      return this._internalLabel
    }

    this._internalLabel = func
    thus.update()
    return this
  }

  maxValue () {
    return this.data().reduce((acc, curr) => Math.max(acc, curr.amount), 0)
  }
}