import { getCases, dataEndpoint, dataHost }   from '../service/getCases';
import  React,{Component} from 'react'
import areaData from '../service/areaPop'
import {Location} from './location'

export class Dashboard extends React.Component {

  constructor(props){
    super(props);
    this.areaInfo = areaData;     
    this.state={thedata:[],started:false};
    this.getTheData = this.getTheData.bind(this);
    this.popData = areaData().sort();
    this.sortAreas = this.sortAreas.bind(this);
    this.popDataObj ={};  
    this.dataHost= dataHost;
    this.thedates=[];
    var date = new Date()
    let daydiff= 11;
    date.setDate(date.getDate()-daydiff);
    this.startDate =  date;
    while( daydiff> 4){
      daydiff--;
      date = new Date()
      date.setDate(date.getDate()- daydiff);
      this.thedates.push(date.toISOString().substr(0,10));  
    }
    this.endDate = date; 
    this.popData.sort().map((area,index) => { area.index = index; area.currentrate=0 ; area.thisweekscases = 0 ; area.thisweeksrate=0; this.popDataObj[area.areaCode]= area});
  }

  componentDidMount()
  {
    if (!this.state.started){
      this.setState({thedata:[],started:true});
      this.thedates.map(thedate => {       
             let dataEndpointForThisWeek = dataEndpoint.replace('{date}',thedate);
             this.getTheData(dataHost + dataEndpointForThisWeek)
      });
    
    }

  }

  sortAreas(area1,area2){

    //sort areas to be approximately north south, but with an east/west component
    if ((area1.lat + (0.025*area1.long)) <(area2.lat+(0.025*area2.long)))
    {
      return 1
    }
    else 
    {
      return -1
    }
  }
  getTheData(url)
  {
    getCases(url).then(data =>{
      var allData = this.state.thedata;
      var i= 0;
      let casedate;
      data.data.map(value =>{
        try {
          value.rate = value.cases / (this.popDataObj[value.areaCode].pop / 100000);
          casedate = new Date(Date.parse(value.date));
          if ( casedate >this.startDate && casedate<this.endDate)
          {
            if (value.cases>0){
                this.popDataObj[value.areaCode].thisweekscases =  this.popDataObj[value.areaCode].thisweekscases + value.cases;              
            }
          }
        }
        catch 
        {
          console.log(value.areaCode)
        }
        allData.push(value);
        });

      this.popData.map(value=>   {
        this.popDataObj[value.areaCode].currentrate = Math.round( this.popDataObj[value.areaCode].thisweekscases / (this.popDataObj[value.areaCode].pop/100000))
        value.currentrate = this.popDataObj[value.areaCode].currentrate;
        value.thisweekscases = this.popDataObj[value.areaCode].thisweekscases;
      })

      this.setState({thedata:allData});
      if ( allData.length<70000 && (typeof(data.pagination.next)!= 'undefined' && !!data.pagination.next))
      {
          this.getTheData(this.dataHost + data.pagination.next)
      }  
  
    
    });
    
  }

  render() {  
    var  popData = this.popData;


  return <div ><h3>Loading Regional Data {this.state.thedata.length} of about 3,000</h3>
    <ul >
      {  popData.length <1 ? <p>Not Yet</p>: popData.sort(this.sortAreas).map((value, index) =>{ 
            
            return <Location  area={value.areaName} 
                  rate={value.currentrate} 
                  lat={value.lat} 
                  long={value.long} 
                  index={value.index} />
            })}
    </ul>
    </div>
    ;
  }
}
                    
           