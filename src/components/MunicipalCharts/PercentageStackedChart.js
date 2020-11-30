import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'

export default class PercentageStackedChart extends MunicipalChart {
  constructor (target) {
    super(target)
    this._items = this.d3.select(this.node).append('div').classed('items', true).node()
    this._mainLabel = d => [d.amount, d.label]
    this._subLabel = d => [`${d.label ? d.label + ': ' : ''} ${d.amount}`]
    this._itemResizeObserver = new ResizeObserver(this.itemResizeHandler())
  }

  itemResizeHandler () {
    const d3 = this.d3
  
    return () => {
      const nodeRect = this.node.getBoundingClientRect()
      var overflowCounter = 0

      d3.select(this.node).selectAll('.item').each(function () {
        const subLabel = d3.select(this).select('.item-label.sub')
        const mainLabelBody = d3.select(this).select('.item-label.main .item-label-body')
        const subLabelBody = subLabel.select('.item-label-body')
        const overflow = mainLabelBody.node() && mainLabelBody.node().getBoundingClientRect().width > this.clientWidth

        if (!this.classList.contains('remove') && !this.classList.contains('add')) {
          d3.select(this).classed('label-overflow', overflow)

          if (overflow && subLabel.node()) {
            let itemRect = d3.select(this).node().getBoundingClientRect()
            let subBodyRect = subLabelBody.node().getBoundingClientRect()
            let offsetScale = (itemRect.left + itemRect.width / 2 - nodeRect.left) / nodeRect.width
            subLabel.attr('data-align', subBodyRect.width < itemRect.width ? 'center' : offsetScale < 1 / 3 ? 'left' : offsetScale < 2 / 3 ? 'center' : 'right')
            subLabel.style('height',`${parseInt(getComputedStyle(subLabel.node()).getPropertyValue('--level-height')) * ++overflowCounter}px`)
          }
        }
      })
      d3.select(this.node).style('height', `${this._items.scrollHeight}px`)
    }
  }

  updateProvider () {
    const d3 = this.d3
    const maxValue = this.maxValue()
    const mainLabelFunc = this._mainLabel
    const subLabelFunc = this._subLabel
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

        // create or update main and sub labels
        d3.select(this)
          .selectAll('.item-label')
          .data([mainLabelFunc(d), subLabelFunc(d)])
            .join(
              enter => enter.append('div').style('opacity', 0),
              update => update,
              exit => exit.transition().duration(transitionDuration).style('opacity', 0).remove()
            )
              .classed('item-label', true)
              .classed('main', (d, i) => !i)
              .classed('sub', (d, i) => i)
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

  mainLabel (func) {
    if (!arguments.length) {
      return this._mainLabel
    }

    this._mainLabel = func
    this.update()
    return this
  }

  subLabel (func) {
    if (!arguments.length) {
      return this._subLabel
    }

    this._subLabel = func
    this.update()
    return this
  }

  maxValue () {
    return this.data().reduce((acc, curr) => Math.max(acc, curr.amount), 0)
  }
}