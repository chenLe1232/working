const format = {
  rate: function (value) {
    const v = parseFloat(value);
    if (isNaN(v) || !v) {
      return '0.00%';
    }
    return `${(v * 100).toFixed(2)}%`;
  },
  numberic: function (v) {
    let med;
    let tmp_value;
    let out_value = parseFloat(v);
    if (isNaN(out_value) || out_value === 0) {
      return '0.00';
    }
    med = 0;
    do {
      med += 2;
      tmp_value = out_value.toFixed(med);
    } while (parseFloat(tmp_value) === 0 && med < 6);
    out_value = tmp_value;
    return out_value.toString().replace(/(\d{1,3})(?=(\d{3})+(?:\.))/g, '$1,');
  },
  integer: function (v) {
    const out_value = parseInt(v);
    if (isNaN(out_value)) {
      return '0';
    }
    return out_value.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
  },
  formatDate24: (date) => (
    new Date(date).toLocaleTimeString('chinese', { hour12: false })
  )
};

export default format;
