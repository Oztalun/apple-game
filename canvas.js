window.onload = function () {
  //캔버스 좌표 계산 및 그리기 필수 요소
  var canvas = document.getElementById("AppleCanvas");
  var ctx = canvas.getContext("2d");

  const overlaycanvas = document.getElementById("overlayCanvas");
  const overlayctx = overlaycanvas.getContext("2d");
  
  const musiclevelcanvas = document.getElementById("musiclevelCanvas");
  const musiclevelctx = musiclevelcanvas.getContext("2d");
  
  //음악
  totalvolume = 1;
  intbgm = 1;
  lightcolors = 0;
  var bgm = new Audio("bgm/bgm.mp3");
  bgm.loop = true; // 반복 재생
  
  function playBGM() {
    bgm.currentTime = 0; // 처음부터 재생
    bgm.volume = totalvolume;
    bgm.play().catch((error) => console.log("오디오 자동 재생 차단됨:", error));
  }

  function stopBGM() {
    bgm.pause(); // 음악 정지
  }
  
  function clicksound() {
    var click = new Audio("bgm/click.mp3"); // 매번 새로운 오디오 객체 생성
    click.volume = totalvolume;
    click.play();
  }

  function endingsound() {
    var click = new Audio("bgm/timeup.mp3"); // 매번 새로운 오디오 객체 생성
    click.volume = totalvolume;
    click.play();
  }

  function appledropsound() {
    var click = new Audio("bgm/appledrop.mp3"); // 매번 새로운 오디오 객체 생성
    click.volume = totalvolume;
    click.play();
  }
  
  function BgmStart() {
    if (gameActive == true && intbgm == 1) {
      playBGM();
    } else {
      stopBGM();
    }
  }

  //시작 버튼 이벤트
  const cx = 210;
  const cy = 250;
  const start_radius = 60;
  
  //light colors 위치
  var txt_lc_x = 480,
      txt_lc_y = 447;
  var lightColorsWidth = ctx.measureText("Light Colors").width + 4;
  //BGM 위치
  var txt_bgm_x = txt_lc_x + 80, txt_bgm_y = 447;
  var bgmWidth = ctx.measureText("BGM").width + 4;
  //reset 위치
  var txt_rs_x = 80,
  txt_rs_y = 447;
  //볼륨 삼각형
  var TrStartX = txt_lc_x + 125,
      TrStartY = 447,
      TrHigh = 10,
      TrWid = 70;
  
  let startsoundimgX = 595, endsoundimgX = 660, soundimgX = startsoundimgX, soundimgY = 434, soundimglenX = 25, soundimglenY = 25, volumeclickactive = false;
  var volumeimg = new Image();
  volumeimg.src = "img/8bell.png";
  function sound() {
    volumeimg.onload = function () {
      musiclevelctx.drawImage(volumeimg, soundimgX, soundimgY, soundimglenX, soundimglenY);
    }
  }

  function moveSoundImg(mouseX) {
    if (mouseX!=soundimgX) {//기존 영역에서 움직이면(즉 볼륨을 다시 설정하면)
      musiclevelctx.clearRect(startsoundimgX, soundimgY, soundimglenX, soundimglenY);//영역 지우고
      volumeimg.onload = function () {//다시 그리기
        musiclevelctx.drawImage(volumeimg, soundimgX, soundimgY, soundimglenX, soundimglenY);
      }
    }
  }
  sound();
  
  //게임 끝난 엔딩 호버, 클릭 위치
  const middleX = 230,
        middleY = 40,
        offsetX = 69,
        offsetupY = 230,
        offsetdownY = 280,
        btnX = middleX + offsetX,
        btnshadowX = btnX + 2, 
        upbtnY = middleY + offsetupY,
        upbtnshadowY = upbtnY + 2,
        downbtnY = middleY + offsetdownY,
        downbtnshadowY = downbtnY + 2,
        lenX = 120,
        lenY = 30;
  
  //

  //볼륨 위치
  function volumePosition(mouseX, mouseY) {
    return (
      mouseX >= soundimgX && 
      mouseX <= soundimgX + soundimglenX && 
      mouseY >= soundimgY && 
      mouseY <= soundimgY + soundimglenY
    );
  }

  //light colors 버튼 위치
  function LightColorsPosition(mouseX, mouseY) {
    lc_x_start = txt_lc_x - 23 - lightColorsWidth / 2;
    lc_x_end = txt_lc_x + 6 + lightColorsWidth / 2;
    var lightColorsHeight = 13 + 4;
    return (
      mouseX >= lc_x_start &&
      mouseX <= lc_x_end &&
      mouseY >= txt_lc_y - 2 - lightColorsHeight / 2 &&
      mouseY <= txt_lc_y + 2 + lightColorsHeight / 2
    );
  }

  //bgm 버튼 위치
  function BgmPosition(mouseX, mouseY) {
    bgm_x_start = txt_bgm_x - 20 - bgmWidth / 2;
    bgm_x_end = txt_bgm_x + 6 + bgmWidth / 2;
    var bgmHeight = 13 + 4;
    return (
      mouseX >= bgm_x_start &&
      mouseX <= bgm_x_end &&
      mouseY >= txt_bgm_y - 2 - bgmHeight / 2 &&
      mouseY <= txt_bgm_y + 2 + bgmHeight / 2
    );
  }

  //reset 버튼 위치
  function ResetPosition(mouseX, mouseY) {
    var rsWidth = ctx.measureText("Reset").width + 16;
    var rsHeight = 13 + 6;
    return (
      mouseX >= txt_rs_x - rsWidth / 2 &&
      mouseX <= txt_rs_x + 1 + rsWidth / 2 &&
      mouseY >= txt_rs_y - 2 - rsHeight / 2 &&
      mouseY <= txt_rs_y + 2 + rsHeight / 2
    );
  }

  //버튼 클릭 이벤트 (시작 버튼 클릭 이벤트와 통합, 호버를 통합해서 클릭 이벤트도 통합하기로 함)
  function ClickEvent(event) {
    var rect = overlaycanvas.getBoundingClientRect(); //캔버스의 위치를 가져오는 함수
    var mouseX = event.clientX - rect.left; //화면에서 현재 마우스의 위치 - 캔버스의 위치
    var mouseY = event.clientY - rect.top;

    // 클릭이 텍스트 영역 내에 있는지 확인
    var distance = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2);
    if (BgmPosition(mouseX, mouseY)) {
      if (intbgm == 0) {
        intbgm = 1;
      } else {
        intbgm = 0;
      }
      clicksound();
      drawBox();
      BgmStart();
    } else if (LightColorsPosition(mouseX, mouseY)) {
      if (lightcolors == 0) {
        lightcolors = 1;
      } else {
        lightcolors = 0;
      }
      clicksound();
      drawBox();
    } else if (ResetPosition(mouseX, mouseY)) {
      clicksound();
      gameActive = false;
      BgmStart();
      startdraw();
      overlaycanvas.removeEventListener("click", endClickEvent);
      overlaycanvas.removeEventListener("mousemove", endHoverEvent);
    } else if (distance <= start_radius && !gameActive) {
      //시작 버튼 클릭
      clicksound();
      gamestart();
      requestAnimationFrame(gameLoop);
    }
  }

  //버튼 호버 이벤트 (시작 버튼 이벤트와 통합, 둘다 겹치면서 하나는 동작하지 않는 버그 발생)
  function CursorMoveEvent(event) {
    var rect = overlaycanvas.getBoundingClientRect(); //캔버스의 위치를 가져오는 함수
    var mouseX = event.clientX - rect.left; //화면에서 현재 마우스의 위치 - 캔버스의 위치
    var mouseY = event.clientY - rect.top;

    // 어느 한 영역이라도 침범하면 커서를 pointer로 설정
    if (
      LightColorsPosition(mouseX, mouseY) || 
      BgmPosition(mouseX, mouseY) || 
      ResetPosition(mouseX, mouseY) || 
      volumePosition(mouseX, mouseY)
    ) {
      overlaycanvas.style.cursor = "pointer";
    } else if (!gameActive) {
      var distance = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2);
      // 원 영역에 침범하면 커서 변경
      if (distance <= start_radius) {
        overlaycanvas.style.cursor = "pointer";
      } else {
        overlaycanvas.style.cursor = "default";
      }
    } else {
      overlaycanvas.style.cursor = "default";
    }
  }

  function endClickEvent(event) {
    var rect = overlaycanvas.getBoundingClientRect(); //캔버스의 위치를 가져오는 함수
    var mouseX = event.clientX - rect.left; //화면에서 현재 마우스의 위치 - 캔버스의 위치
    var mouseY = event.clientY - rect.top;

    // 클릭이 텍스트 영역 내에 있는지 확인
    const area1 = (mouseX>=btnX && mouseX<=btnX + lenX && mouseY >= upbtnY && mouseY <= upbtnY + lenY)
    const area2 = (mouseX>=btnX && mouseX<=btnX + lenX && mouseY >= downbtnY && mouseY <= downbtnY + lenY)
    if (area1) {
      overlaycanvas.removeEventListener("click", endClickEvent);
      overlaycanvas.removeEventListener("mousemove", endHoverEvent);
      clicksound();
      gamestart();
      requestAnimationFrame(gameLoop);
    } else if (area2) {
      console.log(gameActive);
      overlaycanvas.removeEventListener("click", endClickEvent);
      overlaycanvas.removeEventListener("mousemove", endHoverEvent);
      clicksound();
      startdraw();
      BgmStart();
    }
  }

  function endHoverEvent(event) {
    var rect = overlaycanvas.getBoundingClientRect(); //캔버스의 위치를 가져오는 함수
    var mouseX = event.clientX - rect.left; //화면에서 현재 마우스의 위치 - 캔버스의 위치
    var mouseY = event.clientY - rect.top;

    // 클릭이 텍스트 영역 내에 있는지 확인
    const area1 = (mouseX>=btnX && mouseX<=btnX + lenX && mouseY >= upbtnY && mouseY <= upbtnY + lenY)
    const area2 = (mouseX>=btnX && mouseX<=btnX + lenX && mouseY >= downbtnY && mouseY <= downbtnY + lenY)
    if (area1 || area2) {
      overlaycanvas.style.cursor = "pointer";
    } else {
      overlaycanvas.style.cursor = "default";
    }
  }

  function StandardListener() {
    //볼륨, light, reset 이밴트
    // 클릭 이벤트 리스너
    overlaycanvas.addEventListener("click", ClickEvent);
    // 마우스가 텍스트 영역에 있을 때 커서 변경 함수
    overlaycanvas.addEventListener("mousemove", CursorMoveEvent);
  }
  StandardListener();

  const rows = 10,
    cols = 17,
    appleSize = 33;
  const apples = [];
  let selectedApples = [];
  let isDragging = false;
  let startX, startY, endX, endY;
  let score = 0;
  let gameActive = false;
  let readymode = true;

  function drawApples() {
    ctx.clearRect(60, 75, 577, 337);
    printscore();
    apples.forEach((apple) => {
      if (!apple.collected) {
        ctx.beginPath();
        ctx.arc(
          apple.x + appleSize / 2,
          apple.y + appleSize / 2,
          appleSize / 2 - 3,
          0,
          Math.PI * 2
        ); //원 생성
        ctx.fillStyle = apple.highlighted ? "green" : "red";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(
          apple.value,
          apple.x + appleSize / 2,
          apple.y + appleSize / 2 + 2
        );
      }
    });

    overlayctx.strokeStyle = "blue";
    overlayctx.lineWidth = 2;
    overlayctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isDragging) {
      overlayctx.strokeRect(startX, startY, endX - startX, endY - startY);
    }
  }

  function getSelectedApples() {
    selectedApples = apples.filter(
      (apple) =>
        !apple.collected &&
        apple.x + appleSize > Math.min(startX, endX) &&
        apple.x < Math.max(startX, endX) &&
        apple.y + appleSize > Math.min(startY, endY) &&
        apple.y < Math.max(startY, endY)
    );
    apples.forEach(
      (apple) => (apple.highlighted = selectedApples.includes(apple))
    );
  }

  function checkSum() {
    let sum = selectedApples.reduce((acc, apple) => acc + apple.value, 0);
    if (sum === 10) {
      selectedApples.forEach((apple) => (apple.collected = true));
      score += selectedApples.length;
      appledropsound();
    }
    apples.forEach((apple) => (apple.highlighted = false));
  }

  //클릭 할 때
  function click_mouse(e) {
    if (!gameActive) return;
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
    console.log(startX, "   ", startY);//좌표 확인용 제거해도됨
    endX = startX;
    endY = startY;
  }

  //클릭 후 드래그
  function drag_mouse(e) {
    if (isDragging) {
      endX = e.offsetX;
      endY = e.offsetY;
      getSelectedApples();
      drawApples();
    }
  }

  //클릭 떼기
  function clickup_mouse(e) {
    if (!gameActive) return;
    isDragging = false;
    endX = e.offsetX;
    endY = e.offsetY;
    getSelectedApples();
    checkSum();
    drawApples();
  }

  //기본 그리기
  function startdraw() {
    ctx.clearRect(50, 55, 625, 370);
    canvas.style.backgroundImage = "url('img/titleEnglish.png')"; //그리지 않고 배경화면을 바꿈으로서 그리는 것 처럼 보이게 함
    canvas.style.backgroundSize = "cover"; // 이미지 크기 조정
    canvas.style.backgroundPosition = "center"; // 중앙 정렬
  }

  function gamestart() {
    console.log("start");
    //사과 랜덤 숫자 배치
    gameActive = true;
    BgmStart();
    apples.length = 0; //사과 배열 초기화
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        apples.push({
          x: j * appleSize + 70, //각 사과의 좌표
          y: i * appleSize + 80, //
          value: Math.floor(Math.random() * 9) + 1, //랜덤 숫자
          collected: false,
          highlighted: false,
        });
      }
    }
    //
    startTime = performance.now();
    score = 0; //점수 초기화
    canvas.style.backgroundImage = "url('img/background.png')";
    overlaycanvas.addEventListener("mousedown", click_mouse); //이벤트 리스너 시작
    overlaycanvas.addEventListener("mousemove", drag_mouse);
    overlaycanvas.addEventListener("mouseup", clickup_mouse);
    drawApples();
  }

  //외부 기본 틀
  function drawframe() {
    var img = new Image();
    img.src = "img/frame.png";
    img.onload = function () {
      ctx.drawImage(img, 4, 4);
      drawBox();
      ctx.font = "14px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
      ctx.fillText("BGM", txt_bgm_x, txt_bgm_y + 1);

      ctx.font = "13px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
      ctx.fillText("Light Colors", txt_lc_x, txt_lc_y);

      ctx.font = "13px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
      ctx.fillText("Reset", txt_rs_x, txt_rs_y);

      //bgm 볼륨
      ctx.fillStyle = "rgb(107, 255, 121)";
      ctx.beginPath();
      ctx.moveTo(TrStartX, TrStartY);
      ctx.lineTo(TrStartX + TrWid, TrStartY + TrHigh / 2 - 0.5);
      ctx.lineTo(TrStartX + TrWid, TrStartY - TrHigh / 2 - 0.5);
      ctx.moveTo(TrStartX, TrStartY);
      ctx.fill();
    };
  }

  //버튼 그리기 함수
  function drawBox() {
    ctx.fillStyle = "rgb(237, 255, 239)";
    ctx.fillRect(txt_bgm_x - 28, 442, 10, 10);
    ctx.fillStyle = "rgb(237, 255, 239)";
    ctx.fillRect(txt_lc_x - 47, 442, 10, 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    posX = 533;
    posY = 442;
    if (intbgm == 1) {
      ctx.beginPath();
      ctx.moveTo(posX + 0, posY + 5); // 시작점
      ctx.lineTo(posX + 3, posY + 8); // 체크의 첫 번째 선
      ctx.lineTo(posX + 8, posY); // 체크의 두 번째 선
      ctx.stroke();
    }

    posX -= 99;
    if (lightcolors == 1) {
      ctx.beginPath();
      ctx.moveTo(posX + 0, posY + 5); // 시작점
      ctx.lineTo(posX + 3, posY + 8); // 체크의 첫 번째 선
      ctx.lineTo(posX + 8, posY); // 체크의 두 번째 선
      ctx.stroke();
    }
  }

  const timeX = 660,
    timeY = 70;
  function printscore() {
    ctx.clearRect(633, 58, 40, 20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgb(37, 252, 22)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
    ctx.fillText(score, timeX, timeY);
  }

  let startTime = performance.now();

  function gameLoop() {
    if (gameActive) {
      let now = performance.now();
      let elapsedTime = (now - startTime) / 1000; // 경과 시간 (초 단위)

      if (elapsedTime >= 5) {
        console.log("게임 종료!");
        endgame();
        return;
      }
      ctx.fillStyle = "rgb(10, 255, 38)";
      ctx.fillRect(650, 90, 12, 300);
      ctx.clearRect(651, 91, 10, elapsedTime * 2.45);

      drawApples();
    }
    requestAnimationFrame(gameLoop);
  }

  function endgame() {
    endingsound()
    gameActive = false;
    isDragging = false;
    BgmStart();
    overlaycanvas.removeEventListener("mousedown", click_mouse);
    overlaycanvas.removeEventListener("mousemove", drag_mouse);
    overlaycanvas.removeEventListener("mouseup", clickup_mouse);
    (startX = 0), (startY = 0), (endX = 0);
    endy = 0;
    getSelectedApples();
    drawApples();
    overlayctx.clearRect(0, 0, canvas.width, canvas.height);
    var appleimage = new Image();
    appleimage.src = "img/apple.png";
    
    appleimage.onload = function () {
      ctx.drawImage(appleimage, middleX, middleY, 260, 260);

      ctx.fillStyle = "rgb(126, 126, 126)";
      ctx.fillRect(btnshadowX, upbtnshadowY, lenX, lenY);
      ctx.fillStyle = "rgb(38, 255, 0)";
      ctx.fillRect(btnX, upbtnY, lenX, lenY);

      ctx.fillStyle = "rgb(126, 126, 126)";
      ctx.fillRect(btnshadowX, downbtnshadowY, lenX, lenY);
      ctx.fillStyle = "rgb(38, 255, 0)";
      ctx.fillRect(btnX, downbtnY, lenX, lenY);
      ctx.font = "27px Arial";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
      ctx.fillText("score", 360, 180);
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
      ctx.fillText(score, 360, 220);
      ctx.font = "25px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
      ctx.fillText("restart", middleX + offsetX + 61, middleY + offsetupY + 16);
      ctx.font = "25px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // 텍스트를 박스 중앙에 정렬
      ctx.fillText("reset", middleX + offsetX + 61, middleY + offsetdownY + 16);
      
      overlaycanvas.addEventListener("click", endClickEvent);
      // 마우스가 텍스트 영역에 있을 때 커서 변경 함수
      overlaycanvas.addEventListener("mousemove", endHoverEvent);
    };
  }


  drawframe(); //프레임은 절대적
  startdraw();
  appledropsound();
  endingsound();
};
