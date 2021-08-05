const g = 6.67408;
const defaultMass = 50000;

let m = defaultMass;
let tx = 3, ty = 3, a = 1000, b = 20000, v_x = 0, v_y = 0, r = 3;

class Field{
    constructor(w, h, name = "unknown"){
        this.name = name;
        this.clear();
        this.height = h;
        this.width = w;
    }
    
    stop(){
        this.dt = 0;
    }
    resume(){
        this.dt = 10;
    }
    run(){
        this.time += this.dt;
        this.objects.forEach(obj => {
            obj.run();
        })
        this.arrows.forEach(obj => {
            obj.run();
        })
        //console.log(this.getDataString());
        this.farAwayCheck();
    }
    clear(){
        this.time = 0;
        this.dt = 10;
        this.objects = [];
        this.arrows = [];
    }
    kill(){
        this.objects = [];
    }
    addObject(x, y){
        this.objects.push(new Object(this, [x, y], v));
    }
    addMassPoint(x, y, mass, v1, v2){
        this.objects.push(new MassPoint(this, [x, y], mass, [v1, v2]));
    }
    addMassObj(x, y, mass, rad, v1, v2){
        this.objects.push(new MassObject(this, [x, y], mass, rad, [v1, v2]));
    }
    addArrow(x, y){
        this.arrows.push(new ForceArrow(this, [x, y]));
    }
    draw(crc){
        crc.clearRect(0, 0, this.width, this.height);
        this.arrows.forEach(o => o.draw(crc));
        crc.fillStyle = "#000000";
        this.objects.forEach(o => o.draw(crc));
    }
    getDataString(){
        let objectsStr = "";
        
        this.objects.forEach(o => {
            objectsStr += " " + o.getDataString() + "\n";
        })
        return `${this.name}:
                    time:${this.time},
                    dt:${this.dt},
                    objects:
                    ${objectsStr}`
    }
    farAwayCheck(){
        let list = [];
        this.objects.forEach((obj, i) => {
            if(obj.farAway())list.push(i);
        });
        this.objects = this.objects.filter((o, i) => !list.includes(i));
    }
}

class PhyObject{
    constructor(field, x = [0, 0], v = [0, 0], a = [0, 0], r = 0){
        this.field = field;
        
        this.x = x;
        this.v = v;
        this.a = a;
        this.name = field.name + "_Obj_" + field.objects.length;
        this.index = field.objects.length;
        this.r = r;
    }
    draw(crc){
        crc.beginPath();
        crc.arc(this.x[0], this.x[1],this.r === 0 ? 5 : this.r,0,Math.PI*2,true);
        crc.fill();
    }
    getDataString(){
        return `${this.name}:
                    x:[${this.x}],
                    v:[${this.v}],
                    a:[${this.a}]`
    }
    farAway(){
        let flag1 = this.x[0] > this.field.width*2;
        let flag2 = this.x[0] < -this.field.width;
        let flag3 = this.x[1] > this.field.height*2;
        let flag4 = this.x[1] < -this.field.height;
        return flag1 || flag2 || flag3 || flag4;
    }
    run(){
        this.x.forEach((c, i) => {
            this.x[i] += this.v[i]*this.field.dt/1000;
            this.v[i] += this.a[i]*this.field.dt/1000;
        })
    }
    getForce(obj){
        return [0, 0];
    }
}

class MassPoint extends PhyObject{
    constructor(field, x, m = 0, v = [0, 0], a = [0, 0]){
        super(field, x, v, a, 0);
        this.m = m;
    }
    
    run(){
        let f = [0, 0];
        this.x.forEach((c, i) => {
            this.x[i] += this.v[i]*this.field.dt/1000;
            this.v[i] += this.a[i]*this.field.dt/1000;
        });
        
        this.a = [0, 0];
        
        this.field.objects.forEach(o => {
            f = o.getForce(this);
            this.a[0] += f[0];
            this.a[1] += f[1];
        });
        
        this.a[0] /= this.m;
        this.a[1] /= this.m;
    }
    getForce(obj){
        if(obj.m === undefined)return [0, 0];
        if(obj.name === this.name)return [0, 0];
        
        let d = (obj.x[0]-this.x[0])*(obj.x[0]-this.x[0])+(obj.x[1]-this.x[1])*(obj.x[1]-this.x[1]);
        let f = Math.sqrt(d);
        let m = -(obj.m*this.m*g)/(d*f);
        
        //console.log(d);
        
        return [m*(obj.x[0]-this.x[0]), m*(obj.x[1]-this.x[1])];
    }
    getPotential(x = [0,0]){
        let d = (x[0]-this.x[0])*(x[0]-this.x[0])+(x[1]-this.x[1])*(x[1]-this.x[1]);
        let f = Math.sqrt(d);
        return this.m*g/f;
    }
}

class MassObject extends MassPoint{
    constructor(field, x, m = 0, r = 0, v = [0, 0], a = [0, 0]){
        super(field, x, m, v, a);
        this.r = r;
    }
    
