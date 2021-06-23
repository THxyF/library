class Complex{
    constructor(a, b = 0){
        this.re = a;
        this.im = b;
    }
    
    get angle(){
        return Complex.angle(this);
    }
    get norm(){
        return Complex.norm(this);
    }
    
    get string(){
        //console.log(this);
        let str = this.re === 0 ? "" : this.re;
        
        if(this.im === 0){if(this.re === 0)str = "0";}
        else if(this.im === 1)str += this.re === 0 ? "i" : "+i";
        else if(this.im === -1)str += "-i";
        else str += (this.im > 0 && this.re !== 0 ? "+" : "")+this.im+"i"; 
        
        return str;
    }
    
    get stringA(){
        return `${this.norm}e^${this.angle}`;
    }
    
    static isComplex(z){
        if(typeof z !== "object")return false;
        return z.constructor.name === "Complex";
    }
    
    static toComplex(x){
        return Complex.isComplex(x) ? x : new Complex(x + 0);
    }
    
    static add(x, y = 0){
        let ans = new Complex(0, 0);
        
        let a = Complex.toComplex(x);
        let b = Complex.toComplex(y);
        
        return new Complex(x.re+y.re,x.im+y.im);
    }
    
    static sub(x, y = 0){
        return Complex.add(x, Complex.mul(y, -1));
    }
    
    static mul(x, y = 1){
        let a = Complex.toComplex(x);
        let b = Complex.toComplex(y);
        let ans = new Complex(0,0);
        
        //console.log(a,x);
        
        ans.re = a.re*b.re-a.im*b.im;
        ans.im = a.re*b.im+a.im*b.re;
        
        return ans;
    }
    
    static conjugate(x){
        let z = Complex.toComplex(x);
        return new Complex(z.re, -z.im);
    }
    
    static norm2(x){
        let z = Complex.toComplex(x);
        return z.re*z.re+z.im*z.im;
    }
    
    static norm(z){
        return Math.sqrt(Complex.norm2(z));
    }
    
    static angle(x){
        let z = Complex.toComplex(x);
        return Math.atan(z.im/z.re);
    }
    
    static div(x, y = 1){
        let ans = Complex.mul(x, Complex.conjugate(y));
        let norm2 = Complex.norm2(y);
        
        //console.log(y);
        
        ans.re /= norm2;
        ans.im /= norm2;
        
        return ans;
    }
    
    static pow(x, y = 1){
        return x === 0 ? 0 : Complex.exp(Complex.mul(y, Complex.ln(x)));
    }
    
    static exp(x){
        let z = Complex.toComplex(x);
        return Complex.mul(Math.exp(z.re), new Complex(Math.cos(z.im), Math.sin(z.im)));
    }
    
    static ln(x){
        return new Complex(Math.log(Complex.norm(x)), Complex.angle(x));
    }
    
    static log(x, y = Math.E){
        return Complex.div(Complex.ln(y), Complex.ln(x));
    }
    
    static sin(x){
        let i = Complex.I;
        let w = Complex.exp(Complex.mul(i, x));
        
        w = Complex.div(w, 2);
        
        return Complex.mul(i, Complex.sub(Complex.conjugate(w), w));
    }
    
    static cos(x){
        let i = Complex.I;
        let w = Complex.exp(Complex.mul(i, x));
        
        w = Complex.div(w, 2);
        
        return Complex.add(Complex.conjugate(w), w);
    }
    
    static tan(x){
        return Complex.div(Complex.sin(x), Complex.cos(x))
    }
    
    static round(x){
        let z = Complex.toComplex(x);
        
        return new Complex(Math.floor(z.re), Math.floor(z.im));
    }
    
    static floor(x){
        let z = Complex.toComplex(x);
        
        return new Complex(Math.floor(z.re), Math.floor(z.im));
    }
    
    static ceil(x){
        let z = Complex.toComplex(x);
        
        return new Complex(Math.ceil(z.re), Math.ceil(z.im));
    }
    
    static round(x){
        let z = Complex.toComplex(x);
        
        return new Complex(Math.round(z.re), Math.round(z.im));
    }
    
    static quadrant(x){
        let z = Complex.toComplex(x);
        
        if(z.re === 0){
            if(z.im === 0)return 0;
            else if(z.im > 0)return -2;
            else return -4;
        }
        else if(z.re > 0){
            if(z.im === 0)return -1;
            else if(z.im > 0)return 1;
            else return 4;
        }
        else {
            if(z.im === 0)return -3;
            else if(z.im > 0)return 2;
            else return 3;
        }
    }
    
    static I = new Complex(0, 1);
}
