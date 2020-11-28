import * as d3 from 'd3'

export default class MunicipalChart {
  constructor (target) {
    this._node = document.createElement('div')

    if (target) {
      this._target = target
      target.appendChild(this._node)
    }
    
    this._node.className = this.toKebabCase(this.constructor.name)
    this._data = []
    this._numberFormat = ''
    this._smallBreakpoint = 600

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        let width = (entry.contentBoxSize && entry.contentBoxSize[0] && entry.contentBoxSize[0].inlineSize) || 
                (entry.contentBoxSize && entry.contentBoxSize.inlineSize) || 
                entry.contentRect.width

        d3.select(this._node).classed('small', width < this._smallBreakpoint)
      }
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

  numberFormat (value){
    if (!arguments.length) {
      return this._numberFormat
    }

    this._numberFormat = value
    this.update()
    return this
  }

  node () {
    return this._node
  }

  toKebabCase (value) {
    return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }
}