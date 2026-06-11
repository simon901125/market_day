# alert 和 confirm 統一規則 (Swal)

## Alert

### 按下確認後，沒有要做其他事

```js
  Swal.fire({
    title: '請輸入欲退貨之商品',
    confirmButtonText: EnumSwalButton.Confirm,
  });
```

### 🔔若有return不能寫在than裡面，需寫在外面才有作用

```js
  Swal.fire({
    title: '請輸入欲退貨之商品',
    confirmButtonText: EnumSwalButton.Confirm,
  });
  return;
```

### 按下確認後，需接著做其他事

```js
  Swal.fire({
    title: '只能選取相同商品類別進貨單',
    confirmButtonText: EnumSwalButton.Confirm,
  }).then(() => {
    hasInvalidClass = true;
  });
  return;
```

## Confirm

### 只有在確認後做事(if (result.isConfirmed))

```js
Swal.fire({
  title: '有新版本可用，是否重新載入？',
  showCancelButton: true,
  confirmButtonText: this.confirm_button,
  cancelButtonText: this.cancel_button,
}).then((result) => {
  if (result.isConfirmed) {
    this.swUpdate.activateUpdate().then(() => window.location.reload());
  }
});
```

### 確認後做事(if (result.isConfirmed))，取消後做事(else)

```js
  Swal.fire({
    html: res.Message,
    showCancelButton: true,
    confirmButtonText: EnumSwalButton.Confirm,
    cancelButtonText: EnumSwalButton.Cancel,
  }).then((result) => {
    if (result.isConfirmed) {
      this.addCustomer();
    } else {
      this.loadingService.stopLoading();
    }
  });
```


### 🔔若需要return不能寫在than裡面，需改成async和await的寫法

```js
protected async onClickSave() {
  let confirm = await Swal.fire({
    html: `權限已修改，系統需進行重整，請確認您的作業已儲存`,
    showCancelButton: true,
    confirmButtonText: EnumSwalButton.Confirm,
    cancelButtonText: EnumSwalButton.Cancel,
  }).then(r => r.isConfirmed);

  if(confirm) {
    this.LoadingDisplayStatus = true;
    this.httpService.Post('AuthGroupManagement/UpdateAuthGroupDetail', modifiedDetails).subscribe((res) => {
      if (res.StatusCode === EnumStatus.Ok) {
        this.LoadingDisplayStatus = false;
        this.returnDataSubject.next(null);
        this.close();
        Swal.fire({
          title: '權限已更新完成，系統將進行重整',
          confirmButtonText: EnumSwalButton.Confirm,
        }).then(() => {
          window.location.reload();
        });
      }
    });
  }
  if (!confirm) return;
}
```


## ⚠️ title 和 html 使用狀況

### 一般狀況使用 title

```js
  Swal.fire({
    title: '請輸入欲退貨之商品',
    confirmButtonText: EnumSwalButton.Confirm,
  });
```

### 若是有較長文字請用 html

```js
  Swal.fire({
    html: '未偵測到拍攝設備！請確認設備已正確連接或權限設置，然後重新開啟拍照功能。',
    confirmButtonText: EnumSwalButton.Confirm,
  });
```

### `若是"需要換行"請使用 html，可以加上 <br> 或 \n (🔔要 html 才能做到換行 title 沒辦法)`
```js
  Swal.fire({
    html: `此帳號已在其他裝置登入，因此本裝置已被登出。<br>
          若這不是您本人操作，請立即更改密碼以保障帳號安全。`,
    confirmButtonText: EnumSwalButton.Confirm,
  });
```
