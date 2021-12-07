
export const CryptHelper = {

    cheep: 3,

    key: 'bokakotorska',

    chars: {
        'a' : 'n1a',
        'A' : 'N19',
        'b' : 'IOd',
        'B' : 'IIO',
        'c' : 'ket',
        'C' : 'K9u',
        'd' : 'f8a',
        'D' : 'f9d',
        'e' : 'gwd',
        'E' : 'Wqm',
        't' : 'Bho',
        'T' : 'LLr',
        'i' : 'v7i',
        'I' : 'v7w',
        '=' : 'end',
        '+' : 'eol',
        'k' : '3eo',
        'K' : '8Ga',
        'z' : 'Yy2',
        'Z' : 's52',
        '.' : 'geo',
        ',' : 'j1t',
        'q' : 'z93',
        'n' : 'dxq',
        '&' : '2e5',
        'f' : 'asw',
        'F' : 'r76',
        'g' : 'wey',
        'G' : 'rrt',
        'y' : '9ui',
        'Y' : 'TTR',
        'N' : 'p5v',
        'Q' : 'gf8',
        's' : '00d',
        'S' : '00R',
        'h' : 'yTh',
        'H' : 'r8j',
        'o' : 'AbA',
        'O' : 'lfx',
        'p' : 'Gfz',
        'P' : '7mt',
        'j' : '33s',
        'J' : 'Uf1',
        'l' : 'Qfp',
        'L' : 'Apq',
        'v' : '4d0',
        'V' : 'A1r',
        'm' : '0t4',
        'M' : 'ms2',
        'x' : 'but',
        'X' : 'Fu6',
        'u' : '8s8',
        'U' : 'U8U',
        '0' : 'dY7',
        '1' : 'GB4',
        '2' : 'FFa',
        '3' : '0sz',
        '4' : 'A8p',
        '5' : 'kKd',
        '6' : 'ml2',
        '7' : 'tec',
        '8' : '3kf',
        '9' : '55t',
        '(' : 'YUB',
        ')' : 'BBT',
        '-' : 'LXC',
        ' ' : 'RAD',
        ':' : '6Fv',
        '/' : 'TrO'

    },

    encrypt: function( string ){

        var str = '';
        var _chars= new Array();
        for(var i =0; i< string.length; i++){
            var char = string[i];
            var newChar = char;
            if(this.chars[char]!== undefined){
                newChar = this.chars[char];
            } 
            _chars.push(newChar);
        }

        var newStr= _chars.join('');

        return newStr;

    },

    decrypt: function( string ){

        var nchars = {};
        Object.keys(this.chars).map( (k) => {
            nchars[this.chars[k]] = k;
        });

        var newStr = '';
        var n = '';
        var f = '';
        for(var i =0; i< string.length; i++){
            n += string[i];
            if(n.length == 3){
                f +=nchars[n] != undefined ? nchars[n] : n;
                n = '';
            }
        }

        return f;
    }

}