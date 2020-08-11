const findMarks = (asstd) => {
  const marks = {};
  const MIR = asstd.MIR;
  if(MIR){
    const rate = 1 / MIR / 5, baseRate = 20;

    for ( let j = 1; j < 7; j++){
      if ( j === 1){
        marks[1] = '1X';
        continue;
      }
      marks[rate * (j - 1)] = `${rate * (j - 1)}X`;
    };
  };
  return {marks, max : 1/ MIR};
};
export default findMarks;