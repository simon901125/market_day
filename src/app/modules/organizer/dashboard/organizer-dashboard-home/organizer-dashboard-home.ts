import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Legend,
  LinearScale,
  Plugin,
  ScriptableContext,
  Tooltip,
} from 'chart.js';
import type { ActiveElement, ChartEvent, TooltipItem } from 'chart.js';
import { OrganizerDashboardNotification } from '../organizer-dashboard-notification/organizer-dashboard-notification';
import { DashboardHomeTodoCard } from '../../../shared/dashboard/dashboard-home-todo-card/dashboard-home-todo-card';
import { DashboardNotification } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';
import { TodoItem } from '../../../../models/interface/organizer/OrganizerDashboardHomeTodo';

interface ActivityRegistrationOverview {
  id: number;
  name: string;
  capacity: number;
  registeredCount: number;
  paidCount: number;
  selectedCount: number;
}

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

@Component({
  selector: 'app-organizer-dashboard-home',
  imports: [DashboardHomeTodoCard, DashboardNotification, RouterLink],
  templateUrl: './organizer-dashboard-home.html',
  styleUrl: './organizer-dashboard-home.scss',
})
export class OrganizerDashboardHome extends OrganizerDashboardNotification implements AfterViewInit, OnDestroy {
  @ViewChild('registrationChart') private registrationChartRef?: ElementRef<HTMLCanvasElement>;

  private registrationChart?: Chart<'bar'>;

  constructor(private readonly router: Router) {
    super();
  }

  /** 主辦方後台首頁待辦統計卡片資料。 */
  todoItems: TodoItem[] = [
    {
      icon: 'bi-clipboard-heart',
      count: 12,
      unit: '筆',
      label: '待審核報名',
      path: '/organizer/dash-board/register',
      iconColor: 'orange',
    },
    {
      icon: 'bi-wallet2',
      count: 3,
      unit: '筆',
      label: '退款待處理',
      path: '/organizer/dash-board/collection',
      iconColor: 'red',
    },
    {
      icon: 'bi-shop-window',
      count: 50,
      unit: '位',
      label: '待完成選位',
      path: '/organizer/dash-board/stall',
      iconColor: 'blue',
    },
  ];

  /** 首頁圖表展示資料；串接 API 後由首頁統計端點取代。 */
  readonly activityRegistrationOverview: ActivityRegistrationOverview[] = [
    { id: 1, name: '夏日綠意市集', capacity: 150, registeredCount: 128, paidCount: 118, selectedCount: 106 },
    { id: 2, name: '職人咖啡生活市集', capacity: 120, registeredCount: 120, paidCount: 102, selectedCount: 95 },
    { id: 3, name: '衣著選物週末', capacity: 100, registeredCount: 100, paidCount: 96, selectedCount: 88 },
  ];

  ngAfterViewInit(): void {
    const canvas = this.registrationChartRef?.nativeElement;
    if (!canvas) return;

    this.registrationChart = new Chart(canvas, this.createRegistrationChartConfig());
  }

  ngOnDestroy(): void {
    this.registrationChart?.destroy();
  }

