import React,{ Component } from 'react';
import {isMobile} from 'react-device-detect';

function format_number(number, decimals, dec_point, thousands_sep) {

	var n = number, prec = decimals;

	var toFixedFix = function (n,prec) {
		var k = Math.pow(10,prec);
		return (Math.round(n*k)/k).toString();
	};

	n = !isFinite(+n) ? 0 : +n;
	prec = !isFinite(+prec) ? 0 : Math.abs(prec);
	var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
	var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

	var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

	var abs = toFixedFix(Math.abs(n), prec);
	var _, i;

	if (abs >= 1000) {
		_ = abs.split(/\D/);
		i = _[0].length % 3 || 3;

		_[0] = s.slice(0,i + (n < 0)) +
		_[0].slice(i).replace(/(\d{3})/g, sep+'$1');
		s = _.join(dec);
	} else {
		s = s.replace('.', dec);
	}

	var decPos = s.indexOf(dec);
	if (prec >= 1 && decPos !== -1 && (s.length-decPos-1) < prec) {
		s += new Array(prec-(s.length-decPos-1)).join(0)+'0';
	}
	else if (prec >= 1 && decPos === -1) {
		s += dec+new Array(prec).join(0)+'0';
	}
	return s;
};




function bundle_price(data){

    var product = data.product;

    if(data.price) return data.price;

    if(data.discount){
        var price = parseFloat(product.price);
        return price - (price * parseFloat('0.'+data.discount));
    }

};



function product_price(product){
	
	if(product.prices.old.value){
		return (
			<div className="price-holder">
				<div className={product.prices.old.class}>
					<span>{product.prices.old.label}</span>
					<span>{product.prices.old.formated}</span>
					<sup>{product.prices.old.monet}</sup>
				</div>
				<div className={product.prices.saving.class}>
					<span>{product.prices.saving.label}</span>
					<span>{product.prices.saving.formated}</span>
					<sup>{product.prices.saving.monet}</sup>
				</div>
				<div className={product.prices.price.class}>
					<span>{product.prices.price.label}</span>
					<span>{product.prices.price.formated}</span>
					<sup>{product.prices.price.monet}</sup>
				</div>
				<span className="price-helper">Za gotovinsko plaćanje i online kupovinu</span>
			</div>
		);
	} else {
		return (
			<div className="price-holder">
				<div className="mp-price empty-price">
					<span>&nbsp;</span>
					<span>&nbsp;</span>
					<sup>&nbsp;</sup>
				</div>
				<div className="saving-price empty-price">
					<span>&nbsp;</span>
					<span>&nbsp;</span>
					<sup>&nbsp;</sup>
				</div>
				<div className={product.prices.price.class + ' single-price'}>
					<span className={product.prices.price.label?'p-t-1':'p-t-2'}  >{product.prices.price.label?product.prices.price.label:'Cena'}</span>
					<span>{product.prices.price.formated}</span>
					<sup>{product.prices.price.monet}</sup>
				</div>
			</div>
		);
	}

}



export {format_number, bundle_price, product_price};
