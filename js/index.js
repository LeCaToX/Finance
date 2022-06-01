var API_KEY = "GIV5PQPE125MS0X1"

// API command: https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=AAPL&interval=5min&apikey=GIV5PQPE125MS0X1


function fn_invest(x) {
    var init = parseInt(document.getElementById("init").value); 
    var add = parseInt(document.getElementById("add").value); 
    return (init + 12*x*add);
}

var val_total = [];
var unitY;
function fn_total(x) {
    return val_total[x];
}

function init_val_total(year) {
    var init = parseFloat(document.getElementById("init").value); 
    var add = parseFloat(document.getElementById("add").value); 
    var inr = parseFloat(document.getElementById("inr").value); 
    val_total[0] = init;
    
    for (var i=1; i<=year; ++i) {
        val_total[i] = val_total[i-1]*(100+inr)/100 + 12*add;
    }
}

function CalUnit(year) {
    //alert(year);
    var t = val_total[year];
    
    var unit = 1;
    
    for (var i=0; i<=10000; ++i) {
        if (10*unit >= t) break;
        unit *= 10;
    }
    
    var res = {};
    
    if (t%unit ==0) {
        res.unitY = unit;
        console.log(unit);
        res.scaleY = Math.floor(t/unit);
    }
    else {
        res.unitY = unit;
        res.scaleY = Math.floor(t/unit) + 1;
    }
    
    return res;
}

function draw() {
    console.log(API_KEY);
    
    var year = parseInt(document.getElementById("year").value); 
    init_val_total(year);
    
    var canvas = document.getElementById("canvas");
    if (canvas == null || !canvas.getContext) return;
    
    var axes={}, ctx=canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    axes.x0 = 60;  // x0 pixels from left to x=0
    axes.y0 = canvas.height-30; // y0 pixels from top to y=0
    //axes.scale = 40;                 // 40 pixels from x=0 to x=1
    axes.scaleX = Math.floor((canvas.width-30)/(year+1));
    
    var pp = CalUnit(year);
    
    axes.scaleY = Math.floor((canvas.height-120)/pp.scaleY);
    unitY = pp.unitY;
    axes.doNegativeX = true;

    showAxes(ctx,axes);
    fnGraph(ctx,axes,fn_invest,"rgb(102, 0, 255)",2); 
    fnGraph(ctx,axes,fn_total,"rgb(11,153,11)",2); 
    
    document.getElementById("to_mon").innerHTML = "$" + Math.floor(val_total[year]); 
    document.getElementById("to_inv").innerHTML = "$" + Math.floor(fn_invest(year));
    document.getElementById("profit").innerHTML = "$" + Math.floor(val_total[year] - fn_invest(year));
    
    loadData();
}

function showAxes(ctx,axes) {
    var x0=axes.x0, w=ctx.canvas.width;
    var y0=axes.y0, h=ctx.canvas.height;
    var xmin = axes.doNegativeX ? 0 : x0;
    ctx.beginPath();
    
    ctx.strokeStyle =  "rgb(0,0,0)"; 
    ctx.moveTo(60,h-30); ctx.lineTo(w,h-30);  // X axis
    ctx.moveTo(60,h-30);    ctx.lineTo(60,20);  // Y axis
    
    ctx.stroke();
    
    ctx.beginPath(1);
    
    // Draw grid
    ctx.font = "10px Arial";    
    ctx.strokeStyle = "rgb(128,128,128)"; 
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    
    var curYear = new Date().getFullYear();
    
    for (var i=0; i<w-60; i+=axes.scaleX) {
        ctx.moveTo(i+60,h-30); ctx.lineTo(i+60,20); 
        ctx.fillText(curYear.toString(), i+50, h-20);
        curYear++;
    }
    
    // Horizontal lines
    var year = parseInt(document.getElementById("year").value);
    //unitY = CalUnit(year);
    
    var ss="dolar", t = 1;
    
    if (unitY >= 1000000000) {
        ss = "billion dollar";
        t = 1000000000;
    }
    else if (unitY >= 1000000) {
        ss = "million dollar";
        t = 1000000;
    }
    else if (unitY >= 1000) {
        ss = "thousand dollar";
        t = 1000;
    }
    
    ctx.fillText(ss,10,10);
    
    var curAmount = 0;
    for (var i=h; i>20; i-=axes.scaleY) {
        ctx.moveTo(60,i-30); ctx.lineTo(w,i-30); 
        //ctx.moveTo(60,i-20);
        ctx.fillText((curAmount/t).toString(),30,i-30);
        
        curAmount += unitY;
    }
    
    ctx.stroke();
}

function fnGraph (ctx,axes,func,color,thick) {
    var xx, yy, dx=4, x0=axes.x0, y0=axes.y0;
    
    
    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    var year = parseInt(document.getElementById("year").value);
    //var xx,yy;
    
    for (var i=0; i<=year; ++i) {
        xx = x0 + i * axes.scaleX;
        yy = y0 - func(i) * axes.scaleY / unitY;
        
        if (i==0) ctx.moveTo(xx,yy);
        else ctx.lineTo(xx,yy);
    }
    
    ctx.stroke();
}


function hello() {
    alert("Hello");
}

// -------------------------- STOCK ---------------------------

var stockList = []; 
var beg = 0;
function loadData() { // Load all companies' symbol in NASDAQ
    fetch("https://raw.githubusercontent.com/alexeipc/Finance/main/stockList.json")
        .then(response => response.json())
        .then(data => {
            stockList = data;
        })
}


function most_profit_in_day() {
    for (var i=0; i<1; ++i) {
        var symbol = stockList[i];
        
        var cmd = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+symbol+"&interval=1day&apikey="+API_KEY;
        
        console.log(cmd);
        
        fetch(cmd)
                .then(response => response.json())
                .then(data => {
                    var p = data["Time Series (Daily)"];
                    console.log(p);
            })
    }
}

function loadInitTable() {
    beg = 0;
    
    if (document.getElementById("time_length").value == "day") {
        most_profit_in_day();
    }
    
    loadTable(0);
}

function nextTable() {
    beg += 10;
    
    if (beg>=stockList.length) beg -= 10;
    loadTable(beg);
}
function prevTable() {
    beg -= 10;
    if (beg < 0) beg = 0;
    loadTable(beg);
}

function loadTable(beg) {
    
    var table = document.getElementById('myTable')
    
    table.innerHTML="";
    
    for (var i=beg; i<Math.min(beg+10,stockList.length); ++i) {
        var row = `<tr> 
                        <td>${stockList[i]}</td>
                        <td>Joe</td>
                        <td>$0</td>
                        <td>0%</td>
                    </tr>`
        //console.log(stockList[i]);
        table.innerHTML += row;
    }
}