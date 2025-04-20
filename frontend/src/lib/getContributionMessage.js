function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }
  
  export function getContributionMessage(dateStr, contributionCount) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'long' });
    const ordinal = getOrdinalSuffix(day);
    const formattedDate = `${month} ${day}${ordinal}`;
    const pluralSuffix = contributionCount > 1? 's' : '';
    return `${contributionCount} contribution${pluralSuffix} on ${formattedDate}`;
  }
  