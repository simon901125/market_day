import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrganizerHeader } from '../organizer-header/organizer-header';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';

interface OrganizerFeature {
  icon: string;
  title: string;
  description: string;
}

interface OrganizerAction {
  image: string;
  title: string;
  description: string;
}

interface OrganizerStep {
  icon: string;
  title: string;
  description: string;
}

interface OrganizerFaq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-organizer-home',
  imports: [CommonModule, RouterLink, OrganizerHeader, UserFooter],
  templateUrl: './organizer-home.html',
  styleUrl: './organizer-home.scss',
})
export class OrganizerHome {
  readonly features: OrganizerFeature[] = [
    {
      icon: 'bi bi-megaphone',
      title: '提升活動曝光',
      description: '平台協助活動曝光，讓更多攤主看見你的市集，增加報名數量與活動影響力。',
    },
    {
      icon: 'bi bi-clipboard-check',
      title: '集中管理攤主報名',
      description: '線上報名表單、資料收集與審核一次完成，不再需要繁瑣的表單與人工彙整。',
    },
    {
      icon: 'bi bi-credit-card',
      title: '掌握審核與付款進度',
      description: '清楚查看報名審核、付款狀態與攤位分配進度，活動管理更輕鬆。',
    },
  ];

  readonly actions: OrganizerAction[] = [
    {
      image: '/assets/images/organizer/organizer-create-market.png',
      title: '建立市集活動',
      description: '快速建立活動頁面，設定活動資訊、報名時間與攤位類型。',
    },
    {
      image: '/assets/images/organizer/organizer-registration.png',
      title: '管理攤主報名',
      description: '查看報名列表、審核資料與聯繫攤主，溝通更有效率。',
    },
    {
      image: '/assets/images/organizer/organizer-payment.png',
      title: '確認付款狀態',
      description: '掌握攤主付款進度，支援多種付款方式與狀態管理。',
    },
    {
      image: '/assets/images/organizer/organizer-booth.png',
      title: '管理攤位資訊',
      description: '分配攤位、管理攤位編號，讓活動現場更有秩序。',
    },
  ];

  readonly steps: OrganizerStep[] = [
    {
      icon: 'bi bi-person-plus',
      title: '註冊主辦方帳號',
      description: '填寫基本資料並送出申請，成為小集日主辦方。',
    },
    {
      icon: 'bi bi-file-earmark-check',
      title: '等待平台審核通過',
      description: '平台檢查您的資料，通過後即可開始使用。',
    },
    {
      icon: 'bi bi-shop',
      title: '建立市集活動',
      description: '建立活動頁，設定報名時間與攤位資訊。',
    },
    {
      icon: 'bi bi-people',
      title: '開放攤主報名',
      description: '攤主可線上瀏覽活動並報名參加。',
    },
    {
      icon: 'bi bi-pie-chart',
      title: '管理審核、付款與攤位',
      description: '審核報名資料、確認付款並分配攤位。',
    },
  ];

  readonly faqs: OrganizerFaq[] = [
    {
      question: '主辦方如何申請加入？',
      answer: '點擊右上角「註冊」並選擇「主辦方」，填寫基本資料並送出申請，平台將盡快審核。',
    },
    {
      question: '審核需要多久？',
      answer: '平台通常於 1～3 個工作天內完成審核，審核完成後將於通知中心發送通知。',
    },
    {
      question: '可以建立多場活動嗎？',
      answer: '可以，通過審核後，您可以依需求建立並管理多場市集活動。',
    },
    {
      question: '如何管理攤主報名與付款？',
      answer: '您可在後台查看報名狀態、審核資料、付款進度，並分配攤位與管理相關資訊。',
    },
  ];
}
