//Challenge # 14 . Belly Button Biodiversity
//Option menu for the displays in the site
function optionChanged(id) {
    d3.json(url).then(data =>  {  
        barGraph(id, data);
        bubble(id, data);
        demographics(id, data); 
        gauge(id, data);
    });
}


//1. Use the D3 library to read in samples.json from the URL
const url ="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data for the first display 
function init() {
    d3.json(url).then(data =>  {   
        let subjectIds = data.names;
        let dropdown = d3.select("#selDataset");
        subjectIds.forEach(id => {
            dropdown.append("option").attr("value", id).text(id);            
        });

        let firstSubjectId = subjectIds[0];
        optionChanged(firstSubjectId);
    });
}
init();


//2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function barGraph(id, data) {
    let fauna= data.samples;
    let subjectFauna = fauna.filter(row => row.id == id)[0];
    console.log(subjectFauna);
    
    xArray = [];
    yArray = [];
    hoverLabels = [];
    for (element = 0; element < 10; element++) {
        xArray.push(subjectFauna.sample_values[element]);
        yArray.push('OTU ' + subjectFauna.otu_ids[element]);
        hoverLabels.push(subjectFauna.otu_labels[element]);      
    }
// Insert the graph
    let trace1 = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation:"h",
        text:hoverLabels    
    }];                 
    let layout = {
        title: { 
            display: true,
            text: "10 most common bacteria in the Subject (OTU)",
            size: 9
        },
        autosize: true,
        xaxis: {autorange: true},
        yaxis: {autorange: true} 
    };
  
   Plotly.newPlot("bar",  trace1, layout);
};


//3. Create a bubble chart that displays each sample.
function bubble(id, data) {
    let fauna = data.samples;
    let subjectFauna = fauna.filter(row => row.id == id)[0];
    console.log(subjectFauna);
    
    xArray = [];
    yArray = [];
    hoverLabels = [];

    let sampleLength = d3.selectAll(subjectFauna.otu_ids).size();
    console.log(sampleLength)
    for (el = 0; el < 80 ; el++) {
        xArray.push(subjectFauna.otu_ids[el]);
        yArray.push(subjectFauna.sample_values[el]);
        hoverLabels.push(subjectFauna.otu_labels[el]);
    }
// Insert the graph
    let name = `Subject ${id} : OTUs population`; 
    
    let trace2 = [{
        x: xArray,
        y: yArray,
        type: "scatter",
        mode: 'markers',
        marker: {
            color: xArray,
            size: yArray
        },
        text: hoverLabels  
    }];                 
    
    let layout = {
        title: { 
            display: true,
            text: name,
            size: 9
        },
        xaxis: {autorange: true},
        yaxis: {autorange: true},
        margin: {b: 30, l: 20, r: 20, t: 30}
    };
 
   Plotly.newPlot("bubble",  trace2, layout);
}


//4. Display the sample metadata, i.e., an individual's demographic information.
//Populate the panel with demographics 
function demographics(id, data) {
    let metadata = data.metadata;
    let subjectMetadata = metadata.filter(row => row.id == id)[0];
    //console.log(subjectMetadata)
    let panel = d3.select("#sample-metadata");
    panel.html("")
    let list =panel.append("ul");
    Object.entries(subjectMetadata).forEach(([key,value]) => { 
        panel.append("h5").text(key + ": " + value);
        });       
};


//5. gauge --optional 
function gauge(id, data) {
    let freq = data.metadata;
    let subjectFreq = freq.filter(row => row.id == id)[0][6];
    //let frequency = d3.selectAll(subjectFreq).value();
   //console.log(frequency)
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: 3,
            title: { text: "Frequeny" },
            type: "indicator",
            mode: "gauge+number",
            steps: [
                {range: [0,1], label: '0-1', color: "lightblue"},
                {range: [1,2], text: '1-2', color: "blue"},
                {range: [2,3], text: '2-3', color: 2},
                {range: [2,4], text: '3-4', color: 3},
                {range: [4,5], text: '4-5', color: 4},
                {range: [5,6], text: '5-6', color: 5},
                {range: [6,7], text: '6-7', color: 6},
                {range: [7,8], text: '7-8', color: 7}],

        }
    ];
   
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", data, layout);
};