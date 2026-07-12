import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Dropdown } from '../dropdown/dropdown';
import {
  MarketBoothStatus,
  MarketMapBooth,
  MarketMapData,
  MarketMapMode,
} from '../../../models/interface/shared/MarketMap';

type PublicMapTab = 'detail' | 'directory';
type Point = [number, number];

const boothSize = 32;
const mapPaddingX = 28;
const mapPaddingTop = 10;
const mapPaddingBottom = 0;

const brandNames = [
  '拾甜製菓', '森林選物', '毛孩日常', '花間織所', '植感生活', '小日子手作',
  '慢日陶房', '午後烘焙', '日光咖啡', '山系日常', '微景設計', '木木皮革',
  '好好生活', '暖暖花室', '小島果醬', '日日器物', '白露茶所', '野餐研究室',
  '一隅香氛', '初日烘焙', '漫漫織品', '甜野果實', '小森花藝', '日日木作',
  '島嶼紙品', '清晨麵包', '貓掌小舖', '春光花房', '海風選品', '鹿角木工',
  '森之器', '青鳥插畫', '慢慢選物', '午后茶點', '星丘玻璃', '野花甜點',
  '橘子手感', '日安布作', '甜陶工房', '晴天皮革', '小路陶器', '米粒選物',
  '山丘果醬', '醒埕小物', '末日香氛', '布魯農場', '森之路', '吉玉咖啡',
  '寓式泥作', '森嶼花房',
];

const categories = ['餐飲美食', '文創手作', '寵物生活', '服飾配件', '植物選物'];

const boothCoordinates: Record<string, Point[]> = {
  A: [
    [412, 230], [450, 230], [488, 230], [526, 230], [564, 230], [602, 230], [640, 230],
    [678, 230], [716, 230], [754, 230], [792, 230], [830, 230], [868, 230], [906, 230],
    [412, 270], [450, 270], [488, 270], [526, 270], [564, 270], [602, 270], [640, 270],
    [678, 270], [716, 270], [754, 270], [792, 270], [830, 270], [868, 270], [906, 270],
  ],
  B: [
    [50, 232], [88, 232], [126, 232],
    [50, 272], [88, 272], [126, 272],
    [246, 232], [284, 232], [322, 232],
    [222, 272], [260, 272], [298, 272], [336, 272],
  ],
  C: [
    [368, 316], [368, 354], [368, 392], [368, 430], [368, 468], [368, 506],
    [174, 316],
    [136, 392], [174, 354],
  ],
};

const createPosition = (
  x: number,
  y: number
): Pick<MarketMapBooth, 'x' | 'y' | 'width' | 'height' | 'shape' | 'labelX' | 'labelY'> => ({
  x,
  y,
  width: boothSize,
  height: boothSize,
  shape: 'rect',
  labelX: x + boothSize / 2,
  labelY: y + boothSize / 2 + 4,
});

const createBooths = (): MarketMapBooth[] => {
  const zoneCounts = { A: 28, B: 13, C: 9 };
  const booths: MarketMapBooth[] = [];

  Object.entries(zoneCounts).forEach(([zone, count]) => {
    for (let index = 0; index < count; index += 1) {
      const brandIndex = booths.length;
      const code = `${zone}${String(index + 1).padStart(2, '0')}`;
      const [x, y] = boothCoordinates[zone][index];
      const category = categories[brandIndex % categories.length];
      const name = brandNames[brandIndex % brandNames.length];

      booths.push({
        id: code,
        code,
        zone: `${zone}區`,
        ...createPosition(x, y),
        status: 'occupied',
        size: '3m x 3m x 2.5m',
        brand: {
          id: `brand-${brandIndex + 1}`,
          name,
          category,
          summary: `${name}以${category}為主題，現場規劃互動體驗、限定商品與生活風格展示，邀請參觀者在逛市集的過程中認識品牌理念，也能挑選適合日常使用的作品。`,
          logo: `assets/images/user/brand/brands/brand-0${(brandIndex % 8) + 1}/logo.png`,
          socialLinks: [
            { type: 'facebook', label: name, url: 'https://www.facebook.com/' },
            { type: 'instagram', label: name, url: 'https://www.instagram.com/' },
            { type: 'website', label: '官方網站', url: '/user/brands' },
          ],
        },
      });
    }
  });

  booths.push({
    id: 'service-booth',
    code: '服務處',
    zone: '服務處',
    ...createPosition(0, 232),
    width: 46,
    labelX: 23,
    status: 'occupied',
    size: '服務攤位',
  });

  /*
      zone: '服務處',
      size: '服務攤位',
  */
  return booths;
};

