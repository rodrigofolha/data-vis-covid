import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  @Input() groupFilters: Object;
  @Input() city: string;
  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  constructor(private container: ElementRef) { }

  ngOnInit(): void {
  this.createSvg();
  d3.dsv(';',"/assets/covid-"+this.city+"1111.csv").then(data => this.drawBars(data));
  }
  ngOnChanges(): void {
    console.log(this.groupFilters);
    console.log(this.city);
    let home = 1;
    let school = 1;
    let work = 1;
    let transport = 1;
    if (this.groupFilters && this.groupFilters['contactsAtHome'])
      home = this.groupFilters['contactsAtHome'];
    if (this.groupFilters && this.groupFilters['contactsAtSchool'])
      school = this.groupFilters['contactsAtSchool'];
    if (this.groupFilters && this.groupFilters['contactsAtWork'])
      work = this.groupFilters['contactsAtWork'];
    if (this.groupFilters && this.groupFilters['contactsAtTransport'])
      transport = this.groupFilters['contactsAtTransport'];
    
  console.log(this.city);
    d3.dsv(';',"/assets/covid-"+this.city+home+school+work+transport+".csv").then(data => this.updateBars(data));
  }

private createSvg(): void {
    this.svg = d3.select(this.container.nativeElement)
    .select("figure")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    this.svg = d3.select(this.container.nativeElement).select("figure").select("svg").select("g");
}

private drawBars(data: any[]): void {
    var event_selector = 'infected';
    if (this.groupFilters && this.groupFilters['typeOfEvent']){
      if (this.groupFilters['typeOfEvent'] === 'infected' ||  
      this.groupFilters['typeOfEvent'] === 'cured' || 
      this.groupFilters['typeOfEvent'] === 'dead')
        event_selector = this.groupFilters['typeOfEvent'];
    }
  
    let infectedCount = d3.nest<unknown, number>().key(d => d['EVENT']).key(d => d['DAY'])
    .rollup(v => v.length)
    .entries(data)
    .filter( d => d.key == event_selector)
    .map(function(d) {
      return d.values;
    })[0];
    // Create the X-axis linear scale
    const xScale = d3.scaleLinear()
    .range([0, this.width])
    .domain([0, d3.max(data, d => parseInt(d['DAY']))]);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end");

    // Create the Y-axis linear scale
    const yScale = d3.scaleLinear()
    .domain([0, infectedCount.reduce((a,b)=>a.value > b.value?a:b).value])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .attr("class", "yAxis")
    .call(d3.axisLeft(yScale));

    // Add X axis label:
    this.svg
    .append("g")
    .attr("class", "xLabel")
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", this.width)
    .attr("y", this.height + this.margin-20)
    .text("Days");

    // Y axis label:
    this.svg
    .append("g")
    .attr("class", "yLabel")
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", yScale(2.75*this.margin))
    .attr("x", xScale(0))
    .text("People Infected");

    // Create and fill the bars
    var rect = this.svg.selectAll("rect_uni")
    .data(infectedCount);

    rect.enter()
    .append("rect")
    .attr("x", d => xScale(d.key))
    .attr("y", d => yScale(d.value))
    .attr("width", 2)
    .attr("height", (d) => this.height - yScale(d.value))
    .attr("fill", d => {if (d.key%7==0 || d.key%7==6) return "#fbba72"; else return "#ca5310";})
    .append("title")
    .text(d => 'Day: '+d.key+'\nQuantity: '+ d.value);
    
}

private updateBars(data: any[]): void {
    var event_selector = 'infected';
    if (this.groupFilters && this.groupFilters['typeOfEvent']){
      if (this.groupFilters['typeOfEvent'] === 'infected' ||  
      this.groupFilters['typeOfEvent'] === 'cured' || 
      this.groupFilters['typeOfEvent'] === 'dead')
        event_selector = this.groupFilters['typeOfEvent'];
    }

    let infectedCount = d3.nest<unknown, number>().key(d => d['EVENT']).key(d => d['DAY'])
    .rollup(v => v.length)
    .entries(data)
    .filter( d => d.key == event_selector)
    .map(function(d) {
      return d.values;
    })[0];
    // Create the X-axis linear scale
    const xScale = d3.scaleLinear()
    .range([0, this.width])
    .domain([0, d3.max(data, d => parseInt(d['DAY']))]);

    // Draw the X-axis on the DOM
    this.svg.select(".xAxis")
    .transition()
    .duration(750)
    .attr('transform', 'translate(0,' + this.height + ')')
		.attr('class', 'xAxis')
    .call(d3.axisBottom(xScale));
    console.log(infectedCount.reduce((a,b)=>a.value > b.value?a:b).value);
    // Create the Y-axis linear scale
    const yScale = d3.scaleLinear()
    .domain([0, infectedCount.reduce((a,b)=>a.value > b.value?a:b).value])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.select(".yAxis")
    .transition()
    .duration(750)
    .call(d3.axisLeft(yScale));


    // Select bars
    var rect = this.svg.selectAll("rect")
    .data(infectedCount)


    // Remove unused bars
    rect
    .exit()
    .remove();



    // Update bars
    rect
    .transition()
    .duration(100)
    .attr("x", d => xScale(d.key))
    .attr("y", d => yScale(d.value))
    .attr("width", 2)
    .attr("height", (d) => this.height - yScale(d.value))
    .attr("fill", d => {if (d.key%7==0 || d.key%7==6) return "#fbba72"; else return "#ca5310";});



    // Create new bars
    rect.enter().append("rect")
    .attr("x", d => xScale(d.key))
    .attr("y", d => yScale(d.value))
    .attr("width", 2)
    .attr("height", (d) => this.height - yScale(d.value))
    .attr("fill", d => {if (d.key%7==0 || d.key%7==6) return "#fbba72"; else return "#ca5310";});

    rect.append("title")
    .text(d => 'Day: '+d.key+'\nQuantity: '+ d.value);
    

}
}
