function integrate(from, to, fn = () => 1, dx = 0.01){
    //console.log(`∫[${from},${to}]`);
    
    let f = n => fn(from+n*dx)*dx;
    return (sum(0, (to-from)/dx - 1, f)+sum(1, (to-from)/dx, f))/2;
}

function sum(from, to, fn){
    //console.log("[" + from + "," + to + "]");
    let result = 0;
    for(let n = from; n <= to; ++ n){
        //console.log("["+n+"]"+fn(n) + ":" + result);
        result += fn(n);
    }
    return result;
}

function realFourierSeries(fn, len = 2*Math.PI, max = 4){
    let ans = [];
    let q = 2/len;
    let p = q*Math.PI;
    for(let n = 0; n <= max; ++n){
        ans.push([integrate(-len/2, len/2, x => fn(x)*Math.cos(n*p*x))*q,integrate(-len/2, len/2, x => fn(x)*Math.sin(n*p*x))*q]);
    }
    return ans;
}
