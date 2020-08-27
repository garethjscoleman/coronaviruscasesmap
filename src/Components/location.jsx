import React from 'react';


export class Location extends React.Component {

    render() {
          let latscale = -297.363;
          let longscale = 172.255;
          let latoffset = -16630;
          let longoffset =  -1175.970584;

          let lati =  Math.round(((this.props.lat)*  latscale)-latoffset) ;
          let longi = Math.round(((this.props.long)*  longscale)-longoffset );
          let rate = this.props.rate;
          let textscale = Math.min(Math.max(0.3,rate/50),1.75);
          const re = /\s/
          let widthoftext=this.props.area.split(re)[0].length * textscale *(13)
          let leftpos = longi-(0.5*widthoftext)
          let myStyle = { listStyleType:'none',
                            fontSize: textscale.toString()+'em' ,
                            position:'absolute',
                            left:leftpos,
                            top:lati, 
                            color: "rgb("+Math.min(255,(100+(2*rate)))+","+Math.max(0,(200-(2*rate)))+",80)"}; 
            return <li style={myStyle} key={this.props.index} > {  this.props.area} { this.props.rate }</li>;
      }
    }
