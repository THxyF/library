/*
* This code was made by THF(Twitter:@THxyF_) to solve 1st order-O.D.E. by using one of the Runge–Kutta methods, Dormand-Prince method.
* references: http://depa.fquim.unam.mx/amyd/archivero/DormandPrince_19856.pdf
*/

function rk1(x_0, t_0, f, h, max){
    let point = [];
    for(let x = x_0, step = 0; step <= max; x += h*f(x, t_0+h*step), ++ step){
        point.push([t_0+h*step,x]);
        //if(step%parseInt(1/(h*10), 10) === 0)console.log([t_0+h*step,x]);
    }
    
    return point;
}

function rk4(x_0, t_0, f, h, max){
    let point = [];
    let t, k1, k2, k3, k4;
    for(let x = x_0, step = 0; step <= max; ++ step){
        t = t_0+h*step;
        k1 = f(x, t);
        k2 = f(x+h*k1/2, t+h/2);
        k3 = f(x+h*k2/2, t+h/2);
        k4 = f(x+h*k3, t+h);
        
        x += (k1+2*k2+2*k3+k4)*h/6;
        
        point.push([t_0+h*step,x]);
        //if(step%parseInt(1/(h*100), 10) === 0)console.log([t_0+h*step,x]);
    }
    
    return point;
}

function rk45(x_0, t_0, f, h_0, max){
    let point = [];
    let t = t_0, x = x_0, h = h_0, k = [];
    let a = [0, 1/5, 3/10, 4/5, 8/9, 1, 1];
    let b = [
                [],
                [1/5],
                [3/10,9/40],
                [44/45,-56/15,32/9],
                [19372/6561,-25360/2187,64448/6561, -212/729],
                [9017/3168,-355/33,-46732/5247,49/176,-5103/18656],
                [35/384,0,500/1113,125/192,-2187/6784,11/84]
            ];
    let c = [5179/57600,0,7571/16695,393/640,-92097/339200,187/2100,1/40];
    let buf = 0, d = 0, life = 8;
    for(let step = 0; step <= max; ++ step, t += h){
        while(life > 0){
            a.forEach((kt, i) => {
                buf = 0;
                b[i].forEach((kk, j) => {
                    buf += kk*k[j]*h;
                })
                
                k[i] = f(x+buf, t+kt*h);
            });
        
            d = x;
            c.forEach((kc, i) => {
                x += kc*k[i]*h;
            });
            b[6].forEach((kb, i) => {
                d += kb*k[i]*h;
            });
           
            d = Math.abs(d-x);
            d = Math.pow(h_0*h/(2*d), 1);
            
            h *= d;
            //console.log(h);
        
            if(d < h_0/20){
                -- life;
                console.log(h);
            }
            else break;
        }
        
        point.push([t, x]);
        /*if(point.length >= 10000){
            console.log("[step="+step+"]:("+point[0]+")");
            point = [];
        }*/
    }
    
    return point;
}

function rk1(x_0, t_0, f, h, max){
    let point = [];
    for(let x = x_0, step = 0; step <= max; x += h*f(x, t_0+h*step), ++ step){
        //point.push([t_0+h*step,x]);
        if(step%parseInt(1/(h*10), 10) === 0)console.log([t_0+h*step,x]);
    }
    
    return point;
}

/*
* rk functions can solve Ordinary differential equation, dx/dt = f(x, t).
* you should give them t0, x0 and f as well as h, the minimum error, and max, the maximum step count.

e.g.
function f(x,t){
    return x;
}
console.log(rk45(1, 0, f, 0.0001, 10000000));

*/
