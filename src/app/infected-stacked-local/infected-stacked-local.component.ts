import { Component, OnInit,  Input } from '@angular/core';
import * as d3 from 'd3';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-infected-stacked-local',
  templateUrl: './infected-stacked-local.component.html',
  styleUrls: ['./infected-stacked-local.component.css']
})
export class InfectedStackedLocalComponent implements OnInit {
  @Input() city: string;
  @Input() groupFilters: Object;
  private chart: am4charts.XYChart;
  private xAxis;
  private yAxis;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  private population;

  constructor() { }

  ngOnInit (): void {
    let data = fetch('/assets/' + this.city + '.txt')
      .then(response => response.text())
      .then (population => d3.dsv(';',"./assets/covid-"+this.city+"-none-none-none-none-normal.csv").then(data => this.createGraph(data, population)));
  }

  ngOnChanges (): void {
    let home = "none";
    let school = "none";
    let work = "none";
    let transport = "none";
    let mode_infectivity = "normal";
    if (this.groupFilters && this.groupFilters['contactsAtHome'])
      home = this.groupFilters['contactsAtHome'];
    if (this.groupFilters && this.groupFilters['contactsAtSchool'])
      school = this.groupFilters['contactsAtSchool'];
    if (this.groupFilters && this.groupFilters['contactsAtWork'])
      work = this.groupFilters['contactsAtWork'];
    if (this.groupFilters && this.groupFilters['contactsAtTransport'])
      transport = this.groupFilters['contactsAtTransport'];
    if (this.groupFilters && this.groupFilters['typeOfEvent'])
      mode_infectivity = this.groupFilters['typeOfEvent'];

    if (this.chart) {
      let data : any = d3.dsv(';',"./assets/covid-"+this.city+"-"+school+"-"+work+"-"+home+"-"+transport+"-"+mode_infectivity+".csv")
      .then(data => this.updateGraph(data,  "s: "+school+" - w: "+work+" - h: "+home+" - t: "+transport+" - mi: "+mode_infectivity));
    }

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
}

