document.addEventListener('DOMContentLoaded', function () {
  const link = document.getElementById('copy-button');
  // onClick's logic below:
  link.addEventListener('click', function () {
    copyToClipboard();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const link = document.getElementById('copy-button-from-tg');
  // onClick's logic below:
  link.addEventListener('click', function () {
    copyToClipboardForTg();
  });
});

function copyToClipboard() {
  let text = document.getElementById('input2').innerText;
  const re = new RegExp(String.fromCharCode(160), "g");
  text = text.replace(re, ' ');
  navigator.clipboard.writeText(text)
  .then(function () {
    console.log('Текст успешно скопирован в буфер обмена');
  }, function (err) {
    console.error('Произошла ошибка при копировании текста: ', err);
  })
}

function copyToClipboardForTg() {
  let text = document.getElementById('input2').innerText;
  const re = new RegExp(String.fromCharCode(160), "g");
  text = text.replace(re, ' ');
  text = '\`\`\`' + text + '\`\`\`'
  if (text.length <= 4096) {
    navigator.clipboard.writeText(text).then(function () {
      console.log('Текст успешно скопирован в буфер обмена');
    }, function (err) {
      console.error('Произошла ошибка при копировании текста: ', err);
    })
  } else {
    alert('Максимальная длинна для сообщения для telegram 4096 символов')
  }
}
