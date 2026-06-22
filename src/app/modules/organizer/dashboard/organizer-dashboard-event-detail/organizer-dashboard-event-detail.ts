import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface EventForm {
  name: string;
  coverFileName: string;
  categories: string[];
  description: string;
  introduction: string;
}

interface FormStep {
  title: string;
  description: string;
}

@Component({
  selector: 'app-organizer-dashboard-event-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './organizer-dashboard-event-detail.html',
  styleUrl: './organizer-dashboard-event-detail.scss',
})
export class OrganizerDashboardEventDetail {
  /** 建立或編輯活動時顯示在左側的流程步驟。 */
  readonly steps: FormStep[] = [
    { title: '活動基本資料', description: '活動名稱、類型、介紹' },
    { title: '活動時間', description: '活動與報名時間設定' },
    { title: '活動場地與攤位規劃', description: '地點、地圖、攤位配置' },
  ];

  /** 活動類型選項，後續可改由共用類型或 API 提供。 */
  readonly categoryOptions = ['餐飲美食', '文創手作', '親子家庭', '寵物生活', '植物選物', '服飾配件', '玩具選物'];

  /** 活動基本資料表單暫存資料。 */
  form: EventForm = {
    name: '',
    coverFileName: '',
    categories: [],
    description: '',
    introduction: '',
  };

  /** 切換活動類型的勾選狀態。 */
  toggleCategory(category: string): void {
    this.form.categories = this.isCategorySelected(category)
      ? this.form.categories.filter((item) => item !== category)
      : [...this.form.categories, category];
  }

  /** 判斷活動類型是否已被選取。 */
  isCategorySelected(category: string): boolean {
    return this.form.categories.includes(category);
  }

  /** 暫存使用者選擇的封面檔名，之後可在此接上上傳流程。 */
  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.coverFileName = input.files?.[0]?.name ?? '';
  }
}
