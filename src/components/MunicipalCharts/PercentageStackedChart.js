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
        const externalLabel = d3.select(this).select('.item-label.external')
        const internalLabelBody = d3.select(this).select('.item-label.internal .item-label-body')
        const externalLabelBody = externalLabel.select('.item-label-body')
        const overflow = internalLabelBody.node() && internalLabelBody.node().getBoundingClientRect().width > this.clientWidth

        if (!this.classList.contains('remove') && !this.classList.contains('add')) {
          d3.select(this).classed('label-overflow', overflow)

          if (overflow && externalLabel.node()) {
            let itemRect = d3.select(this).node().getBoundingClientRect()
            let externalBodyRect = externalLabelBody.node().getBoundingClientRect()
            let offsetScale = (itemRect.left + itemRect.width / 2 - nodeRect.left) / nodeRect.width
            externalLabel.attr('data-align', externalBodyRect.width < itemRect.width ? 'center' : offsetScale < 1 / 3 ? 'left' : offsetScale < 2 / 3 ? 'center' : 'right')
            externalLabel.style('height',`${parseInt(getComputedStyle(externalLabel.node()).getPropertyValue('--level-height')) * ++overflowCounter}px`)
          }
        }
      })
      d3.select(this.node).style('height', `${this._items.scrollHeight}px`)
    }
  }

  updateProvider () {
    const d3 = this.d3
    const maxValue = this.maxValue()
    const internalLabelFunc = this._internalLabel
    const externalLabelFunc = this._externalLabel
    const itemResizeObserver = this._itemResizeObserver
    const itemResizeHandler = this.itemResizeHandler()
    const transitionDuration = 700
    itemResizeObserver.disconnect()

    d3.select(this._items).selectAll('.item')
      .data(this.data())
      .join(
        enter => enter.append('div').style('flex-grow', 0).classed('add', true),
        update => update,
        exit => exit.classed('remove', true)
          .transition()
          .duration(transitionDuration)
          .style('flex-grow', 0)
          .style('margin-right', 0)
          .remove()
      )
      .each(function (d) {
        itemResizeObserver.observe(this)

        // create or update internal and external labels
        d3.select(this)
          .selectAll('.item-label')
          .data([internalLabelFunc(d), externalLabelFunc(d)])
            .join(
              enter => enter.append('div').style('opacity', 0),
              update => update,
              exit => exit.transition().duration(transitionDuration).style('opacity', 0).remove()
            )
              .classed('item-label', true)
              .classed('internal', (d, i) => !i)
              .classed('external', (d, i) => i)
              .transition()
              .duration(transitionDuration)
              .style('opacity', 1)
              .each(function (d) {
                d3.select(this).selectAll('.item-label-body')
                .data([d])
                .join('div')
                  .classed('item-label-body', true)
                  .selectAll('div')
                    .data(d)
                    .join('div')
                    .text(d => d)
              })
      })
      .classed('item', true)
      .transition()
      .duration(transitionDuration)
      .style('flex-grow', d => d.amount / maxValue)
      .style('margin-right', '4px')
      .on('end', function () {
        d3.select(this).classed('add', false)
        itemResizeHandler()
      })
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