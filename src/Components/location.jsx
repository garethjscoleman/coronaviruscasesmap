import React from 'react';


export class Location extends React.Component {

    render() {

          let lati = Math.round((56-this.props.lat)*250);
          let longi = Math.round((6.5+this.props.long)*150);
          let rate = this.props.rate;
          let scale = Math.min(Math.max(0.3,rate/50),1.75);
          const re = /\s/
          let widthoftext=this.props.area.split(re)[0].length * scale *(13)
          let leftpos = longi-(0.5*widthoftext)
          let myStyle = { listStyleType:'none',
                            fontSize: scale.toString()+'em' ,
                            position:'absolute',
                            left:leftpos,
                            top:lati, 
                            color: "rgb("+Math.min(255,(100+(2*rate)))+","+Math.max(0,(200-(2*rate)))+",80)"}; 
            return <li style={myStyle} key={this.props.index} > {  this.props.area} { this.props.rate }</li>;
      }
    }
