function UInt64Array(length) {

    array = [];

    for(var i = 0; i < length; i++) {
        array.push(new UInt64(0, 0));
    }


    return array;

}

var powersOfTen = [];

(function() {
    var x10 = function(x) {
        var x2 = x.add(x);
        var x4 = x2.add(x2);
        var x8 = x4.add(x4);
        return x8.add(x2);
    }
    var x = new UInt64(10);
    var lx = new UInt64(1);
    //while(x > lx)
    while(x.sub(lx).isPos()) {
        powersOfTen.unshift(lx);
        lx = x;
        x = x10(x);
    }
})()

console.log(powersOfTen.toString());

function UInt64(high, low) {

    if(typeof low === "undefined") {
        low = high;
        high = 0;
    }

    if(high < 0) {
        high += 0x100000000;
    }
    if(low < 0) {
        low += 0x100000000;
    }

    this.high = high;
    this.low = low;

    this.toString = function(x) {
        if(typeof(x) == "undefined") {
            x = 10;
        }
        if(x == 16) {
            x = 16
            // var num = this;
            // var str = "";
            // if(high >= 0x80000000) {
            //  console.log("num " + num.high.toString(x) + " " + num.low.toString(x))
            //  num = num.neg();
            //  console.log("neg " + num.high.toString(x) + " " + num.low.toString(x))
            //  str = "-";
            // }
            // if(num.high != 0) {
            //  str += num.high.toString(x);
            // }
            if(this.high == 0) {
                return this.low.toString(x);
            }
            else {
                return this.high.toString(x) + padHex(this.low.toString(x), 8);
            }
        }
        else {

            var num = this;
            var str = "";
            if(!this.isPos()) {
                num = this.neg();
                str = "-";
            }
            
            for(var i = 0; i < powersOfTen.length; i++) {
                var currentdigit = 0;
                while(num.sub(powersOfTen[i]).isPos()) {
                    currentdigit++;
                    num = num.sub(powersOfTen[i]);
                }
                if(!(currentdigit == 0 && (str === "" || str === "-"))) {
                    str = str + currentdigit.toString();
                }
            }

            return str;
        }
    };

    this.and = function(x) {
        return new UInt64(high & x.high, low & x.low);
    };

    this.xor = function(x) {
        return new UInt64(high ^ x.high, low ^ x.low);
    };

    this.add = function(x) {
        newLow = low + x.low;
        newHigh = high + x.high;
        if(newLow > 0xffffffff) {
            newHigh += 1;
            newLow -= 0x100000000
        }
        if(newHigh > 0xffffffff) {
            newHigh -= 0x100000000;
        }
        return new UInt64(newHigh, newLow);
    }

    this.neg = function() {
        newLow = low ^ 0x7fffffff;//this
        newHigh = high ^ 0x7fffffff;
        if(newHigh > 0x7fffffff) {
            newHigh -= 0x80000000;
        }
        else {
            newHigh += 0x80000000;
        }
        if(newLow > 0x7fffffff) {
            newLow -= 0x80000000;
        }
        else {
            newLow += 0x80000000;
        }
        return (new UInt64(newHigh, newLow)).add(new UInt64(1));
    }

    this.sub = function(x) {
        return this.add(x.neg());
    }

    this.is0 = function() {
        if(high == 0 && low == 0) {
            return true;
        }
        return false;
    }

    this.isPos = function() {
        return (high & 0x80000000) == 0;
    }

    this.toBool = function() {
        return !this.is0();
    }

    this.rightshift = function(x) {
        newLow = low >>> x;
        newLow |= ((Math.pow(2, x) - 1)&high) << (32 - x)
        newHigh = high >>> x;
        return new UInt64(newHigh, newLow);
    }

}
