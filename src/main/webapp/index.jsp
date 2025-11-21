<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <title>Mario-like Game</title>
  <style>
    html,body { height:100%; margin:0; background:#000; }
    #game-container { width:100%; height:100vh; overflow:hidden; }
    .touch-controls { position: absolute; bottom: 12px; left: 12px; z-index:10; display:flex; gap:8px; }
    .btn { background: rgba(255,255,255,0.25); border-radius:8px; padding:12px; font-size:18px; color:#000; user-select:none; }
    .btn:active { background: rgba(255,255,255,0.45); }
    .right { position:absolute; right:12px; bottom:12px; }
  </style>
</head>
<body>
<div id="game-container"></div>

<!-- touch/buttons for mobile -->
<div class="touch-controls" id="leftControls">
  <div class="btn" id="leftBtn">◀</div>
  <div class="btn" id="jumpBtn">▲</div>
</div>
<div class="right" id="rightControls">
  <div class="btn" id="rightBtn">▶</div>
</div>

<!-- Phaser 3 from CDN -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