const DEFAULT_MAP: MarketMapData = {
  name: '小集日市集',
  width: 1000,
  height: 580,
  booths: createBooths(),
  facilities: [
    { id: 'service', label: '', icon: 'bi-info-circle', x: 0, y: 104, width: 158, height: 112 },
    { id: 'building-left-tall', label: '', icon: 'bi-building', x: 174, y: 8, width: 180, height: 208 },
    { id: 'building-top-a', label: '', icon: 'bi-building', x: 412, y: 8, width: 166, height: 96 },
    { id: 'building-top-b', label: '', icon: 'bi-building', x: 594, y: 8, width: 166, height: 96 },
    { id: 'building-top-c', label: '', icon: 'bi-building', x: 776, y: 8, width: 166, height: 96 },
    { id: 'building-mid-a', label: '', icon: 'bi-building', x: 412, y: 120, width: 166, height: 96 },
    { id: 'building-mid-b', label: '', icon: 'bi-building', x: 594, y: 120, width: 166, height: 96 },
    { id: 'building-mid-c', label: '', icon: 'bi-building', x: 776, y: 120, width: 166, height: 96 },
    { id: 'building-row-a', label: '', icon: 'bi-building', x: 412, y: 316, width: 166, height: 96 },
    { id: 'building-row-b', label: '', icon: 'bi-building', x: 594, y: 316, width: 166, height: 96 },
    { id: 'building-row-c', label: '', icon: 'bi-building', x: 776, y: 316, width: 166, height: 96 },
    {
      id: 'building-left-l',
      label: '',
      icon: 'bi-building',
      x: 126,
      y: 316,
      width: 228,
      height: 222,
      path: 'M134 430 H214 Q222 430 222 422 V324 Q222 316 230 316 H346 Q354 316 354 324 V530 Q354 538 346 538 H134 Q126 538 126 530 V438 Q126 430 134 430 Z',
    },
    { id: 'building-bottom-a', label: '', icon: 'bi-building', x: 412, y: 442, width: 166, height: 96 },
    { id: 'building-bottom-b', label: '', icon: 'bi-building', x: 594, y: 442, width: 166, height: 96 },
    { id: 'building-bottom-c', label: '', icon: 'bi-building', x: 776, y: 442, width: 166, height: 96 },
  ],
};

@Component({
  selector: 'app-market-map',
  imports: [CommonModule, RouterLink, Dropdown],
  templateUrl: './market-map.html',
  styleUrl: './market-map.scss',
})
export class MarketMap {
  private readonly hostElement = inject(ElementRef<HTMLElement>);

  @ViewChild('mapViewport') private mapViewport?: ElementRef<HTMLDivElement>;
  @ViewChild('fullscreenMapStage') private fullscreenMapStage?: ElementRef<HTMLDivElement>;

  @Input() mode: MarketMapMode = 'public';
  @Input() mapData: MarketMapData = DEFAULT_MAP;

