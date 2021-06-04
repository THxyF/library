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
        
        console.log(this);
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
    
    static add(x, y){
        let ans = new Complex(0, 0);
        
        if(!Complex.isComplex(x))ans.re += x;
        else {ans.re += x.re; ans.im += x.im;}
        if(!Complex.isComplex(y))ans.re += y;
        else {ans.re += y.re; ans.im += y.im;}
        
        return ans;
    }
    
    static sub(x, y){
        return Complex.add(x, Complex.mul(y, -1));
    }
    
    static mul(x, y){
        let a = Complex.isComplex(x) ? x : new Complex(x, 0);
        let b = Complex.isComplex(y) ? y : new Complex(y, 0);
        let ans = new Complex(0,0);
        
        ans.re = a.re*b.re-a.im*b.im;
        ans.im = a.re*b.im+a.im*b.re;
        
        return ans;
    }
    
    static conjugate(z){
        return new Complex(z.re, -z.im);
    }
    
    static norm2(z){
        return z.re*z.re+z.im*z.im;
    }
    
    static norm(z){
        return Math.sqrt(Complex.norm2(z));
    }
    
    static angle(z){
        return Math.atan(z.im/z.re);
    }
    
    static div(x, y){
        let ans = Complex.mul(x, Complex.conjugate(y));
        let norm2 = Complex.norm2(y);
        
        ans.re /= norm2;
        ans.im /= norm2;
        
        return ans;
    }
    
    static pow(x, y){
        let ans = new Complex(0, 0);
        
        if(!Complex.isComplex(x))ans.re += x;
        else {ans.re += x.re; ans.im += x.im;}
        if(!Complex.isComplex(y))ans.re += y;
        else {ans.re += y.re; ans.im += y.im;}
        
        return ans;
    }
    
    static exp(z){
        return Complex.mul(Math.exp(z.re), new Complex(Math.cos(z.im), Math.sin(z.im)));
    }
    
    static ln(z){
        return new Complex(Math.log(Complex.norm(z)), Complex.angle(z));
    }
    
    static pow(x, y){
        return Complex.exp(Complex.mul(y, Complex.ln(x)));
    }
}
