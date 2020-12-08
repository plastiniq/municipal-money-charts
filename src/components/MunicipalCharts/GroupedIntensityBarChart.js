import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'
import * as d3 from 'd3'

export default class GroupedIntencityBarChart extends MunicipalChart {
  constructor (target) {
    super(target)

    d3.select(this.node).call(node => {
      this._label = node.append('div').classed('x-axis-label', true)
      this._table = node.append('div').classed('table', true)
    })

    this._highlight = null
    this._intensityLabelField = 'amount'
    this._barGroupingField = 'comparison'
    this._xAxisLabel = 'Intencity Chart'
  }

  updateProvider () {
    this._label.text(this._xAxisLabel)
    this._table.selectAll('.group')
      .data(this.groups())
      .join('div')
        .classed('group', true)
        .call(group => 
          group.selectAll('.group-label')
          .data(d => [d])
          .join('div')
            .classed('group-label', true)
            .text(d => d.group)
        )
  }

  highlight (name) {
    if (!arguments.length) {
      return this._highlight
    }

    this._highlight = name
    this.update()
    return this
  }

  intensityLabelField (value) {
    if (!arguments.length) {
      return this._intensityLabelField
    }

    this._intensityLabelField = value
    this.update()
    return this
  }

  barGroupingField (value) {
    if (!arguments.length) {
      return this._barGroupingField
    }

    this._barGroupingField = value
    this.update()
    return this
  }

  xAxisLabel (value) {
    if (!arguments.length) {
      return this._xAxisLabel
    }

    this._xAxisLabel = value
    this.update()
    return this
  }

  groups () {
    return Array.from(this.d3.group(this.data(), d => d[this._barGroupingField]), ([group, series]) => ({ group, series }))
  }
}