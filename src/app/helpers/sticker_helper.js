import React, { Component } from 'react';


class StickerHelper extends React.Component {

    constructor(props){
        super();
    };


    inline_style(sticker){
        return {
            color: sticker.color,
            backgroundColor: sticker.bg
        }
    };

    sticker_class(sticker){
        return sticker.class !== undefined ? sticker.class : 'regular';
    }

    /*
    * type 1 - top
    * type 2 - bottom
    */
    getStickers(stickers, type){
       if(type == 1){
           if(stickers.length){
                var _stickers = stickers['top'];

                if(_stickers === Object(_stickers)){
                    _stickers = Object.keys(_stickers).map(function (key) { return _stickers[key]; });
                }

                if(_stickers.length){
                    return _stickers.map((sticker, i) =>
                    <li key={i} className="box-sticker" style={this.inline_style(sticker)}><span>{sticker.name}</span></li> );
                }
            }
       }

       if(type == 2){

        if(stickers.length){        
                var _stickers = stickers['bottom'];

                if(_stickers === Object(_stickers)){
                    _stickers = Object.keys(_stickers).map(function (key) { return _stickers[key]; });
                }

                if(_stickers.length){
                    return _stickers.map((sticker, i) => <li key={i} className={this.sticker_class(sticker)}><span>{sticker.name}</span></li> );
                }
            }
        }
    }


    render(){
        const type = this.props.type;
        const stickers = this.props.stickers;

        if(!stickers) return '';

        if(Object.keys(stickers).length){
            return (
                <ul className="stickers">
                    {this.getStickers(stickers, type)}
                </ul>
            );
        } else {
            return '';
        }
    };

}

export default StickerHelper;
