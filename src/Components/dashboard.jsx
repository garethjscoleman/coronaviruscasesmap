import { getCases, dataEndpoint, dataHost } from '../service/getCases';
import React from 'react'
import areaData from '../service/areaPop'
import { Location } from './location'

export class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.areaInfo = areaData;
    this.state = { thedata: [], started: false, dataloaded:0 };
    this.getTheData = this.getTheData.bind(this);
    this.popData = areaData().sort();
    this.sortAreas = this.sortAreas.bind(this);
    this.popDataObj = {};
    this.dataHost = dataHost;
    this.thedates = [];
    var date = new Date()
    let daydiff = 11;
    date.setDate(date.getDate() - daydiff);
    this.startDate = date;
    while (daydiff > 4) {
      daydiff--;
      date = new Date()
      date.setDate(date.getDate() - daydiff);
      this.thedates.push(date.toISOString().substr(0, 10));
    }
    this.endDate = date;
    this.popData.sort().map((area, index) => { area.index = index; area.currentrate = 0; area.thisweekscases = 0; area.thisweeksrate = 0; this.popDataObj[area.areaCode] = area;return null });
  }

  componentDidMount() {
    if (!this.state.started) {
      this.setState({ thedata: [], started: true });
      this.thedates.map(thedate => {
        let dataEndpointForThisWeek = dataEndpoint.replace('{date}', thedate);
        this.getTheData(dataHost + dataEndpointForThisWeek);
        return null;
      });

    }

  }

  sortAreas(area1, area2) {

    //sort areas to be approximately north south, but with an east/west component
    if ((area1.lat + (0.025 * area1.long)) < (area2.lat + (0.025 * area2.long))) {
      return 1
    }
    else {
      return -1
    }
  }
  getTheData(url) {
    getCases(url).then(data => {
      var allData = this.state.thedata;
      let casedate;
      data.data.map(value => {
        try {
          value.rate = value.cases / (this.popDataObj[value.areaCode].pop / 100000);
          casedate = new Date(Date.parse(value.date));
          if (casedate > this.startDate && casedate < this.endDate) {
            if (value.cases > 0) {
              this.popDataObj[value.areaCode].thisweekscases = this.popDataObj[value.areaCode].thisweekscases + value.cases;
            }
          }
          return null;
        }
        catch
        {
          console.log(value.areaCode)
        }
        allData.push(value);
        return null;
  
      });

      this.popData.map(value => {
        this.popDataObj[value.areaCode].currentrate = Math.round(this.popDataObj[value.areaCode].thisweekscases / (this.popDataObj[value.areaCode].pop / 100000))
        value.currentrate = this.popDataObj[value.areaCode].currentrate;
        value.thisweekscases = this.popDataObj[value.areaCode].thisweekscases;
        return null;
      })
      let dataloaded = this.state.dataloaded+1;

      this.setState({ thedata: allData,dataloaded:dataloaded });

      if (allData.length < 70000 && (typeof (data.pagination.next) != 'undefined' && !!data.pagination.next)) {
        this.getTheData(this.dataHost + data.pagination.next)
      }


    });

  }

  render() {
    var popData = this.popData;
    var mapStyle= {
      height:"1835px",
//      width:"1325px",
      position:"absolute",
      top:"0px",
      left:"0px",
      zIndex:-1
    }

    return <div >
      {this.state.dataloaded<7 && <h3>Loading Regional Daily Data for last full week of data {this.state.dataloaded} of 7</h3>}
      <ul>
        {popData.length < 1 ? <li key={-9999} index={-99999}>Not Yet</li> :
         popData.sort(this.sortAreas).map((value, index) => {

          return <Location area={value.areaName}
            rate={value.currentrate}
            lat={value.lat}
            long={value.long}
            index={value.index}
            key={value.index} />
        })}
      </ul>
      <img 
    src={process.env.PUBLIC_URL + '/england.svg'} 
    alt="map of england" 
    
    style={mapStyle} />
    </div>
      ;
  }
}

