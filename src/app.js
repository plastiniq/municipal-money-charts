import { muniMoneyChart, loadData, unloadData } from './modules/municipal-money-charts/municipal-money-chart';
import $ from 'jQuery'
import _ from 'lodash'

let apiUrl = 'https://municipaldata.treasury.gov.za/api/cubes'

let munis = []
let selectedMuni = {}
let compareMunis = []
let selectedCompareMunis = []
let removeSeriesIds = []

let cut = $('#cut').val()
let startYear = $('#startYear').val()

/* EVENT LISTENERS */

$('#muniSelect').on('change', function() { selectMuni() } );
$('#muniCompareSelect').on('change', function () { compareMuni() });
$('#toggleCut').on('click', function() {
    $('.cutOptions').toggle()
})
$('#cut').on('blue', function() {
    cut = $(this).val()
})
$('#startYear').on('blue', function() {
    startYear = $(this).val()
})


/* GET THE MUNIS */

$.ajax({
    url : apiUrl + '/municipalities/facts',
}).done(function (data) {
    munis = data.data;
    munis.forEach(function (muni, i) {
        $('#muniSelect').append('<option value="' + muni["municipality.demarcation_code"] + '">' + muni["municipality.name"] + '</option>')
    });
});



function selectMuni() {

    if($('#muniCompareSelect').val() == 'specific') {

        compareSpecificMunis()

    } else {

        resetComparisons()

        if($('#muniSelect').val() != '') {

            $('.initialMuni').remove()
            
            $.ajax({
                url: apiUrl + '/cflow/facts?cut=demarcation.code:"' + $('#muniSelect').val() + '"' + cut
            }).done(function (data) {

                selectedMuni = _.find(munis, function(o) { return o["municipality.demarcation_code"] == $('#muniSelect').val(); });

                let selectedMuniData = _.filter(data.data, function (o) {
                    return o["financial_period.period"] > startYear;
                })

                selectedMuni.data = selectedMuniData;

                muniMoneyChart('#muniMoneyChart',
                    [selectedMuni["municipality.name"],
                        selectedMuni.data[0].amount,
                        selectedMuni.data[1].amount,
                        selectedMuni.data[2].amount
                    ],[
                        selectedMuni.data[0]["financial_period.period"],
                        selectedMuni.data[1]["financial_period.period"],
                        selectedMuni.data[2]["financial_period.period"]
                    ]
                )

                $('#selectedMunis').append('<div class="muni initialMuni">' + selectedMuni["municipality.name"] + '</div>')

                $('#muniSelect').val('') 

            })
        }
    }
}

function compareSpecificMunis() {
    if(selectedCompareMunis.length < 3) {

        $.ajax({
            url: apiUrl + '/cflow/facts?cut=demarcation.code:"' + $('#muniSelect').val() + '"' + cut
        }).done(function (data) {

            let specificMuni = _.find(munis, function(o) { return o["municipality.demarcation_code"] == $('#muniSelect').val(); });

            let specificMuniData = _.filter(data.data, function (o) {
                return o["financial_period.period"] > 2016;
            });

            specificMuni.data = specificMuniData;

            selectedCompareMunis.push(specificMuni);
            
            $('#selectedMunis').append('<div class="muni compareMuni">' + specificMuni["municipality.name"] + '</div>')

            $('#muniSelect').val('') 

            loadData([specificMuni["municipality.name"],
                specificMuni.data[0].amount,
                specificMuni.data[1].amount,
                specificMuni.data[2].amount
            ],removeSeriesIds)

            $('.compareMuni').on('click', function () { 
                removeSpecificMuni($(this).text())
                $(this).remove();
            })
        })
    }
}

function removeSpecificMuni(muni) {
    
    selectedCompareMunis = _.remove(selectedCompareMunis, function(muni) {
        return muni["municipality.name"] == muni
    })
    unloadData(muni)

}

function compareMuni() {

    resetComparisons()

    if($('#muniCompareSelect').val() == 'specific') {} 
    else if($('#muniCompareSelect').val() == '') {}
    else {
        let oKey = null;
        
        if($('#muniCompareSelect').val() == 'national') {
            oKey = "municipality.miif_category"
        }
        else if($('#muniCompareSelect').val() == 'province') {
            oKey = "municipality.province_code"
        }
        else if($('#muniCompareSelect').val() == 'nearby') {
            oKey = "municipality.parent_code"
        }

         compareMunis = _.filter(munis, function (o) {
            return o[oKey] == selectedMuni[oKey] && o["municipality.demarcation_code"] != selectedMuni["municipality.demarcation_code"];
        })
        
        selectedCompareMunis = _.sampleSize(compareMunis, 3);

        _.forEach(selectedCompareMunis, function(compareMuni, index) {

            selectedCompareMunis[index].data = []

            $('#selectedMunis').append('<div class="muni compareMuni">' + selectedCompareMunis[index]["municipality.name"] + '</div>')
            
            $.ajax({
                url: apiUrl + '/cflow/facts?cut=demarcation.code:"' + compareMuni["municipality.demarcation_code"] + '"' + cut
            }).done(function (data) {

                let compareMuniData = _.filter(data.data, function (o) {
                    return o["financial_period.period"] > 2016;
                })

                selectedCompareMunis[index].data = compareMuniData;

                loadData([selectedCompareMunis[index]["municipality.name"],
                    selectedCompareMunis[index].data[0].amount,
                    selectedCompareMunis[index].data[1].amount,
                    selectedCompareMunis[index].data[2].amount
                ],removeSeriesIds)
            })
        })
    }
}

function resetComparisons() {
    $('#selectedMunis .compareMuni').remove();

    removeSeriesIds = []

    _.forEach(selectedCompareMunis, function(muni) {
        removeSeriesIds.push(muni["municipality.name"])
    })

    selectedCompareMunis = []
    compareMunis = []
}






