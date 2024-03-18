import { type Component, onMount, createMemo } from 'solid-js';
import { Chart, Title, Tooltip, Colors, ChartOptions } from 'chart.js';
import { Line } from 'solid-chartjs';
import { formatISO9075 } from 'date-fns';

interface ILineChartProps {
  data: Array<{ x: Date; y: number }>;
}

export const LineChart: Component<ILineChartProps> = props => {
  onMount(() => {
    Chart.register(Title, Tooltip, Colors);
  });

  const chartData = createMemo(() => ({
    labels: props.data
      .map(({ x }) => formatISO9075(x, { representation: 'date' }))
      .toReversed(),
    datasets: [
      {
        data: props.data.map(({ y }) => y).toReversed(),
      },
    ],
  }));

  console.log(chartData());

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Line
        data={chartData()}
        options={chartOptions}
        width={500}
        height={500}
      />
    </div>
  );
};
