import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {Sign} from '../const';

import AbstractComponent from "./abstract-component";
const EVENT_COUNTER = 1;

const getUniqueItems = (array) => Array.from(new Set(array));

const getDateByTypes = (types, events) => {
  const dataTypes = [...types].map((type) => {
    return {
      name: type,
      sum: 0,
      count: 0,
      time: 0,
    };
  });
  events.forEach((event) => {
    const {type: eventType, price, duration} = event;
    const index = dataTypes.findIndex((type) => type.name === eventType);
    dataTypes[index].sum += price;
    dataTypes[index].count += EVENT_COUNTER;
    dataTypes[index].time += +duration.replace(Sign.HOUR, ``);
  });

  return dataTypes;
};


const getMoneyByTypes = (dataItems) => dataItems.map((type) => type.sum);
const getCountByTypes = (dataItems) => dataItems.map((type) => type.count);
const getTimeByTypes = (dataItems) => dataItems.map((type) => type.time);

const renderMoneyChart = (eventsCtx, labels, events) => {
  return new Chart(eventsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: events,
        backgroundColor: `#ffffff`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      scales: {
        xAxes: [{
          display: false,
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
          categoryPercentage: 0.5,
          barPercentage: 0.5,
        }],
      },
      tooltips: {
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 0,
        cornerRadius: 0,
        xPadding: 10,
        yPadding: 10
      },
      animation: {
        duration: 1,
        onComplete() {
          const chartInstance = this.chart;
          const ctx = chartInstance.ctx;
          ctx.textAlign = `right`;
          ctx.fillStyle = `rgba(0, 0, 0, 1)`;
          ctx.textBaseline = `middle`;
          ctx.font = `18px regular`;

          this.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const data = `${Sign.EURO} ${dataset.data[index]}`;
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        },
      },
      title: {
        display: true,
        text: `MONEY`,
        position: `left`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        display: false,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 800,
          fontColor: `#000000`,
          fontSize: 20
        }
      }
    }
  });
};

const renderTransportChart = (eventsCtx, labels, events) => {
  return new Chart(eventsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: events,
        backgroundColor: `#ffffff`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      scales: {
        xAxes: [{
          display: false,
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
          categoryPercentage: 0.5,
          barPercentage: 0.5,
        }],
      },
      tooltips: {
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 0,
        cornerRadius: 0,
        xPadding: 10,
        yPadding: 10
      },
      animation: {
        duration: 1,
        onComplete() {
          const chartInstance = this.chart;
          const ctx = chartInstance.ctx;
          ctx.textAlign = `right`;
          ctx.fillStyle = `rgba(0, 0, 0, 1)`;
          ctx.textBaseline = `middle`;
          ctx.font = `18px regular`;

          this.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const data = `${dataset.data[index]}${Sign.COUNT}`;
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        },
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        position: `left`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        display: false,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 800,
          fontColor: `#000000`,
          fontSize: 20
        }
      }
    }
  });
};

const renderTimeChart = (eventsCtx, labels, events) => {
  return new Chart(eventsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: events,
        backgroundColor: `#ffffff`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      scales: {
        xAxes: [{
          display: false,
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
          categoryPercentage: 0.5,
          barPercentage: 0.5,
        }],
      },
      tooltips: {
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 0,
        cornerRadius: 0,
        xPadding: 10,
        yPadding: 10
      },
      animation: {
        duration: 1,
        onComplete() {
          const chartInstance = this.chart;
          const ctx = chartInstance.ctx;
          ctx.textAlign = `right`;
          ctx.fillStyle = `rgba(0, 0, 0, 1)`;
          ctx.textBaseline = `middle`;
          ctx.font = `18px regular`;

          this.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const data = `${dataset.data[index]}${Sign.HOUR}`;
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        },
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        position: `left`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        display: false,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 800,
          fontColor: `#000000`,
          fontSize: 20
        }
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(events) {
    super();

    this._events = events;
    this._data = null;
    this._labels = null;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();
    this._labels = this._events.getPoints()
      .map((event) => event.type)
      .filter(getUniqueItems);
    this._data = getDateByTypes(this._labels, this._events.getPoints());

    this._moneyChart = renderMoneyChart(moneyCtx, this._labels, getMoneyByTypes(this._data));
    this._transportChart = renderTransportChart(transportCtx, this._labels, getCountByTypes(this._data));
    this._timeChart = renderTimeChart(timeCtx, this._labels, getTimeByTypes(this._data));
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
