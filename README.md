# municipal-money-charts

## Generate inital municpal money chart with:

```js
muniMoneyChart(container,[muniName,data],[period])
```

## Add data with:

```js
loadData([muniName,muniData],[removeSeriesIds])
```
Adding `removeSeriedIds` unloads previous data before loading new data which is recommended by C3

## Unload data with:
```js
unloadData(muniName)
```