    getForce(obj){
        if(obj.m === undefined)return [0, 0];
        if(obj.name === this.name)return [0, 0];
        
        let d = (obj.x[0]-this.x[0])*(obj.x[0]-this.x[0])+(obj.x[1]-this.x[1])*(obj.x[1]-this.x[1]);
        let f = Math.sqrt(d);
        
        if(f < this.r + obj.r){
            this.collide(obj);
            return [0, 0];
        }
        
        let m = -(obj.m*this.m*g)/(d*f);
        
        //console.log(d);
        
        return [m*(obj.x[0]-this.x[0]), m*(obj.x[1]-this.x[1])];
    }
    
    collide(obj){
        console.log(this.index + ":" + obj.index);
        if(this.index >= obj.index)return 0;
        
        let p = [this.m*this.v[0]+obj.m*obj.v[0], this.m*this.v[1]+obj.m*obj.v[1]];
        let q = [this.m*this.x[0]+obj.m*obj.x[0], this.m*this.x[1]+obj.m*obj.x[1]];
        
        this.field.objects.splice(this.index, 1);
        obj.m += this.m;
        obj.v[0] = p[0]/obj.m;
        obj.v[1] = p[1]/obj.m;
        obj.r = Math.pow(obj.r*obj.r*obj.r+this.r*this.r*this.r, 1/3);
        obj.x[0] = q[0]/obj.m;
        obj.x[1] = q[1]/obj.m;
    }
}

class ForceArrow extends PhyObject{
    constructor(field, x, r = 0, v = [0, 0], a = [0, 0]){
        super(field, x, v, a);
        this.m = 1;
        this.u = 0;
    }
    
    run(){
        this.a = [0, 0];
        this.u = 0;
        
        this.field.objects.forEach(o => {
            //this.a[0] += o.getForce(this)[0];
            //this.a[1] += o.getForce(this)[1];
            this.u += o.getPotential(this.x);
        });
    }
    
    draw(crc){
        //console.log(this.a);
        let dx = this.a[0];
        let dy = this.a[1];
        
        if(dx*dx+dy*dy>5000){dx = 0;dy = 0;}
        
        crc.beginPath();
        crc.fillStyle = myRGBA((this.u - a)/b);
        crc.fillRect(this.x[0] - tx/2, this.x[1] - ty/2, tx, ty);
    }
}

var canvas = document.getElementById("field");
var field = new Field(canvas.width, canvas.height, "a");

/*
canvasResize();
window.onresize = canvasResize();
*/

let ctx = canvas.getContext('2d');

canvas.addEventListener("click", e => {
    field.addMassObj(e.offsetX, e.offsetY, m, r, v_x, v_y);
    field.draw(ctx);
});

/*
canvas.addEventListener("dblclick", e => {
    field.objects = field.objects.filter(o => !(Math.abs(o.x[0]-e.offsetX) < 5 && Math.abs(o.x[1]-e.offsetY) < 5));
    field.addArrow(e.offsetX, e.offsetY);
    field.draw(ctx);
});
*/

function runField(){
    console.log("run!!"+field.objects.length);
    field.run();
    field.draw(ctx);
}

let intervalee = runField();

let intervalId = "stopped";

function stopField(){
    clearInterval(intervalId);
    intervalId = "stopped";
}

function resumeField(){
    if(intervalId === "stopped")intervalId = setInterval(runField, field.dt);
}

function clearField(){
    field.kill();
    field.draw(ctx);
}

function fillWithArrow(){
    for(let x = 0; x < field.width; x += tx){
        for(let y = 0; y < field.height; y += ty){
            //console.log(x,y);
            field.addArrow(x, y);
        }
    }
}

function myRGBA(i){
    i = 1-i;
    //console.log(i);
    if(i < 0)return "rgb(255, 0, 0)";
    if(i > 1)return "rgb(255, 255, 255)";
    
    let r = 255;
    let g = 255;
    let b = 255;
    i *= 6;
    let j = Math.floor(i);
    let f = i - j;
    
    
    
    switch (j) {
            default:
            case 0:
                g *= f;
                b *= 0;
                break;
            case 1:
                r *= 1 - f;
                b *= 0;
                break;
            case 2:
                r *= 0;
                b *= f;
                break;
            case 3:
                r *= 0;
                g *= 1 - f;
                break;
            case 4:
                r *= f;
                g *= 0;
                break;
            case 5:
                g *= 0;
                b *= 1 - f;
                break;
        }
    
    return `rgb(${r}, ${g}, ${b})`;
}

fillWithArrow();

function reloadArgs(){
    a = Number(document.getElementById("a").value);
    b = Number(document.getElementById("b").value);
    m = Number(document.getElementById("m").value);
    v_x = Number(document.getElementById("v_x").value);
    v_y = Number(document.getElementById("v_y").value);
    r = Number(document.getElementById("r").value);
}

/*
function canvasResize(){
    console.log(window.innerHeight, window.innerWidth)
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}
*/