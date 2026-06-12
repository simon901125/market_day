import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  /** 左側主標題 */
  @Input() title = '';

  /** 左側強調文字 */
  @Input() highlight = '';

  /** 左側說明文字 */
  @Input() description = '';

  /** 右上方提示文字 */
  @Input() topText = '';

  /** 右上方連結文字 */
  @Input() topLinkText = '';

  /** 右上方連結路徑 */
  @Input() topLink = '';

  /** Logo 圖片路徑 */
  @Input() logoImg = '';
}