  // Create series
 createSeries(data, value, name, stacked ) {
  let series = this.chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = value;
  series.dataFields.categoryX = "key";
  series.columns.template.tooltipText = "Series: {name}\nAge range: {categoryX}\nValue: {valueY}%";
  series.name = name;
  series.stacked = stacked
  series.columns.template.width = am4core.percent(95);

  let bullet = series.bullets.push(new am4charts.LabelBullet());
  bullet.interactionsEnabled = false;
  bullet.dy = 30;
  bullet.label.fill = am4core.color('#dadada');


  series.data=data;

  return series;
}

extractData(data){
  let data_grouped = d3.nest<unknown, number>().key(function(d) :string{
    let age_group = undefined;
    if (d['INFECTED_AGE'] <= 10) {
      age_group = '01-10';
    } else if (d['INFECTED_AGE'] <= 20)  {
      age_group = '11-20';
    } else if (d['INFECTED_AGE'] <= 30)  {
      age_group = '21-30';
    } else if (d['INFECTED_AGE'] <= 40)  {
      age_group = '31-40';
    } else if (d['INFECTED_AGE'] <= 50)  {
      age_group = '41-50';
    } else if (d['INFECTED_AGE'] <= 60)  {
      age_group = '51-60';
    } else if (d['INFECTED_AGE'] <= 70)  {
      age_group = '61-70';
    } else if (d['INFECTED_AGE'] <= 80)  {
      age_group = '71-80';
    } else if (d['INFECTED_AGE'] <= 90)  {
      age_group = '81-90';
    } else {
      age_group = '91-100';
    }  
    return age_group;
  })
  .sortKeys(d3.ascending)
  .rollup(function(v) : any{
    let local = d3.nest<unknown, number>().key(function(d) {
      return d['LOCAL_OF_INFECTION']
    })
    .rollup(d => d.length)
    .entries(v);
    return local
  })
  .entries(data)
  .filter( d => d.key != '-');

  let objects = data_grouped.map(function(e : {key: string, values: any, value: any}, index) {
    let home : number = 0;
    let work : number = 0;
    let transportation : number = 0;
    let school : number = 0;
    for (let i = 0; i < e.value.length; i++){
      if (e.value[i].key === 'home'){
        home = +(e.value[i].value/this.population[index]*100).toFixed(2);
      } else if (e.value[i].key === 'work'){
        work = +(e.value[i].value/this.population[index]*100).toFixed(2);
      }  else if (e.value[i].key === 'transportation'){
        transportation = +(e.value[i].value/this.population[index]*100).toFixed(2);
      }  else if (e.value[i].key === 'school'){
        school = +(e.value[i].value/this.population[index]*100).toFixed(2);
      } 
    }
    return {key: e.key, home: home, school: school, work: work, transportation: transportation};
  }.bind(this));
  
  return objects;
}

sumPopulationbyAge(population) {
  let INTERVAL = 10;

  this.population = population.reduce(function(result, value, index) {
      var i = Math.floor(index/INTERVAL);
      result[i] ? result[i] += value : result[i] = value;
      return result;
    }, []);
}


updateGraph(data, name){
  let infectedCount = this.extractData(data);
  let series1 = this.createSeries(infectedCount, 'home', 'Home: ' + name, false);
  let series2 = this.createSeries(infectedCount, 'school', 'School: ' + name, true);
  let series3 = this.createSeries(infectedCount, 'work', 'Work: ' + name, true);
  let series4 = this.createSeries(infectedCount, 'transportation', 'Transportation: ' + name, true);

  //this.linkEvents(series1, series2, series3, series4);
  
}

createGraph(data, population) {
  this.population = population.split("\n").map(Number);

  this.sumPopulationbyAge(this.population);
  let infectedCount = this.extractData(data);

  am4core.useTheme(am4themes_animated);

  this.chart = am4core.create("chartdiv_stacked_"+this.city, am4charts.XYChart);
  this.chart.colors.step = 1;

  this.chart.legend = new am4charts.Legend()
  this.chart.legend.position = 'right';
  this.chart.legend.scrollable = true;
  this.chart.legend.paddingBottom = 20;
  this.chart.legend.labels.template.maxWidth = 95;

  let xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
  xAxis.dataFields.category = 'key';
  xAxis.title.text = "Age range";
  xAxis.renderer.grid.template.location = 0;
  xAxis.renderer.minGridDistance = 20;
  xAxis.renderer.cellStartLocation = 0.1;
  xAxis.renderer.cellEndLocation = 0.9;

  let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;
  xAxis.data = [{key: "01-10"},
              {key: "11-20"},
              {key: "21-30"},
              {key: "31-40"},
              {key: "41-50"},
              {key: "51-60"},
              {key: "61-70"},
              {key: "71-80"},
              {key: "81-90"},
              {key: "91-100"}]

  let series1 = this.createSeries(infectedCount, 'home', 'Home: default', false);
  let series2 = this.createSeries(infectedCount, 'school', 'School: default', true);
  let series3 = this.createSeries(infectedCount, 'work', 'Work: default', true);
  let series4 = this.createSeries(infectedCount, 'transportation', 'Transportation: default', true);

  //this.linkEvents(series1, series2, series3, series4);

}

linkEvents(series1, series2, series3, series4){
  series1.events.on("hidden", function() {
    series2.hide();
    series3.hide();
    series4.hide();
  });
  
  series1.events.on("shown", function() {
    series2.show();
    series3.show();
    series4.show();
  });

  series2.events.on("hidden", function() {
    series1.hide();
    series3.hide();
    series4.hide();
  });
  
  series2.events.on("shown", function() {
    series1.show();
    series3.show();
    series4.show();
  });

  series3.events.on("hidden", function() {
    series2.hide();
    series1.hide();
    series4.hide();
  });
  
  series3.events.on("shown", function() {
    series2.show();
    series1.show();
    series4.show();
  });

  series4.events.on("hidden", function() {
    series2.hide();
    series3.hide();
    series1.hide();
  });
  
  series4.events.on("shown", function() {
    series2.show();
    series3.show();
    series1.show();
  });
}
 
}
