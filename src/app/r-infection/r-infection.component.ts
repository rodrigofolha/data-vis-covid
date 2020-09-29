import { Component, OnInit,  Input } from '@angular/core';
import * as d3 from 'd3';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-r-infection',
  templateUrl: './r-infection.component.html',
  styleUrls: ['./r-infection.component.css']
})
export class RInfectionComponent implements OnInit {
  @Input() city: string;
  @Input() groupFilters: Object;
  private chart: am4charts.XYChart;
  private xAxis;
  private valueAxis;
  private margin = 50;
  private width = 750;
  private height = 600;
  private population;
  private colors;

  constructor() { }

  ngOnInit (): void {
    let data = fetch('/assets/' + this.city + '.txt')
      .then(response => response.text())
      .then (population => d3.dsv(';',"/assets/covid-"+this.city+"-none-none-none-none-normal.csv").then(data => this.createGraph(data, population)));
 
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
      let data : any = d3.dsv(';',"/assets/covid-"+this.city+"-"+school+"-"+work+"-"+home+"-"+transport+"-"+mode_infectivity+".csv")
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
 createSeries(data, name) {
  let series : any = this.chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = 'value';
  series.dataFields.valueX = "key";
  series.data = data;
  series.tooltipText = '{value}'
  series.name = name;
  series.strokeWidth = 2;
  series.tensionX = 0.77;

  // Drop-shaped tooltips
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.strokeOpacity = 0;
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.label.minWidth = 40;
  series.tooltip.label.minHeight = 40;
  series.tooltip.label.textAlign = "middle";
  series.tooltip.label.textValign = "middle";

  // // Make bullets grow on hover
  var bullet = series.bullets.push(new am4charts.CircleBullet());
  bullet.circle.strokeWidth = 2;
  bullet.circle.radius = 4;
  //bullet.circle.fill = am4core.color("#fff");


  return series;
}

extractData(data){
  let data_grouped = d3.nest<unknown, number>().key(d => d['STEP'])
  .sortKeys((a, b) => d3.ascending(+a, +b))
  .rollup(d => d.length)
  .entries(data)
  .filter(d => d.key !== '0');

  for (let i=data_grouped.length-1; i > 0; i--){
    data_grouped[i].value /= data_grouped[i-1].value;
  }

  return data_grouped;
}


updateGraph(data, name){
  let infectedCount = this.extractData(data);
  let series = this.createSeries(infectedCount, name);
  let snaps : any = this.chart.cursor.snapToSeries;
  snaps.push(series);
  
}

createGraph(data, population) {

  this.population = population.split("\n").map(Number);
  let infectedCount = this.extractData(data);
  am4core.useTheme(am4themes_animated);

  this.chart = am4core.create("chartdiv_r_infection_"+this.city, am4charts.XYChart);
  this.chart.paddingRight = 20;
  //this.chart.colors.step = 2;

  this.chart.legend = new am4charts.Legend()
  this.chart.legend.position = 'right';
  this.chart.colors.step = 2;
  this.chart.legend.scrollable = true;
  this.chart.legend.paddingBottom = 20
  this.chart.legend.labels.template.maxWidth = 95

  let xAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
  xAxis.title.text = "Generation #";
  xAxis.renderer.grid.template.location = 0.5;
  xAxis.renderer.minGridDistance = 50;
  xAxis.renderer.cellStartLocation = 0.5;
  xAxis.renderer.cellEndLocation = 0.5;

  let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.baseValue = 1;
  this.valueAxis = valueAxis;

  // Make a panning cursor
  this.chart.cursor = new am4charts.XYCursor();
  // this.chart.cursor.behavior = "panXY";
  this.chart.cursor.xAxis = xAxis;

  let series = this.createSeries(infectedCount, 'Default');
  this.chart.cursor.snapToSeries = [series];

}


 
}