  selectedBooth: MarketMapBooth | null = null;
  hoveredBooth: MarketMapBooth | null = null;
  isPreviewPinned = false;
  isPreviewClosing = false;
  isFullscreenMap = false;
  isFullscreenClosing = false;
  hasPublicBrandSelection = false;
  activePublicTab: PublicMapTab = 'directory';
  searchText = '';
  selectedZone = 'all';
  zoom = 1;
  readonly organizerDates = ['2026/07/18（六）', '2026/07/19（日）'];
  selectedOrganizerDate = this.organizerDates[0];
  private readonly organizerSelectedCodes = ['A02', 'A03', 'A10', 'A12', 'B01', 'B03', 'B10', 'B13', 'C03'];
  private hoverPreviewTimer: ReturnType<typeof setTimeout> | null = null;
  private previewCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private fullscreenCloseTimer: ReturnType<typeof setTimeout> | null = null;

  readonly mapPaddingX = mapPaddingX;
  readonly mapPaddingTop = mapPaddingTop;
  readonly mapPaddingBottom = mapPaddingBottom;
  readonly zones = ['A', 'B', 'C'];
  readonly trees: Point[] = [
    [66, 28], [126, 28],
    [586, 15], [768, 15], [948, 15],
    [948, 156],
    [68, 345], [68, 471],
    [586, 476], [768, 476],
  ];

  get viewBox(): string {
    const paddedWidth = this.mapData.width + this.mapPaddingX * 2;
    const paddedHeight = this.mapData.height + this.mapPaddingTop + this.mapPaddingBottom;
    const width = paddedWidth / this.zoom;
    const height = paddedHeight / this.zoom;
    const x = -this.mapPaddingX + (paddedWidth - width) / 2;
    const y = -this.mapPaddingTop + (paddedHeight - height) / 2;
    return `${x} ${y} ${width} ${height}`;
  }

  get brandBooths(): MarketMapBooth[] {
    return this.mapData.booths.filter((booth) => booth.brand);
  }

  get filteredBrandBooths(): MarketMapBooth[] {
    return this.brandBooths.filter((booth) =>
      (this.selectedZone === 'all' || booth.zone.startsWith(this.selectedZone)) && this.matchesSearch(booth)
    );
  }

  get zoneOptions(): string[] {
    return ['全部', ...this.zones.map((zone) => `${zone}區`)];
  }

  get selectedZoneLabel(): string {
    return this.selectedZone === 'all' ? '全部' : `${this.selectedZone}區`;
  }

  get directoryColumns(): MarketMapBooth[][] {
    const columnCount = 6;
    const columns: MarketMapBooth[][] = Array.from({ length: columnCount }, () => []);
    this.filteredBrandBooths.forEach((booth, index) => columns[index % columnCount].push(booth));
    return columns;
  }

  get previewBooth(): MarketMapBooth | null {
    if (this.mode !== 'public') {
      return null;
    }

    return this.selectedBooth;
  }

  get mobileSelectedBooth(): MarketMapBooth | null {
    if (this.mode !== 'public') {
      return null;
    }

    return this.selectedBooth ?? this.brandBooths[0] ?? null;
  }

  setPublicTab(tab: PublicMapTab): void {
    this.activePublicTab = tab;
  }

  selectZone(zone: string): void {
    this.selectedZone = zone;
  }

  selectZoneByLabel(label: string): void {
    this.selectZone(label === '全部' ? 'all' : label.replace('區', ''));
  }

  boothClass(booth: MarketMapBooth): string {
    const visibleStatus = this.mode === 'organizer-view'
      ? (this.isOrganizerBoothSelected(booth) ? 'selected' : 'available')
      : booth.status;
    const classes = [`booth-${visibleStatus}`, `zone-${booth.code.charAt(0).toLowerCase()}`];

    if (booth.id === 'service-booth') {
      classes.push('booth-service');
    }

    const activeBoothId = this.mode === 'public' ? this.previewBooth?.id : this.selectedBooth?.id;
    if (booth.id === activeBoothId) {
      classes.push('is-active');
    }

    if (this.searchText && !this.matchesSearch(booth)) {
      classes.push('is-muted');
    }

    return classes.join(' ');
  }

  isOrganizerBoothSelected(booth: MarketMapBooth): boolean {
    return this.organizerSelectedCodes.includes(booth.code);
  }

