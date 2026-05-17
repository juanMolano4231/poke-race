<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Pokémon Race</title>

  <style>

    body {
      font-family: sans-serif;
      text-align: center;
      padding-bottom: 400px;
    }

    #selection {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .poke {
      cursor: pointer;
      border: 2px solid transparent;
      width: 160px;
      height: 160px;
      image-rendering: pixelated;
    }

    .poke.selected {
      border-color: red;
    }

    #race {
      position: relative;
      width: 900px;
      height: 400px;
      margin: 20px auto;
      border: 1px solid #000;
      overflow: hidden;
    }

    .racer {
      position: absolute;
      left: 0;
    }

    #result {
      font-size: 24px;
      margin-top: 20px;
    }

    #logsPanel {
      width: 700px;
      height: 350px;
      margin: 20px auto;
      border: 1px solid black;
      overflow-y: auto;
      padding: 10px;
      text-align: left;
      background: white;
    }

    .group {
      margin-bottom: 20px;
      border-bottom: 1px solid gray;
      padding-bottom: 10px;
    }

  </style>
</head>

<body>

  <h2>Pokémon Race</h2>

  <div>
    <input type="text" id="username" placeholder="Enter username">
    <button id="loginBtn">Login</button>
  </div>

  <br>

  <div id="selection"></div>

  <button id="startBtn">Start Race</button>

  <div id="race"></div>

  <div id="result"></div>

  <br><br>

  <h2>Logs</h2>

  <select id="userSelect"></select>

  <select id="groupSelect">
    <option value="all">All Time</option>
    <option value="week">By Week</option>
    <option value="month">By Month</option>
  </select>

  <button id="loadLogsBtn">Load Logs</button>

  <div id="logsPanel"></div>

  <script src="script.js"></script>

</body>

</html>