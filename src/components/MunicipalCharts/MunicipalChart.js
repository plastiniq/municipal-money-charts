import * as d3 from 'd3'
import ResizeObserver from 'resize-observer-polyfill';

export default class MunicipalChart {
  constructor (target) {
    this._node = document.createElement('div')

    if (target) {
      this._target = target
      target.appendChild(this._node)
    }
    
    this._node.className = this.toKebabCase(this.constructor.name)
    this._data = []
    this._format = d3.format('')
    this._width = 'auto'
    this._smallBreakpoint = 600

    const resizeObserver = new ResizeObserver(() => {
      d3.select(this._node).classed('small', this._smallBreakpoint >= this._node.offsetWidth)
    })
    resizeObserver.observe(this._node)
    this.updateSizeClass()
  }

  data (value) {
    if (!arguments.length) {
      return this._data
    }

    this._data = value
    this.update()
    return this
  }

  get d3 () {
    return d3
  }

  update () {
    if (this._scheduledUpdate === undefined) {
      this._scheduledUpdate = window.requestAnimationFrame(() => {
        this.updateProvider()
        this._scheduledUpdate = undefined
      })
    }
  }

  updateProvider () {
  }

  width (value) {
    if (!arguments.length) {
      return this._width
    }

    this._width = value
    d3.select(this._node).style('width', typeof value === 'number' ? `${value}px` : value)
    return this
  }

  smallBreakpoint (value) {
    if (!arguments.length) {
      return this._smallBreakpoint
    }

    this._smallBreakpoint = value
    this.updateSizeClass()
    return this
  }

  updateSizeClass () {
    d3.select(this._node).classed('small', this._smallBreakpoint > this._node.getBoundingClientRect().width)
  }

  format (value){
    if (!arguments.length) {
      return this._format
    }

    this._format = value
    this.update()
    return this
  }

  get node () {
    return this._node
  }

  toKebabCase (value) {
    return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }
}