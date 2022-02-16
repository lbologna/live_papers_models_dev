var model_url = 'EBRAINS_live_papers/2022_bianchi_et_al/bianchi_et_al_2022.zip';
var default_parameters = { "h": { 'FUNCTIONS': ['biophysint()'] }, 'tstop': 800, 'v_init': -80, 'nax_ax': 0.06, 'na3_soma': 0.05, 'na3_dend': 0.05, 'na3_apical': 0.04, 'kdr_ax': 0.3, 'kdr_soma': 0.1, 'kdr_dend': 0.06, 'kdr_apical': 0.06, 'kmdb_ax': 0.003, 'kmdb_soma': 0.001, 'kap_ax': 0.02, 'kap_soma': 0.02, 'kap_dend': 0.015, 'valuekad': 0.015 };
var recorded_vectors = { 'TIME': 't', 'v(0.5)': 'v' };
var fadeinval = 1200;
var fadeoutval = 600;

var static_traces_info = {
    "HM_0_1": {
        "url": "https://corsproxy.hbpneuromorphic.eu/https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/2022_bianchi_et_al/20303003_R_HM_0.1.json", "legend": "Exp 0.1"
    },
    "HM_0_2": {
        "url": "https://corsproxy.hbpneuromorphic.eu/https://object.cscs.ch:443/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/2022_bianchi_et_al/20303003_R_HM_0.2.json", "legend": "Exp 0.2"
    },
    "HM_0_3": {
        "url": "https://corsproxy.hbpneuromorphic.eu/https://object.cscs.ch:443/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/2022_bianchi_et_al/20303003_R_HM_0.3.json", "legend": "Exp 0.3"
    },
    "HM_0_05": {
        "url": "https://corsproxy.hbpneuromorphic.eu/https://object.cscs.ch:443/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/2022_bianchi_et_al/20303003_R_HM_0.05.json", "legend": "Exp 0.05"
    },
    "HM_0_15": {
        "url": "https://corsproxy.hbpneuromorphic.eu/https://object.cscs.ch:443/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/2022_bianchi_et_al/20303003_R_HM_0.15.json", "legend": "Exp 0.15"
    },
    "HM_0_25": {
        "url": "https://corsproxy.hbpneuromorphic.eu/https://object.cscs.ch:443/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/2022_bianchi_et_al/20303003_R_HM_0.25.json", "legend": "Exp 0.25"
    },
    "HM_0_35": {
        "url": "https://corsproxy.hbpneuromorphic.eu/https://object.cscs.ch:443/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/2022_bianchi_et_al/20303003_R_HM_0.35.json", "legend": "Exp 0.35"
    },
}

var static_traces_keys = Object.keys(static_traces_info);

var margin = {
    l: 60,
    r: 25,
    b: 60,
    t: 35,
    pad: 15
}

var layout_01 = {
    title: 'Voltage',
    xaxis: { title: 't (ms)' },
    yaxis: { title: 'V (mV)' },
    legend: { "orientation": "h", y: -0.2 },
    showlegend: true,
    margin: margin,
};

var static_traces = {};

var param_ids = {
    "#nax_ax": ["0.06"], "#na3_soma": ["0.05"], "#na3_dend": ["0.05"], "#na3_apical": ["0.04"], "#kdr_ax": ["0.3"],
    "#kdr_soma": ["0.1"], "#kdr_dend": ["0.06"], "#kdr_apical": ["0.06"], "#kmdb_ax": ["0.003"], "#kmdb_soma": ["0.001"],
    "#kap_ax": ["0.02"], "#kap_soma": ["0.02"], "#kap_dend": ["0.015"], "#valuekad": ["0.015"]
};

var param_keys = Object.keys(param_ids);

// store static traces in dict
var counter = 1;
for (let j = 0; j < static_traces_keys.length; j++) {
    $.getJSON(static_traces_info[static_traces_keys[j]]["url"], function (emp) {
        var time = emp["time"];
        var voltage = emp["voltage"];
        static_traces[static_traces_keys[j]] = { x: time, y: voltage, name: static_traces_info[static_traces_keys[j]]["legend"] };
        counter += 1;
        check_files_fetch(counter, static_traces_keys.length);
    });
}

function check_files_fetch(c, len) {
    if (c == len) {
        console.log(static_traces);
    }
}

