document.addEventListener('DOMContentLoaded', function () {
  const link = document.getElementById('copy-button');
  // onClick's logic below:
  link.addEventListener('click', function () {
    copyToClipboard();
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
