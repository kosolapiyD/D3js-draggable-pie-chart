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
  .startAngle((d) => d[d.length - 1].startAngle * Math.PI)
  .endAngle((d) => d[d.length - 1].endAngle * Math.PI)
  .sort(null)
  .value((d) => d.percentage);

const arcPath = d3
  .arc()
  .outerRadius(dimensions.radius)
  .innerRadius(dimensions.radius / 4);

// join the pie data to path elements
const paths = graph.selectAll('path').data(pie(draggableElements));
paths.attr('d', arcPath);

const redrawPie = (data) => {
  const paths = graph.selectAll('path').data(pie(data));
  paths.attr('d', arcPath);
};

paths
  .enter()
  .append('path')
  .attr('class', 'arc')
  .attr('d', arcPath)
  .attr('stroke', '#fff')
  .attr('stroke-width', 3)
  .attr('fill', (d) => d.data.color);

firstRun = true;

function drag(event, d) {
  // calculate the new position of the draggable element based on the mouse coordinates
  const newX = event.x - center.x;
  const newY = event.y - center.y;
  let angle = Math.atan2(newY, newX);

  const x = center.x + dimensions.radius * Math.cos(angle);
  const y = center.y + dimensions.radius * Math.sin(angle);

  // calculate the percentage, starting from the top, from 0% to 100%
  ascendingGlobalPercentage = (99.99 * +(angle + Math.PI / 2)) / (2 * Math.PI);

  // normalize the negative percentage values
  if (ascendingGlobalPercentage <= 0) {
    ascendingGlobalPercentage += 99.99;
  }

  // temporary difference from the current point (0 => 99.99, or 99.99 => 0)
  let tempDiff = ascendingGlobalPercentage - d.percentagePoint;
  if (tempDiff <= 0) {
    tempDiff += 99.99;
  }

  // console.log('tempDiff', tempDiff);

  // the actual difference calculation from the current point (0 => 99.99, or 0 => -99.99)
  let difference;
  if (d.from < d.to) {
    const rangeToNextElement = d.to - d.percentagePoint;
    const rangeToPreviousElement = d.percentagePoint - d.from;

    // get the biggest range
    const range = Math.max(rangeToNextElement, rangeToPreviousElement);
    let newRange = d.initialValue >= 50 ? 100 - range : range;

    if (tempDiff <= newRange) {
      difference = tempDiff;
    } else {
      difference = tempDiff - 100;
    }
  }

  if (d.from > d.to) {
    const rangeToNextElement =
      d.percentagePoint > d.from
        ? 100 - d.percentagePoint + d.to
        : d.to - d.percentagePoint;
    const rangeToPreviousElement =
      d.percentagePoint > d.from
        ? d.percentagePoint - d.from
        : 100 - d.from + d.percentagePoint;

    // get the biggest range
    const range = Math.max(rangeToNextElement, rangeToPreviousElement);
    let newRange = d.initialValue >= 50 ? 100 - range : range;

    if (tempDiff >= newRange) {
      difference = tempDiff - 100;
    } else {
      difference = tempDiff;
    }
  }

  // console.log('difference', difference);

  const isWithinTheRangeToOne = () => {
    // allow the draggable circle to be dragged within the from - to range
    if (d.from > d.to) {
      if (
        ascendingGlobalPercentage >= d.from + 1 &&
        ascendingGlobalPercentage <= 99
      ) {
        // update the position of the draggable circle
        d3.select(this).attr('cx', x).attr('cy', y);
        return true;
      }
      if (
        ascendingGlobalPercentage >= 1 &&
        ascendingGlobalPercentage <= d.to - 1
      ) {
        // update the position of the draggable circle
        d3.select(this).attr('cx', x).attr('cy', y);
        return true;
      }
    } else {
      if (
        ascendingGlobalPercentage >= d.from + 1 &&
        ascendingGlobalPercentage <= d.to - 1
      ) {
        d3.select(this).attr('cx', x).attr('cy', y);
        return true;
      }
    }
  };

  const isWithinTheRangeToZero = () => {
    // allow the draggable circle to be dragged within the from - to range
    if (d.from > d.to) {
      if (
        ascendingGlobalPercentage >= d.from &&
        ascendingGlobalPercentage <= 100
      ) {
        // update the position of the draggable circle
        d3.select(this).attr('cx', x).attr('cy', y);
        return true;
      }
      if (ascendingGlobalPercentage >= 0 && ascendingGlobalPercentage <= d.to) {
        // update the position of the draggable circle
        d3.select(this).attr('cx', x).attr('cy', y);
        return true;
      }
    } else {
      if (
        ascendingGlobalPercentage >= d.from &&
        ascendingGlobalPercentage <= d.to
      ) {
        d3.select(this).attr('cx', x).attr('cy', y);
        return true;
      }
    }
  };

  // allow the draggable element to be dragged only in the allowed area
  draggableElements.forEach((circle, idx) => {
    if (circle.id === d.id) {
      // *=================== FIRST ONLY DRAGGABLE CIRCLE =====================//
      if (idx === 0) {
        if (isWithinTheRangeToOne()) {
          const updatedPercentage = circle.initialValue + difference;
          circle.percentage = updatedPercentage;
          const updatedNextPercentage =
            draggableElements[1].initialValue - difference;
          draggableElements[1].percentage = updatedNextPercentage;
          allValueBoxes[idx].innerHTML = updatedPercentage.toFixed();
          allValueBoxes[1].innerHTML = updatedNextPercentage.toFixed();
          // update the percentage stopping point
          circle.percentageStopPoint = ascendingGlobalPercentage;
          redrawPie(draggableElements);
        }
      }
      // *=================== LAST ONLY DRAGGABLE CIRCLE ======================//
      else if (idx === draggableElements.length - 1) {
        if (isWithinTheRangeToOne()) {
          const updatedPercentage = circle.initialValue + difference;
          circle.percentage = updatedPercentage;
          const updatedNextPercentage =
            draggableElements[0].initialValue - difference;
          draggableElements[0].percentage = updatedNextPercentage;
          // update the value boxes
          allValueBoxes[idx].innerHTML = updatedPercentage.toFixed();
          allValueBoxes[0].innerHTML = updatedNextPercentage.toFixed();
          // pie starting angle is always 0 by default (12 o'clock position),
          // so in this case we need to calculate the new angle
          const newAngle = tempDiff / 50;
          const reNewAngle = d.startAngle + newAngle;
          circle.startAngle = firstRun ? newAngle : reNewAngle;
          circle.endAngle = firstRun ? newAngle + 2 : reNewAngle + 2;
          // update the percentage stopping point
          circle.percentageStopPoint = ascendingGlobalPercentage;
          redrawPie(draggableElements);
        }
      }
      // *=================== REST OF THE DRAGGABLE CIRCLES ===================//
      else {
        if (isWithinTheRangeToOne()) {
          const updatedPercentage = circle.initialValue + difference;
          circle.percentage = updatedPercentage;
          const updatedNextPercentage =
            draggableElements[idx + 1].initialValue - difference;
          draggableElements[idx + 1].percentage = updatedNextPercentage;
          // update the value boxes
          allValueBoxes[idx].innerHTML = updatedPercentage.toFixed();
          allValueBoxes[idx + 1].innerHTML = updatedNextPercentage.toFixed();
          // update the percentage stopping point
          circle.percentageStopPoint = ascendingGlobalPercentage;
          redrawPie(draggableElements);
        }
      }
    }
  });
}

