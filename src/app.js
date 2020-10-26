import { municipalMoneyChart, loadData, unloadData, eChartsMuni, eChartsUpdate } from './modules/municipal-money-charts/municipal-money-chart';
import $ from 'jQuery'
import _ from 'lodash'

let apiUrl = 'https://municipaldata.treasury.gov.za/api/cubes'

let municipalities = []
let selectedMunicipality = {}
let compareMunicipalities = []
let selectedCompareMunicipalities = []

$('#municipality').on('change', function() { selectMunicipality() } );
$('#compare').on('change', function () { compareMunicipality() });

$.ajax({
    url : apiUrl + '/municipalities/facts',
}).done(function (data) {
    municipalities = data.data;
    municipalities.forEach(function (muni, i) {
        $('#municipality').append('<option value="' + muni["municipality.demarcation_code"] + '">' + muni["municipality.name"] + '</option>')
    });
});

function selectMunicipality() {
    if($('#municipality').val() != '') {
        
        $.ajax({
            url: apiUrl + '/cflow/facts?cut=demarcation.code:"' + $('#municipality').val() + '"|item.label:"Capital assets"|period_length.length:"year"|amount_type.code:"AUDA"'
        }).done(function (data) {

            selectedMunicipality = _.find(municipalities, function(o) { return o["municipality.demarcation_code"] == $('#municipality').val(); });

            let selectedMunicipalityData = _.filter(data.data, function (o) {
                return o["financial_period.period"] > 2016;
            });

            selectedMunicipality.data = selectedMunicipalityData;

            municipalMoneyChart('#municipalMoneyChart', [
                $('#municipality option:selected').text(), 
                selectedMunicipality.data[0].amount,
                selectedMunicipality.data[1].amount,
                selectedMunicipality.data[2].amount
            ],[
                selectedMunicipality.data[0]["financial_period.period"],
                selectedMunicipality.data[1]["financial_period.period"],
                selectedMunicipality.data[2]["financial_period.period"]
            ]);

            eChartsMuni('echarts', $('#municipality option:selected').text(), [
                selectedMunicipality.data[0].amount,
                selectedMunicipality.data[1].amount,
                selectedMunicipality.data[2].amount
            ],[
                selectedMunicipality.data[0]["financial_period.period"],
                selectedMunicipality.data[1]["financial_period.period"],
                selectedMunicipality.data[2]["financial_period.period"]
            ])



        });
    }
}

function compareMunicipality() {

    resetComparisons()

    if($('#compare').val() == 'specific') {


    
    } else {
        let oKey = null;
        if($('#compare').val() == 'national') {
            oKey = "municipality.miif_category"
        }
        else if($('#compare').val() == 'province') {
            oKey = "municipality.province_code"
        }
        else if($('#nearby').val() == 'province') {
            oKey = "municipality.parent_code"
        }

         compareMunicipalities = _.filter(municipalities, function (o) {
            return o[oKey] == selectedMunicipality[oKey] && o["municipality.demarcation_code"] != selectedMunicipality["municipality.demarcation_code"];
        })

        

        selectedCompareMunicipalities = _.sampleSize(compareMunicipalities, 2);

        _.forEach(selectedCompareMunicipalities, function(compareMunicipality, index) {

            selectedCompareMunicipalities[index].data = []

            $('#selectedMunicipalities').append('<div class="chip">' + selectedCompareMunicipalities[index]["municipality.name"] + '</div>')
            
            $.ajax({
                url: apiUrl + '/cflow/facts?cut=demarcation.code:"' + compareMunicipality["municipality.demarcation_code"] + '"|item.label:"Capital assets"|period_length.length:"year"|amount_type.code:"AUDA"'
            }).done(function (data) {

                let compareMunicipalityData = _.filter(data.data, function (o) {
                    return o["financial_period.period"] > 2016;
                })

                selectedCompareMunicipalities[index].data = compareMunicipalityData;

                loadData([selectedCompareMunicipalities[index]["municipality.name"],
                    selectedCompareMunicipalities[index].data[0].amount,
                    selectedCompareMunicipalities[index].data[1].amount,
                    selectedCompareMunicipalities[index].data[2].amount
                ])

                eChartsUpdate([selectedCompareMunicipalities[index]])
            })
        })

       

    }
}

function resetComparisons() {
    $('#selectedMunicipalities').html('');

    let compareSeriesIds = []

    _.forEach(selectedCompareMunicipalities, function(municipality) {
        compareSeriesIds.push(municipality["municipality.name"])
    })

    unloadData(compareSeriesIds);

    selectedCompareMunicipalities = []
    compareMunicipalities = []
}






