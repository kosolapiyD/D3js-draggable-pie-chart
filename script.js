const dimensions = { height: 400, width: 400, radius: 150 };
const center = { x: dimensions.width / 2, y: dimensions.height / 2 };

const initialData = [
  { name: 'bills', cost: 10 },
  { name: 'food', cost: 20 },
  { name: 'car', cost: 30 },
  { name: 'rent', cost: 40 },
];

const lightColorsArray = [
  '#b2e061',
  '#ffee65',
  '#beb9db',
  '#fd7f6f',
  '#bd7ebe',
  '#ffb55a',
  '#fdcce5',
  '#8bd3c7',
];

// return new array based on the initialData array, with proper data for the drag function
const tempDragArray = initialData.map((element, idx, arr) => {
  if (idx === 0) {
    return {
      id: element.name,
      percentage: element.cost,
      color: lightColorsArray[idx],
      initialValue: element.cost,
      previousElementValue: arr[arr.length - 1].cost,
      percentagePoint: 0,
    };
  } else {
    return {
      id: element.name,
      percentage: element.cost,
      color: lightColorsArray[idx],
      initialValue: element.cost,
      previousElementValue: arr[idx - 1].cost,
      // calculate the percentagePoint by adding on each iteration all the previous costs
      percentagePoint: arr
        .slice(0, idx)
        .reduce((acc, curr) => acc + curr.cost, 0),
    };
  }
});

// return new array based on the tempDragArray array, with the from and to properties added
const draggableElements = tempDragArray.map((element, idx, arr) => {
  if (idx === 0) {
    return {
      ...element,
      from: arr[arr.length - 1].percentagePoint,
      to: arr[idx + 1].percentagePoint,
    };
  } else if (idx === arr.length - 1) {
    return {
      ...element,
      from: arr[idx - 1].percentagePoint,
      to: arr[0].percentagePoint,
    };
  } else {
    return {
      ...element,
      from: arr[idx - 1].percentagePoint,
      to: arr[idx + 1].percentagePoint,
    };
  }
});
console.log('draggableElements', draggableElements);

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
