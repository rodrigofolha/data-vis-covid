import { Component, OnInit,  Input } from '@angular/core';
import * as d3 from 'd3';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-infector-by-age',
  templateUrl: './infector-by-age.component.html',
  styleUrls: ['./infector-by-age.component.css']
})
export class InfectorByAgeComponent implements OnInit {
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
 createSeries(data, name) {
  let series = this.chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = "value";
  series.dataFields.categoryX = "key";
  series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}%";
  series.name = name;

  // series.events.on("hidden", this.arrangeColumns.bind(this));
  // series.events.on("shown", this.arrangeColumns.bind(this));

  let bullet = series.bullets.push(new am4charts.LabelBullet());
  bullet.interactionsEnabled = false;
  bullet.dy = 30;
  bullet.label.fill = am4core.color('#dadada');


  series.data=data;

  return series;
}

sumPopulationbyAge(population) {
  let INTERVAL = 10;

  this.population = population.reduce(function(result, value, index) {
      var i = Math.floor(index/INTERVAL);
      result[i] ? result[i] += value : result[i] = value;
      return result;
    }, []);
}

extractData(data){
  let data_grouped = d3.nest<unknown, number>().key(d => d['EVENT']).key(function(d) :string{
    let age_group = undefined;
    if (0 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 10) {
      age_group = '01-10';
    } else if (10 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 20)  {
      age_group = '11-20';
    } else if (20 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 30)  {
      age_group = '21-30';
    } else if (30 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 40)  {
      age_group = '31-40';
    } else if (40 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 50)  {
      age_group = '41-50';
    } else if (50 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 60)  {
      age_group = '51-60';
    } else if (60 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 70)  {
      age_group = '61-70';
    } else if (70 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 80)  {
      age_group = '71-80';
    } else if (80 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 90)  {
      age_group = '81-90';
    } else if (90 < +d['INFECTOR_AGE'] && +d['INFECTOR_AGE'] <= 100) {
      age_group = '91-100';
    }  
    return age_group;
  })
  .sortKeys( d3.ascending)
  .rollup(v => v.length)
  .entries(data)
  .filter( d => d.key == 'infected')
  .map(function(d) {
    return d.values;
  })[0]
  .map((d,i) => {return {key: d.key, value: Math.round(d.value/this.population[i]*100)}; });

  return data_grouped;
}


updateGraph(data, name){
  let infectedCount = this.extractData(data);
  let series = this.createSeries(infectedCount, name);
  
}

createGraph(data, population) {
  this.population = population.split("\n").map(Number);
  this.sumPopulationbyAge(this.population);

  let infectedCount = this.extractData(data);
  
  am4core.useTheme(am4themes_animated);

  this.chart = am4core.create("chartdiv_infectorbyage_"+this.city, am4charts.XYChart);
  this.chart.colors.step = 2;
  //this.chart.responsive.enabled = true;
  this.chart.legend = new am4charts.Legend()
  this.chart.legend.position = 'right';
  this.chart.legend.scrollable = true;
  this.chart.legend.showTooltipOn = 'always';
  this.chart.legend.paddingBottom = 20;
  this.chart.legend.labels.template.maxWidth = 95;

  let xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
  xAxis.dataFields.category = 'key';
  xAxis.title.text = "Age range";
  xAxis.renderer.cellStartLocation = 0.1;
  xAxis.renderer.cellEndLocation = 0.9;
  xAxis.renderer.grid.template.location = 0;
  this.xAxis = xAxis;
  let yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
  yAxis.min = 0;
  yAxis.max = 200;

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

  this.createSeries(infectedCount, 'Default');

}

arrangeColumns() : any{
  let series = this.chart.series.getIndex(0);
  let w = 1 - this.xAxis.renderer.cellStartLocation - (1 - this.xAxis.renderer.cellEndLocation);
  if (series.dataItems.length > 1) {
      let x0 = this.xAxis.getX(series.dataItems.getIndex(0), "categoryX");
      let x1 = this.xAxis.getX(series.dataItems.getIndex(1), "categoryX");
      let delta = ((x1 - x0) / this.chart.series.length) * w;
      if (am4core.isNumber(delta)) {
          let middle = this.chart.series.length / 2;

          let newIndex = 0;
          this.chart.series.each(function(series) {
              if (!series.isHidden && !series.isHiding) {
                  series.dummyData = newIndex;
                  newIndex++;
              }
              else {
                  series.dummyData = this.chart.series.indexOf(series);
              }
          }.bind(this))
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          this.chart.series.each(function(series) {
              let trueIndex = this.chart.series.indexOf(series);
              let newIndex = series.dummyData;

              let dx = (newIndex - trueIndex + middle - newMiddle) * delta

              series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
              series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          }.bind(this))
      }
  }
}
 
}
