import * as d3 from 'd3'

export default class MunicipalChart {
  constructor (target, data) {
    this._node = document.createElement('div')
    this._node.className = this.toKebabCase(this.constructor.name)
    this._target = target
    this._data = data
    this._groupFunc = null
  }

  data (value) {
    if (!arguments.length) {
      return this._data
    }

    this._data = value
    return this
  }

  get d3 () {
    return d3
  }

  node () {
    return this._node
  }

  toKebabCase (value) {
    return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }
}