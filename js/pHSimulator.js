class Acid{//ほかのコードでこれだけ使うかも
    constructor(n = 1, pk = [0]){
        if(!Array.isArray(pk))pk = [pk];
        
        this.n = n;//valence
        this.pk = pk;//acidity(length = n)
    }
}

class UsingAcid extends Acid{//投入量,各イオンの濃度付き
    constructor(n, pk, c){
        super(n, pk);
        this.c = c;//amount(mol)
        
        console.log(this);
    }
    
    getRatio(ph){//各イオンの濃度[mol/L]を配列にして返す(i番目はi価(i = 0,1,...,n-1))
      let sum = 0, summ = [], ssum = 0;
      for(let i = 0; i < this.n + 1; ++ i){//全体量を出す
        for(let j = 0; j < this.n; ++ j){
          sum -= i <= j ? ph : this.pk[j];//10^-pkなので、掛け算は足し算になる
        }
        summ.push(sum);//各イオンの全体に対する割合(この時点ではlog10をとってある)
        ssum += Math.pow(10, sum);//各イオンの全体の計算
        sum = 0;
      }
      
      //console.log("ssum:"+ssum);
      //console.log("summ:"+summ);
        
      return summ.map(suum => Math.pow(10, suum)*this.c/ssum);
    }
    
    getCharge(ph){//イオンによる1[L]当たりの電荷[C]をとってくる
        let ionRatio = this.getRatio(ph);
        
        //console.log("ionRatio:"+ionRatio);
        let charge = 0;
        ionRatio.forEach((ratio, ch) => charge += -ratio*ch);//-chが電荷になる
        
        //console.log("charge:"+charge);
        
        return charge;
    }
}

class Acids{
    constructor(n = [], pk = [], c = []){
        this.acids = [];
        if(!Array.isArray(n)){n = [n];pk = [pk];c = [c];}
        for(let i = 0; i < n.length; ++ i)this.acids.push(new UsingAcid(n[i], pk[i], c[i]));
    }
    
    test(ph){
        let ch = 0;
        this.acids.forEach(acid => ch += acid.getCharge(ph));
        
        ch += Math.pow(10, -ph) - Math.pow(10, ph-14);//phを[H+][mol/L]に換算,全体の電荷を求める。
                                //+だとpH低すぎ,-だと高すぎ
                                //[OH^-]=Kw/[H+]
        
        console.log("ans :"+ch);
        return ch;
    }
    
    run(){
        let step = 0, ph = 0;
        
        if(this.test(ph) > 0){while(this.test(ph) < 0)ph -= 14;ph += 7;}
        else {while(this.test(ph) > 0)ph += 14;ph -= 7;}//pHを0~14/14~28...に収める
        
        for(let unit = 3.5; step < 100; ++ step){//二分探査,現在の"ph"より±7の範囲にあることが保証
            if(this.test(ph) < 0)ph -= unit;
            else ph += unit;
            
            console.log("at ph = "+ph+"±"+unit+"\n")
            
            unit /= 2;
        }
        
        return ph;
    }
}

let kasuu = document.getElementById("n");
let amount = document.getElementById("c");

let pks = document.getElementById("pks");

let out = document.getElementById("out");

let sol = new Acids();

function addPKS(n){
    let val = n.value;
    let str = "";
    
    for(let i = 1; i <= val; i ++){
        str += `第${i}解離定数:10^-(<input type="text" id="pk${i}" value="1">)<br>`
    }
    pks.innerHTML = str;
}

function addAcid(){
    let pk = [];
    
    pks.childNodes.forEach(pki => {
        let a = pki.value - 0;
        if(!Number.isNaN(a))pk.push(a);
    });
    
    sol.acids.push(new UsingAcid(kasuu.value - 0, pk, amount.value - 0));
    
    let res = sol.run();
    
    out.value = res;
}

function resetSim(){
    sol = new Acids();
    out.value = sol.run();
}