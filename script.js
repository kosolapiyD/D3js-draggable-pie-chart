const dimensions = { height: 400, width: 400, radius: 150 };
const center = { x: dimensions.width / 2, y: dimensions.height / 2 };

// build the content box
const contentBox = document.querySelector('.content-box');
let content = '';

draggableElements.forEach((element) => {
  content += `
  <div class="box-item" style="background:${element.color}">
    <h2 class="box-title">${element.id}</h2>
    <h2 id="box-value-${element.id}" class="box-value">${element.percentage}</h2>
  </div>
  `;
});

contentBox.innerHTML += content;
// get all the value boxes
const allValueBoxes = document.querySelectorAll('.box-value');

// ===================== PIE CHART ===================== //
const pieSvg = d3
  .select('.chart-box')
  .append('svg')
  .attrs({ id: 'pie-svg', width: dimensions.width, height: dimensions.height });

// create a group for the pie chart
const graph = pieSvg
  .append('g')
  .attr('transform', `translate(${center.x}, ${center.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.percentage);

const arcPath = d3
  .arc()
  .outerRadius(dimensions.radius)
  .innerRadius(dimensions.radius / 2);

// join the pie data to path elements
const paths = graph.selectAll('path').data(pie(draggableElements));
paths.attr('d', arcPath);

const redrawPie = (data) => {
  // join the pie data to path elements
  const paths = graph.selectAll('path').data(pie(data));
  paths.attr('d', arcPath);
};

// event handlers
const handleMouseOver = (e) => {
  // d3.select(e.srcElement)
  //   .transition('changeSliceFill') // name of the transition, for not to interfere with other transitions
  //   .duration(300)
  //   .attr('fill', '#e6e6e6');
};

paths
  .enter()
  .append('path')
  .attr('class', 'arc')
  .attr('d', arcPath)
  .attr('stroke', '#fff')
  .attr('stroke-width', 3)
  .attr('fill', (d) => d.data.color)
  .on('mouseover', handleMouseOver);

function drag(event, d) {
  // calculate the new position of the draggable element based on the mouse coordinates
  const newX = event.x - center.x;
  const newY = event.y - center.y;
  let angle = Math.atan2(newY, newX);

  const x = center.x + dimensions.radius * Math.cos(angle);
  const y = center.y + dimensions.radius * Math.sin(angle);
  // calculate the percentage, starting from the top, from 0% to 100%
  let percentage = (100 * +(angle + Math.PI / 2)) / (2 * Math.PI);
  // normalize the negative percentage values
  if (percentage < 0) {
    percentage += 100;
  }
  // let draggedPercent = +percentage.toFixed(2);
  // console.log('draggedPercent', draggedPercent);

  // allow the draggable element to be dragged only in the allowed area
  draggableElements.forEach((circle, idx) => {
    if (circle.id === d.id) {
      // ?=================== FIRST ONLY DRAGGABLE CIRCLE =====================//
      if (idx === 0) {
        // define draggable element range (from and to)
        if (
          (percentage >= circle.from && percentage <= 100) ||
          (percentage >= 0 && percentage <= circle.to)
        ) {
          // update the position of the draggable circle
          d3.select(this).attr('cx', x).attr('cy', y);
          const difference = percentage - circle.percentagePoint;

          const updatedPercentage = +(circle.initialValue + difference);
          circle.percentage = updatedPercentage;

          const updatedNextPercentage = +(
            (difference - draggableElements[idx + 1].initialValue) *
            -1
          );
          draggableElements[idx + 1].percentage = updatedNextPercentage;
          // update the value boxes
          allValueBoxes[idx].innerHTML = updatedPercentage.toFixed();
          allValueBoxes[idx + 1].innerHTML = updatedNextPercentage.toFixed();
          redrawPie(draggableElements);
        }
      }
      // ?=================== LAST ONLY DRAGGABLE CIRCLE ======================//
      else if (idx === draggableElements.length - 1) {
        // define draggable element range (from and to)
        if (draggedPercent >= circle.from || draggedPercent <= circle.to) {
          // update the position of the draggable circle
          d3.select(this).attr('cx', x).attr('cy', y);
        }
      }
      // ?=================== REST OF THE DRAGGABLE CIRCLES ===================//
      else {
        // define draggable element range (from and to)
        if (draggedPercent >= circle.from && draggedPercent <= circle.to) {
          // update the position of the draggable circle
          d3.select(this).attr('cx', x).attr('cy', y);
        }
      }
    }
  });
}

const dragEnd = (event, d) => {
  console.log('draggableElements', draggableElements);
};

// start appending the draggable circles
let startAngle = 100 / Math.PI - 89.95;
const smallCircles = pieSvg //outerCircleSvg
  .selectAll('.draggableElement')
  .data(draggableElements)
  .enter()
  .append('circle')
  .attrs({
    id: (d) => d.id,
    percentage: (d) => d.percentage,
    class: 'draggableElement',
    r: 8,
  })
  .attrs((d) => {
    startAngle += (d.percentage / 100) * 2 * Math.PI;
    return {
      cx: center.x + dimensions.radius * Math.cos(startAngle),
      cy: center.y + dimensions.radius * Math.sin(startAngle),
    };
  })

  .call(d3.drag().on('drag', drag).on('end', dragEnd));
