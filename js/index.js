function fn_invest(x) {
    var init = parseInt(document.getElementById("init").value); 
    var add = parseInt(document.getElementById("add").value); 
    return (init + x*add);
}

function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas == null || !canvas.getContext) return;
    
    var axes={}, ctx=canvas.getContext("2d");
    axes.x0 = 0;  // x0 pixels from left to x=0
    axes.y0 = canvas.height; // y0 pixels from top to y=0
    axes.scale = 40;                 // 40 pixels from x=0 to x=1
    axes.doNegativeX = true;

    showAxes(ctx,axes);
    fnGraph(ctx,axes,fn_invest,"rgb(11,153,11)",1); 
}

function showAxes(ctx,axes) {
    var x0=axes.x0, w=ctx.canvas.width;
    var y0=axes.y0, h=ctx.canvas.height;
    var xmin = axes.doNegativeX ? 0 : x0;
    ctx.beginPath();
    
    ctx.strokeStyle = "rgb(128,128,128)"; 
    ctx.moveTo(xmin,h); ctx.lineTo(w,h);  // X axis
    ctx.moveTo(0,h);    ctx.lineTo(0,0);  // Y axis
    
    
    // Draw grid
    ctx.font = "30px Arial";
    ctx.fillText("Hello World", 10, 50); 
    
    // Vertical lines
    for (var i=axes.scale; i<=w; i+=axes.scale) {
        ctx.moveTo(i,h); ctx.lineTo(i,0); 
    }
    
    // Horizontal lines
    for (var i=h; i>=0; i-=axes.scale) {
        ctx.moveTo(0,i); ctx.lineTo(w,i); 
    }
    
    ctx.stroke();
}

function fnGraph (ctx,axes,func,color,thick) {
    var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
    var iMax = Math.round((ctx.canvas.width-x0)/dx);
    var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
    
    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    for (var i=0;i<=10000;i++) {
        xx = dx*i; yy = scale*func(xx/scale);
        if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
        else ctx.lineTo(x0+xx,y0-yy);
    }
    ctx.stroke();
}

function hello() {
    alert("Hello")
}