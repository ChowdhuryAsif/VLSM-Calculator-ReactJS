export const downloadFile = (lanList) => {
  let headers = Object.keys(lanList[0]);
  let csvData = [];
  csvData.push(headers.join(','));

  for (const row of lanList) {
    const values = headers.map((header) => {
      return `"${row[header]}"`;
    });
    csvData.push(values.join(','));
  }
  download(csvData.join('\n'));
};

const download = (data) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'Subnet_Allocation_Result.csv');
  document.body.append(a);
  a.click();
  document.body.removeChild(a);
};
