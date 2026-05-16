let allData = [];

let statusChart;
let rejectChart;
let qcChart;


/* LOAD CSV */
fetch("data.csv")
.then(res => res.text())

.then(data => {

  const rows = data.trim().split("\n").slice(1);

  rows.forEach(row => {

    const cols = row.split(",");

    const clean = (v) => v ? v.trim() : "";

   allData.push({

  job: clean(cols[0]),

  date: clean(cols[1]),

  qc: clean(cols[2]),

  status: clean(cols[3]),

  by: clean(cols[4]),

  category: clean(cols[5]),

  month: clean(cols[6]),

  year: clean(cols[7])

});

  });

  applyFilters();

});


/* FILTERS */
function applyFilters() {

  let qc = document.getElementById("qcFilter").value;

  let packing = document.getElementById("packingFilter").value;

  let year = document.getElementById("yearFilter").value;

  let month = document.getElementById("monthFilter").value;

  let search = document.getElementById("searchBox").value.toLowerCase();


  let filtered = allData;


  // QC FILTER
  if (qc !== "") {
    filtered = filtered.filter(x => x.qc === qc);
  }


  // PACKING FILTER
  if (packing !== "") {
    filtered = filtered.filter(x => x.by === packing);
  }


  // YEAR FILTER
  if (year !== "") {
    filtered = filtered.filter(x => x.year === year);
  }


  // MONTH FILTER
  if (month !== "") {
    filtered = filtered.filter(x => x.month === month);
  }


  // SEARCH
  if (search) {

    filtered = filtered.filter(x =>
      x.job.toLowerCase().includes(search)
    );

  }


  renderTable(filtered);

  updateCards(filtered);

  createStatusChart(filtered);

  createRejectChart(filtered);

  createQCChart(filtered);
}



/* TABLE */
function renderTable(data) {

  const tbody = document.querySelector("tbody");

  tbody.innerHTML = "";

  data.slice(0, 10).forEach(r => {

    tbody.innerHTML += `

      <tr>

        <td>${r.job}</td>

        <td>${r.date}</td>

        <td class="${r.status === 'Pass' ? 'pass' : 'reject'}">
          ${r.status}
        </td>

        <td>${r.qc}</td>

        <td>${r.by}</td>

        <td>${r.category}</td>

      </tr>

    `;

  });

}



/* CARDS */
function updateCards(data) {

  let total = data.length;

  let pass = data.filter(x => x.status === "Pass").length;

  let reject = data.filter(x => x.status === "Reject").length;


  document.getElementById("totalCount").innerText = total;

  document.getElementById("passCount").innerText = pass;

  document.getElementById("rejectCount").innerText = reject;

}



/* PASS VS REJECT */
function createStatusChart(data) {

  let pass = data.filter(x => x.status === "Pass").length;

  let reject = data.filter(x => x.status === "Reject").length;


  const ctx = document.getElementById("statusChart");


  if (statusChart) {
    statusChart.destroy();
  }


  statusChart = new Chart(ctx, {

    type: "doughnut",

    data: {

      labels: ["Pass", "Reject"],

      datasets: [{

        data: [pass, reject],

        backgroundColor: [
          "#00d9ff",
          "#ff00ff"
        ]

      }]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false

    }

  });

}



/* REJECT CHART */
function createRejectChart(data) {

  const rejects = data.filter(x => x.status === "Reject");


  const reasons = [...new Set(rejects.map(x => x.category))];


  const counts = reasons.map(reason =>

    rejects.filter(x => x.category === reason).length

  );


  const ctx = document.getElementById("rejectChart");


  if (rejectChart) {
    rejectChart.destroy();
  }


  rejectChart = new Chart(ctx, {

    type: "bar",

    data: {

      labels: reasons,

      datasets: [{

        label: "Reject Count",

        data: counts,

        backgroundColor: "#ff00ff"

      }]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      plugins: {

        legend: {
          display: false
        }

      }

    }

  });

}



/* QC PERFORMANCE */
function createQCChart(data) {

  const qcNames = [
    "Fady",
    "Samir",
    "Hatem",
    "Hossam",
    "A.Lotfy"
  ];


  const totals = qcNames.map(name =>

    data.filter(x => x.qc === name).length

  );


  const ctx = document.getElementById("qcChart");


  if (qcChart) {
    qcChart.destroy();
  }


  qcChart = new Chart(ctx, {

    type: "bar",

    data: {

      labels: qcNames,

      datasets: [{

        label: "Devices",

        data: totals,

        backgroundColor: "#00d9ff"

      }]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false

    }

  });

}