function dragEnd(event, d) {
  firstRun = false;
  const draggedIdx = draggableElements.findIndex(
    (circle) => circle.id === d.id
  );

  // d.percentagePoint = ascendingGlobalPercentage;
  // d.initialValue = +ascendingGlobalPercentage.toFixed(2);

  draggableElements.forEach((circle, idx) => {
    if (circle.id === d.id) {
      // *=================== FIRST ONLY DRAGGED CIRCLE =====================//
      if (idx === 0) {
        circle.percentagePoint = circle.percentageStopPoint;
        circle.initialValue = +circle.percentage.toFixed(2);
        // update next circle data
        draggableElements[1].initialValue =
          +draggableElements[1].percentage.toFixed(2);
      }
      // *=================== LAST ONLY DRAGGED CIRCLE ======================//
      else if (idx === draggableElements.length - 1) {
        circle.percentagePoint = circle.percentageStopPoint;
        circle.initialValue = +circle.percentage.toFixed(2);
        // update next circle data
        draggableElements[0].initialValue =
          +draggableElements[0].percentage.toFixed(2);
      }
      // *=================== REST OF THE DRAGGED CIRCLES ===================//
      else {
        // console.log('dragEnd rest circle =======>', d.id);
        circle.percentagePoint = circle.percentageStopPoint;
        circle.initialValue = +circle.percentage.toFixed(2);
        // update next circle data
        draggableElements[draggedIdx + 1].initialValue =
          +draggableElements[draggedIdx + 1].percentage.toFixed(2);
      }
    }
  });

  const newDraggableElements = calcFromTo(draggableElements);
  console.log('onDragEnd newDraggableElements', newDraggableElements);
  redrawPie(newDraggableElements);
  drawCircles(newDraggableElements);
}

const drawCircles = (data) => {
  // start appending the draggable circles from the top
  let startAngle = 100 / Math.PI - 89.95;
  const smallCircles = pieSvg
    .selectAll('.draggable-element')
    .data(data)
    .enter()
    .append('circle')
    .attrs({
      id: (d) => d.id,
      percentage: (d) => d.percentage,
      class: 'draggable-element',
      r: 10,
    })
    .attrs((d) => {
      startAngle += (d.percentage / 100) * 2 * Math.PI;
      return {
        cx: center.x + dimensions.radius * Math.cos(startAngle),
        cy: center.y + dimensions.radius * Math.sin(startAngle),
      };
    })
    .call(d3.drag(data).on('drag', drag).on('end', dragEnd));

  return smallCircles;
};
drawCircles(draggableElements);