  selectBooth(booth: MarketMapBooth): void {
    if (booth.id === 'service-booth') {
      return;
    }

    if (this.mode === 'public' && !booth.brand) {
      return;
    }

    if (this.mode === 'public') {
      this.clearPreviewCloseTimer();
      this.isPreviewClosing = false;
      this.hoveredBooth = booth;
      this.selectedBooth = booth;
      this.hasPublicBrandSelection = true;
      this.isPreviewPinned = false;
      return;
    }

    this.selectedBooth = booth;
  }

  selectBrand(booth: MarketMapBooth): void {
    if (this.mode === 'public') {
      this.clearPreviewCloseTimer();
      this.isPreviewClosing = false;
      this.hoveredBooth = booth;
      this.selectedBooth = booth;
      this.hasPublicBrandSelection = true;
      this.isPreviewPinned = false;
    } else {
      this.selectedBooth = booth;
    }
    document.getElementById(`market-booth-${booth.id}`)?.focus({ preventScroll: true });
  }

  showBoothPreview(booth: MarketMapBooth): void {
    if (this.mode !== 'public' || booth.id === 'service-booth' || !booth.brand) {
      return;
    }

    this.clearHoverPreviewTimer();
    this.hoverPreviewTimer = setTimeout(() => {
      this.clearPreviewCloseTimer();
      this.isPreviewClosing = false;
      this.hoveredBooth = booth;
      this.selectedBooth = booth;
      this.hasPublicBrandSelection = true;
      this.hoverPreviewTimer = null;
    }, 140);
  }

  clearBoothPreview(booth: MarketMapBooth): void {
    this.clearHoverPreviewTimer();
    if (this.hoveredBooth?.id === booth.id) {
      this.hoveredBooth = null;
    }
  }

  clearPublicBoothSelection(): void {
    if (this.mode !== 'public') {
      return;
    }

    this.clearHoverPreviewTimer();
    this.hoveredBooth = null;
    this.isPreviewPinned = false;

    if (!this.selectedBooth || this.isPreviewClosing) {
      return;
    }

    this.isPreviewClosing = true;
    this.clearPreviewCloseTimer();
    this.previewCloseTimer = setTimeout(() => {
      this.selectedBooth = null;
      this.hasPublicBrandSelection = false;
      this.isPreviewClosing = false;
      this.previewCloseTimer = null;
    }, 180);
  }

  previewX(booth: MarketMapBooth): number {
    const tooltipWidth = 420;
    const mapGap = 12;
    const minX = 8;
    const maxX = this.mapData.width - tooltipWidth - 8;

    const hasRoomOnRight = booth.x + booth.width + mapGap + tooltipWidth <= this.mapData.width - 8;
    const shouldOpenLeft = booth.code.startsWith('A') && booth.x > this.mapData.width * 0.58;
    const preferredX = hasRoomOnRight
      ? booth.x + booth.width + mapGap
      : booth.x - tooltipWidth - mapGap;

    if (shouldOpenLeft) {
      return Math.max(minX, Math.min(booth.x - tooltipWidth - mapGap, maxX));
    }

    return Math.max(minX, Math.min(preferredX, maxX));
  }

  previewY(booth: MarketMapBooth): number {
    const tooltipHeight = 340;
    const minY = 8;
    const maxY = this.mapData.height - tooltipHeight - 28;

    if (booth.code.startsWith('A')) {
      return Math.max(minY, Math.min(96, maxY));
    }

    const preferredY = booth.y - 122;
    return Math.max(minY, Math.min(preferredY, maxY));
  }

  updateSearch(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value.trim();
    const match = this.mapData.booths.find((booth) => this.matchesSearch(booth));

    if (match) {
      this.selectedBooth = match;
      this.hoveredBooth = match;
      this.hasPublicBrandSelection = true;
      this.isPreviewPinned = true;
    }
  }

  clearSearch(): void {
    this.searchText = '';
  }

  zoomIn(): void {
    this.zoom = Math.min(1.4, Number((this.zoom + 0.2).toFixed(1)));
  }

