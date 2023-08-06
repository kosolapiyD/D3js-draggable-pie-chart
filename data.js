// const initialData = [
//   { name: 'bills', cost: 10 },
//   { name: 'food', cost: 20 },
//   { name: 'car', cost: 30 },
//   { name: 'rent', cost: 40 },
// ];

const initialData = [
  { name: 'bills', cost: 10 },
  { name: 'food', cost: 20 },
  { name: 'car', cost: 30 },
  { name: 'rent', cost: 25 },
  { name: 'drink', cost: 15 },
];

const lightColorsArray = [
  '#b2e061',
  '#ffee65',
  '#8bd3c7',
  '#fd7f6f',
  '#bd7ebe',
  '#ffb55a',
  '#fdcce5',
  '#beb9db',
];

// return new array based on the initialData array, with proper data for the drag function
const tempDragArray = initialData.map((element, idx, arr) => {
  if (idx === 0) {
    return {
      idx: idx,
      id: element.name,
      percentage: element.cost,
      color: lightColorsArray[idx],
      initialValue: element.cost,
      previousElementValue: arr[arr.length - 1].cost,
      nextElementValue: arr[idx + 1].cost,
      percentagePoint: element.cost,
      percentageStopPoint: 0,
      // startAngle: 0,
      // endAngle: 2,
    };
  } else {
    return {
      idx: idx,
      id: element.name,
      percentage: element.cost,
      color: lightColorsArray[idx],
      initialValue: element.cost,
      previousElementValue: arr[idx - 1].cost,
      nextElementValue:
        idx === arr.length - 1 ? arr[0].cost : arr[idx + 1].cost,
      // calculate the percentagePoint by adding on each iteration all the previous costs
      percentagePoint: arr
        .slice(0, idx + 1)
        .reduce((acc, curr) => acc + curr.cost, 0),
      percentageStopPoint: 0,
      startAngle: idx === arr.length - 1 && 0,
      endAngle: idx === arr.length - 1 && 2,
    };
  }
});

// return new array based on the tempDragArray array, with the from and to properties added
const calcFromTo = (arr) => {
  const fromToArr = arr.map((element, idx, arr) => {
    if (idx === 0) {
      return {
        ...element,
        from: +arr[arr.length - 1].percentagePoint.toFixed(2),
        to: +arr[idx + 1].percentagePoint.toFixed(2),
      };
    } else if (idx === arr.length - 1) {
      return {
        ...element,
        from: +arr[idx - 1].percentagePoint.toFixed(2),
        to: +arr[0].percentagePoint.toFixed(),
      };
    } else {
      return {
        ...element,
        from: +arr[idx - 1].percentagePoint.toFixed(2),
        to: +arr[idx + 1].percentagePoint.toFixed(2),
      };
    }
  });
  return fromToArr;
};

const draggableElements = calcFromTo(tempDragArray);

console.log('draggableElements', draggableElements);
