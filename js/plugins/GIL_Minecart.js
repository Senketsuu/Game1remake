/**
 * @author Gilgamar
 * @version 1.02
 * @license MIT
 */
 
 var Imported = Imported || {};
 Imported.GIL_Minecart = true;

 var Gilgamar = Gilgamar || {};
 Gilgamar.Minecart = Gilgamar.Minecart || {};

/*:
 * @plugindesc v1.02 Adds a semi-automated minecart vehicle.
 * @author Gilgamar
 *
 * @param Minecart BGM
 * @desc Background music to play while in minecart.
 * @default
 *
 * @param Minecart Start Map ID
 * @desc ID of map to place minecart.
 * @default 0
 *
 * @param Minecart Start X
 * @desc X coordinate to place minecart.
 * @default 0
 *
 * @param Minecart Start Y
 * @desc Y coordinate to place minecart.
 * @default 0
 *
 * @param Minecart Crash Event
 * @desc ID of common event to run after crash.
 * @default 0
 *
 * @param Minecart Speed
 * @desc Change minecart default speed.
 * Default: 4
 * @default 4
 *
 * @param Railroad Terrain Tag
 * @desc Terrain Tag assigned to the railroad tiles.
 * Default: 1
 * @default 1
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Add a minecart vehicle to the game.
 * The minecart moves automatically after being boarded.
 * The player must steer the vehicle around turns or it will crash.
 * The minecart can only be boarded/exited from rail end tiles.
 *
 * 1) Assign the rail tiles a common Terrain Tag other than 0 in tileset editor.
 * 2) Change startMapId to the map ID you want the minecart in.
 * 3) Change startX and startY to the coordinates you want the minecart at.
 * 4) Change bgm name to the filename of the background music you want to use.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.02:
 * - No longer need to edit System.json as minecart is injected at Scene_Boot
 * - No longer need to set the Passage (4-dir), relies on Terrain Tag instead
 * - Improved performance by using faster passage checks
 *
 * Version 1.01:
 * - Minecart is semi-automated!
 * - Removed plugin commands
 * - Improved Minecart.findPath() to handle all directions and branch nodes
 * - Minecart.crash() runs user defined common event
 *
 */

 //=============================================================================
 // Parameters
 //=============================================================================
Gilgamar.Parameters = PluginManager.parameters('GIL_Minecart');
Gilgamar.Param = Gilgamar.Param || {};
// System.json data
Gilgamar.Param.MinecartBGM          = String(Gilgamar.Parameters['Minecart BGM']);
Gilgamar.Param.MinecartStartMapId   = Number(Gilgamar.Parameters['Minecart Start Map ID']);
Gilgamar.Param.MinecartStartX       = Number(Gilgamar.Parameters['Minecart Start X']);
Gilgamar.Param.MinecartStartY       = Number(Gilgamar.Parameters['Minecart Start Y']);
// Extra data
Gilgamar.Param.MinecartCrash        = Number(Gilgamar.Parameters['Minecart Crash Event']);
Gilgamar.Param.MinecartSpeed        = Number(Gilgamar.Parameters['Minecart Speed']);
Gilgamar.Param.RailTerrainTag       = Number(Gilgamar.Parameters['Railroad Terrain Tag']);


//=============================================================================
// Plugin Commands
//=============================================================================
Gilgamar.Minecart.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Gilgamar.Minecart.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command == 'Minecart') {
        switch (args[0].toLowerCase()) {
            // BGM
            case 'bgm':
                var bgm = {
                    "name": String(args[1]),
                    "pan": 0,
                    "pitch": 100,
                    "volume": 90
                };
                $gameMap.minecart().setBgm(bgm);
                break;
            case 'setlocation':
                var mapId = Number(args[1]);
                var x     = Number(args[2]);
                var y     = Number(args[3]);
                $gameMap.minecart().setLocation(mapId, x, y);
                break;
            // Crash Event
            case 'crashevent':
                var eid = Number(args[1]);
                Gilgamar.Param.MinecartCrash = eid;
                break;
            // Speed
            case 'speed':
                var speed = Number(args[1]).clamp(1,6);
                $gameMap.minecart().setMoveSpeed(speed);
                break;
        }
    }
};


