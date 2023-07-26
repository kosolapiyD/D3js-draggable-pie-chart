// const angleData = [
//   { name: 'bills', cost: 10 },
//   { name: 'food', cost: 20 },
//   { name: 'car', cost: 20 },
//   { name: 'rent', cost: 50 },
// ];

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
      startAngle: 0,
      endAngle: 2,
      id: element.name,
      percentage: element.cost,
      color: lightColorsArray[idx],
      initialValue: element.cost,
      previousElementValue: arr[arr.length - 1].cost,
      percentagePoint: 10,
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
        .slice(0, idx + 1)
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