//
$(document).ready(function () {

    for (let i = 0; i < param_keys.length; i++) {
        $(param_keys[i]).val(param_ids[param_keys[i]][0]);
        $(param_keys[i]).prop("min", 0);
        $(param_keys[i]).prop("max", 5);
        $(param_keys[i]).prop("step", 0.001);
    }

    var plotlyChart_01 = document.getElementById("plotlyChart_01");

    for (let i = 0; i < param_keys.length; i++) {
        $(param_keys[i]).prop('disabled', true);
    }

    Plotly.newPlot(plotlyChart_01, [{ x: [], y: [] }], layout_01, { displayModeBar: false }, { responsive: true });

    $("#nax_ax,#na3_soma,#na3_dend,#na3_apical,#kdr_ax,#kdr_soma,#kdr_dend,#kdr_apical,#kmdb_ax,#kmdb_soma,#kap_ax,#kap_soma,#kap_dend,#valuekad").keyup(validate_parameters)

    $("#nax_ax,#na3_soma,#na3_dend,#na3_apical,#kdr_ax,#kdr_soma,#kdr_dend,#kdr_apical,#kmdb_ax,#kmdb_soma,#kap_ax,#kap_soma,#kap_dend,#valuekad").on("change", validate_parameters);

    $('#run-btn').click(function () {
        toggle_btns_for_run(false);
        $('#error-msg').animate({ opacity: 0 }, 0);
        $('#plots').animate({ opacity: 0 }, fadeoutval);
        $('#loader').animate({ opacity: 1 }, fadeinval);
        var xmin = 0;
        var xmax = 800;
        layout_01['xaxis']['autorange'] = false;
        layout_01['xaxis']['range'] = [xmin, xmax];
        var ws = new WebSocket('wss://blue-naas-svc-bsp-epfl.apps.hbp.eu/ws');
        ws.onerror = function (evt) { ws_on_error(evt) }
        ws.onopen = function () { ws_on_open(ws, default_parameters, nax_ax, na3_soma, na3_dend, na3_apical, kdr_ax, kdr_soma, kdr_dend, kdr_apical, kmdb_ax, kmdb_soma, kap_ax, kap_soma, kap_dend, valuekad) }
        ws.onmessage = function (evt) { ws_on_message(ws, evt, layout_01, "") }
    });

    $('.trace-check').on("change", function () {
        update_plot();
    });


    $('#switch').on("change", function () {
        if ($('#switch')[0].checked) {
            for (let i = 0; i < param_keys.length; i++) {
                $(param_keys[i]).prop('disabled', false);
            }
        } else {
            for (let i = 0; i < param_keys.length; i++) {
                $(param_keys[i]).prop('disabled', true);
                $(param_keys[i]).val(param_ids[param_keys[i]][0]);
            }
        }
    });
    $("#run-btn").click();
});

//
function update_plot() {
    // declare final traces array
    var datafinalp1 = [];

    // read current data in plot
    var datap1 = plotlyChart_01.data;

    // read plotted traces keys
    var trnames = [];
    for (let k = 0; k < datap1.length; k++) {
        if (datap1[k]["name"]) {
            trnames.push(datap1[k]["name"]);
        }
    }

    // store simulation traces in final array
    for (let i = 0; i < trnames.length; i++) {
        var name = trnames[i];
        if (name == "simulation") {
            datafinalp1.push(datap1[i]);
        }
    }

    // store static traces in final array
    for (let j = 0; j < static_traces_keys.length; j++) {
        var k = static_traces_keys[j];
        var el = "#" + k;
        var el_lab = el + "_lab";
        if ($(el)[0].checked) {
            datafinalp1.push(static_traces[k]);
            $(el_lab).addClass('checked-trace-button');
        } else {
            $(el_lab).removeClass('checked-trace-button');
        }
    }
    Plotly.newPlot(plotlyChart_01, datafinalp1, layout_01);
}
// open websocket connection
function ws_on_open(ws, params, nax_ax, na3_soma, na3_dend, na3_apical, kdr_ax, kdr_soma, kdr_dend, kdr_apical, kmdb_ax, kmdb_soma, kap_ax, kap_soma, kap_dend, valuekad) {
    ws.send(JSON.stringify({ 'cmd': 'set_url', 'data': model_url }));
    params["nax_ax"] = parseFloat(nax_ax.value)
    params["na3_soma"] = parseFloat(na3_soma.value)
    params["na3_dend"] = parseFloat(na3_dend.value)
    params["na3_apical"] = parseFloat(na3_apical.value)
    params["kdr_ax"] = parseFloat(kdr_ax.value)
    params["kdr_soma"] = parseFloat(kdr_soma.value)
    params["kdr_dend"] = parseFloat(kdr_dend.value)
    params["kdr_apical"] = parseFloat(kdr_apical.value)
    params["kmdb_ax"] = parseFloat(kmdb_ax.value)
    params["kmdb_soma"] = parseFloat(kmdb_soma.value)
    params["kap_ax"] = parseFloat(kap_ax.value)
    params["kap_soma"] = parseFloat(kap_soma.value)
    params["kap_dend"] = parseFloat(kap_dend.value)
    params["valuekad"] = parseFloat(valuekad.value)

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

    Plotly.react(plotlyChart_01, [{
        x: time, y: v,
        name: "simulation",
    }], layout_01);

    update_plot();

    $('#plot-title')[0].innerHTML = title;
    $('#error-msg').animate({ opacity: 0 }, 0);
    $('#plots').animate({ opacity: 1 }, fadeinval);
    $('#loader').animate({ opacity: 0 }, fadeoutval);
    toggle_btns_for_run(true);
    ws.close();
}


function validate_parameters() {
    var flag = true;

    for (let i = 0; i < param_keys.length; i++) {
        if ($(param_keys[i]).val() < 0.0 || $(param_keys[i]).val() > 5.0 || $(param_keys[i]).val() == "") {
            $(param_keys[i]).css("background-color", "#cb4335");
            flag = false;
        } else {
            $(param_keys[i]).css("background-color", "#fff");
        }
    }
    if (!flag) {
        $("#run-btn").attr("disabled", true);
    } else {
        $("#run-btn").attr("disabled", false);
    }
}

function toggle_btns_for_run(flag) {
    if (flag) {
        for (let i = 0; i < static_traces_keys.length; i++) {
            $("#" + static_traces_keys[i]).attr('disabled', false);
            $("#" + static_traces_keys[i] + "_lab").attr('disabled', false);
        }
        $("#switch").attr('disabled', false);
        $("#switch_lab").attr('disabled', false);
        $("#run-btn").attr('disabled', false);
    } else {
        for (let i = 0; i < static_traces_keys.length; i++) {
            $("#" + static_traces_keys[i]).attr('disabled', true);
            $("#" + static_traces_keys[i] + "_lab").attr('disabled', true);

        }
        $("#switch").attr('disabled', true);
        $("#switch_lab").attr('disabled', true);
        $("#run-btn").attr('disabled', true);
    }
}