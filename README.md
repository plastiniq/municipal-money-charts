# municipal-money-charts

## Generate inital municpal money chart with:

```js
let chartInstance = new MuniMoneyChart('#container',initialMuniData)
wrapper.appendChild(chartInstance.chart.element)
```

## Add data with:

```js
chartInstance.loadMunis([MuniData])
```
## Unload data with:

```js
chartInstance.unloadMunis()
```

## Highlight Muni:

```js
chartInstance.showMuni(id)
```

## Load Medians:

```js
chartInstance.loadMedians([medians])
```


