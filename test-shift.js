const parseTime = (timeStr) => {
    let h = NaN;
    let m = NaN;
    if (timeStr.includes("T")) {
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        return [d.getHours(), d.getMinutes()];
      }
    }
    const match = timeStr.match(/(\d+):(\d+)/);
    if (match) {
      h = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
    }
    return [h, m];
  };

console.log(parseTime("11:40:00+03"));
console.log(parseTime("14:00:00+03"));
console.log(parseTime("1970-01-01T11:40:00Z"));
