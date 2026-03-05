const scriptData = [
    "Hey you 🌷",
    "A tiny hello.",
    "Một chút năng lượng nhỏ<br>cho ngày 8/3.",
    "Có thể không phải ngày nào cũng hoàn hảo.<br>Nhưng ngày nào cũng có sự cố gắng.",
    "Có những lúc mệt.<br>Có những lúc muốn nghỉ một chút.",
    "Nhưng nhìn lại xem,<br>cậu đã đi được một quãng xa đến thế nào.",
    "Một chặng đường dài sắp khép lại.<br>Và phía trước… không còn xa nữa. 🏁",
    "⏳ Đang tính ngày thi...<br>Từng ngày một thôi, cậu đang làm tốt rồi.",
    "Mong 8/3 này cậu cho phép mình nghỉ một chút,<br>để thấy lòng thật êm giữa những trang sách.",
    "Sắp về đích rồi.<br>Cố lên một chút nữa thôi."
];

let currentFrame = 0;
const audio = document.getElementById('bg-music');

function init() {
    const container = document.getElementById('frames-container');
    const examDate = new Date('2026-06-26').getTime();
    const now = new Date().getTime();
    const days = Math.floor((examDate - now) / (1000 * 60 * 60 * 24));
    scriptData[7] = `⏳ Còn ${days} ngày.<br>Từng ngày một thôi, cậu đang làm tốt rồi.`;

    scriptData.forEach((text, index) => {
        const div = document.createElement('div');
        div.className = 'message-frame' + (index === 0 ? ' active' : '');
        div.id = `f-${index}`;
        div.innerHTML = text;
        container.appendChild(div);
    });
}

function nextFrame() {
    if (currentFrame < scriptData.length - 1) {
        if (currentFrame === 0) audio.play();
        document.getElementById(`f-${currentFrame}`).classList.remove('active');
        currentFrame++;
        document.getElementById(`f-${currentFrame}`).classList.add('active');
    }
}

function openPage(url) {
    const overlay = document.getElementById('page-overlay');
    const iframe = document.getElementById('content-frame');
    iframe.src = url;
    overlay.style.display = 'flex';
}

function closePage() {
    document.getElementById('page-overlay').style.display = 'none';
}

window.onload = init;