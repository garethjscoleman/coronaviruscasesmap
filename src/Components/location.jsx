import React from 'react';


export class Location extends React.Component {

    render() {
          let scale = 1 ; //990.7121/1835;
          let latscale = -165.603*scale;
          let longscale = 102.055*scale;
          let latoffset = -10080*scale;
          let longoffset =  -1065.970584*scale;

          let lati =  Math.round(((this.props.lat)*  latscale)-latoffset) ;
          let longi = Math.round(((this.props.long)*  longscale)-longoffset );
          let rate = this.props.rate;

          const re = /\s/
          let type = this.props.type;
          let minCaseFont = 0.3;
          let maxCaseFont = 1.1;
          let minDeathFont = 0.5;
          let maxDeathFont = 1.5;
          let textCaseScaleFactor = 200;
          let textDeathScaleFactor = 10;
          let textscale = Math.min(Math.max(minCaseFont,rate/textCaseScaleFactor),maxCaseFont);
          let color = "rgb("+Math.min(255,(100+(2*rate)))+","+Math.max(0,(200-(2*rate)))+",80)";
          if (!!type && type==="Region")
          {
            rate = this.props.deathrate;
            color = "rgb("+Math.min(255,(100+(25*rate)))+","+Math.max(0,(200-(25*rate)))+",125)";
            textscale = Math.min(Math.max(minDeathFont,rate/textDeathScaleFactor),maxDeathFont);
            type = " deaths per million per week"
          }
          let widthoftext=this.props.area.split(re)[0].length * textscale *(13)
          let leftpos = longi-(0.5*widthoftext)
          let myStyle = { listStyleType:'none',
                            fontSize: textscale.toString()+'em' ,
                            position:'absolute',
                            left:leftpos,
                            top:lati, 
                            color:color,
                            zIndex:200
                        }; 

          return  <li style={myStyle} key={this.props.index}>
                        {this.props.area} {type} {this.props.rate + this.props.deathrate}
                  </li>;
      }
    }