  zoomOut(): void {
    this.zoom = Math.max(0.8, Number((this.zoom - 0.2).toFixed(1)));
  }

  resetView(): void {
    this.zoom = 1;
  }

  openFullscreenMap(): void {
    if (this.isMobileLandscape()) {
      return;
    }

    this.clearFullscreenCloseTimer();
    this.isFullscreenClosing = false;
    this.isFullscreenMap = true;
    window.setTimeout(() => this.centerFullscreenMap(), 0);
  }

  closeFullscreenMap(): void {
    if (!this.isFullscreenMap || this.isFullscreenClosing) {
      return;
    }

    this.isFullscreenClosing = true;
    this.clearPreviewState();
    this.fullscreenCloseTimer = setTimeout(() => {
      this.isFullscreenMap = false;
      this.isFullscreenClosing = false;
      this.fullscreenCloseTimer = null;
    }, 220);
  }

  @HostListener('document:keydown.escape')
  closeFullscreenMapWithEscape(): void {
    if (this.isFullscreenMap) {
      this.closeFullscreenMap();
    }
  }

  @HostListener('window:resize')
  closeFullscreenMapOnLandscape(): void {
    if (this.isFullscreenMap && this.isMobileLandscape()) {
      this.closeFullscreenMapImmediately();
    }
  }

  @HostListener('document:click', ['$event'])
  clearBoothSelectionOutside(event: MouseEvent): void {
    if (this.mode !== 'public') {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node) || this.hostElement.nativeElement.contains(target)) {
      return;
    }

    this.clearPublicBoothSelection();
  }

  boothStatusLabel(status: MarketBoothStatus): string {
    const labels: Record<MarketBoothStatus, string> = {
      available: '可選擇',
      occupied: '已進駐品牌',
      selected: '已選擇',
      mine: '我的攤位',
    };
    return labels[status];
  }

  private matchesSearch(booth: MarketMapBooth): boolean {
    if (!this.searchText) {
      return true;
    }

    const keyword = this.searchText.toLowerCase();
    return booth.code.toLowerCase().includes(keyword)
      || booth.brand?.name.toLowerCase().includes(keyword) === true
      || booth.brand?.category.toLowerCase().includes(keyword) === true;
  }

  private clearPreviewState(): void {
    this.clearHoverPreviewTimer();
    this.clearPreviewCloseTimer();
    this.selectedBooth = null;
    this.hoveredBooth = null;
    this.hasPublicBrandSelection = false;
    this.isPreviewPinned = false;
    this.isPreviewClosing = false;
  }

  private closeFullscreenMapImmediately(): void {
    this.clearFullscreenCloseTimer();
    this.isFullscreenMap = false;
    this.isFullscreenClosing = false;
    this.clearPreviewState();
  }

  private isMobileLandscape(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(max-width: 932px) and (orientation: landscape)').matches;
  }

  private clearHoverPreviewTimer(): void {
    if (!this.hoverPreviewTimer) {
      return;
    }

    clearTimeout(this.hoverPreviewTimer);
    this.hoverPreviewTimer = null;
  }

  private clearPreviewCloseTimer(): void {
    if (!this.previewCloseTimer) {
      return;
    }

    clearTimeout(this.previewCloseTimer);
    this.previewCloseTimer = null;
  }

  private clearFullscreenCloseTimer(): void {
    if (!this.fullscreenCloseTimer) {
      return;
    }

    clearTimeout(this.fullscreenCloseTimer);
    this.fullscreenCloseTimer = null;
  }

  private centerFullscreenMap(): void {
    const stage = this.fullscreenMapStage?.nativeElement;
    if (!stage || !this.isFullscreenMap) {
      return;
    }

    const maxScrollLeft = Math.max(stage.scrollWidth - stage.clientWidth, 0);
    stage.scrollTo({
      left: Math.round(maxScrollLeft * 0.46),
      top: 0,
      behavior: 'auto',
    });
  }
}
