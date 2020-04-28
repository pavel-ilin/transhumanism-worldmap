import React, { useRef, useEffect, useState } from 'react';
import '../App.css';
import { event, select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import geoData from "../Utils/countries.geo.json";
import usaGeo from "../Utils/USA.geo.json";

const GeoMap = () => {
        // const countries = []
        // const dataArray = []
    
        // countries.map(country => {
        //     let findCountry = geoData.features.find(jsonCont => jsonCont.properties.name === country.country)
    
        //     if (findCountry) {
        //       findCountry.confirmed = country.confirmed
        //       dataArray.push(findCountry)
        //     }
        // })
      for(let i = 0; geoData.features.length > i; i++){
        if (geoData.features[i].properties.brk_name === 'United States'){
           geoData.features.splice(i-1, i);
        }
      }

      usaGeo.features.map(element => {
        element.properties.gdp_md_est = 0
      })      
  
      let newGeoJSON = { 
          "type" : "FeatureCollection",
          "features": [... geoData.features, ... usaGeo.features]
      }

        const svgRef = useRef()
        const [clickedCountry, setClickedCountry] = useState(null)
        
        let div = select("body")
          .append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);
        
        const mouseOver = (data) => {
          div.transition()
          .duration(200)
          .style("opacity", .9)
          div.html(`${data.properties.brk_name}: <br/> ${data.properties.gdp_md_est}` )
            .style("left", (event.pageX) + "px")     
            .style("top", (event.pageY - 18) + "px"); 
        }

        const mouseOut = () => {
          div.transition()        
           .duration(500)      
           .style("opacity", 0);   
         }

        useEffect(() => {
          const svg = select(svgRef.current)
    
          const minProp = min(geoData.features, feature => feature.properties.gdp_md_est);
          const maxProp = max(geoData.features, feature => feature.properties.gdp_md_est);
    
          const colorScale = scaleLinear()
            .domain([minProp, maxProp])
            .range(["#ccc", "red"]);
    
          const width = 900
          const height = 800

          const projection = geoMercator()
            .fitSize([width, height], clickedCountry || newGeoJSON)
            .precision(100);
    
          const pathGenerator = geoPath().projection(projection)
    
          svg.selectAll('.country')
            .data(newGeoJSON.features)
            .join('path')
            .attr('class', 'country')
            .attr("fill", feature => colorScale(feature.properties.gdp_md_est))
            .attr('d', feature => pathGenerator(feature))
            .on('mouseover', feature => { mouseOver(feature) })
            .on('mouseout', feature => { mouseOut(feature) })
            .on("click", feature => 
            {setClickedCountry(clickedCountry === feature ? null : feature)})
        }, [clickedCountry, mouseOver, mouseOut])

        
          return (
                  <svg style={{ width: '1000px', height: '800px' }} ref={svgRef}/>
      )
    }

export default GeoMap;