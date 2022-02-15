var model_url = 'EBRAINS_live_papers/2021_spoleti_et_al/spoleti_et_al_2021.zip';
var recorded_vectors = { 'TIME': 't', 'v(0.5)': 'v' };

var fadeinval = 1200;
var fadeoutval = 600;

var nrn_func = "WT23_0p25()";
var plot_title = "WT 3M 0.25nA";
var amp = 0.25;

btns_params = {
    "wt230p25": ["0.004", "7e-06", "WT23_0p25()", "WT 3M 0.25nA", 0.25],
    "wt230p5": ["0.004", "7e-06", "WT23_0p5()", "WT 3M 0.5nA", 0.5],
    "tg230p25": ["1.48e-04", "1e-06", "TG23_0p25()", "TG 3M 0.25nA", 0.25],
    "tg230p5": ["1.48e-04", "1e-06", "TG23_0p5()", "TG 3M 0.5nA", 0.5],
    "wt680p2": ["3.70e-04", "1.50e-04", "WT68_0p2()", "WT 8M 0.2nA", 0.2],
    "wt680p25": ["3.70e-04", "1.50e-04", "WT68_0p25()", "WT 8M 0.25nA", 0.25],
    "tg680p2": ["3.00e-05", "2.00e-04", "TG68_0p2()", "TG 8M 0.2nA", 0.2],
    "tg680p25": ["3.00e-05", "2.00e-04", "TG68_0p25()", "TG 8M 0.25nA", 0.25],
}


$(document).ready(function () {
    
    $("#run-btn").click(function () {
        $('#error-msg').animate({ opacity: 0 }, 0);
        $('#plots').animate({ opacity: 0 }, fadeoutval);
        $('#loader').animate({ opacity: 1 }, fadeinval);
        var xmin = 700;
        var xmax = 2500;
        layout_01['xaxis']['autorange'] = false;
        layout_01['xaxis']['range'] = [xmin, xmax];

        // set input edit values
        var kdr_allnoax = parseFloat($("#kdr_allnoax").val());
        var kca_allnoax = parseFloat($("#kca_allnoax").val());
        var amp = parseFloat($("#i_inj").val());
        var default_parameters = {
            "h": { "kdr_allnoax": kdr_allnoax, "kca_allnoax": kca_allnoax, "stim": { "amp": amp }, 'FUNCTIONS': [nrn_func] }
        };

        // start ws
        var ws = new WebSocket('wss://blue-naas-svc-bsp-epfl.apps.hbp.eu/ws');
        ws.onerror = function (evt) { ws_on_error(evt) }
        ws.onopen = function () { ws_on_open(ws, default_parameters) }
        ws.onmessage = function (evt) { ws_on_message(ws, evt, layout_01, plot_title) }
    });

    $(".btn-param").click(function () {
        assign_params(this.id);
    });

    var plotlyChart_01 = document.getElementById("plotlyChart_01");

    var plotdiv = document.getElementById("plots");

    var margin = {
        l: 60,
        r: 25,
        b: 60,
        t: 35,
        pad: 15
    }

    var layout_01 = {
        xaxis: { title: 't (ms)' },
        yaxis: { title: 'V (mV)' },
        legend: { "orientation": "h", y: -0.2 },
        showlegend: false,
        margin: margin,
    };

    Plotly.newPlot(plotlyChart_01, [{ x: [], y: [] }], layout_01, { displayModeBar: false }, { responsive: true });

    resize_plots();

    $(window).resize(function () {
        resize_plots();
    });

    assign_params("wt230p25");
    $("#run-btn").click();
});

// assign parameters depending on button click
function assign_params(btn_id) {
    $("#kdr_allnoax").focus();
    $("#kdr_allnoax").val(btns_params[btn_id][0]);
    $("#kca_allnoax").focus();
    $("#kca_allnoax").val(btns_params[btn_id][1]);
    $("#i_inj").val(btns_params[btn_id][4]);
    nrn_func = btns_params[btn_id][2];
    plot_title = btns_params[btn_id][3];
    $("#run-btn").focus();
}

// open websocket connection
function ws_on_open(ws, params) {
    ws.send(JSON.stringify({ 'cmd': 'set_url', 'data': model_url }));
    ws.send(JSON.stringify({ "cmd": 'set_params', "data": params }))
    ws.send(JSON.stringify({ 'cmd': 'run_simulation', 'data': recorded_vectors }))
}

// handle errors event
function ws_on_error() {
    $('#plots').animate({ opacity: 0 }, fadeoutval);
    $('#loader').animate({ opacity: 0 }, fadeoutval);
    const wait = time => new Promise(
        res => setTimeout(() => res(), time)
    );
    wait(fadeinval + fadeoutval)
        .then(() => $('#error-msg').animate({ opacity: 1 }, fadeinval));

}
// open websocket connection
function ws_on_message(ws, evt, layout_01, title) {
    // handle received message
    var received_msg = JSON.parse(evt.data);
    var time = received_msg["data"]["TIME"];
    var v = received_msg["data"]["v(0.5)"];

    layout_01["title"] = title;

    Plotly.react(plotlyChart_01, [{ x: time, y: v }], layout_01);

    $('#error-msg').animate({ opacity: 0 }, 0);
    $('#plots').animate({ opacity: 1 }, fadeinval);
    $('#loader').animate({ opacity: 0 }, fadeoutval);
    ws.close();
}

function resize_plots() {
    var plotdiv = document.getElementById("plots");
    var plot_width = Math.trunc((plotdiv.offsetWidth - 200));

    var plotlyChart_01 = document.getElementById("plotlyChart_01");

    var layout_01 = plotlyChart_01.layout;

    var data_01 = plotlyChart_01.data;

    layout_01["width"] = plot_width;

    Plotly.react(plotlyChart_01, data_01, layout_01);

}