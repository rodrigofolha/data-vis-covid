import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-infected-accumulated',
  templateUrl: './infected-accumulated.component.html',
  styleUrls: ['./infected-accumulated.component.css']
})
export class InfectedAccumulatedComponent implements OnInit {
  @Input() city: string;
  @Input() groupFilters: Object;
  private chart: am4charts.XYChart;
  private margin = 50;
  private width = 750;
  private height = 600;
  private population : any;

  constructor() { }

  ngOnInit (): void {
    let data = fetch('./assets/' + this.city + '.txt')
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

  extractData(data){
    let infectedCount = d3.nest<unknown, number>().key(d => d['EVENT']).key(d => d['DAY'])
    .rollup(v => v.length)
    .entries(data)
    .filter( d => d.key == 'infected')
    .map(function(d) {
      return d.values;
    })[0];
    let sum = this.population.reduce((a, b) => a+b, 0);
    for (let i=1; i< infectedCount.length; i++){
      infectedCount[i].value += infectedCount[i-1].value;
    }
    infectedCount = infectedCount.map(d=> { return {key: d.key, 'value': (d.value*100/sum).toFixed(2)}; });

    return infectedCount;
  }

   // Create series
 createSeries(data, name) {
  let series = this.chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "value";
  series.dataFields.valueX = "key";
  series.tooltipText = "Day: {valueX}\n[bold] Total infected: {valueY}%";
  series.name = name;
  series.strokeWidth = 1;

  let segment = series.segments.template;
  segment.interactionsEnabled = true;

  let hoverState = segment.states.create("hover");
  hoverState.properties.strokeWidth = 3;

  let dimmed = segment.states.create("dimmed");
  dimmed.properties.stroke = am4core.color("#dadada");

  
  series.data = data;

  // Drop-shaped tooltips
  series.tooltip.background.cornerRadius = 10;
  series.tooltip.background.strokeOpacity = 0;
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.label.minWidth = 40;
  series.tooltip.label.minHeight = 40;
  series.tooltip.label.textAlign = "middle";

  // Make bullets grow on hover
  let bullet = series.bullets.push(new am4charts.CircleBullet());
  bullet.circle.strokeWidth = 2;
  bullet.circle.radius = 1;
  bullet.circle.fill = am4core.color("#fff");

  return series;
}

updateGraph(data, name){
  let infectedCount = this.extractData(data);
    let series = this.createSeries(infectedCount,name);
    let scrollbar: any = this.chart.scrollbarX;
    scrollbar.series.push(series);
    let snaps:any = this.chart.cursor.snapToSeries;
    snaps.push(series);
  
}

createGraph(data, population) {
  this.population = population.split("\n").map(Number);
  let infectedCount = this.extractData(data);
  am4core.useTheme(am4themes_animated);
  let chart = am4core.create("chartdiv_infection_cumulated_"+this.city, am4charts.XYChart);

  chart.paddingRight = 20;


  let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
  xAxis.renderer.grid.template.location = 0;
  xAxis.title.text = "Day";

  let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  yAxis.tooltip.disabled = true;
  yAxis.renderer.minWidth = 35;

  let scrollbarX = new am4charts.XYChartScrollbar();
  this.chart = chart;
  this.chart.colors.step = 2;
  let series = this.createSeries(infectedCount, "Default" );
  scrollbarX.series.push(series);

  this.chart.cursor = new am4charts.XYCursor();
  this.chart.cursor.xAxis = xAxis;
  this.chart.cursor.snapToSeries = [series];
  this.chart.scrollbarX = scrollbarX;
  this.chart.legend = new am4charts.Legend();
  this.chart.legend.position = 'right';
  this.chart.legend.scrollable = true;
  this.chart.legend.labels.template.maxWidth = 95;

}

}