//=============================================================================
// Minecart Class
//=============================================================================
function Minecart() {
    throw new Error('This is a static class');
}

Minecart._data = {
    "bgm": {
        "name": Gilgamar.Param.MinecartBGM,
        "pan": 0,
        "pitch": 100,
        "volume": 90
    },
    "characterIndex": 6,
    "characterName": "Vehicle",
    "startMapId": Gilgamar.Param.MinecartStartMapId,
    "startX": Gilgamar.Param.MinecartStartX,
    "startY": Gilgamar.Param.MinecartStartY
};

Minecart.update = function() {
    this.x = $gamePlayer.x;
    this.y = $gamePlayer.y;
    this.d = $gamePlayer.direction();
};

// NOTE: Player must be pressing the correct direction key before turning or crash
Minecart.findPath = function() {
    this.update();  // Update player coordinates and direction

    var P = $gameMap.isMinecartPassable(this.x, this.y, this.d);
    var D = $gameMap.isMinecartPassable(this.x, this.y, 2);
    var L = $gameMap.isMinecartPassable(this.x, this.y, 4);
    var R = $gameMap.isMinecartPassable(this.x, this.y, 6);
    var U = $gameMap.isMinecartPassable(this.x, this.y, 8);

    // Moving up or down
    if (this.d === 8 || this.d === 2) {
        if (L && Input.isPressed('left'))  return $gamePlayer.setDirection(4);
        if (R && Input.isPressed('right')) return $gamePlayer.setDirection(6);
        if (!L && !R && !P)                return $gamePlayer.getOffVehicle();
        if (!P)                            return this.crash();
    // Moving left or right
    } else {
        if (U && Input.isPressed('up'))    return $gamePlayer.setDirection(8);
        if (D && Input.isPressed('down'))  return $gamePlayer.setDirection(2);
        if (!U && !D && !P)                return $gamePlayer.getOffVehicle();
        if (!P)                            return this.crash();
    }
};

Minecart.crash = function() {
    $gameTemp.reserveCommonEvent(Gilgamar.Param.MinecartCrash);
};


//=============================================================================
// RPG Maker Methods
//=============================================================================
Gilgamar.Minecart.Scene_Boot_isReady =
    Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    if (DataManager.isDatabaseLoaded() && Gilgamar.Minecart.Scene_Boot_isReady.databaseLoaded === 0) {
        Gilgamar.Minecart.Scene_Boot_isReady.databaseLoaded++;
        $dataSystem.minecart = Minecart._data;
        // console.log($dataSystem)
    }
    return Gilgamar.Minecart.Scene_Boot_isReady.call(this);
};
Gilgamar.Minecart.Scene_Boot_isReady.databaseLoaded = 0;


// Replacement method
Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
    return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y) || $gameMap.minecart().posNt(x, y);
};

// Replacement method
Game_Map.prototype.createVehicles = function() {
    this._vehicles = [];
    this._vehicles[0] = new Game_Vehicle('boat');
    this._vehicles[1] = new Game_Vehicle('ship');
    this._vehicles[2] = new Game_Vehicle('airship');
    this._vehicles[3] = new Game_Vehicle('minecart');
};

// Replacement method
Game_Map.prototype.vehicle = function(type) {
    if (type === 0 || type === 'boat') {
        return this.boat();
    } else if (type === 1 || type === 'ship') {
        return this.ship();
    } else if (type === 2 || type === 'airship') {
        return this.airship();
    } else if (type === 3 || type === 'minecart') {
        return this.minecart();
    } else {
        return null;
    }
};

// New method
Game_Map.prototype.minecart = function() {
    return this._vehicles[3];
};

// New method
Game_Player.prototype.isInMinecart = function() {
    return this._vehicleType === 'minecart';
};