  private createRegistrationChartConfig(): ChartConfiguration<'bar'> {
    const rows = this.activityRegistrationOverview;
    const colors = {
      selected: this.getCssColor('--chart-selected', '#dea064'),
      selectedHover: this.getCssColor('--chart-selected-hover', '#ad5f22'),
      paidPending: this.getCssColor('--chart-paid-pending', '#ecb77a'),
      paidPendingHover: this.getCssColor('--chart-paid-pending-hover', '#cf7f31'),
      unpaid: this.getCssColor('--chart-unpaid', '#f4d09a'),
      unpaidHover: this.getCssColor('--chart-unpaid-hover', '#e9aa55'),
      remaining: this.getCssColor('--chart-remaining', '#f3f0ea'),
      remainingHover: this.getCssColor('--chart-remaining-hover', '#e2d8c8'),
    };
    const stackRadius = (context: ScriptableContext<'bar'>) =>
      this.getStackBorderRadius(context.datasetIndex, context.dataIndex);
    const totalLabelPlugin: Plugin<'bar'> = {
      id: 'activityRegistrationTotalLabel',
      afterDatasetsDraw: (chart: Chart<'bar'>) => {
        const xScale = chart.scales['x'];
        const yScale = chart.scales['y'];
        const context = chart.ctx;

        context.save();
        context.font = '600 11px system-ui, sans-serif';
        context.fillStyle = '#5f5a54';

        rows.forEach((row, index) => {
          const x = xScale.getPixelForValue(row.capacity);
          const y = yScale.getPixelForValue(index);
          context.fillText(`${row.registeredCount} / ${row.capacity}`, x + 8, y + 4);
        });

        context.restore();
      },
    };

    return {
      type: 'bar',
      data: {
        labels: rows.map((row) => row.name),
        datasets: [
          {
            label: '已選位',
            data: rows.map((row) => row.selectedCount),
            backgroundColor: colors.selected,
            hoverBackgroundColor: colors.selectedHover,
            borderRadius: stackRadius,
            borderSkipped: false,
            barPercentage: 0.62,
          },
          {
            label: '已付款未選位',
            data: rows.map((row) => Math.max(row.paidCount - row.selectedCount, 0)),
            backgroundColor: colors.paidPending,
            hoverBackgroundColor: colors.paidPendingHover,
            borderRadius: stackRadius,
            borderSkipped: false,
            barPercentage: 0.62,
          },
          {
            label: '已報名未付款',
            data: rows.map((row) => Math.max(row.registeredCount - row.paidCount, 0)),
            backgroundColor: colors.unpaid,
            hoverBackgroundColor: colors.unpaidHover,
            borderRadius: stackRadius,
            borderSkipped: false,
            barPercentage: 0.62,
          },
          {
            label: '剩餘名額',
            data: rows.map((row) => Math.max(row.capacity - row.registeredCount, 0)),
            backgroundColor: colors.remaining,
            hoverBackgroundColor: colors.remainingHover,
            borderColor: colors.remainingHover,
            borderWidth: 1,
            borderRadius: stackRadius,
            borderSkipped: false,
            barPercentage: 0.62,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        interaction: { mode: 'nearest', axis: 'y', intersect: true },
        onHover: (event: ChartEvent, elements: ActiveElement[]) => {
          const target = event.native?.target as HTMLElement | null;
          if (target) target.style.cursor = elements.length ? 'pointer' : 'default';
        },
        onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
          const selected = elements[0];
          if (!selected) return;
          this.navigateFromChart(selected.datasetIndex, selected.index);
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'start',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 7,
              boxHeight: 7,
              padding: 14,
              color: '#5f5a54',
              font: { size: 11, weight: 600 },
            },
          },
          tooltip: {
            displayColors: true,
            padding: 12,
            callbacks: {
              title: (items: TooltipItem<'bar'>[]) => rows[items[0].dataIndex].name,
              label: (item: TooltipItem<'bar'>) => `${item.dataset.label}：${item.formattedValue} 人`,
              afterBody: (items: TooltipItem<'bar'>[]) => {
                const row = rows[items[0].dataIndex];
                return [
                  `活動名額：${row.capacity} 人`,
                  `報名人數：${row.registeredCount} 人`,
                  `已付款：${row.paidCount} 人`,
                  `已選位：${row.selectedCount} 人`,
                  `尚未付款：${Math.max(row.registeredCount - row.paidCount, 0)} 人`,
                  `尚未選位：${Math.max(row.paidCount - row.selectedCount, 0)} 人`,
                  `剩餘名額：${Math.max(row.capacity - row.registeredCount, 0)} 人`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            suggestedMax: Math.max(...rows.map((row) => row.capacity)) * 1.12,
            grid: { color: '#ece9e4' },
            border: { display: false },
            ticks: { display: false },
          },
          y: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#35312d', font: { size: 14, weight: 700 }, padding: 12 },
          },
        },
      },
      plugins: [totalLabelPlugin],
    };
  }

  private navigateFromChart(datasetIndex: number, activityIndex: number): void {
    const activity = this.activityRegistrationOverview[activityIndex];
    if (!activity) return;

    const destinations = [
      { path: '/organizer/dash-board/stall', queryParams: { activity: activity.name } },
      { path: '/organizer/dash-board/stall', queryParams: { activity: activity.name } },
      { path: '/organizer/dash-board/collection', queryParams: { keyword: activity.name } },
      { path: '/organizer/dash-board/activity', queryParams: { keyword: activity.name } },
    ];
    const destination = destinations[datasetIndex];
    if (destination) void this.router.navigate([destination.path], { queryParams: destination.queryParams });
  }

  private getCssColor(variableName: string, fallback: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() || fallback;
  }

  private getStackBorderRadius(datasetIndex: number, activityIndex: number) {
    const row = this.activityRegistrationOverview[activityIndex];
    const segmentValues = [
      row.selectedCount,
      Math.max(row.paidCount - row.selectedCount, 0),
      Math.max(row.registeredCount - row.paidCount, 0),
      Math.max(row.capacity - row.registeredCount, 0),
    ];
    const visibleIndexes = segmentValues
      .map((value, index) => (value > 0 ? index : -1))
      .filter((index) => index >= 0);
    const firstIndex = visibleIndexes[0];
    const lastIndex = visibleIndexes[visibleIndexes.length - 1];
    const radius = 6;

    return {
      topLeft: datasetIndex === firstIndex ? radius : 0,
      bottomLeft: datasetIndex === firstIndex ? radius : 0,
      topRight: datasetIndex === lastIndex ? radius : 0,
      bottomRight: datasetIndex === lastIndex ? radius : 0,
    };
  }
}
