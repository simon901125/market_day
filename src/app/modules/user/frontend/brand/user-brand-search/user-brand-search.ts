import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrandItem } from '../../../../../models/interface/BrandItem';
import { BrandType } from '../../../../../models/type/BrandType ';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Dropdown } from '../../../../shared/dropdown/dropdown';
import { UserBrandSearchCard } from '../user-brand-search-card/user-brand-search-card';

const brandImage = (brandId: string, fileName: string): string =>
  `assets/images/user/brand/brands/${brandId}/${fileName}`;

export const BRANDS: BrandItem[] = [
  {
    id: 'brand-01',
    name: '拾甜製菓',
    description: '選用在地蜂蜜與當季食材，烘焙溫柔耐吃的日常甜點。',
    introduction:
      '拾甜製菓相信甜點不只是味道，更是日常裡值得被收藏的小片刻。我們走訪在地農家挑選蜂蜜與當季果物，減少不必要的添加，以細緻火候烘焙出自然、耐吃且適合分享的甜點。從配方測試、食材處理到包裝設計，每個步驟都希望保留手作的溫度，讓收到甜點的人也能感受到真誠而輕盈的心意。',
    tags: [BrandType.food],
    historyMarkets: [
      { name: '草悟野餐市集', year: '2025', startDate: '03/27', endDate: '03/30' },
      { name: '咖啡生活節', year: '2025', startDate: '05/10', endDate: '05/11' },
      { name: '城市甜點生活市集', year: '2025', startDate: '08/16', endDate: '08/17' },
      { name: '秋日職人手作市集', year: '2025', startDate: '10/04', endDate: '10/05' },
    ],
    image: brandImage('brand-01', 'cover.png'),
    logo: brandImage('brand-01', 'logo.png'),
    goodat_works: '蜂蜜蛋糕、手工瑪德蓮',
    products: [
      { image: brandImage('brand-01', 'product-01.png'), name: '蜂蜜蛋糕禮盒', price: 380, description: '在地蜂蜜揉入細緻蛋糕體，濕潤柔軟且甜度輕盈。' },
      { image: brandImage('brand-01', 'product-02.png'), name: '手工蜂蜜瑪德蓮', price: 240, description: '奶油與蜂蜜交織出溫潤香氣，外緣微酥、內裡柔軟。' },
      { image: brandImage('brand-01', 'product-03.png'), name: '低糖焦糖布丁組', price: 290, description: '滑順蛋香搭配微苦焦糖，清爽不膩的日常甜點。' },
    ],
    links: { instagram: 'https://instagram.com/shitian.sweets', facebook: 'https://facebook.com/shitian.sweets', officialWebsite: 'https://shitian.example.com' },
  },
  {
    id: 'brand-02',
    name: '花間織所',
    description: '以花草為靈感，將細緻針線織進每一件日常布作。',
    introduction:
      '花間織所從四季花草與生活風景汲取靈感，透過刺繡、拼布與手縫留下緩慢製作的溫度。每件作品皆由選布、配色到收邊細心完成，希望讓實用布品也能成為陪伴日常的柔軟風景。我們也持續嘗試不同纖維與傳統針法，讓每一件作品既有細節，也保有長久使用的舒適與耐看。',
    tags: [BrandType.handmade],
    historyMarkets: [
      { name: '夏日風格服裝市集', year: '2025', startDate: '07/02', endDate: '07/05' },
      { name: '花草香氛生活市集', year: '2025', startDate: '09/13', endDate: '09/14' },
    ],
    image: brandImage('brand-02', 'cover.png'),
    logo: brandImage('brand-02', 'logo.png'),
    goodat_works: '刺繡小包、手作布品',
    products: [
      { image: brandImage('brand-02', 'product-01.png'), name: '野花刺繡小包', price: 420, description: '天然亞麻搭配細緻野花刺繡，收納日常的小巧隨身包。' },
      { image: brandImage('brand-02', 'product-02.png'), name: '四季花草杯墊', price: 320, description: '四款植物圖樣手工繡製，為桌面增添柔和風景。' },
      { image: brandImage('brand-02', 'product-03.png'), name: '草原刺繡掛畫', price: 680, description: '以多層針法描繪草地花朵，適合點綴安靜的生活角落。' },
    ],
    links: { instagram: 'https://instagram.com/hanama.textile', facebook: 'https://facebook.com/hanama.textile', officialWebsite: 'https://hanama.example.com' },
  },
  {
    id: 'brand-03',
    name: '青衫製所',
    description: '以天然布料與簡約剪裁，製作舒適耐穿的日常服飾。',
    introduction:
      '青衫製所專注於天然材質與舒適版型，從布料觸感、活動空間到縫製細節反覆調整。我們希望衣服能自在融入不同場合，陪伴穿著者長久使用，也在時間裡留下屬於自己的生活痕跡。設計上減少短暫流行的裝飾，以容易搭配的色彩和輪廓，實踐簡單、耐穿且不造成負擔的日常衣著。',
    tags: [BrandType.fashion],
    historyMarkets: [
      { name: '草悟野餐市集', year: '2025', startDate: '03/27', endDate: '03/30' },
      { name: '夏夜音樂手作市集', year: '2025', startDate: '08/02', endDate: '08/03' },
    ],
    image: brandImage('brand-03', 'cover.png'),
    logo: brandImage('brand-03', 'logo.png'),
    goodat_works: '亞麻襯衫、帆布提袋',
    products: [
      { image: brandImage('brand-03', 'product-01.png'), name: '日常亞麻襯衫', price: 1680, description: '透氣亞麻與寬鬆剪裁，適合四季層次穿搭。' },
      { image: brandImage('brand-03', 'product-02.png'), name: '厚磅帆布提袋', price: 780, description: '耐用厚磅帆布搭配細緻內袋，簡潔實用。' },
      { image: brandImage('brand-03', 'product-03.png'), name: '植物染輕薄圍巾', price: 980, description: '天然染色形成柔和漸層，保留纖維自然紋理。' },
    ],
    links: { instagram: 'https://instagram.com/aoshirt.studio', facebook: 'https://facebook.com/aoshirt.studio', officialWebsite: 'https://aoshirt.example.com' },
  },
  {
    id: 'brand-04',
    name: '森芽植研',
    description: '用綠意療癒生活，打造適合城市日常的小型植物風景。',
    introduction:
      '森芽植研觀察植物在城市空間中的生長方式，選擇容易照顧且適合室內環境的植栽，搭配手作容器與養護建議，讓第一次接觸植物的人也能輕鬆建立自己的綠色角落。我們重視每株植物的生長狀態與空間比例，透過適合的介質和配置，讓綠意真正融入居家與工作生活。',
    tags: [BrandType.plant],
    historyMarkets: [
      { name: '植感生活市集', year: '2025', startDate: '06/15', endDate: '06/16' },
      { name: '植物療癒週末市集', year: '2025', startDate: '08/10', endDate: '08/11' },
      { name: '花草香氛生活市集', year: '2025', startDate: '09/13', endDate: '09/14' },
    ],
    image: brandImage('brand-04', 'cover.png'),
    logo: brandImage('brand-04', 'logo.png'),
    goodat_works: '多肉植栽、玻璃苔景',
    products: [
      { image: brandImage('brand-04', 'product-01.png'), name: '多肉共生盆景', price: 520, description: '精選多肉搭配手作陶盆，形成耐看的微型風景。' },
      { image: brandImage('brand-04', 'product-02.png'), name: '玻璃森林苔景', price: 880, description: '苔蘚、蕨類與石材構成可在室內照顧的小森林。' },
      { image: brandImage('brand-04', 'product-03.png'), name: '森綠陶盆植栽', price: 620, description: '霧面陶盆搭配易照顧觀葉植物，適合桌面與窗邊。' },
    ],
    links: { instagram: 'https://instagram.com/morigreen.lab', facebook: 'https://facebook.com/morigreen.lab', officialWebsite: 'https://morigreen.example.com' },
  },
  {
    id: 'brand-05',
    name: '拾土器作',
    description: '揉捏土與釉色的自然變化，留下每件器物獨有的手感。',
    introduction:
      '拾土器作以手捏與拉坯製作生活器皿，保留土質、指痕和窯燒帶來的不規則變化。我們重視器物與使用者之間的關係，希望每只杯盤都能在盛裝食物與陪伴生活的過程中逐漸長出自己的樣子。從土料、釉色到燒成曲線皆親自測試，接受火與時間留下的偶然，也珍惜每件作品不可複製的差異。',
    tags: [BrandType.handmade],
    historyMarkets: [
      { name: '草悟野餐市集', year: '2025', startDate: '03/27', endDate: '03/30' },
      { name: '夏日風格服裝市集', year: '2025', startDate: '07/02', endDate: '07/05' },
      { name: '秋日職人手作市集', year: '2025', startDate: '10/04', endDate: '10/05' },
      { name: '港邊海風選物市集', year: '2025', startDate: '11/08', endDate: '11/09' },
    ],
    image: brandImage('brand-05', 'cover.png'),
    logo: brandImage('brand-05', 'logo.png'),
    goodat_works: '手作陶杯、生活器皿',
    products: [
      { image: brandImage('brand-05', 'product-01.png'), name: '窯變雙杯組', price: 860, description: '土色與深釉自然流動，每只杯都有獨特窯變表情。' },
      { image: brandImage('brand-05', 'product-02.png'), name: '深海釉餐盤', price: 720, description: '靛藍與鐵褐釉色交疊，襯托料理的自然器皿。' },
      { image: brandImage('brand-05', 'product-03.png'), name: '砂土小花器', price: 580, description: '保留拉坯紋理與釉淚，適合單枝花草的日常花器。' },
    ],
    links: { instagram: 'https://instagram.com/shitu.ceramics', facebook: 'https://facebook.com/shitu.ceramics', officialWebsite: 'https://shitu.example.com' },
  },
  {
    id: 'brand-06',
    name: '暮光香室',
    description: '以植物氣味與柔和燭光，收藏日常裡安靜放鬆的片刻。',
    introduction:
      '暮光香室以植物精油、天然蠟材與不同季節的氣味記憶調製作品。從香氣層次到燃燒狀態皆經過反覆測試，希望透過溫和不張揚的氣息，為忙碌生活留下一段安靜的休息時間。我們也以空間與使用時刻為出發點設計香氣，讓每款作品都能自然陪伴閱讀、工作或夜晚放鬆。',
    tags: [BrandType.handmade],
    historyMarkets: [
      { name: '咖啡生活節', year: '2025', startDate: '05/10', endDate: '05/11' },
      { name: '夏夜音樂手作市集', year: '2025', startDate: '08/02', endDate: '08/03' },
      { name: '冬日禮物選品市集', year: '2025', startDate: '12/13', endDate: '12/14' },
    ],
    image: brandImage('brand-06', 'cover.png'),
    logo: brandImage('brand-06', 'logo.png'),
    goodat_works: '香氛蠟燭、植萃噴霧',
    products: [
      { image: brandImage('brand-06', 'product-01.png'), name: '暮林植萃蠟燭', price: 620, description: '木質與草本香氣緩慢展開，適合夜晚閱讀與放鬆。' },
      { image: brandImage('brand-06', 'product-02.png'), name: '晨霧織品噴霧', price: 480, description: '清爽植萃配方，為空間與織品留下淡雅氣息。' },
      { image: brandImage('brand-06', 'product-03.png'), name: '葉影擴香石組', price: 420, description: '手作陶質擴香石吸附香氣，適合書桌與衣櫃。' },
    ],
    links: { instagram: 'https://instagram.com/twilight.aroma', facebook: 'https://facebook.com/twilight.aroma', officialWebsite: 'https://twilight.example.com' },
  },
  {
    id: 'brand-07',
    name: '毛日和',
    description: '為毛孩設計舒適又可愛的配件，陪伴每個自在出遊的日子。',
    introduction:
      '毛日和從毛孩實際活動需求出發，挑選親膚、耐用且容易清潔的材質，製作領巾、牽繩與外出配件。每項設計兼顧安全與舒適，讓毛孩和家人都能更自在地享受散步與旅行。我們會依不同體型調整尺寸與受力細節，也持續從實際使用回饋改善設計，陪伴每一次安心出門。',
    tags: [BrandType.pet],
    historyMarkets: [
      { name: '毛孩友善市集', year: '2025', startDate: '05/31', endDate: '06/01' },
      { name: '毛孩夏日派對市集', year: '2025', startDate: '08/17', endDate: '08/18' },
    ],
    image: brandImage('brand-07', 'cover.png'),
    logo: brandImage('brand-07', 'logo.png'),
    goodat_works: '寵物領巾、編織牽繩',
    products: [
      { image: brandImage('brand-07', 'product-01.png'), name: '雙面棉質領巾', price: 320, description: '親膚棉布與可調節尺寸，讓毛孩舒適換上不同風格。' },
      { image: brandImage('brand-07', 'product-02.png'), name: '編織散步牽繩', price: 780, description: '耐磨棉繩搭配黃銅扣件，兼顧握感與外出安全。' },
      { image: brandImage('brand-07', 'product-03.png'), name: '隨行零食小包', price: 420, description: '可清潔內裡與腰帶掛環，散步訓練時方便取用。' },
    ],
    links: { instagram: 'https://instagram.com/maobiyori.pet', facebook: 'https://facebook.com/maobiyori.pet', officialWebsite: 'https://maobiyori.example.com' },
  },
  {
    id: 'brand-08',
    name: '小木日常',
    description: '以溫潤木材製作開放式玩具，陪孩子自由組合與想像。',
    introduction:
      '小木日常以安全木材與圓潤手感為製作核心，設計不限定玩法的積木與手作玩具。我們期待孩子能透過觸摸、堆疊和組合發展自己的故事，也讓玩具成為親子共同探索與陪伴的媒介。所有邊角皆經細緻打磨並使用安心塗裝，讓作品不只好玩，也能經得起長時間陪伴與傳承。',
    tags: [BrandType.toy],
    historyMarkets: [
      { name: '親子童趣假日市集', year: '2025', startDate: '07/12', endDate: '07/13' },
      { name: '玩具收藏交流市集', year: '2025', startDate: '09/21', endDate: '09/22' },
      { name: '冬日禮物選品市集', year: '2025', startDate: '12/13', endDate: '12/14' },
    ],
    image: brandImage('brand-08', 'cover.png'),
    logo: brandImage('brand-08', 'logo.png'),
    goodat_works: '木製積木、手作陀螺',
    products: [
      { image: brandImage('brand-08', 'product-01.png'), name: '森林建構積木', price: 980, description: '多種幾何木塊自由堆疊，發展空間想像與手眼協調。' },
      { image: brandImage('brand-08', 'product-02.png'), name: '彩環手作陀螺', price: 360, description: '天然木紋搭配柔和色環，每次旋轉都有不同節奏。' },
      { image: brandImage('brand-08', 'product-03.png'), name: '小象拉拉車', price: 720, description: '圓潤邊角與滑順木輪，陪伴孩子踏出探索步伐。' },
    ],
    links: { instagram: 'https://instagram.com/komoku.play', facebook: 'https://facebook.com/komoku.play', officialWebsite: 'https://komoku.example.com' },
  },
];

export const findBrandById = (brandId: string | null | undefined): BrandItem | undefined =>
  BRANDS.find((brand) => brand.id === brandId);

@Component({
  selector: 'app-user-brandserch',
  imports: [UserBrandSearchCard, Dropdown, Pagination],
  templateUrl: './user-brand-search.html',
  styleUrl: './user-brand-search.scss',
})
export class UserBrandSearch {
  /** 品牌類型下拉選項 */
  brandTypeOptions = BrandType.filterList;

  /** 參與市集下拉選項 */
  marketOptions = ['全部市集', '草悟野餐市集', '咖啡生活節', '夏日風格服裝市集'];

  /** 當前頁碼 */
  currentPage = 1;

  /** 每頁顯示筆數 */
  pageSize = 6;

  /** 品牌列表假資料；未來可直接替換成 API 回傳結果。 */
  readonly brands = BRANDS;

  constructor(private router: Router) {}

  get pagedBrands(): BrandItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.brands.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  goToBrandDetail(brand: BrandItem): void {
    this.router.navigate(['/user/brand-detail'], {
      queryParams: { brand: brand.id },
      state: { brand },
    });
  }
}