// Replacement method
Game_Player.prototype.isInVehicle = function() {
    return this.isInBoat() || this.isInShip() || this.isInAirship() || this.isInMinecart();
};

// Replacement method
Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
    if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2) || $gameMap.minecart().pos(x2, y2)) {
        if (TouchInput.isTriggered() && this.getOnVehicle()) {
            return true;
        }
    }
    if (this.isInBoat() || this.isInShip() || this.isInMinecart()) {
        if (TouchInput.isTriggered() && this.getOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerThere([0, 1, 2]);
    return $gameMap.setupStartingEvent();
};

// Replacement method
Game_Player.prototype.getOnVehicle = function() {
    var direction = this.direction();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = $gameMap.roundXWithDirection(x1, direction);
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    if ($gameMap.airship().pos(x1, y1)) {
        this._vehicleType = 'airship';
    } else if ($gameMap.minecart().pos(x2, y2)) {
        this._vehicleType = 'minecart';
        [2,4,6,8].forEach(function(d) {
            if ($gameMap.isMinecartPassable(x2, y2, d)) {
                $gameMap._vehicles[3].setDirection(d);
            }
        });
    } else if ($gameMap.ship().pos(x2, y2)) {
        this._vehicleType = 'ship';
    } else if ($gameMap.boat().pos(x2, y2)) {
        this._vehicleType = 'boat';
    }
    if (this.isInVehicle()) {
        this._vehicleGettingOn = true;
        if (!this.isInAirship()) {
            this.forceMoveForward();
        }
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};

// New method
Game_Vehicle.prototype.isMinecart = function() {
    return this._type === 'minecart';
};

// Replacement method
Game_Vehicle.prototype.initMoveSpeed = function() {
    if (this.isBoat()) {
        this.setMoveSpeed(4);
    } else if (this.isShip()) {
        this.setMoveSpeed(5);
    } else if (this.isAirship()) {
        this.setMoveSpeed(6);
    } else if (this.isMinecart()) {
        this.setMoveSpeed(Gilgamar.Param.MinecartSpeed);
    }
};

// Replacement method
Game_Vehicle.prototype.vehicle = function() {
    if (this.isBoat()) {
        return $dataSystem.boat;
    } else if (this.isShip()) {
        return $dataSystem.ship;
    } else if (this.isAirship()) {
        return $dataSystem.airship;
    } else if (this.isMinecart()) {
        return $dataSystem.minecart;
    } else {
        return null;
    }
};

// Replacement method
Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (this.isBoat()) {
        return $gameMap.isBoatPassable(x2, y2);
    } else if (this.isShip()) {
        return $gameMap.isShipPassable(x2, y2);
    } else if (this.isMinecart()) {
        return $gameMap.isMinecartPassable(x, y, d);
    } else if (this.isAirship()) {
        return true;
    } else {
        return false;
    }
};

// New method
Game_Map.prototype.isMinecartPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if ($gameMap.terrainTag(x2, y2) === Gilgamar.Param.RailTerrainTag) {
        return true;
    } else {
        return false;
    }
};

// Alias method
Gilgamar.Minecart.Game_Vehicle_update =
    Game_Vehicle.prototype.update;
Game_Vehicle.prototype.update = function() {
    Gilgamar.Minecart.Game_Vehicle_update.call(this);
    if (this.isMinecart() && this._driving) this.updateMinecart();
};


// New method
Game_Vehicle.prototype.updateMinecart = function() {
    // Probably need to check for other possible interruptions as well
    if (SceneManager.isSceneChanging()) return;
    if ($gamePlayer.isMoveRouteForcing()) return;

    $gameMap.refreshIfNeeded();
    if(!Minecart.findPath()) {
        // Param for 'Step Forward'
        param = {};
        param.list = [{code: Game_Character.ROUTE_MOVE_FORWARD, indent: null}, {code: 0}];
        param.repeat = false;
        param.skippable = true;
        param.wait = true;
        $gamePlayer.forceMoveRoute(param);
        $gameMap._interpreter.setWaitMode('route');
    }
};
