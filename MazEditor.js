/*jshint browser: true */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W061 */
"use strict";
/////////////////////////////////////////////////
/*
 forked from: LevelEditor for Deep Down Into Darkness, v0.18.0
 ported to gen 3 ENGINE, GRID
 forked from MazeMaster 1.03
      
 to do:
      
 known bugs: 

 */
////////////////////////////////////////////////////
var MAP = {
  map: null
};
var INI = {
  MAXINT: 96,
  MININT: 10,
  MAX_GRID: 48,
  MIN_GRID: 8,
  SPACE_X: 2048,
  SPACE_Y: 2048
};
var PRG = {
  VERSION: "0.01.01",
  NAME: "MazEditor",
  YEAR: "2022",
  CSS: "color: #239AFF;",
  INIT() {

    console.log("%c**************************************************************************************************************************************", PRG.CSS);
    console.log(`${PRG.NAME} ${PRG.VERSION} by Lovro Selic, (c) C00lSch00l ${PRG.YEAR} on ${navigator.userAgent}`);
    console.log("%c**************************************************************************************************************************************", PRG.CSS);
    $("#title").html(PRG.NAME);
    $("#version").html(`${PRG.NAME} V${PRG.VERSION} <span style='font-size:14px'>&copy</span> C00lSch00l ${PRG.YEAR}`);
    $("input#toggleAbout").val("About " + PRG.NAME);
    $("#about fieldset legend").append(" " + PRG.NAME + " ");

    ENGINE.autostart = true;
    ENGINE.start = PRG.start;
    ENGINE.readyCall = GAME.setup;
    ENGINE.init();
  },
  setup() {
    console.log("PRG.setup");
    $("#verticalGrid").change(GAME.updateWH);
    $("#horizontalGrid").change(GAME.updateWH);
    $("#gridsize").change(GAME.updateWH);
    $("#selector input[name=renderer]").click(GAME.render);
    $("#corr").click(GAME.render);
    $("#grid").click(GAME.render);

    $("#buttons").on("click", "#new", GAME.init);
  },
  start() {
    console.log(PRG.NAME + " started.");
    $("#startGame").addClass("hidden");
    $(document).keypress(function (event) {
      if (event.which === 32 || event.which === 13) {
        event.preventDefault();
      }
    });
    GAME.start();
  }
};
var GAME = {
  counter: 0,
  canvas: null,
  start() {
    $("#bottom")[0].scrollIntoView();
    ENGINE.topCanvas = ENGINE.getCanvasName("ROOM");
    $(ENGINE.topCanvas).on("click", { layer: ENGINE.topCanvas }, GAME.mouseClick);
    GAME.init();
  },
  mouseClick(event) {
    ENGINE.readMouse(event);
    console.log(ENGINE.mouseX, ENGINE.mouseY);
  },
  pacGrid() {
    let corr = $("input[name='corr']")[0].checked;
    ENGINE.resizeBOX("ROOM");
    $(ENGINE.gameWindowId).width(ENGINE.gameWIDTH + 4);
    let pac = PacGrid.gridToPacGrid(MAP.map);
    let lw = Math.round(ENGINE.INI.GRIDPIX / 12);
    ENGINE.PACGRID.configure(lw, "pacgrid", "#FFF", "#000", "#666");
    ENGINE.PACGRID.draw(pac, corr);
    GAME.canvas = ENGINE.PACGRID.layer.canvas;
  },
  blockGrid() {
    let corr = $("input[name='corr']")[0].checked;
    ENGINE.resizeBOX("ROOM");
    $(ENGINE.gameWindowId).width(ENGINE.gameWIDTH + 4);
    ENGINE.BLOCKGRID.configure("pacgrid", "#FFF", "#000");
    ENGINE.BLOCKGRID.draw(MAP.map, corr);
    GAME.canvas = ENGINE.BLOCKGRID.layer.canvas;
  },
  textureGrid() {
    let corr = $("input[name='corr']")[0].checked;
    ENGINE.resizeBOX("ROOM");
    $(ENGINE.gameWindowId).width(ENGINE.gameWIDTH + 4);
    ENGINE.TEXTUREGRID.configure("pacgrid", "wall", 'RockFloor', 'BrickWall4');
    ENGINE.TEXTUREGRID.draw(MAP.map, corr);
    GAME.canvas = ENGINE.TEXTUREGRID.floorLayer.canvas;
  },
  resize() {
    MAP.level.width = $("#horizontalGrid").val();
    MAP.level.height = $("#verticalGrid").val();
  },
  render() {
    var radio = $("#selector input[name=renderer]:checked").val();
    switch (radio) {
      case "line":
        GAME.pacGrid();
        break;

      case "block":
        GAME.blockGrid();
        break;

      case "texture":
        GAME.textureGrid();
        break;
    }

    if ($("input[name='grid']")[0].checked) GRID.grid();
  },
  init() {
    console.log("new canvas");
    MAP.width = $("#horizontalGrid").val();
    MAP.height = $("#verticalGrid").val();
    MAP.map = FREE_MAP.create(MAP.width, MAP.height);
    GAME.render();
  },
  updateWH() {
    if (isNaN(parseInt($("#verticalGrid").val(), 10))) $("#verticalGrid").val(32);
    if (isNaN(parseInt($("#horizontalGrid").val(), 10))) $("#horizontalGrid").val(24);
    if (isNaN(parseInt($("#gridsize").val(), 10))) $("#gridsize").val(32);
    if ($("#verticalGrid").val() > INI.MAXINT)
      $("#verticalGrid").val(INI.MAXINT);
    if ($("#verticalGrid").val() < INI.MININT)
      $("#verticalGrid").val(INI.MININT);
    if ($("#horizontalGrid").val() > INI.MAXINT)
      $("#horizontalGrid").val(INI.MAXINT);
    if ($("#horizontalGrid").val() < INI.MININT)
      $("#horizontalGrid").val(INI.MININT);
    if ($("#gridsize").val() < INI.MIN_GRID) $("#gridsize").val(INI.MIN_GRID);
    if ($("#gridsize").val() > INI.MAX_GRID) $("#gridsize").val(INI.MAX_GRID);
    if ($("#gridsize").val() % 8 !== 0) {
      $("#gridsize").val(Math.floor($("#gridsize").val() / 8) * 8);
    }
    ENGINE.INI.GRIDPIX = parseInt($("#gridsize").val(), 10);
    //change grids
    if ($("#horizontalGrid").val() * ENGINE.INI.GRIDPIX > INI.SPACE_X) {
      $("#horizontalGrid").val(Math.floor(INI.SPACE_X / ENGINE.INI.GRIDPIX));
    }
    if ($("#verticalGrid").val() * ENGINE.INI.GRIDPIX > INI.SPACE_Y) {
      $("#verticalGrid").val(Math.floor(INI.SPACE_Y / ENGINE.INI.GRIDPIX));
    }

    ENGINE.gameHEIGHT = $("#verticalGrid").val() * ENGINE.INI.GRIDPIX;
    ENGINE.gameWIDTH = $("#horizontalGrid").val() * ENGINE.INI.GRIDPIX;
    $("#ENGINEgameWIDTH").html(ENGINE.gameWIDTH);
    $("#ENGINEgameHEIGHT").html(ENGINE.gameHEIGHT);
    if (GAME.started) GAME.resize();
  },
  setup() {
    console.log("GAME SETUP started");
    GAME.updateWH();

    $(ENGINE.gameWindowId).width(ENGINE.gameWIDTH + 4);
    ENGINE.addBOX("ROOM", ENGINE.gameWIDTH, ENGINE.gameHEIGHT, ["pacgrid", "wall", "grid", "click"], null);

    $("#buttons").append("<input type='button' id='new' value='New'>");
  }
};
$(function () {
  PRG.INIT();
  PRG.setup();
  ENGINE.LOAD.preload();
});
